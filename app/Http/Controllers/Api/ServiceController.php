<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Models\ServiceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Throwable;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Service::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Active status filter
        if ($request->filled('is_active')) {
            $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination avec chargement des relations
        $perPage = min($request->input('per_page', 15), 100);
        $services = $query->with('serviceItems')->paginate($perPage);
            
        return ServiceResource::collection($services);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $imagePath = null;

        DB::beginTransaction();

        try {
            // Upload du fichier (temporairement)
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('services', 'public');
                $data['image'] = $imagePath;
            }

            // Création du service principal
            $service = Service::create($data);

            // Création des éléments associés
            foreach ($request->input('service_items', []) as $item) {
                $service->serviceItems()->create([
                    'title' => $item,
                ]);
            }

            DB::commit();

            return response()->json([
                'data' => new ServiceResource($service->load('serviceItems')),
                'message' => 'Service created successfully.',
            ], 201);

        } catch (Throwable $e) {
            DB::rollBack();

            // Si l’image a été uploadée avant l’erreur, on la supprime du storage
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return response()->json([
                'message' => 'An error occurred while creating the service.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service): ServiceResource
    {
        return new ServiceResource($service->load('serviceItems'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        $data = $request->validated();
        $imagePath = null;

        DB::beginTransaction();

        try {
            // Upload d'une nouvelle image si fournie
            if ($request->hasFile('image')) {
                if ($service->image && Storage::disk('public')->exists($service->image)) {
                    Storage::disk('public')->delete($service->image);
                }
                $imagePath = $request->file('image')->store('services', 'public');
                $data['image'] = $imagePath;
            }

            // Mise à jour du service
            $service->update($data);

            // Suppression de tous les items existants
            $service->serviceItems()->delete();

            // Création des nouveaux items envoyés par le user (si présents)
            foreach ($request->input('service_items', []) as $item) {
                $service->serviceItems()->create([
                    'title' => $item,
                ]);
            }

            DB::commit();

            return response()->json([
                'data' => new ServiceResource($service->load('serviceItems')),
                'message' => 'Service updated successfully.',
            ]);

        } catch (Throwable $e) {
            DB::rollBack();

            // Supprimer l'image uploadée si erreur
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return response()->json([
                'message' => 'An error occurred while updating the service.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service): JsonResponse
    {
        $service->delete();
        
        return response()->json([
            'message' => 'Service deleted successfully.'
        ], 204);
    }
}
