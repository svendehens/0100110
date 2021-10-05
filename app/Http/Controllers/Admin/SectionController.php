<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SectionUpdateRequest;

use App\Models\Section;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;

use Inertia\Inertia;

class SectionController extends Controller
{

  /**
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    return Inertia::render('Admin/Section/Index', [
      'filters' => Request::all('search'),
      'sections' => Section::filter(Request::only('search'))
        ->orderByDesc('id')
        ->paginate(30)
        ->transform(function ($section) {
          return [
            'id' => $section->id,
            'name' => $section->name,
            'info' => $section->info
          ];
        }),
    ]);
  }

  /**
   * @param \Illuminate\Http\Request $request
   * @param \App\Models\Section $section
   * @return \Illuminate\Http\Response
   */
  public function edit(Request $request, Section $section)
  {
    return Inertia::render('Admin/Section/Edit', compact('section'));
  }

  /**
   * @param \App\Http\Requests\SectionUpdateRequest $request
   * @param \App\Models\Section $section
   * @return \Illuminate\Http\Response
   */
  public function update(SectionUpdateRequest $request, Section $section)
  {
    $section->update([
      'content' => $request->content
    ]);
    return Redirect::route('admin.section.index');
  }

}
