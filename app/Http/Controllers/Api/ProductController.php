<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        $query = Product::query();

        // Filtre de recherche
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtre par statut actif
        if ($request->filled('active')) {
            $active = filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN);
            $query->where('active', $active);
        }

        // Filtre par disponibilité en stock
        if ($request->filled('en_stock')) {
            $enStock = filter_var($request->input('en_stock'), FILTER_VALIDATE_BOOLEAN);
            $query->where('en_stock', $enStock);
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = min($request->input('per_page', 15), 100);
        $products = $query->with('createdBy')->paginate($perPage);
            
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        $imagePrincipalePath = null;
        $imagesSecondaires = [];

        DB::beginTransaction();

        try {
            // Upload de l'image principale
            if ($request->hasFile('image_principale')) {
                $imagePrincipalePath = $request->file('image_principale')->store('products', 'public');
                $data['image_principale'] = $imagePrincipalePath;
            }

            // Upload des images secondaires
            if ($request->hasFile('images_secondaires')) {
                foreach ($request->file('images_secondaires') as $image) {
                    $path = $image->store('products/secondary', 'public');
                    $imagesSecondaires[] = $path;
                }
                $data['images_secondaires'] = $imagesSecondaires;
            }

            // Définir les valeurs par défaut si non fournies
            $data['en_stock'] = $request->input('en_stock', true);
            $data['active'] = $request->input('active', true);
            
            // Récupérer l'ID de l'utilisateur authentifié (le middleware auth:web garantit qu'un utilisateur est présent)
            $data['creé_par'] = $request->user()->id;

            // Création du produit
            $product = Product::create($data);

            DB::commit();

            return response()->json([
                'message' => 'Produit créé avec succès.',
                'data' => new ProductResource($product->load('createdBy')),
            ], 201);

        } catch (Throwable $e) {
            DB::rollBack();

            // Supprimer l'image principale si elle a été uploadée avant l'erreur
            if ($imagePrincipalePath && Storage::disk('public')->exists($imagePrincipalePath)) {
                Storage::disk('public')->delete($imagePrincipalePath);
            }

            // Supprimer les images secondaires si elles ont été uploadées
            if (!empty($imagesSecondaires)) {
                foreach ($imagesSecondaires as $imagePath) {
                    if (Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                    }
                }
            }

            return response()->json([
                'message' => 'Une erreur est survenue lors de la création du produit.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): ProductResource
    {
        return new ProductResource($product->load('createdBy'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $data = $request->validated();
        
        // Log pour déboguer
        Log::info('Product update data received:', $data);
        Log::info('Product before update:', $product->toArray());
        
        $imagePrincipalePath = null;
        $newImagesSecondaires = [];

        DB::beginTransaction();

        try {
            // Upload d'une nouvelle image principale si fournie
            if ($request->hasFile('image_principale')) {
                // Supprimer l'ancienne image si elle existe
                if ($product->image_principale && Storage::disk('public')->exists($product->image_principale)) {
                    Storage::disk('public')->delete($product->image_principale);
                }
                
                $imagePrincipalePath = $request->file('image_principale')->store('products', 'public');
                $data['image_principale'] = $imagePrincipalePath;
            }

            // Upload de nouvelles images secondaires si fournies
            if ($request->hasFile('images_secondaires')) {
                // Récupérer les images existantes ou initialiser un tableau vide
                $existingImages = $product->images_secondaires ?? [];
                
                // Upload des nouvelles images secondaires
                foreach ($request->file('images_secondaires') as $image) {
                    $path = $image->store('products/secondary', 'public');
                    $existingImages[] = $path;
                    $newImagesSecondaires[] = $path;
                }
                
                $data['images_secondaires'] = $existingImages;
            }

            // Mise à jour du produit
            $product->update($data);
            
            // Recharger le produit pour avoir les dernières valeurs
            $product->refresh();
            
            Log::info('Product after update:', $product->toArray());

            DB::commit();

            return response()->json([
                'message' => 'Produit modifié avec succès.',
                'data' => new ProductResource($product->load('createdBy')),
            ]);

        } catch (Throwable $e) {
            DB::rollBack();

            // Log de l'erreur complète
            Log::error('Product update error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'product_id' => $product->id,
            ]);

            // Supprimer l'image principale uploadée si erreur
            if ($imagePrincipalePath && Storage::disk('public')->exists($imagePrincipalePath)) {
                Storage::disk('public')->delete($imagePrincipalePath);
            }

            // Supprimer les nouvelles images secondaires uploadées si erreur
            foreach ($newImagesSecondaires as $imagePath) {
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }

            return response()->json([
                'message' => 'Une erreur est survenue lors de la modification du produit.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Supprimer l'image principale si elle existe
            if ($product->image_principale && Storage::disk('public')->exists($product->image_principale)) {
                Storage::disk('public')->delete($product->image_principale);
            }
            
            // Supprimer les images secondaires si elles existent
            if ($product->images_secondaires) {
                foreach ($product->images_secondaires as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }
            
            $product->delete();

            DB::commit();

            return response()->json([
                'message' => 'Produit supprimé avec succès.'
            ], 200);

        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Une erreur est survenue lors de la suppression du produit.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

