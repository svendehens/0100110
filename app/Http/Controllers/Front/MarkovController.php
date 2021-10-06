<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApiRequest;

class MarkovController extends Controller
{
    /**
     * @param \App\Http\Requests\ApiRequest $request
     * @return \Illuminate\Http\Response
     */
    public function index(ApiRequest $request)
    {
        $content = $request->content ?? null;
        $order = $request->order ?? 5;
        $length = $request->length ?? 200;
        $begining = $request->begining ?? null;

        $markov_table = $this->generate_markov_table($content, $order);
        $markov = $this->generate_markov_text($length, $markov_table, $order, $begining);

        echo $markov;
    }

    function generate_markov_table($text, $look_forward)
    {
        $table = array();

        // now walk through the text and make the index table
        for ($i = 0; $i < strlen($text); $i++) {
            $char = substr($text, $i, $look_forward);
            if (!isset($table[$char])) $table[$char] = array();
        }

        // walk the array again and count the numbers
        for ($i = 0; $i < (strlen($text) - $look_forward); $i++) {
            $char_index = substr($text, $i, $look_forward);
            $char_count = substr($text, $i + $look_forward, $look_forward);

            if (isset($table[$char_index][$char_count])) {
                $table[$char_index][$char_count]++;
            } else {
                $table[$char_index][$char_count] = 1;
            }
        }
        return $table;
    }

    function generate_markov_text($length, $table, $look_forward, $start)
    {
        // get first character
        $ppi = 0;
        if ($start) {
            $char = substr($start, 0, $look_forward);
        } else {
            $char = array_rand($table);
            $ppi = 1;
        }

        $o = $char;

        for ($i = 0; $i < ($length / $look_forward); $i++) {
            $newchar = $this->return_weighted_char($table[$char]);

            if ($newchar) {
                $char = $newchar;
                $o .= $newchar;
            } else {
                $char = array_rand($table);
            }
        }

        return $o;
    }


    function return_weighted_char($array)
    {
        if (!$array) return false;

        $total = array_sum($array);
        $rand  = mt_rand(1, $total);
        foreach ($array as $item => $weight) {
            if ($rand <= $weight) return $item;
            $rand -= $weight;
        }
    }
}
