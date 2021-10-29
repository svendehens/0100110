// CONSTANTS
const TEST_MODE = true;

const MAX_RESULTS_PER_BOX = 15;
const MAX_SEARCH_RESULTS = 75;

const WINDOW_WIDTH = 250;
const WINDOW_HEIGHT = 300;

const WRITE_WINDOW_WIDTH = 400;
const WRITE_WINDOW_HEIGHT = 250;

const TIMING_HINT_IMAGE = 3000;
const TIMING_HINT_IMAGE_FADEOUT = 3000;

const TIMING_HINT_IMAGE_ONSCREEN = 5000;

const TIMING_TYPEIN_WORD = 5000; // 3 seconds

const TIMING_HINT_MESSAGE_1 = 15000; // 3 seconds

const HINT_MESSAGE_1 = ['well, waiting got you this far, but not much further, so select one of the text excerpts that look like they could be interesting.'
    , 'ok, find a text that looks like it could be interesting. click on it.'
    , 'which of the excerpts above look promising to you? click on it.'];

const HINT_MESSAGE_2 = ["this is the paragraph which hosted the excerpt.." +
    "now, find another text. if theres nothing that looks attractive, try scrolling through any of the columns of examples til you find one and click on that.",
    "find another text fragment that looks promising. click.",
    "now click on another text that seems interesting."];

const HINT_MESSAGE_3 = ["if either of these new text windows need to be moved, just grab the L (ikon) in the upper left of the text window and move it." +
    "anyway, now in these two texts you'll see the original searchterm (\'search\', remember), underlined. click and drag one ‘search’ to the other. a blue line and a blue text. a synthesis of the two."];

const HINT_MESSAGE_4 = ["also at the top of this text area, to the right, you’ll find the title of the work from which this paragraph was taken. a click on that will bring up a larger excerpt of the text," +
    " but before you do that, below the author and title is a line with a slider. click the crossbar and slide to the right. constious words will be highlighted gray. it calculates relevance. the further right," +
    " the larger the scope of relevance. link any two highlighted words from any two texts. red line and text. link red and red or blue, green text." +
    "the synonyms and wikipedia and twitter associations you dont need me for."];

const ELIZA_MESSAGES = ["does %word interest you?", "what does %word suggest to you?", "is %word much on your mind?", "do you feel strongly discussing about %word?"];

const BY_TERM_JSON = 'https://test.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=';
const THES_JSON = 'http://words.bighugelabs.com/api/2/173aaf6b8cc559ac582b75f5ef7a8c8c/';
const WIKI_API_URL = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=*&format=json&pageids=';
const MARKOV_URL = '';
const SEARCH_ALL_URL = '';
const SEARCH_URL = '';
const LIST_URL = '';

const BLUE_ENDPOINT_OPTS = {
    endpoint: "Rectangle",
    paintStyle: { width: 25, height: 20, fillStyle: '#555' },
    isSource: true,
    connectorStyle: { strokeStyle: "#00F" },
    isTarget: true,
    anchor: "TopCenter"
};
const RED_ENDPOINT_OPTS = {
    endpoint: "Rectangle",
    paintStyle: { width: 25, height: 20, fillStyle: '#555' },
    isSource: true,
    connectorStyle: { strokeStyle: "#F00" },
    isTarget: true,
    anchor: "TopCenter"
};

const GREEN_ENDPOINT_OPTS = {
    endpoint: "Rectangle",
    paintStyle: { width: 25, height: 20, fillStyle: '#555' },
    isSource: true,
    connectorStyle: { strokeStyle: "#00FF00" },
    isTarget: true,
    anchor: "TopCenter"
};

// VARS

let descriptionWindow = [];
let grids = [];
let writingBox = null;
let suggestionBox = null;
let suggestionList = '';
let searchCount = 0;
let openedTextCount = 0;
let linksMade = 0;
let no_action = true;
let texts_opened = 0;
let synths_made = 0;
let nonblue_synths_made = 0;
let windowIndex = 0;
let blueTexts = {};
let desktop_demo = false;
let idle = true;


// UTILS FUNCTIONS

/**
 * @returns Name and Version of the browser
 */
var browser = (function () {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
})();

function sortJSON(data, sortMethod) {
    var ret;
    if (data.outLinks == undefined)
        return null;
    if (sortMethod == 'relatedness') {
        ret = data.outLinks.sort(function (a, b) { return parseFloat(b.relatedness) - parseFloat(a.relatedness) });
    }
    else {
        ret = data.outLinks.sort(function (a, b) { return a.title > b.title ? 1 : -1 });
    }
    return ret;
}

function checkRegexp(o, regexp, n) {
    if (!(regexp.test(o.val()))) {
        return false;
    } else {
        return true;
    }
}

function scrollToAnchor(aid, scroll_container, container_id) {
    var path = "#" + container_id + " a[name='" + aid + "']";
    var aTag = $(path);
    scroll_container.animate({ scrollTop: aTag.offset().top - 80 }, 'fast');
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}

var autoRefresh = function (seconds) {
    var refresh,
        intvrefresh = function () {
            clearInterval(refresh);
            refresh = setTimeout(function () {
                location.href = location.href;
            }, seconds * 1000);
        };

    $(document).on('keypress, click, mousemove', function () { intvrefresh(); detectFirstActivity(); });
    intvrefresh();
};

// READY
$(function () {

    // triggerHintImage(TIMING_HINT_IMAGE);

    if (browser.name == "MSIE" || browser.name == "Edge") {
        alert("machine for making sense has been designed and tested on Firefox and Chrome");
    }

    $('#search_box').val('');

    setTimeout(() => {
        openWriteBox();
        typeInSearch();
        $('.search_box').trigger('focus');
        $('.search_box').trigger('select');
    }, 6000)

    initJsPlumb()
});


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
        // writingBox.getHeader().find('.minimizeImg').css('display', 'block');
        // writingBox.getHeader().find('.closeImg').css('display', 'none');
        $('.window_function_bar').css('display', 'block');
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
    var sampleWord = hint_array[rand] + ' \t \n';
    sampleWord = sampleWord.replace('%word', step);
    var interval = 80;
    //$('#hint_message').val('');
    showText('.window_frame #hint_message', sampleWord, 0, interval, false);

    // var fadeout_delay = interval * sampleWord.length + 3000;
    // console.log(fadeout_delay);
}

function searchByTerm(term) {
    $('.window_frame #hint_message').text('');

    var author = '';
    if (term.indexOf(',') > 0) {
        author = term.substring(0, term.indexOf(',')).trim();
        term = term.substring(term.indexOf(',') + 1).trim();
    }
    $.getJSON("search-all?keyword=" + term + "&author=" + author, searchCallback(term));

    // $.getJSON("https://api.twitter.com/1.1/search/tweets.json?lang=en&q=" + term + "&callback=?", searchTwitterCallback());

    setTimeout(function () {
        searchWikiminer(term.toLowerCase());
    }, 2000);

    setTimeout(function () {
        thesaurusSyns(term.toLowerCase());
    }, 2000);

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
    return function (data) {
        var results = '';
        if (data === null)
            results = 'No results';

        var author = '';
        var resultsPerBox = 0;
        var ignoredResults = 0;
        var acceptedResults = 0;
        var boxCount = 0;

        var ratio = data && data.length > MAX_SEARCH_RESULTS ? MAX_SEARCH_RESULTS / data.length : 1;

        $.each(data, function (i, item) {
            // console.log('callback each data', item)
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
        if (data && data.length > 0)
            searchCount++;

        $('.search_box')[0].value = '';
        $('.write_container .write_note_box').trigger('focus');
    }
}

function search_result(result, article_id, wordIndex, term) {
    var target = result.parentNode.parentNode;

    $.getJSON("search?id=" + article_id + "&wordIndex=" + wordIndex, searchResultCallback($(target), term, (wordIndex == -1) ? true : false));

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
    return false;
}

function searchResultCallback(target, term, largeText) {
    return function (data) {
        var dataItem = data[0];
        var result = '';
        var body = dataItem.content;
        var divclass = 'text_section';
        if (largeText) {
            divclass = divclass + ' large_text_section';
        }
        body.replace(/â€™/g, '\'')

        result = `
            <div class="${divclass}">
                <h2>
                    <a href="#" onclick="list_titles(this,\'${term}\',\'${dataItem.author}\');return false;">${dataItem.author}</a>
                    , <a href="#" onclick="search_result(this,${dataItem.id},-1,\'${term}\');return false">${dataItem.name}</a>
                </h2>
                <div class="wikify_slider"></div>
                <p>${body}</p>
            </div>
        `;
        var container = $(target).parents('.window_panel');
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
            // $('.jtk-endpoint').attr('title', 'drag to any other anchor word to link');
        }
        else if (linksMade >= 3) {
            $(".highlight").attr('title', '');
            $('._jsPlumb_endpoint').attr('title', '');
            // $('.jtk-endpoint').attr('title', '');
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
        // $('.jtk-endpoint').attr('title', 'drag to any other anchor word to synthesize');
    }
    else if (linksMade >= 3) {
        $(".highlight").attr('title', '');
        $('._jsPlumb_endpoint').attr('title', '');
        // $('.jtk-endpoint').attr('title', '');
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

    // plainWiki = plainWiki.substring(0, plainWiki.indexOf('=='));
    plainWiki = plainWiki.replace(/{{(.*?)}}/g, '');
    // plainWiki = plainWiki.lastIndexOf('}}') > 0 ? plainWiki.substring(plainWiki.lastIndexOf('}}') + 2) : plainWiki;
    // plainWiki = plainWiki.lastIndexOf('(disambiguation)') > 0 ? plainWiki.substring(plainWiki.lastIndexOf('(disambiguation)') + 15) : plainWiki;
    // plainWiki=plainWiki.replace(/|(.*?)|/g,'');

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
    $.getJSON("search?id=" + article_id + "", searchResultCallback(target));
    //descriptionWindow[windowIndex-1]
}

function list_titles(result, term, author) {
    //alert(result.nextElementSibling.value);
    //todo pass word and index to searchResultCallback
    //var grid = getGridForElement(result);
    //grid.changeMode('search_result');

    var target = result.parentNode.parentNode;//.parentNode;
    console.log('accessing list titles')
    // $.getJSON("list.php", listTitlesCallback($(target), term, author));

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
            result += '<li>' + anchor + value.author + ', <a href="#" onclick="search_result(this,' + value.id + ',-1,\'' + term + '\');return false">' + value.name + '</a></li>';

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


function initJsPlumb() {
    jsPlumb.ready(function () {
        jsPlumb.Defaults.Container = $("body");
        jsPlumb.importDefaults({
            ConnectorZIndex: 4000,
            Connector: "Straight",
            //  Endpoint : "Blank",
            PaintStyle: { lineWidth: 1, strokeStyle: "#00F" },
            Anchors: ["TopCenter", "BottomCenter"]
        });

        jsPlumb.bind("jsPlumbConnection", function (info) {
            $('.window_frame #hint_message').fadeOut(500);
            $('.window_frame #hint_message').text('');
            synths_made++;

            const sourceTxt = info.source.parent().text();
            const targetTxt = info.target.parent().text();
            const sourceWindow = info.source.parents('.window_panel');//parent().parent().parent().parent();
            const targetWindow = info.target.parents('.window_panel');//parent().parent().parent().parent();

            const x = (info.source.position().left + info.target.position().left +
                sourceWindow.position().left + targetWindow.position().left) / 2 - WINDOW_WIDTH / 2;

            const y = (info.source.position().top + info.target.position().top +
                sourceWindow.position().top + targetWindow.position().top) / 2 - 50;

            if (info.source.hasClass('wm_wikifiedLink')) {	//wikified anchor (e.g red synth)
                nonblue_synths_made++;
                const sourceWord = info.source.text();
                const targetWord = info.target.text();
                $.getJSON("/search?keyword=" + sourceWord + "&max=10", function (data1) {

                    $.getJSON("/search?keyword=" + targetWord + "&max=10", function (data2) {
                        console.log('targetword data2', data2)
                        if (result1 == undefined || result2 == undefined) {
                            // console.log('local synth');
                            if (sourceTxt.length > 2000) {
                                sourceTxt = sourceTxt.substring(0, 2000);
                                // console.log(sourceTxt);
                            }
                            var len = sourceTxt.length < 200 ? sourceTxt.length : sourceTxt.length * 0.6;
                            $.ajax({
                                url: '/markov?order=5&begining=' + sourceWord + '&length=' + len + '&content=' + sourceTxt,
                                context: document.body
                            }).done(function (data) {
                                generateMarkov(data, x, y, sourceWord, targetWord, info);
                            });
                        }
                        else {
                            const result1 = data1[Math.floor(Math.random() * data1.length)];
                            const result2 = data2[Math.floor(Math.random() * data2.length)];

                            $.getJSON("search2.php?id=" + result1.id + "&wordIndex=" + result1.wordIndex, function (para1) {
                                $.getJSON("search2.php?id=" + result2.id + "&wordIndex=" + result2.wordIndex, function (para2) {

                                    //console.log('paragraphs '+para1.length+' '+para2.length);

                                    const length = Math.round((para1[0].body.length + para2[0].body.length) / 2);


                                    $.ajax({
                                        url: '/markov?order=5&begining=' + sourceWord + '&length=' + length + '&content=' + para1[0].body + ' ' + para2[0].body,
                                        context: document.body
                                    }).done(function (data) {
                                        generateMarkov(data, x, y, sourceWord, targetWord, info);
                                    });
                                });
                            });
                        }
                    });
                });
                info.source.css('color', '#F00');
                info.target.css('color', '#F00');
            }
            else {
                const color = (info.source.parents('.red_text').length > 0 || info.source.parents('.blue_text').length > 0 ||
                    info.target.parents('.red_text').length > 0 || info.target.parents('.blue_text').length > 0) ? 'green' : 'blue';
                const div = '<div class="' + color + '_overlay">' + sourceTxt + ' ' + targetTxt + '</div>';

                const length = Math.round((sourceTxt.length + targetTxt.length) / 2);
                const order = color == 'blue' ? 6 : 4;
                if (color == 'blue' && nonblue_synths_made == 0) {
                    setTimeout(function () {
                        if (nonblue_synths_made == 0) {
                            writeHintMessage(4);
                        }
                    }, 10000);
                }

                $.ajax({
                    url: '/markov?order=' + order + '&begining=' + info.source.text() + '&length=' + length + '&content=' + sourceTxt + ' ' + targetTxt,
                    context: document.body
                }).done(function (data) {
                    var textCont = "<div class='" + color + "_text_cont'>..." + data + "...</div>";

                    var blueGrid = openWindow(x, y, 2000, WINDOW_WIDTH, WINDOW_HEIGHT, textCont, '', color + '_text', true);
                    var height = blueGrid.window.getContainer().find('.' + color + '_text_cont').height();
                    blueGrid.window.resize(WINDOW_WIDTH, height + 40);
                    // '.window_frame'
                    $(blueGrid.window.getContainer()).find('.window_frame').height(height + 30);

                    blueTexts[info.source] = blueGrid;
                    if (color != 'green') {

                        $(blueGrid.window.getContainer()).find('.window_frame').highlight(info.source.text());
                        $(blueGrid.window.getContainer()).find('.window_frame').highlight(info.target.text());

                        jsPlumb.addEndpoint($("#" + blueGrid.window.getContainer().attr('id') + " .highlight"), GREEN_ENDPOINT_OPTS);

                        jsPlumb.draggable(blueGrid.window.getContainer());
                    }

                });
                info.source.css('color', '#00F');
                info.target.css('color', '#00F');
            }
            linksMade++;
        });

        jsPlumb.bind("jsPlumbConnectionDetached", function (info) {
            info.source.css('color', '#666');
            info.target.css('color', '#666');
            console.log(info)
            var grid = blueTexts[info.source];
            grid.window.close();
        });
    });
}

function GridElement(index, window) {
  this.index = index;
  this.window = window;

  this.mode = 'search';

  this.window.getContainer().find('.change_to_wiki').css('display', 'none');


  this.window.getContainer().find('.grid_index').val(index);

}

GridElement.prototype.getX = function () {
  return this.window.getContainer().css('top');
}

GridElement.prototype.getY = function () {
  return this.window.getContainer().css('left');

}

GridElement.prototype.getResultContainer = function () {
  return this.window.getContainer().find('.result_container');
}

GridElement.prototype.getSearchBox = function () {
  return this.window.getContainer().find('.search_box');
}

GridElement.prototype.getNoteBox = function () {
  return this.window.getContainer().find('.note_box');
}

GridElement.prototype.getTextContent = function () {
  return this.window.getContainer().find('.results_box p').text();
}

GridElement.prototype.changeMode = function (mode) {
  if (mode == this.mode)
    return;
  var container = this.window.getContainer();
  switch (mode) {
    case 'search_result':
      container.find('.change_to_note').css('display', 'none');
      container.find('.change_to_wiki').css('display', 'inline');
      break;
    case 'note':
      container.find('.search_box').remove();
      container.find('.results_box').remove();
      $('<textarea/>').addClass('note_box').insertAfter(container.find('.checkboxes'));
      container.find('.change_to_note').css('display', 'none');
      container.find('.change_to_wiki').css('display', 'none');

      break;

  }
  this.mode = mode;
}

GridElement.prototype.toJson = function () {
  var jsonObject = this;
  jsonObject.x = Math.round(this.getX().replace('px', ''));
  jsonObject.y = Math.round(this.getY().replace('px', ''));
  jsonObject.html_content = this.window.getContainer().find('.result_container').html();
  jsonObject.scroll = Math.round(this.window.getContainer().find('.window_frame').scrollTop());

  return jsonObject;
}

"use strict";

var txtwiki = (function () {

  function parseWikitext(content) {
    var parsed = "";

    content = stripWhitespace(content);

    content = firstPass(content);
    content = secondPass(content);

    var paragraphs = content.split("\n");
    for (var i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].length === 0) {
        parsed += "\n";
        continue;
      }

      paragraphs[i] = boldItalicPass(paragraphs[i]);

      parsed += paragraphs[i] + "\n";
    }

    parsed = stripWhitespace(parsed);

    return parsed;
  }

  function parseSimpleTag(content, pos, start, end) {
    if (content.slice(pos, pos + start.length) == start) {
      pos += start.length;
      var posEnd = content.indexOf(end, pos);
      if (posEnd == -1)
        posEnd = content.length;
      return { text: content.slice(pos, posEnd), pos: posEnd + end.length };
    }
    return { text: null, pos: pos };
  }

  function parseLink(content, pos) {
    if (content.slice(pos, pos + 2) == "[[") {
      var link = "";
      pos += 2;
      while (content.slice(pos, pos + 2) != "]]") {
        if (content.slice(pos, pos + 2) == "[[") {
          var out = parseLink(content, pos);
          link += out.text;
          pos = out.pos;
        } else {
          link += content[pos];
          pos++;
        }
      }
      pos += 2;

      var args = link.split("|");
      if (args.length == 1)
        return { text: args[0], pos: pos };
      else {
        if (args[0].slice(0, 5) == "File:")
          return { text: "", pos: pos }
        return { text: args[1], pos: pos };
      }
    }
    return { text: null, pos: pos };
  }

  function parseRef(content, pos) {
    if (content.slice(pos, pos + 4) == "<ref") {
      pos += 4;
      var text = content.slice(pos);
      var posEnd = text.search(/<\/ref>|\/>/);
      if (text.slice(posEnd, posEnd + 6) == "</ref>")
        return { text: text.slice(0, posEnd), pos: pos + posEnd + 6 };
      else
        return { text: text.slice(0, posEnd), pos: pos + posEnd + 2 };
    }
    return { text: null, pos: pos };
  }

  function firstPass(content) {
    var parsed = "";
    var pos = 0;
    var out;
    while (pos < content.length) {

      if (content[pos] == "<") {
        // Parse comment.
        out = parseSimpleTag(content, pos, "<!--", "-->");
        if (out.text != null) {
          pos = out.pos;
          continue;
        }
      }

      if (content[pos] == "{") {
        // Parse table.
        out = parseSimpleTag(content, pos, "{|", "|}");
        if (out.text != null) {
          pos = out.pos;
          continue;
        }
      }

      parsed += content[pos];
      pos++;
    }

    return parsed;
  }

  function secondPass(content) {
    var parsed = "";
    var pos = 0;
    var out;

    while (pos < content.length) {

      if (content[pos] == "<") {
        out = parseRef(content, pos);
        if (out.text != null) {
          pos = out.pos;
          continue;
        }
      }

      if (content[pos] == "[") {
        out = parseLink(content, pos);
        if (out.text != null) {
          pos = out.pos;
          parsed += out.text;
          continue;
        }
      }

      parsed += content[pos];
      pos++;
    }

    return parsed;
  }

  // Strip bold and italic caracters from paragraph. */
  function boldItalicPass(content) {
    var toggle = [];
    var countItalic = 0, countBold = 0;

    var tmp = content;
    var i = 0, pos = 0;
    // First pass to determine default toggle positions.
    while (true) {
      i = tmp.search(/''([^']|$)/);
      if (i === -1)
        break;

      pos += i;
      if (tmp.slice(i - 3, i) === "'''") {
        toggle.push({ pos: pos - 3, type: "b" });
        toggle.push({ pos: pos, type: "i" });
        countBold += 1;
        countItalic += 1;
      } else if (tmp[i - 1] === "'") {
        toggle.push({ pos: pos - 1, type: "b" });
        countBold += 1;
      } else {
        toggle.push({ pos: pos, type: "i" });
        countItalic += 1;
      }
      pos += 2;
      tmp = tmp.slice(i + 2);
    }

    // Treat special cases if both number of toggles odd.
    if ((countBold % 2) + (countItalic % 2) === 2)
      for (i = 0; i < toggle.length; i++)
        if (toggle[i].type === "b"
          && (toggle[i + 1] === undefined || toggle[i + 1].pos - toggle[i].pos !== 3)) {
          pos = toggle[i].pos;
          if ((content[pos - 2] === " " && content[pos - 2] !== " ")
            || (content[pos - 2] !== " " && content[pos - 2] !== " ")
            || (content[pos - 2] === " ")) {
            toggle[i].pos += 1;
            toggle[i].type = "i";
            countBold -= 1;
            countItalic += 1;
          }
          break;
        }

    // Add missing toggles at the end.
    if (countItalic % 2 === 1) {
      toggle.push({ pos: content.length, type: 'i' });
      content += "''";
    }
    if (countBold % 2 === 1)
      toggle.push({ pos: content.length, type: 'b' });

    // Remove toggles.
    var parsed = "";
    if (toggle.length !== 0) {
      pos = 0;
      for (i = 0; i < toggle.length; i++) {
        parsed += content.slice(pos, toggle[i].pos);
        if (toggle[i].type === "b") {
          pos = toggle[i].pos + 3;
        } else
          pos = toggle[i].pos + 2;
      }
      if (content.slice(content.length - 2, content.length) !== "''")
        parsed += content.slice(pos, content.length);
    } else
      parsed = content;

    return parsed;
  }

  function stripWhitespace(content) {
    var parsed = "";

    content = content.replace(/ +/g, " ");

    var blocks = content.split("\n");
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].match(/^\s*$/)) {
        parsed += "\n\n";
      }
      else if (blocks[i].match(/^==+.+==+$/))
        parsed += blocks[i] + "\n";
      else
        parsed += blocks[i];
    }

    parsed = parsed.replace(/\n\n+/g, "\n\n");
    parsed = parsed.replace(/(^\n*|\n*$)/g, "");

    return parsed;
  }

  var txtwiki = { parseWikitext: parseWikitext };

  if (typeof module !== 'undefined' && module.exports)
    module.exports = txtwiki;
  else
    return txtwiki;
}());

/*
 * jQuery dragscrollable Plugin
 * version: 1.0 (25-Jun-2009)
 * Copyright (c) 2009 Miquel Herrera
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
; (function ($) { // secure $ jQuery alias

  /**
   * Adds the ability to manage elements scroll by dragging
   * one or more of its descendant elements. Options parameter
   * allow to specifically select which inner elements will
   * respond to the drag events.
   * 
   * options properties:
   * ------------------------------------------------------------------------		
   *  dragSelector         | jquery selector to apply to each wrapped element 
   *                       | to find which will be the dragging elements. 
   *                       | Defaults to '>:first' which is the first child of 
   *                       | scrollable element
   * ------------------------------------------------------------------------		
   *  acceptPropagatedEvent| Will the dragging element accept propagated 
   *	                     | events? default is yes, a propagated mouse event 
   *	                     | on a inner element will be accepted and processed.
   *	                     | If set to false, only events originated on the
   *	                     | draggable elements will be processed.
   * ------------------------------------------------------------------------
   *  preventDefault       | Prevents the event to propagate further effectivey
   *                       | dissabling other default actions. Defaults to true
   * ------------------------------------------------------------------------
   *  
   *  usage examples:
   *
   *  To add the scroll by drag to the element id=viewport when dragging its 
   *  first child accepting any propagated events
   *	$('#viewport').dragscrollable(); 
   *
   *  To add the scroll by drag ability to any element div of class viewport
   *  when dragging its first descendant of class dragMe responding only to
   *  evcents originated on the '.dragMe' elements.
   *	$('div.viewport').dragscrollable({dragSelector:'.dragMe:first',
   *									  acceptPropagatedEvent: false});
   *
   *  Notice that some 'viewports' could be nested within others but events
   *  would not interfere as acceptPropagatedEvent is set to false.
   *		
   */
  $.fn.dragscrollable = function (options) {

    var settings = $.extend(
      {
        dragSelector: '>:first',
        acceptPropagatedEvent: true,
        preventDefault: true
      }, options || {});


    var dragscroll = {
      mouseDownHandler: function (event) {
        // mousedown, left click, check propagation
        if (event.which != 1 ||
          (!event.data.acceptPropagatedEvent && event.target != this)) {
          return false;
        }

        // Initial coordinates will be the last when dragging
        event.data.lastCoord = { left: event.clientX, top: event.clientY };

        $.event.add(document, "mouseup",
          dragscroll.mouseUpHandler, event.data);
        $.event.add(document, "mousemove",
          dragscroll.mouseMoveHandler, event.data);
        if (event.data.preventDefault) {
          event.preventDefault();
          return false;
        }
      },
      mouseMoveHandler: function (event) { // User is dragging
        // How much did the mouse move?
        var delta = {
          left: (event.clientX - event.data.lastCoord.left),
          top: (event.clientY - event.data.lastCoord.top)
        };

        // Set the scroll position relative to what ever the scroll is now
        event.data.scrollable.scrollLeft(
          event.data.scrollable.scrollLeft() - delta.left);
        event.data.scrollable.scrollTop(
          event.data.scrollable.scrollTop() - delta.top);

        // Save where the cursor is
        event.data.lastCoord = { left: event.clientX, top: event.clientY }
        if (event.data.preventDefault) {
          event.preventDefault();
          return false;
        }

      },
      mouseUpHandler: function (event) { // Stop scrolling
        $.event.remove(document, "mousemove", dragscroll.mouseMoveHandler);
        $.event.remove(document, "mouseup", dragscroll.mouseUpHandler);
        if (event.data.preventDefault) {
          event.preventDefault();
          return false;
        }
      }
    }

    // set up the initial events
    this.each(function () {
      // closure object data for each scrollable element
      var data = {
        scrollable: $(this),
        acceptPropagatedEvent: settings.acceptPropagatedEvent,
        preventDefault: settings.preventDefault
      }
      // Set mouse initiating event on the desired descendant
      $(this).find(settings.dragSelector).
        bind('mousedown', data, dragscroll.mouseDownHandler);
    });
  }; //end plugin dragscrollable

})(jQuery); // confine scope

function init() {

  //set option values
  switch (sourceMode) {
    case 2:
      document.getElementById("sourceMode_html").checked = true;
      break;
    case 3:
      document.getElementById("sourceMode_wiki").checked = true;
      break;
    default:
      document.getElementById("sourceMode_auto").checked = true;
  }

  switch (repeatMode) {
    case 0:
      document.getElementById("repeatMode_all").checked = true;
      break;
    case 1:
      document.getElementById("repeatMode_first").checked = true;
      break;
    default:
      document.getElementById("repeatMode_fis").checked = true;
  }

  var rawHtmlContainer = document.getElementById("tab_rawHtml");
  if (rawHtmlContainer != null) {
    var html = rawHtmlContainer.innerHTML;

    //remove result tags
    var start = html.indexOf(">");
    if (start > 0)
      html = html.substring(start + 1);

    var end = html.lastIndexOf("<");
    if (end > 0)
      html = html.substring(0, end);



    //escape html tags
    html = html.replace(/</g, "&lt;");
    html = html.replace(/>/g, "&gt;");

    rawHtmlContainer.innerHTML = html;
  }

  var wikiContainer = document.getElementById("tab_wiki");
  if (wikiContainer != null) {
    var markup = wikiContainer.innerHTML;

    //remove result tags
    var start = markup.indexOf(">");
    if (start > 0)
      markup = markup.substring(start + 1);

    var end = markup.lastIndexOf("<");
    if (end > 0)
      markup = markup.substring(0, end);

    var temp = "";
    var lastIndex = 0;

    var pattern = /\[\[(.*?)(|.*?)\]\]/g;
    var result;
    while ((result = pattern.exec(markup)) != null) {
      temp = temp + markup.substring(lastIndex, result.index);
      temp = temp + "<a href=\"http://www.en.wikipedia.org/wiki/" + getDestination(result[0]) + "\">" + result[0] + "</a>";

      lastIndex = pattern.lastIndex;
    }

    temp = temp + markup.substring(lastIndex);
    wikiContainer.innerHTML = temp;
  }

  if (sourceMode != 0 || repeatMode != 2 || minProbability != 0.5 || bannedTopics != "")
    showOptions();

  addTooltipsToAllLinks($("#tab_renderedHtml"));
  addTooltipsToAllLinks($(wikiContainer));
  addTooltipsToAllLinks($("#tab_topics"));
}

function getDestination(wikiLink) {

  var pos = wikiLink.indexOf("|");

  if (pos > 0)
    return wikiLink.substring(2, pos);
  else
    return wikiLink.substring(2, wikiLink.length - 2);

}

function selectTab(id) {

  var tabs = document.getElementsByName("tab")

  for (var i = 0; i < tabs.length; i++)
    tabs[i].className = "tabDeselected";

  var boxes = document.getElementsByName("outputBox");

  for (var i = 0; i < tabs.length; i++)
    boxes[i].style.display = "none";

  var tab = document.getElementById("tab_" + id);
  tab.className = "tabSelected";

  var box = document.getElementById("box_" + id);
  box.style.display = "block";

}

function showOptions() {

  $('#inputBox_container').css("margin-right", "430px");

  $('#options').show();
  $('#hideOptions').show();
  $('#showOptions').hide();
}

function hideOptions() {

  $('#inputBox_container').css("margin-right", "12px");

  $('#options').hide();
  $('#hideOptions').hide();
  $('#showOptions').show();

}

function getPageDimensions() {

  var width = 0, height = 0;

  if (typeof (window.innerWidth) == 'number') {
    //Non-IE
    width = window.innerWidth;
    height = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    width = document.body.clientWidth;
    height = document.body.clientHeight;
  }

  return new Dimension(width, height);
}


//a helper object for storing locations
function Dimension(width, height) {
  this.width = width;
  this.height = height;
}

function addTooltipsToAllLinks(container) {

  if (container == null) return;

  var links = container.find("a");

  for (var i = 0; i < links.length; i++) {

    var link = $(links[i]);
    var dest = link.attr("href");
    var linkProb = link.attr("linkProb");



    if (dest != null && dest.substr(0, 33) == "http://www.en.wikipedia.org/wiki/") {
      link.unbind("mouseover");
      link.bind("mouseover", {
        id: idsByTitle[dest.substr(33).toLowerCase()],
        object: link,
        linkProb: linkProb
      }, function (event) {
        showTooltip(event.data.id, event.data.object, event.data.linkProb);
      });

      link.unbind("mouseout");
      link.bind("mouseout", function (event) {
        $("#tooltip").hide();
      });
    }
  }
}




function showTooltip(topicId, object, linkProb) {

  var tooltip = $("#tooltip");

  var top = object.offset().top + object.height();
  var left = object.offset().left;

  // if this is too far right to fit on page, move it to be against right side of page
  if (left + tooltip.width() > $(window).width())
    left = $(window).width() - tooltip.width() - 30;

  tooltip.css("top", top + "px");
  tooltip.css("left", left + "px");

  tooltip.html("<div class='loading'></div>");
  tooltip.show();

  //var amp = "%26";
  console.log('accessing showtooltip wikify 216')
//   var escapedUrl = "/proxy.php?proxy_url=http://wdm.cs.waikato.ac.nz:8080/service?task=define%26id=" + topicId + "%26length=0%26formant=2%26linkFormat=0%26getImages=true%26escapeDefinition=true%26maxImageWidth=100%26maxImageHeight=100%26linkDestination=0";

//   $.get(escapedUrl, function (response) {
//     processTooltipResponse(topicId, response, linkProb);
//   });
}

function processTooltipResponse(topicId, response, linkProb) {

  var tooltip = $("#tooltip");

  tooltip.empty();

  var image = $(response).find("Image");
  if (image.length > 0) {
    tooltip.append("<img src='" + image.attr("url") + "'></img>");
  }

  var definition = $(response).find("Definition");
  if (definition.length > 0) {
    tooltip.append(definition.text());
  } else {
    tooltip.append("no definition avaliable");
  }

  if (linkProb != null)
    tooltip.append("<p><em>" + linkProb + "</em> probability of being a link");

  $(tooltip).append("<br/>");

}



/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrance of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};


/*
 * jQuery doTimeout: Like setTimeout, but better! - v1.0 - 3/3/2010
 * http://benalman.com/projects/jquery-dotimeout-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($){var a={},c="doTimeout",d=Array.prototype.slice;$[c]=function(){return b.apply(window,[0].concat(d.call(arguments)))};$.fn[c]=function(){var f=d.call(arguments),e=b.apply(this,[c+f[0]].concat(f));return typeof f[0]==="number"||typeof f[1]==="number"?this:e};function b(l){var m=this,h,k={},g=l?$.fn:$,n=arguments,i=4,f=n[1],j=n[2],p=n[3];if(typeof f!=="string"){i--;f=l=0;j=n[1];p=n[2]}if(l){h=m.eq(0);h.data(l,k=h.data(l)||{})}else{if(f){k=a[f]||(a[f]={})}}k.id&&clearTimeout(k.id);delete k.id;function e(){if(l){h.removeData(l)}else{if(f){delete a[f]}}}function o(){k.id=setTimeout(function(){k.fn()},j)}if(p){k.fn=function(q){if(typeof p==="string"){p=g[p]}p.apply(m,d.call(n,i))===true&&!q?o():e()};o()}else{if(k.fn){j===undefined?e():k.fn(j===false);return true}else{e()}}}})(jQuery);
/*
 * jScrollPane - v2.0.0beta11 - 2011-07-04
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 */
(function(b,a,c){b.fn.jScrollPane=function(e){function d(D,O){var az,Q=this,Y,ak,v,am,T,Z,y,q,aA,aF,av,i,I,h,j,aa,U,aq,X,t,A,ar,af,an,G,l,au,ay,x,aw,aI,f,L,aj=true,P=true,aH=false,k=false,ap=D.clone(false,false).empty(),ac=b.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";aI=D.css("paddingTop")+" "+D.css("paddingRight")+" "+D.css("paddingBottom")+" "+D.css("paddingLeft");f=(parseInt(D.css("paddingLeft"),10)||0)+(parseInt(D.css("paddingRight"),10)||0);function at(aR){var aM,aO,aN,aK,aJ,aQ,aP=false,aL=false;az=aR;if(Y===c){aJ=D.scrollTop();aQ=D.scrollLeft();D.css({overflow:"hidden",padding:0});ak=D.innerWidth()+f;v=D.innerHeight();D.width(ak);Y=b('<div class="jspPane" />').css("padding",aI).append(D.children());am=b('<div class="jspContainer" />').css({width:ak+"px",height:v+"px"}).append(Y).appendTo(D)}else{D.css("width","");aP=az.stickToBottom&&K();aL=az.stickToRight&&B();aK=D.innerWidth()+f!=ak||D.outerHeight()!=v;if(aK){ak=D.innerWidth()+f;v=D.innerHeight();am.css({width:ak+"px",height:v+"px"})}if(!aK&&L==T&&Y.outerHeight()==Z){D.width(ak);return}L=T;Y.css("width","");D.width(ak);am.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}Y.css("overflow","auto");if(aR.contentWidth){T=aR.contentWidth}else{T=Y[0].scrollWidth}Z=Y[0].scrollHeight;Y.css("overflow","");y=T/ak;q=Z/v;aA=q>1;aF=y>1;if(!(aF||aA)){D.removeClass("jspScrollable");Y.css({top:0,width:am.width()-f});n();E();R();w();ai()}else{D.addClass("jspScrollable");aM=az.maintainPosition&&(I||aa);if(aM){aO=aD();aN=aB()}aG();z();F();if(aM){N(aL?(T-ak):aO,false);M(aP?(Z-v):aN,false)}J();ag();ao();if(az.enableKeyboardNavigation){S()}if(az.clickOnTrack){p()}C();if(az.hijackInternalLinks){m()}}if(az.autoReinitialise&&!aw){aw=setInterval(function(){at(az)},az.autoReinitialiseDelay)}else{if(!az.autoReinitialise&&aw){clearInterval(aw)}}aJ&&D.scrollTop(0)&&M(aJ,false);aQ&&D.scrollLeft(0)&&N(aQ,false);D.trigger("jsp-initialised",[aF||aA])}function aG(){if(aA){am.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'),b('<div class="jspDragBottom" />'))),b('<div class="jspCap jspCapBottom" />')));U=am.find(">.jspVerticalBar");aq=U.find(">.jspTrack");av=aq.find(">.jspDrag");if(az.showArrows){ar=b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",aE(0,-1)).bind("click.jsp",aC);af=b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",aE(0,1)).bind("click.jsp",aC);if(az.arrowScrollOnHover){ar.bind("mouseover.jsp",aE(0,-1,ar));af.bind("mouseover.jsp",aE(0,1,af))}al(aq,az.verticalArrowPositions,ar,af)}t=v;am.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){t-=b(this).outerHeight()});av.hover(function(){av.addClass("jspHover")},function(){av.removeClass("jspHover")}).bind("mousedown.jsp",function(aJ){b("html").bind("dragstart.jsp selectstart.jsp",aC);av.addClass("jspActive");var s=aJ.pageY-av.position().top;b("html").bind("mousemove.jsp",function(aK){V(aK.pageY-s,false)}).bind("mouseup.jsp mouseleave.jsp",ax);return false});o()}}function o(){aq.height(t+"px");I=0;X=az.verticalGutter+aq.outerWidth();Y.width(ak-X-f);try{if(U.position().left===0){Y.css("margin-left",X+"px")}}catch(s){}}function z(){if(aF){am.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'),b('<div class="jspDragRight" />'))),b('<div class="jspCap jspCapRight" />')));an=am.find(">.jspHorizontalBar");G=an.find(">.jspTrack");h=G.find(">.jspDrag");if(az.showArrows){ay=b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",aE(-1,0)).bind("click.jsp",aC);x=b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",aE(1,0)).bind("click.jsp",aC);
if(az.arrowScrollOnHover){ay.bind("mouseover.jsp",aE(-1,0,ay));x.bind("mouseover.jsp",aE(1,0,x))}al(G,az.horizontalArrowPositions,ay,x)}h.hover(function(){h.addClass("jspHover")},function(){h.removeClass("jspHover")}).bind("mousedown.jsp",function(aJ){b("html").bind("dragstart.jsp selectstart.jsp",aC);h.addClass("jspActive");var s=aJ.pageX-h.position().left;b("html").bind("mousemove.jsp",function(aK){W(aK.pageX-s,false)}).bind("mouseup.jsp mouseleave.jsp",ax);return false});l=am.innerWidth();ah()}}function ah(){am.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){l-=b(this).outerWidth()});G.width(l+"px");aa=0}function F(){if(aF&&aA){var aJ=G.outerHeight(),s=aq.outerWidth();t-=aJ;b(an).find(">.jspCap:visible,>.jspArrow").each(function(){l+=b(this).outerWidth()});l-=s;v-=s;ak-=aJ;G.parent().append(b('<div class="jspCorner" />').css("width",aJ+"px"));o();ah()}if(aF){Y.width((am.outerWidth()-f)+"px")}Z=Y.outerHeight();q=Z/v;if(aF){au=Math.ceil(1/y*l);if(au>az.horizontalDragMaxWidth){au=az.horizontalDragMaxWidth}else{if(au<az.horizontalDragMinWidth){au=az.horizontalDragMinWidth}}h.width(au+"px");j=l-au;ae(aa)}if(aA){A=Math.ceil(1/q*t);if(A>az.verticalDragMaxHeight){A=az.verticalDragMaxHeight}else{if(A<az.verticalDragMinHeight){A=az.verticalDragMinHeight}}av.height(A+"px");i=t-A;ad(I)}}function al(aK,aM,aJ,s){var aO="before",aL="after",aN;if(aM=="os"){aM=/Mac/.test(navigator.platform)?"after":"split"}if(aM==aO){aL=aM}else{if(aM==aL){aO=aM;aN=aJ;aJ=s;s=aN}}aK[aO](aJ)[aL](s)}function aE(aJ,s,aK){return function(){H(aJ,s,this,aK);this.blur();return false}}function H(aM,aL,aP,aO){aP=b(aP).addClass("jspActive");var aN,aK,aJ=true,s=function(){if(aM!==0){Q.scrollByX(aM*az.arrowButtonSpeed)}if(aL!==0){Q.scrollByY(aL*az.arrowButtonSpeed)}aK=setTimeout(s,aJ?az.initialDelay:az.arrowRepeatFreq);aJ=false};s();aN=aO?"mouseout.jsp":"mouseup.jsp";aO=aO||b("html");aO.bind(aN,function(){aP.removeClass("jspActive");aK&&clearTimeout(aK);aK=null;aO.unbind(aN)})}function p(){w();if(aA){aq.bind("mousedown.jsp",function(aO){if(aO.originalTarget===c||aO.originalTarget==aO.currentTarget){var aM=b(this),aP=aM.offset(),aN=aO.pageY-aP.top-I,aK,aJ=true,s=function(){var aS=aM.offset(),aT=aO.pageY-aS.top-A/2,aQ=v*az.scrollPagePercent,aR=i*aQ/(Z-v);if(aN<0){if(I-aR>aT){Q.scrollByY(-aQ)}else{V(aT)}}else{if(aN>0){if(I+aR<aT){Q.scrollByY(aQ)}else{V(aT)}}else{aL();return}}aK=setTimeout(s,aJ?az.initialDelay:az.trackClickRepeatFreq);aJ=false},aL=function(){aK&&clearTimeout(aK);aK=null;b(document).unbind("mouseup.jsp",aL)};s();b(document).bind("mouseup.jsp",aL);return false}})}if(aF){G.bind("mousedown.jsp",function(aO){if(aO.originalTarget===c||aO.originalTarget==aO.currentTarget){var aM=b(this),aP=aM.offset(),aN=aO.pageX-aP.left-aa,aK,aJ=true,s=function(){var aS=aM.offset(),aT=aO.pageX-aS.left-au/2,aQ=ak*az.scrollPagePercent,aR=j*aQ/(T-ak);if(aN<0){if(aa-aR>aT){Q.scrollByX(-aQ)}else{W(aT)}}else{if(aN>0){if(aa+aR<aT){Q.scrollByX(aQ)}else{W(aT)}}else{aL();return}}aK=setTimeout(s,aJ?az.initialDelay:az.trackClickRepeatFreq);aJ=false},aL=function(){aK&&clearTimeout(aK);aK=null;b(document).unbind("mouseup.jsp",aL)};s();b(document).bind("mouseup.jsp",aL);return false}})}}function w(){if(G){G.unbind("mousedown.jsp")}if(aq){aq.unbind("mousedown.jsp")}}function ax(){b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");if(av){av.removeClass("jspActive")}if(h){h.removeClass("jspActive")}}function V(s,aJ){if(!aA){return}if(s<0){s=0}else{if(s>i){s=i}}if(aJ===c){aJ=az.animateScroll}if(aJ){Q.animate(av,"top",s,ad)}else{av.css("top",s);ad(s)}}function ad(aJ){if(aJ===c){aJ=av.position().top}am.scrollTop(0);I=aJ;var aM=I===0,aK=I==i,aL=aJ/i,s=-aL*(Z-v);if(aj!=aM||aH!=aK){aj=aM;aH=aK;D.trigger("jsp-arrow-change",[aj,aH,P,k])}u(aM,aK);Y.css("top",s);D.trigger("jsp-scroll-y",[-s,aM,aK]).trigger("scroll")}function W(aJ,s){if(!aF){return}if(aJ<0){aJ=0}else{if(aJ>j){aJ=j}}if(s===c){s=az.animateScroll}if(s){Q.animate(h,"left",aJ,ae)
}else{h.css("left",aJ);ae(aJ)}}function ae(aJ){if(aJ===c){aJ=h.position().left}am.scrollTop(0);aa=aJ;var aM=aa===0,aL=aa==j,aK=aJ/j,s=-aK*(T-ak);if(P!=aM||k!=aL){P=aM;k=aL;D.trigger("jsp-arrow-change",[aj,aH,P,k])}r(aM,aL);Y.css("left",s);D.trigger("jsp-scroll-x",[-s,aM,aL]).trigger("scroll")}function u(aJ,s){if(az.showArrows){ar[aJ?"addClass":"removeClass"]("jspDisabled");af[s?"addClass":"removeClass"]("jspDisabled")}}function r(aJ,s){if(az.showArrows){ay[aJ?"addClass":"removeClass"]("jspDisabled");x[s?"addClass":"removeClass"]("jspDisabled")}}function M(s,aJ){var aK=s/(Z-v);V(aK*i,aJ)}function N(aJ,s){var aK=aJ/(T-ak);W(aK*j,s)}function ab(aW,aR,aK){var aO,aL,aM,s=0,aV=0,aJ,aQ,aP,aT,aS,aU;try{aO=b(aW)}catch(aN){return}aL=aO.outerHeight();aM=aO.outerWidth();am.scrollTop(0);am.scrollLeft(0);while(!aO.is(".jspPane")){s+=aO.position().top;aV+=aO.position().left;aO=aO.offsetParent();if(/^body|html$/i.test(aO[0].nodeName)){return}}aJ=aB();aP=aJ+v;if(s<aJ||aR){aS=s-az.verticalGutter}else{if(s+aL>aP){aS=s-v+aL+az.verticalGutter}}if(aS){M(aS,aK)}aQ=aD();aT=aQ+ak;if(aV<aQ||aR){aU=aV-az.horizontalGutter}else{if(aV+aM>aT){aU=aV-ak+aM+az.horizontalGutter}}if(aU){N(aU,aK)}}function aD(){return -Y.position().left}function aB(){return -Y.position().top}function K(){var s=Z-v;return(s>20)&&(s-aB()<10)}function B(){var s=T-ak;return(s>20)&&(s-aD()<10)}function ag(){am.unbind(ac).bind(ac,function(aM,aN,aL,aJ){var aK=aa,s=I;Q.scrollBy(aL*az.mouseWheelSpeed,-aJ*az.mouseWheelSpeed,false);return aK==aa&&s==I})}function n(){am.unbind(ac)}function aC(){return false}function J(){Y.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(s){ab(s.target,false)})}function E(){Y.find(":input,a").unbind("focus.jsp")}function S(){var s,aJ,aL=[];aF&&aL.push(an[0]);aA&&aL.push(U[0]);Y.focus(function(){D.focus()});D.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(aO){if(aO.target!==this&&!(aL.length&&b(aO.target).closest(aL).length)){return}var aN=aa,aM=I;switch(aO.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:s=aO.keyCode;aK();break;case 35:M(Z-v);s=null;break;case 36:M(0);s=null;break}aJ=aO.keyCode==s&&aN!=aa||aM!=I;return !aJ}).bind("keypress.jsp",function(aM){if(aM.keyCode==s){aK()}return !aJ});if(az.hideFocus){D.css("outline","none");if("hideFocus" in am[0]){D.attr("hideFocus",true)}}else{D.css("outline","");if("hideFocus" in am[0]){D.attr("hideFocus",false)}}function aK(){var aN=aa,aM=I;switch(s){case 40:Q.scrollByY(az.keyboardSpeed,false);break;case 38:Q.scrollByY(-az.keyboardSpeed,false);break;case 34:case 32:Q.scrollByY(v*az.scrollPagePercent,false);break;case 33:Q.scrollByY(-v*az.scrollPagePercent,false);break;case 39:Q.scrollByX(az.keyboardSpeed,false);break;case 37:Q.scrollByX(-az.keyboardSpeed,false);break}aJ=aN!=aa||aM!=I;return aJ}}function R(){D.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")}function C(){if(location.hash&&location.hash.length>1){var aL,aJ,aK=escape(location.hash);try{aL=b(aK)}catch(s){return}if(aL.length&&Y.find(aK)){if(am.scrollTop()===0){aJ=setInterval(function(){if(am.scrollTop()>0){ab(aK,true);b(document).scrollTop(am.position().top);clearInterval(aJ)}},50)}else{ab(aK,true);b(document).scrollTop(am.position().top)}}}}function ai(){b("a.jspHijack").unbind("click.jsp-hijack").removeClass("jspHijack")}function m(){ai();b("a[href^=#]").addClass("jspHijack").bind("click.jsp-hijack",function(){var s=this.href.split("#"),aJ;if(s.length>1){aJ=s[1];if(aJ.length>0&&Y.find("#"+aJ).length>0){ab("#"+aJ,true);return false}}})}function ao(){var aK,aJ,aM,aL,aN,s=false;am.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(aO){var aP=aO.originalEvent.touches[0];aK=aD();aJ=aB();aM=aP.pageX;aL=aP.pageY;aN=false;s=true}).bind("touchmove.jsp",function(aR){if(!s){return}var aQ=aR.originalEvent.touches[0],aP=aa,aO=I;Q.scrollTo(aK+aM-aQ.pageX,aJ+aL-aQ.pageY);aN=aN||Math.abs(aM-aQ.pageX)>5||Math.abs(aL-aQ.pageY)>5;
return aP==aa&&aO==I}).bind("touchend.jsp",function(aO){s=false}).bind("click.jsp-touchclick",function(aO){if(aN){aN=false;return false}})}function g(){var s=aB(),aJ=aD();D.removeClass("jspScrollable").unbind(".jsp");D.replaceWith(ap.append(Y.children()));ap.scrollTop(s);ap.scrollLeft(aJ)}b.extend(Q,{reinitialise:function(aJ){aJ=b.extend({},az,aJ);at(aJ)},scrollToElement:function(aK,aJ,s){ab(aK,aJ,s)},scrollTo:function(aK,s,aJ){N(aK,aJ);M(s,aJ)},scrollToX:function(aJ,s){N(aJ,s)},scrollToY:function(s,aJ){M(s,aJ)},scrollToPercentX:function(aJ,s){N(aJ*(T-ak),s)},scrollToPercentY:function(aJ,s){M(aJ*(Z-v),s)},scrollBy:function(aJ,s,aK){Q.scrollByX(aJ,aK);Q.scrollByY(s,aK)},scrollByX:function(s,aK){var aJ=aD()+Math[s<0?"floor":"ceil"](s),aL=aJ/(T-ak);W(aL*j,aK)},scrollByY:function(s,aK){var aJ=aB()+Math[s<0?"floor":"ceil"](s),aL=aJ/(Z-v);V(aL*i,aK)},positionDragX:function(s,aJ){W(s,aJ)},positionDragY:function(aJ,s){V(aJ,s)},animate:function(aJ,aM,s,aL){var aK={};aK[aM]=s;aJ.animate(aK,{duration:az.animateDuration,easing:az.animateEase,queue:false,step:aL})},getContentPositionX:function(){return aD()},getContentPositionY:function(){return aB()},getContentWidth:function(){return T},getContentHeight:function(){return Z},getPercentScrolledX:function(){return aD()/(T-ak)},getPercentScrolledY:function(){return aB()/(Z-v)},getIsScrollableH:function(){return aF},getIsScrollableV:function(){return aA},getContentPane:function(){return Y},scrollToBottom:function(s){V(i,s)},hijackInternalLinks:function(){m()},destroy:function(){g()}});at(O)}e=b.extend({},b.fn.jScrollPane.defaults,e);b.each(["mouseWheelSpeed","arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){e[this]=e[this]||e.speed});return this.each(function(){var f=b(this),g=f.data("jsp");if(g){g.reinitialise(e)}else{g=new d(f,e);f.data("jsp",g)}})};b.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,stickToBottom:false,stickToRight:false,clickOnTrack:true,autoReinitialise:false,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:c,animateScroll:false,animateDuration:300,animateEase:"linear",hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:0.8}})(jQuery,this);