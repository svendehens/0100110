function generateMarkov(data, x, y, sourceWord, targetWord, info) {

    var textCont = "<div class='red_text_cont'>..." + data + "...</div>";

    var blueGrid = openWindow(x, y, 2000, WINDOW_WIDTH, WINDOW_HEIGHT, textCont, '', 'red_text', true);
    var height = blueGrid.window.getContainer().find('.red_text_cont').height();
    blueGrid.window.resize(WINDOW_WIDTH, height + 40);

    $(blueGrid.window.getContainer()).find('.window_frame').height(height + 30);
    $(blueGrid.window.getContainer()).find('.window_frame').highlight(sourceWord);
    $(blueGrid.window.getContainer()).find('.window_frame').highlight(targetWord);

    jsPlumb.addEndpoint($("#" + blueGrid.window.getContainer().attr('id') + " .highlight"), GREEN_ENDPOINT_OPTS);

    jsPlumb.draggable(blueGrid.window.getContainer());

    blueTexts[info.source] = blueGrid;
}

/**
 * Displays Hint screenshot image.
 * If no action the search box will be activated automatically.
 * @param {*} initialDelay
 */
function triggerHintImage(initialDelay) {

    setTimeout(function () {
        if (no_action) {
            $('.hint_screenshot').css('display', 'block');
            $('.hint_screenshot').animate({ 'opacity': 1 }, 2000);
            setTimeout(function () {
                if (no_action) {
                    $('.hint_screenshot').animate({ 'opacity': 0 }, TIMING_HINT_IMAGE_FADEOUT, function () {
                        $('.hint_screenshot').css('display', 'none');
                        setTimeout(function () {

                            if (no_action && $('#search_box').val().length == 0) {
                                typeInSearch();
                            }
                        }, TIMING_TYPEIN_WORD);
                    });
                }
            }, TIMING_HINT_IMAGE_ONSCREEN);
        }
    }, initialDelay);
}

function typeInSearch() {
    var sampleWord = 'search';
    var interval = 400;
    $('#search_box').val('');
    showText('#search_box', sampleWord, 0, interval, true);
    setTimeout(function () {
        search($('#search_box'));
    }, interval * (sampleWord.length + 2));
}

var showTextBusy = '';

var showText = function (target, message, index, interval, input) {
    if (!(showTextBusy == message || showTextBusy == '')) {
        // console.log('wait 1 second for '+message);
        // setTimeout(function () { showText(target, message, index, interval,input); }, 1000);
        return;
    }
    showTextBusy = message;
    if (index < message.length) {
        var content = input ? $(target).val() : $(target).text();
        input ? $(target).val(content + message[index++]) : $(target).text(content + message[index++]);
        setTimeout(function () { showText(target, message, index, interval, input); }, interval);
    }
    else if (index == message.length) {
        showTextBusy = '';
    }
}

function addSelectionToBox() {
    var selectedText = getSelectedText();
    var text = $.trim($('.window_container .write_note_box').val());
    text = text + " " + selectedText;
    $('.window_container .write_note_box').val(text);
}

function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection();
    }
    else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}

/**
 * Creates bottom textarea.
 * @returns
 */
function openWriteBox() {
    let top = $(window).height() - WRITE_WINDOW_HEIGHT - 5;
    let left = $(window).width() / 2 - WRITE_WINDOW_WIDTH / 2;
    if (writingBox == null) {
        let content = $("#write_window").html();
        writingBox = $.window({
            title: " ",
            content: content,
            resizable: true,
            width: WRITE_WINDOW_WIDTH,
            height: WRITE_WINDOW_HEIGHT,
            x: left,
            y: top,
            z: 3000,
            containerClass: 'write_container',
            afterResize: function (wnd) {
                let width = wnd.getContainer()[0].offsetWidth - 50;
                let height = wnd.getContainer()[0].offsetHeight - 80;
                $(wnd.getContainer().find('.write_note_box')[0]).css('width', width + 'px');
                $(wnd.getContainer().find('.write_note_box')[0]).css('height', height + 'px');
            }
        });
        writingBox.getHeader().find('.minimizeImg').css('display', 'block');
        writingBox.getHeader().find('.closeImg').css('display', 'none');
    }
    else {
        if (writingBox.isMinimized()) {
            writingBox.restore();
        }
    }
    return false;
}

function getGridForElement(element) {

    var thisWindow = $(element).parents('.window_container');
    var gridIndex = $(thisWindow).find('.grid_index').val();
    return textContent = grids[gridIndex];
}

function openWindow(x, y, z, width, height, content, title, containerClassName, resizable) {
    descriptionWindow[windowIndex] = $.window({
        title: title != null ? title : " ",
        content: content,
        resizable: true,
        width: width,
        height: height,
        x: x,
        y: y,
        resizable: resizable,
        containerClass: containerClassName
    });
    grids[windowIndex] = new GridElement(windowIndex, descriptionWindow[windowIndex]);


    windowIndex++;
    return grids[windowIndex - 1];

}

function search(searchBox) {
    no_action = false;
    var term = $('#search_box').val(); //searchBox.value;

    if (term.length < 2)
        return false;

    searchByTerm(term);

    openWriteBox();

    setTimeout(function () {
        if (texts_opened == 0) {
            writeHintMessage(1);
        }
    }, TIMING_HINT_MESSAGE_1);

    return false;
}

function writeHintMessage(step) {
    if (showTextBusy != '') {
        return;
    }
    $('.window_frame #hint_message').show();
    $('.window_frame #hint_message').text('');
    var hint_array;
    switch (step) {
        case 1:
            hint_array = HINT_MESSAGE_1;
            break;
        case 2:
            hint_array = HINT_MESSAGE_2;
            break;
        case 3:
            hint_array = HINT_MESSAGE_3;
            break;
        case 4:
            hint_array = HINT_MESSAGE_4;
            break;
        default:
            hint_array = ELIZA_MESSAGES;
            step = step.toLowerCase();
            break;
    }
    var rand = Math.round(Math.random() * 10) % hint_array.length;
    // console.log(rand);
    var sampleWord = hint_array[rand] + ' \t \n';
    sampleWord = sampleWord.replace('%word', step);
    var interval = 80;
    //$('#hint_message').val('');
    showText('.window_frame #hint_message', sampleWord, 0, interval, false);

    var fadeout_delay = interval * sampleWord.length + 3000;
    // console.log(fadeout_delay);
}

function searchByTerm(term) {
    $('.window_frame #hint_message').text('');

    var author = '';
    if (term.indexOf(',') > 0) {
        author = term.substring(0, term.indexOf(',')).trim();
        term = term.substring(term.indexOf(',') + 1).trim();
    }
    // searchCallback(data, term)
    // $.getJSON("search_all2.php?keyword=" + term + "&author=" + author, searchCallback(term));
    // $(searchBox.offsetParent).find('.change_to_note').css('display','none');
    // $.getJSON("https://api.twitter.com/1.1/search/tweets.json?lang=en&q=" + term + "&callback=?", searchTwitterCallback());

    // setTimeout(function () {
    //     searchWikiminer(term.toLowerCase());
    // }, 2000);

    // setTimeout(function () {
    //     thesaurusSyns(term.toLowerCase());
    // }, 2000);

    suggestionList = '';
}

function searchTwitterCallback() {
    return function (data) {
        if (data.results.length > 0) {
            $('.window_frame #twitter_result').text(data.results[0].text);
        }
    };
}

function searchCallback(term) {

    // let data = term;
    // console.log('searchCallback', data, term)
    return function (data) {
        var results = '';
        if (data.length == 0)
            results = 'No results';
        var author = '';
        //var authors;
        var window;
        var authorCount = 0;
        var resultPerAuthorCount = 0;

        var resultsPerBox = 0;
        var ignoredResults = 0;
        var acceptedResults = 0;
        var boxCount = 0;

        var ratio = data.length > MAX_SEARCH_RESULTS ? MAX_SEARCH_RESULTS / data.length : 1;

        $.each(data, function (i, item) {
            console.log('callback each data', item)
            var result = '';
            result = result + '<li>' + item.author + ', ' + item.title;
            result = result + '<input type="hidden" id="search_result_hidden_index" value="' + item.wordIndex + '"/>';
            result = result + '<p><a href="#" onclick="search_result(this,' + item.id + ',' + item.wordIndex + ',\'' + term + '\');return false;">' + item.sentence + '</a></p></li>';

            if (ratio < 1) {
                if (author == item.author) {
                    ignoredResults++;
                }
                else {
                    if (Math.random() < 1) {

                        results = results + result;
                        acceptedResults++;
                        resultsPerBox++;
                    }
                    else {
                        ignoredResults++;
                    }
                }
            }
            else {
                results = results + result;
                resultsPerBox++;
                acceptedResults++;
            }

            author = item.author;

            if (resultsPerBox > MAX_RESULTS_PER_BOX || ignoredResults + acceptedResults == data.length) {
                //console.log(resultsPerBox+' max: ' +MAX_RESULTS_PER_BOX);
                results = '<div class="window_container"><div class="result_container"><ul class="results_box">' + results + '</ul></div></div>';

                var height = WINDOW_HEIGHT + Math.random() * 40;

                var windowX = boxCount * (WINDOW_WIDTH) * .91 + (searchCount % 2) * WINDOW_WIDTH / 2 + 10;

                var windowY = 55 + Math.random() * 30 - 15 + (searchCount % 4) * 100;

                if (windowX + WINDOW_WIDTH + 20 > $(document).width()) {

                    windowY += 50;
                    windowX = windowX % $(document).width();

                }

                var grid = openWindow(windowX, windowY, 2000, WINDOW_WIDTH, height, results, '', 'search_container', true);
                var window = grid.window;

                $(window.getContainer()).find('.results_box p').highlight(term, { wordsOnly: true });
                results = '';
                boxCount++;
                resultsPerBox = 0;
            }

        });
        //	var thisWindow =  $(searchBox).parents('.window_container');

        //	$(thisWindow).find('.results_box').html(results);
        if (data.length > 0)
            searchCount++;

        $('.search_box')[0].value = '';

        $('.write_container .write_note_box').focus();

    }
}

function search_result(result, article_id, wordIndex, term) {

    var target = result.parentNode.parentNode; //.parentNode;
    $.getJSON("search2.php?id=" + article_id + "&wordIndex=" + wordIndex, searchResultCallback($(target), term, (wordIndex == -1) ? true : false));

    texts_opened++;
    $('.window_frame #hint_message').fadeOut(500);
    $('.window_frame #hint_message').text('');

    if (texts_opened == 1) {

        setTimeout(function () {
            if (texts_opened == 1) {
                writeHintMessage(2);
            }
        }, 5000);

    }

    if (texts_opened == 2 && synths_made == 0) {

        setTimeout(function () {
            if (synths_made == 0) {
                writeHintMessage(3);
            }
        }, 5000);

    }


    //result.parentNode.parentNode.parentNode.innerHTML = $('#desc_window .window_container').html();
    return false;
}

function searchResultCallback(target, term, largeText) {
    return function (data) {

        var dataItem = data[0];
        var result = '';
        var body = dataItem.body;
        var divclass = 'text_section';
        if (largeText) {
            divclass = divclass + ' large_text_section';
        }
        body.replace(/â€™/g, '\'')

        // todo correct item.autor

        result = '<div class="' + divclass + '"><h2><a href="#" onclick="list_titles(this,\'' + term + '\',\'' + dataItem.author + '\');return false;">' + dataItem.author + '</a>, <a href="#" onclick="search_result(this,' + dataItem.id + ',-1,\'' + term + '\');return false">' + dataItem.title + '</a></h2><div class="wikify_slider"></div><p>' + body + '</p></div>';
        var container = $(target).parents('.window_panel');//parent().parent().parent().parent();
        var top = $(container).position().top;
        var left = $(container).position().left;
        createWindow(left, top, result, term);
    };
}

function createWindow(left, top, result, term) {  // top and left are the original window top left (where link was)

    left = left + WINDOW_WIDTH + 20 + Math.random() * 20;
    if (top < 5) {
        top = 5;
    }
    if (left + WINDOW_WIDTH > $(document).width()) {
        left = left - 2 * WINDOW_WIDTH;
    }

    var grid = openWindow(left, top, 2000, WINDOW_WIDTH, WINDOW_HEIGHT, result, '', 'result_box', true);

    var window = grid.window;

    var lineHeight = (12 + openedTextCount % 3) + 'px';
    openedTextCount++;

    $(window.getContainer()).find('.text_section').css('line-height', lineHeight);

    var height = $(window.getContainer()).find('.text_section').height() + 30; // 30 for input box

    if (height < 800) {
        window.resize(WINDOW_WIDTH, height * 1.1 + 20);
        $(window.getContainer()).find('.window_frame').height(height + 15);

    }
    else {
        console.log('height: large');
    }

    $(window.getContainer()).find('.wikify_slider').slider({
        max: 100, value: 0,
        stop: function (event, ui) {

            var targetBox = $(event.target).parents('.window_frame').find('.text_section p');

            var text = targetBox.text();
            var prob = 1 - ui.value / 100;
            wikifyText(text, prob, targetBox);

        }
    });

    $(window.getContainer()).find('.wikify_slider a').attr('title', 'slide for relevance');

    if (term != '') {
        $(window.getContainer()).find('.text_section p').highlight(term, { wordsOnly: true });

        jsPlumb.addEndpoint($("#" + window.getContainer().attr('id') + " .highlight"), BLUE_ENDPOINT_OPTS);

        if (linksMade < 3) {
            $("#" + window.getContainer().attr('id') + " .highlight").attr('title', 'drag to any other anchor word to link');
            $('._jsPlumb_endpoint').attr('title', 'drag to any other anchor word to link');
        }
        else if (linksMade >= 3) {
            $(".highlight").attr('title', '');
            $('._jsPlumb_endpoint').attr('title', '');

        }
        jsPlumb.draggable(window.getContainer());

    }

}

function wikifyText(text, probability, target) {

    // var proxy_url = '/proxy.php?proxy_url=http://wikipedia-miner.cms.waikato.ac.nz/services/wikify';
    // var params = {
    //     source: text.substring(0, 10000), minProbability: probability, repeatMode: 'ALL',
    //     responseFormat: 'DIRECT', linkFormat: 'html_id_weight', tooltips: true
    // };
    // $.post(proxy_url, params,
    //     //var thisi=0;
    //     (function (target) {
    //         return function (data) {
    //             wikifyCallback(data, target);
    //         };
    //     }(target)) // calling the function with the current value
    // );
    console.log('cannot wikify')
}

function wikifyCallback(data, target) {
    var window = target.parents('.window_panel');
    var highlights = target.parents('.window_frame').find('.highlight');
    var initialSearchTerm = highlights.length > 0 ? $(highlights[0]).text() : undefined;
    target.html(data);

    // for initial term
    if (initialSearchTerm) {
        window.find('.window_frame p').highlight(initialSearchTerm);
        jsPlumb.addEndpoint($("#" + window.attr('id') + " .highlight"), BLUE_ENDPOINT_OPTS);
    }

    //console.log($("#"+window.attr('id')+" .wm_wikifiedLink"))
    //for wikified terms
    jsPlumb.addEndpoint($("#" + window.attr('id') + " .wm_wikifiedLink"), RED_ENDPOINT_OPTS);
    jsPlumb.draggable(window);

    $(window).find('.window_frame').scroll(function () {
        $.doTimeout('scroll', 1000, function () {
            console.log('scroll');
            jsPlumb.repaintEverything();
        });
    });

    if (linksMade < 3) {
        $("#" + window.attr('id') + " .wm_wikifiedLink").attr('title', 'drag to any other anchor word to synthesize');
        $('._jsPlumb_endpoint').attr('title', 'drag to any other anchor word to synthesize');
    }
    else if (linksMade >= 3) {
        $(".highlight").attr('title', '');
        $('._jsPlumb_endpoint').attr('title', '');

    }

    target.find('.wm_wikifiedLink').click(function (event) {

        var x = $(event.target).parents('.window_panel').position().left;
        var y = $(event.target).parents('.window_panel').position().top;
        var pageId = $(event.target).attr('pageId');

        queryWikipediaApiById(x, y, pageId);

        return false;
    });

}

function queryWikipediaApiById(x, y, pageId) {
    $.ajax({
        type: "GET",
        url: WIKI_API_URL + pageId,
        dataType: "json",
        success: function (data) {
            openWikiWindow(data, x, y, pageId);
        }
    });
    return false;
}

function openWikiWindow(data, x, y, pageId) {
    var rawWiki = data.query.search[0].snippet;
    var plainWiki = txtwiki.parseWikitext(rawWiki);
    console.log('plainwiki:', plainWiki)
    // plainWiki = plainWiki.substring(0, plainWiki.indexOf('=='));
    plainWiki = plainWiki.replace(/{{(.*?)}}/g, '');
    // plainWiki = plainWiki.lastIndexOf('}}') > 0 ? plainWiki.substring(plainWiki.lastIndexOf('}}') + 2) : plainWiki;
    // plainWiki = plainWiki.lastIndexOf('(disambiguation)') > 0 ? plainWiki.substring(plainWiki.lastIndexOf('(disambiguation)') + 15) : plainWiki;
    // plainWiki=plainWiki.replace(/|(.*?)|/g,'');
    console.log('plainwiki clean:', plainWiki)

    var result = `<div class="wikify_slider"></div>
        <div class="text_section">
          <h2>${data.query.search[0].title}</h2>
          <p>${plainWiki}</p>
        </div>`;
    //var grid =openWindow(x,y,2000, WINDOW_WIDTH, WINDOW_HEIGHT , plainWiki ,  '', 'wiki_box');
    if (x == 0 && y == 0) {
        x = 20 + Math.random() * 200;
        y = 30 + Math.random() * 50;
    }
    writeHintMessage(data.query.search[0].title);
    setTimeout(function () {
        // console.log('remove eliza');
        if (showTextBusy == '') {
            $('.window_frame #hint_message').text('');
        }
    }, 7000);
    createWindow(x, y, result, '');
}

function searchResultNewBox(chck, position) {
    var grid = getGridForElement(chck);
    var thisWindow = grid.window.getContainer()[0]; //why [0] ?!
    //var thisWindow =  $(chck).parents('.window_container').offsetParent()[0];
    //var thisWindowOld = chck.offsetParent;
    var newGrid = openAdjacentWindow(chck, $('#desc_window').html(), thisWindow);
    var article_id = $(chck.parentNode.parentNode).find('.search_result_hidden')[0].value;
    //$(descriptionWindow[windowIndex-1].getFrame()).find('.change_to_note').css('display','none');
    newGrid.changeMode('search_result');
    var target = descriptionWindow[windowIndex - 1].getFrame().find('ul');
    $.getJSON("search2.php?id=" + article_id + "", searchResultCallback(target));
    //descriptionWindow[windowIndex-1]
}

function list_titles(result, term, author) {
    //alert(result.nextElementSibling.value);

    //todo pass word and index to searchResultCallback

    //var grid = getGridForElement(result);
    //grid.changeMode('search_result');

    var target = result.parentNode.parentNode;//.parentNode;
    $.getJSON("list.php", listTitlesCallback($(target), term, author));

    //result.parentNode.parentNode.parentNode.innerHTML = $('#desc_window .window_container').html();
    return false;
}

function listTitlesCallback(target, term, author) {
    return function (data) {

        var result = '<ul class="title_list">';
        var prevAuthor = '';
        $.each(data, function (index, value) {
            var anchor = '';
            if (value.author != prevAuthor) {
                prevAuthor = value.author;
                anchor = '<a name="' + value.author + '"/>';
            }
            result += '<li>' + anchor + value.author + ', <a href="#" onclick="search_result(this,' + value.id + ',-1,\'' + term + '\');return false">' + value.title + '</a></li>';

        });
        result += '</ul>';

        var container = $(target).parents('.window_panel');


        var top = $(container).position().top + Math.random() * 20;
        var left = $(container).position().left;

        left = left + WINDOW_WIDTH + 20 + Math.random() * 20;
        if (top < 5) {
            top = 5;
        }
        if (left + WINDOW_WIDTH > $(document).width()) {
            left = left - 2 * WINDOW_WIDTH;
        }
        var grid = openWindow(left, top, 2000, WINDOW_WIDTH, WINDOW_HEIGHT, result, '', 'result_box', true);

        scrollToAnchor(author, $(grid.window.getContainer()).find('.window_frame'), grid.window.getContainer().attr('id'));
        //var window = grid.window;
    };
}

function thesaurusSyns(term) {

    $.getJSON(THES_JSON + term + '/json', function (data) {
        var suggestions_html = '';
        var index = 0;
        for (var key in data) {
            if (key == undefined)
                continue;
            $.each(data[key].syn, function (index, item) {
                if (index < 5) {
                    suggestions_html += '<li><a href="#" onclick="searchByTerm(\'' + item + '\');return false;"> ' + item + '</li>';
                    index++;
                }
            });

        }
        if (suggestionList.length > 0) {
            suggestionList += '<li>&nbsp;</li>';
        }

        suggestionList += suggestions_html;
        $('.write_container .suggestions').html('<ul class="wiki_suggestions">' + suggestionList + '</ul>');
    });
}

function searchWikiminer(term) {
    processArticleJSON(BY_TERM_JSON + term, term);
}

//	http://words.bighugelabs.com/api/2/173aaf6b8cc559ac582b75f5ef7a8c8c/interface/json

function processArticleJSON(url, term) {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        jsonp: "callback",
        dataType: 'jsonp',
        data: {
            action: "query",
            list: "search",
            srsearch: term,
            format: "json"
        },
        xhrFields: { withCredentials: true },
        success: function (data) {
            console.log('processArticleJSON:', data)
            console.log('processArticleJSON snippet:', data.query.search[0].snippet)
            openWikiWindow(data, 0, 0, data.query.search[0].pageid);
        }
    });

    $.getJSON(url, function (data) {
        json_cache = data;
        var sortedLinks = sortJSON(data, 'relatedness');
        if (sortedLinks == null) {
            return;
        }
        var suggestions_html = '';
        $.each(sortedLinks, function (index, item) {
            if (index < 7) {
                suggestions_html += '<li><a href="#" onclick="queryWikipediaApiById(0,0,\'' + item.id + '\');return false;"> ' + item.title.toLowerCase() + ' </a></li>';
                index++;
            }
        });
        if (suggestionList.length > 0) {
            suggestionList += '<li>&nbsp;</li>';
        }
        suggestionList += suggestions_html;

        $('.write_container .suggestions').html('<ul class="wiki_suggestions">' + suggestionList + '</ul>');

    });
}

function save_to_desktop() {
    var content = $('.window_frame #write_textarea').val();
    window.open("save.php?method=desktop&content=" + content, "_self")
}

function send_email() {
    var content = $('.window_frame #write_textarea').val();
    var to = prompt('email address (separated by comma)');
    if (to != null && to != '') {
        $.ajax({
            url: "save.php?method=email&content=" + content + "&to=" + to,
            context: document.body
        }).done(function () {
            console.log('ajax done');
        });
    }
    //	window.open("save.php?method=email&content="+content+"&to="+to,"_self")
}

function contact_email() {
    var content = $('.window_frame #write_textarea').val();
    // var to = 'chrsmnn@gmail.com';
    var to = 'dehens.sven@gmail.com';
    if (to != null && to != '' && content != '') {
        $.ajax({
            url: "save.php?method=email&content=" + content + "&to=" + to,
            context: document.body
        }).done(function () {
            console.log('ajax done');
            alert('thanks');
        });
    }
}

var searchHintCount = 0;
function searchHint(focus) {
    // if (focus && searchHintCount < 3 && searchCount > 0) {
    if (focus) {
        $('.search_hint').show();
        searchHintCount++;
    }
    else {
        $('.search_hint').hide();
    }
}

function searchKeyup(searchField, event) {
    $('.hint_screenshot').css('display', 'none');
    if (event.keyCode == 13) {
        search(searchField);
        no_action = false;
    }
}
