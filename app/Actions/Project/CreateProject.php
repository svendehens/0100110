<?php

namespace App\Actions\Project;

use App\Models\Project;
use Illuminate\Support\Str;

class CreateProject
{
    public function handle(array $data): Project
    {
        $project = new Project();

        $slug = Str::of($data['name'])->slug('-');

        $project->name = trim($data['name']);
        $project->slug = $slug;
        $project->content = $data['content'];
        $project->author = $data['author'];
        $project->status = isset($data['status']) ? (int)boolval($data['status']) : 0;

        $project->save();

        return $project;
    }
}
