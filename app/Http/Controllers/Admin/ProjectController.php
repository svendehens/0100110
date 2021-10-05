<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Author\UpdateOrCreateAuthor;
use App\Http\Controllers\Controller;

use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;

use App\Models\Project;

use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

use App\Actions\Project\CreateProject;
use App\Actions\Project\UpdateProject;
use App\Actions\Media\DeleteMedia;
use App\Actions\Media\UpdateMedia;

class ProjectController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return Inertia::render('Admin/Project/Index', [
            'filters' => Request::all('search'),
            'projects' => Project::filter(Request::only('search'))
                ->orderByDesc('id')
                ->paginate(20)
                ->transform(function ($project) {
                    return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'status' => $project->status,
                        'draft_link' => route('front.text', $project->slug)
                    ];
                }),
        ]);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, Project $project)
    {
        return Inertia::render('Admin/Project/Create', compact('project'));
    }

    /**
     * @param \App\Http\Requests\ProjectStoreRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProjectStoreRequest $request)
    {
        $data = $request->validated();

        (new CreateProject)->handle($data);

        return Redirect::route('admin.project.index');
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, Project $project)
    {
        return Inertia::render('Admin/Project/Edit', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'content' => $project->content,
                'author' => $project->author,
                'status' => boolval($project->status)
            ]
        ]);
    }

    /**
     * @param \App\Http\Requests\ProjectUpdateRequest $request
     * @param \App\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function update(ProjectUpdateRequest $request, Project $project)
    {
        $data = $request->validated();

        $project = new UpdateProject($project);
        $project = $project->handle($data);

        return Redirect::route('admin.project.index');
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('admin.project.index');
    }
}
