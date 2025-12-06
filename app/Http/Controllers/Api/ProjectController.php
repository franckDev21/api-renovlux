<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resources.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::with('category')->latest();
        
        if ($request->has('limit') && is_numeric($request->limit)) {
            $query->take((int)$request->limit);
        }
        
        $perPage = $request->input('per_page', 15);
        $projects = $query->paginate($perPage);
        
        return response()->json([
            'data' => ProjectResource::collection($projects),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Gérer l'upload de l'image principale
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $data['image'] = $path;
        }
        
        // Gérer l'upload des images secondaires
        $secondaryImages = [];
        
        // Gérer les images secondaires existantes si fournies
        if ($request->has('existing_secondary_images') && is_array($request->existing_secondary_images)) {
            $existingImages = $this->normalizeImagePaths($request->existing_secondary_images);
            $secondaryImages = array_merge($secondaryImages, $existingImages);
        }
        
        // Gérer les nouvelles images secondaires
        if ($request->hasFile('secondary_images')) {
            foreach ($request->file('secondary_images') as $image) {
                $path = $image->store('projects/secondary', 'public');
                // Normaliser le chemin pour enlever le préfixe 'public/'
                $normalizedPath = $this->normalizeImagePaths([$path]);
                $secondaryImages = array_merge($secondaryImages, $normalizedPath);
            }
        }
        
        if (!empty($secondaryImages)) {
            $data['secondary_images'] = $secondaryImages;
        }
        
        DB::beginTransaction();
        
        try {
            $project = Project::create($data);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Project created successfully',
                'data' => new ProjectResource($project->load('category'))
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Supprimer les images qui auraient pu être uploadées en cas d'erreur
            if (isset($data['image']) && Storage::disk('public')->exists($data['image'])) {
                Storage::disk('public')->delete($data['image']);
            }
            
            if (!empty($secondaryImages)) {
                foreach ($secondaryImages as $imagePath) {
                    if (Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                    }
                }
            }
            
            return response()->json([
                'message' => 'An error occurred while creating the project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): JsonResponse
    {
        // Charger explicitement la relation category
        $project->load('category');
        
        // Log pour débogage
        \Log::info('Project show:', [
            'project_id' => $project->id,
            'category_loaded' => $project->relationLoaded('category'),
            'category_id' => $project->category_id
        ]);
        
        return response()->json([
            'data' => new ProjectResource($project)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();
        
        // Gérer les images secondaires existantes
        $existingImagesInput = $request->input('existing_secondary_images', []);
        $existingImagesSubmitted = $request->boolean('existing_secondary_images_submitted', false);
        $originalImages = $project->secondary_images ?? [];
        
        // Normaliser les chemins d'images existantes
        $existingImages = $existingImagesSubmitted
            ? $this->normalizeImagePaths($existingImagesInput)
            : $originalImages;
            
        $newSecondaryImages = [];

        DB::beginTransaction();

        try {
            // Gérer l'upload de l'image principale si une nouvelle image est fournie
            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($project->image && Storage::disk('public')->exists($project->image)) {
                    Storage::disk('public')->delete($project->image);
                }
                
                $path = $request->file('image')->store('projects', 'public');
                $data['image'] = $path;
            }

            // Gérer l'upload des nouvelles images secondaires si fournies
            if ($request->hasFile('secondary_images')) {
                // Upload des nouvelles images secondaires
                foreach ($request->file('secondary_images') as $image) {
                    $path = $image->store('projects/secondary', 'public');
                    $existingImages[] = $path;
                    $newSecondaryImages[] = $path;
                }
            }

            if ($existingImagesSubmitted) {
                // Supprimer les images qui ont été supprimées de l'interface
                $removedImages = array_diff($originalImages, $existingImages);
                foreach ($removedImages as $imagePath) {
                    if (Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                    }
                }
                
                $data['secondary_images'] = $existingImages;
            } elseif (empty($newSecondaryImages)) {
                // Si aucune image n'a été soumise et aucune nouvelle image n'a été ajoutée, conserver les images existantes
                $data['secondary_images'] = $originalImages;
            } else {
                // Si des nouvelles images ont été ajoutées mais que les images existantes n'ont pas été soumises
                // On ajoute simplement les nouvelles images aux existantes
                $data['secondary_images'] = array_merge($originalImages, $newSecondaryImages);
            }
            
            $project->update($data);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Project updated successfully',
                'data' => new ProjectResource($project->load('category'))
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Supprimer les nouvelles images qui auraient pu être uploadées en cas d'erreur
            foreach ($newSecondaryImages as $imagePath) {
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
            
            return response()->json([
                'message' => 'An error occurred while updating the project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * Delete a secondary image from a project.
     *
     * @param  \App\Models\Project  $project
     * @param  string  $imagePath
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSecondaryImage(Project $project, string $imagePath): JsonResponse
    {
        // Décoder le chemin de l'image qui a été encodé en URL
        $imagePath = urldecode($imagePath);
        
        // Normaliser le chemin de l'image pour la comparaison
        $normalizedPath = $this->normalizeImagePaths([$imagePath])[0] ?? $imagePath;
        
        // Vérifier si l'image existe dans le tableau des images secondaires
        $secondaryImages = $project->secondary_images ?? [];
        $normalizedSecondaryImages = $this->normalizeImagePaths($secondaryImages);
        $imageIndex = array_search($normalizedPath, $normalizedSecondaryImages);
        
        if ($imageIndex === false) {
            return response()->json([
                'message' => 'Image not found in project',
            ], 404);
        }
        
        // Récupérer le chemin d'origine pour la suppression
        $originalPath = $secondaryImages[$imageIndex] ?? $normalizedPath;
        
        // Supprimer l'image du stockage
        if (Storage::disk('public')->exists($originalPath)) {
            Storage::disk('public')->delete($originalPath);
        }
        
        // Supprimer l'image du tableau des images secondaires
        array_splice($secondaryImages, $imageIndex, 1);
        
        // Mettre à jour le projet
        $project->update([
            'secondary_images' => $secondaryImages
        ]);
        
        return response()->json([
            'message' => 'Image deleted successfully',
            'data' => new ProjectResource($project->load('category'))
        ]);
    }
    
    /**
     * Normalize image paths to store only the relative path
     *
     * @param  array  $imagePaths
     * @return array
     */
    protected function normalizeImagePaths($imagePaths)
    {
        if (!is_array($imagePaths)) {
            return [];
        }
        
        return array_values(array_filter(array_map(function ($path) {
            if (empty($path)) {
                return null;
            }

            // Si le chemin est une URL complète, extraire le chemin relatif
            if (Str::startsWith($path, ['http://', 'https://'])) {
                $parsed = parse_url($path);
                $path = ltrim($parsed['path'] ?? '', '/');
                // Enlever le préfixe 'storage/' s'il existe
                if (Str::startsWith($path, 'storage/')) {
                    return Str::after($path, 'storage/');
                }
                return $path;
            }
            
            // Si le chemin commence par /storage, retourner le chemin relatif
            if (Str::startsWith($path, '/storage/')) {
                return Str::after($path, '/storage/');
            }
            
            // Si le chemin commence par storage/, retourner le chemin relatif
            if (Str::startsWith($path, 'storage/')) {
                return Str::after($path, 'storage/');
            }
            
            // Si le chemin commence par public/, retourner le chemin après public/
            if (Str::startsWith($path, 'public/')) {
                return Str::after($path, 'public/');
            }
            
            // Retourner le chemin tel quel s'il est déjà un chemin relatif correct
            return $path;
        }, $imagePaths)));
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): JsonResponse
    {
        // Delete main image if exists
        if ($project->image && Storage::disk('public')->exists($project->image)) {
            Storage::disk('public')->delete($project->image);
        }
        
        // Delete secondary images if they exist
        if ($project->secondary_images) {
            foreach ($project->secondary_images as $image) {
                if (Storage::disk('public')->exists($image)) {
                    Storage::disk('public')->delete($image);
                }
            }
        }
        
        $project->delete();
        
        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
}
