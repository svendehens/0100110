<?php

namespace App\Actions\Project;

use App\Models\Project;
use Illuminate\Support\Str;
use Exception;

class UpdateProject
{
    private $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }
    public function handle(array $data): Project
    {
        $name = Project::whereName($data['name'])->first();
        if ($name && $name->id !== $this->project->id) {
            throw new Exception('Name must be unique');
        }

        $slug = $this->project->slug;
        if ($data['name'] != $this->project->name) {
            $slug = Str::of($data['name'])->slug('-');
        }

        $this->project->name = trim($data['name']);
        $this->project->slug = $slug;
        $this->project->author = $data['author'];
        $this->project->content = $data['content'];
        $this->project->status = $data['status'] !== null ? (int)boolval($data['status']) : 1;

        $this->project->save();

        return $this->project;
    }
}
