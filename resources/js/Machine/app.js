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

