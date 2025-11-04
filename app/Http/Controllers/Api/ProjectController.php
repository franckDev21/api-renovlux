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
        
        $projects = $query->get();
        
        return response()->json(ProjectResource::collection($projects));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Handle main image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $data['image'] = $path;
        }
        
        // Handle secondary images upload
        $secondaryImages = [];
        if ($request->hasFile('secondary_images')) {
            foreach ($request->file('secondary_images') as $image) {
                $path = $image->store('projects/secondary', 'public');
                $secondaryImages[] = $path;
            }
            $data['secondary_images'] = $secondaryImages;
        }
        
        $project = Project::create($data);
        
        return response()->json([
            'message' => 'Project created successfully',
            'data' => new ProjectResource($project->load('category'))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): JsonResponse
    {
        return response()->json(new ProjectResource($project->load('category')));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();
        
        // Handle main image upload if a new image is provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($project->image && Storage::disk('public')->exists($project->image)) {
                Storage::disk('public')->delete($project->image);
            }
            
            $path = $request->file('image')->store('projects', 'public');
            $data['image'] = $path;
        }
        
        // Handle secondary images upload if provided
        if ($request->hasFile('secondary_images')) {
            // Delete old secondary images if they exist
            if ($project->secondary_images) {
                foreach ($project->secondary_images as $oldImage) {
                    if (Storage::disk('public')->exists($oldImage)) {
                        Storage::disk('public')->delete($oldImage);
                    }
                }
            }
            
            // Upload new secondary images
            $secondaryImages = [];
            foreach ($request->file('secondary_images') as $image) {
                $path = $image->store('projects/secondary', 'public');
                $secondaryImages[] = $path;
            }
            $data['secondary_images'] = $secondaryImages;
        }
        
        $project->update($data);
        
        return response()->json([
            'message' => 'Project updated successfully',
            'data' => new ProjectResource($project->load('category'))
        ]);
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
