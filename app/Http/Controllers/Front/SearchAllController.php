<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApiRequest;
use App\Models\Project;

class SearchAllController extends Controller
{

    /**
     * @param \App\Http\Requests\ApiRequest $request
     * @return \Illuminate\Http\Response
     */
    public function index(ApiRequest $request)
    {
        $word = $request->keyword ?? null;
        $author = $request->author ?? null;
        $max = $request->max ?? 0;
        $id = $request->id ?? null;

        $authorClause = "";

        $MAX_SEARCH_RESULTS = 100;

        if ($author != null && strlen($author) > 0) {
            $authorClause = " and author='$author' ";
        }

        $articles = Project::select('id', 'name', 'content', 'author')->selectRaw(
            "MATCH(name, content) AGAINST('$word' IN NATURAL LANGUAGE MODE) AS score"
        )->whereRaw("INSTR(content, '$word') > 0 " . $authorClause)
            ->orderBy('author')
            ->get();

        $num_result = $articles->count();
        $ratio = $num_result > $MAX_SEARCH_RESULTS ? $MAX_SEARCH_RESULTS / $num_result : 1;

        $doc_count = 0;
        $prevAuthor = '';
        $rows = null;

        foreach ($articles as $r) {
            if ($ratio < 1) {
                $rand = rand() / getrandmax();
                if ($rand > $ratio) {
                    continue;
                }
            }

            // one text per author
            if ($num_result > $MAX_SEARCH_RESULTS && strcmp($r['author'], $prevAuthor) == 0) {
                continue;
            }

            $doc_count++;

            if ($max != 0 && $doc_count > $max) {
                break;
            }

            $id = $r['id'];
            $title = $r['name'];
            $score = $r['score'];
            $body = $r['content'];
            $author = $r['author'];

            $prevAuthor = $author;

            $words = explode(" ", $body);
            $index = array_search($word, $words);
            $strings = $this->getAllAppearences($word, $body, 0, $index);

            for ($i = 0; $i < count($strings); $i++) {
                $row = array(
                    "id" => $id,
                    "title" => $title,
                    "author" => $author,
                    "score" => $score,
                    "sentence" => $strings[$i]['sentence'],
                    "index" => $strings[$i]['index'],
                    "wordIndex" => $strings[$i]['wordIndex']
                );
                $rows[] = $row;
            }
        }

        print json_encode($rows);
    }

    function getAllAppearences($word, $body, $max, $index)
    {
        $results = array();
        $secondWord = '';
        if (strpos($word, " ") > 0) {
            list($word, $secondWord) = explode(" ", $word);
        }
        $words = explode(" ", $body);

        $word = strtolower($word);
        $words = array_map('strtolower', $words);

        $keys = array_keys($words, $word);
        $startingPoint = 0;
        $endPoint = count($keys);

        if (count($keys) > 50) {
            $startingPoint = rand(0, count($keys) - 10);
            $endPoint = rand($startingPoint, count($keys));
        }

        for ($keyCount = $startingPoint; $keyCount < $endPoint; $keyCount++) {

            $string = "";
            $hasSecondWord = false;
            $index = $keys[$keyCount];

            for ($i = $index; $i < $index + 20; $i++) {
                if ($i > 0 && $words[$i] == $secondWord) {
                    $hasSecondWord = true;
                }
                $string = $string . $words[$i] . " ";
            }

            if (strlen($secondWord) == 0 || $hasSecondWord == true) {
                $string = str_replace(array("\\r\\n", "\\r", "\\n", "\\"), " ", $string);
                $results[] = array(
                    "index" => $keyCount,
                    "wordIndex" => $index,
                    "sentence" => '...' . $string . '...'
                );
            }
        }

        return $results;
    }
}
