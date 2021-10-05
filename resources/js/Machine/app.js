// READY

$(function () {
    $("#test").text("The DOM is now loaded and can be manipulated.");

    // triggerHintImage(TIMING_HINT_IMAGE);

    if (browser.name == "MSIE" || browser.name == "Edge") {
        alert("machine for making sense has been designed and tested on Firefox and Chrome");
    }

    $('#search_box').val('');

    // openFirstBox();
    openWriteBox();
    typeInSearch();

    $('.search_box').trigger('click'); // focus
    // $('.search_box').trigger('select'); // select


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
            console.log(synths_made)
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
                // $.getJSON("search_all2.php?keyword=" + sourceWord + "&max=10", function (data1) {

                //     $.getJSON("search_all2.php?keyword=" + targetWord + "&max=10", function (data2) {
                //         console.log('targetword data2', data2)
                //         if (result1 == undefined || result2 == undefined) {
                //             // console.log('local synth');
                //             if (sourceTxt.length > 2000) {
                //                 sourceTxt = sourceTxt.substring(0, 2000);
                //                 // console.log(sourceTxt);
                //             }
                //             var len = sourceTxt.length < 200 ? sourceTxt.length : sourceTxt.length * 0.6;
                //             $.ajax({
                //                 url: 'markov.php?order=5&begining=' + sourceWord + '&length=' + len + '&content=' + sourceTxt,
                //                 context: document.body
                //             }).done(function (data) {
                //                 generateMarkov(data, x, y, sourceWord, targetWord, info);
                //             });
                //         }
                //         else {
                //             const result1 = data1[Math.floor(Math.random() * data1.length)];
                //             const result2 = data2[Math.floor(Math.random() * data2.length)];

                //             $.getJSON("search2.php?id=" + result1.id + "&wordIndex=" + result1.wordIndex, function (para1) {
                //                 $.getJSON("search2.php?id=" + result2.id + "&wordIndex=" + result2.wordIndex, function (para2) {

                //                     //console.log('paragraphs '+para1.length+' '+para2.length);

                //                     const length = Math.round((para1[0].body.length + para2[0].body.length) / 2);


                //                     $.ajax({
                //                         url: 'markov.php?order=5&begining=' + sourceWord + '&length=' + length + '&content=' + para1[0].body + ' ' + para2[0].body,
                //                         context: document.body
                //                     }).done(function (data) {
                //                         generateMarkov(data, x, y, sourceWord, targetWord, info);
                //                     });
                //                 });
                //             });
                //         }
                //     });
                // });
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
                    url: 'markov.php?order=' + order + '&begining=' + info.source.text() + '&length=' + length + '&content=' + sourceTxt + ' ' + targetTxt,
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

            var grid = blueTexts[info.source];
            grid.window.close();
        });
    });

});
