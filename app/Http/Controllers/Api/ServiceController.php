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
        
        // Handle file upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = $path;
        }
        
        $service = Service::create($data);
        
        // Create service items
        foreach ($request->input('service_items', []) as $item) {
            $service->serviceItems()->create([
                'title' => $item['title']
            ]);
        }

        return response()->json([
            'data' => new ServiceResource($service->load('serviceItems')),
            'message' => 'Service created successfully.'
        ], 201);
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
        
        // Handle file upload if a new image is provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }
            
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = $path;
        }
        
        $service->update($data);

        // Handle service items
        if ($request->has('service_items')) {
            $itemIds = [];
            
            foreach ($request->input('service_items', []) as $item) {
                if (isset($item['_delete'])) {
                    // Delete the item if marked for deletion
                    $service->serviceItems()->where('id', $item['id'])->delete();
                } elseif (isset($item['id'])) {
                    // Update existing item
                    $serviceItem = $service->serviceItems()->find($item['id']);
                    if ($serviceItem) {
                        $serviceItem->update(['title' => $item['title']]);
                        $itemIds[] = $serviceItem->id;
                    }
                } else {
                    // Create new item
                    $newItem = $service->serviceItems()->create([
                        'title' => $item['title']
                    ]);
                    $itemIds[] = $newItem->id;
                }
            }

            // Delete items not included in the request
            $service->serviceItems()->whereNotIn('id', $itemIds)->delete();
        }

        return response()->json([
            'data' => new ServiceResource($service->load('serviceItems')),
            'message' => 'Service updated successfully.'
        ]);
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
