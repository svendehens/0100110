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
