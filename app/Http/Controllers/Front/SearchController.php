<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApiRequest;
use App\Models\Project;

class SearchController extends Controller
{

    /**
     * @param \App\Http\Requests\ApiRequest $request
     * @return \Illuminate\Http\Response
     */
    public function index(ApiRequest $request)
    {
        $word = $request->keyword ?? null;
        $id = $request->id ?? null;
        $wordIndex = $request->wordIndex ?? null;
        $searchTerm = $request->searchTerm ?? null;

        if ($word) {
            $articles = Project::select('id', 'name', 'content', 'author')->selectRaw(
                "MATCH(name, content) AGAINST('$word' IN NATURAL LANGUAGE MODE) AS score"
            )->selectRaw(
                "CONCAT_WS(
				' ',
				TRIM(
					SUBSTRING_INDEX(
						SUBSTRING(content, 1, INSTR(content, '$word') - 1 ),
						' ',
						-10
					)
				),
				'$word',
				TRIM(
					SUBSTRING_INDEX(
						SUBSTRING(content, INSTR(content, '$word') + LENGTH('$word') ),
						' ',
						10
					)
				)) AS sentence"
            )
                ->whereRaw("INSTR(content, '$word')> 0")
                ->orderBy('score')
                ->get();
        } elseif ($id) {
            $articles = Project::where('id', $id)->get();
        }

        $rows = null;
        foreach ($articles as $r) {

            if ($wordIndex != null && $wordIndex != 'undefined' && $wordIndex != -1) {
                // trim result
                $fullBody = $r['content'];
                $words = explode(" ", $fullBody);
                $wordCount = 0;
                $before = '';
                $after = '';
                $i = 1;
                $numberOfBreaks = 0;
                $currentWord = $words[$wordIndex];
                while ($numberOfBreaks < 1 && $i < 200) {
                    if ($this->hasNewLine($currentWord)) {
                        $firstBreak = strrpos($currentWord, "\\n");
                        $currentWord = substr($currentWord, $firstBreak);
                        if ($i > 20) {   // to make sure there are at least 40 words
                            $numberOfBreaks++;
                        }
                    }
                    $before = $currentWord . ' ' . $before;
                    $i++;
                    $currentWord = $words[$wordIndex + $i];
                    $wordCount++;
                }

                $i = 1;
                $currentWord = $words[$wordIndex + $i];
                $numberOfBreaks = 0;
                while ($numberOfBreaks < 1 && $i < 100) {
                    if ($this->hasNewLine($currentWord)) {
                        $lastBreak = strrpos($currentWord, "\\n", -1);
                        $currentWord = substr($currentWord, 0, $lastBreak);
                        if ($i > 10) {   // to make sure there are at least 40 words
                            $numberOfBreaks++;
                        }
                    }
                    $after = $after . ' ' . $currentWord;
                    $i++;
                    $currentWord = $words[$wordIndex + $i];
                    $wordCount++;
                }

                $section = $before . $words[$wordIndex] . $after;
                $section = str_replace(array("\\r\\n", "\\r", "\\n", "\\", "\n", "\r"), " ", $section);

                $r['content'] = $section;
            } else {
                $section = $r['content'];
                $text_length = strLen($section);
                $new_length = $text_length > 2000 ? min(round($text_length * 0.1), 2000) : $text_length;
                $start_point = round(rand(1000, $text_length));

                $section = substr($section, $start_point, $start_point + $new_length);
                $section = substr($section, strpos($section, ". ") + 2);
                $section = str_replace(array("\\r\\n", "\\r", "\\n", "\\", "\n", "\r"), " ", $section);

                $r['content'] = $section;
            }
            $rows[] = $r;
        }

        print json_encode($rows);
    }

    function hasNewLine($str)
    {
        $found = false;
        foreach (array("\\r", "\\n", "\\r\\n", "\\n\\r") as $token) {
            if (strpos($str, $token) !== false) {
                $found = true;
                break;
            }
        }
        return $found;
    }
}
