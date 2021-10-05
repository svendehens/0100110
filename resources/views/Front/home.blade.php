@extends('Front.Layout.index')

@section('content')

<div id="container">
    <div class="search_input">
        <input type="text" class="search_box" id="search_box" tabindex="0" onkeyup="searchKeyup(this, event);"
            onfocus="searchHint(true);" onblur="searchHint(false);" />
        <ul class="search_hint">
            <li>searchterm</li>
            <li>searchterm searchterm</li>
            <li>author, searchterm</li>
        </ul>
    </div>

    <div id="write_window" style="display:none">
        <div class="write_container window_container">

            <div class="suggestions"></div>
            <div id="hint_message"></div>
            <textarea class="write_note_box" id="write_textarea">&nbsp;</textarea>

            <div class="twitter_container">

                <span class="save">
                    <ul class="save-options">
                        <li><a href="#" onclick="save_to_desktop();return false;">desk</a></li>
                        <li><a href="#" onclick="send_email();return false;">email</a></li>
                        <li><a href="#" onclick="contact_email();return false;">contact/add</a></li>
                    </ul>
                </span>

                <div id="twitter_result"></div>

            </div>

        </div>
    </div>
</div>

<div id="tooltip" class="ui-corner-all">
    <div class="loading"></div>
</div>

<div class="hint_screenshot"></div>

@endsection
