// The grid manages tiles using ids, which you can define. For our
// examples we'll just use the tile number as the unique id.
var TILE_IDS =
    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

//Indexes are matched with the TILE_IDS above, so the code can all go in one place.
//  Make sure that all of the tiles are accounted for in the templates - too many and
//  the last ones won't display, too few and an error will throw.
var TILE_TEXT = {
    0: {
        "title": "Are you hungry?",
        "content": "asdf <strong>this is bold</strong>"
    },
    1: {
        "title": "Need transportation?",
        "content":
            "<h3>asdf: scroll</h3>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>" +
            "<p>testing</p>" +
            "<p>1, 2, 3</p>"
    },
    2: {
        "title": "Do you need to find a doctor?",
        "content": "General info and link to other pages (i.e. profile pages in the database)"
    },
    3: {
        "title": "Have a toothache?",
        "content": "asdf"
    },
    4: {
        "title": "Is your vision OK?",
        "content": "asdf"
    },
    5: {
        "title": "Lorem Ipsum 1?",
        "content": "asdf"
    },
    6: {
        "title": "Lorem Ipsum 2?",
        "content": "asdf"
    },
    7: {
        "title": "Lorem Ipsum 3?",
        "content": "asdf"
    },
    8: {
        "title": "Lorem Ipsum 4?",
        "content": "asdf"
    },
    9: {
        "title": "Lorem Ipsum 5?",
        "content": "asdf"
    },
    10: {
        "title": "Lorem Ipsum 6?",
        "content": "asdf"
    },
    11: {
        "title": "Lorem Ipsum 7?",
        "content": "asdf"
    },
    12: {
        "title": "Lorem Ipsum 8?",
        "content": "asdf"
    },
    13: {
        "title": "Lorem Ipsum 9?",
        "content": "asdf"
    }
};

// templates in JSON matching the predefined selections you can
// choose on the demo page
var TemplateRows = [
    [
        " A A A ",
        " B B B ",
        " C D D ",
        " C D D ",
        " F F . ",
        " . . . ",
        " G G H ",
        " G G H ",
        " . . . "
    ], [
        " A A B B ",
        " A A C C ",
        " . . . . ",
        " D E E E ",
        " D F F . ",
        " G G . . "
    ], [
        " A A B B B ",
        " A A B B B ",
        " A A . . . ",
        " . C C D D ",
        " E . . D D ",
        " E . . F F "
    ]
];

$(function() {

    var el = document.getElementById('main-grid'),
        grid = new Tiles.Grid(el),
        tileExpanded = -1;

    // template is selected by user, not generated so just
    // return the number of columns in the current template
    grid.resizeColumns = function() {
        return this.template.numCols;
    };

    // by default, each tile is an empty div, we'll override creation
    // to add a tile number to each div
    grid.createTile = function(tileId) {
        var tile = new Tiles.Tile(tileId);
        tile.$el.append('<div class="dev-tile-number">' + TILE_TEXT[tileId].title + '</div>');
        return tile;
    };

    // wait until users finishes resizing the browser
    var debouncedResize = debounce(function() {

        //check browser width and switch templates accordingly.
        var width = $(window).width(), templateIndex;
        if (width <= 525) {
            templateIndex = 0;
        }
        else if (width <= 1280) {
            templateIndex = 1;
        }
        else {
            templateIndex = 2;
        }
        var rows = TemplateRows[templateIndex];

        // set the new template and resize the grid
        grid.template = Tiles.Template.fromJSON(rows);

        //build a new custom template with an expanded active tile
        if (tileExpanded >= 0) {
            var TemporaryTemplateRows = [];

            var beforeWholeRows = Math.floor(tileExpanded / grid.template.numCols);
            var beforePartialtiles = tileExpanded % grid.template.numCols;
            var numAftertiles = grid.template.numTiles - tileExpanded - 1;
            var afterWholeRows = Math.floor(numAftertiles / grid.template.numCols);
            var afterPartialtiles = numAftertiles % grid.template.numCols;

            //65 is the ASCII code for capital-A
            runningCharCode = 65;

            for (i = 0; i < beforeWholeRows; i++) {
                row = '';
                for (j = 0; j < grid.template.numCols; j++) {
                    row += '. ';
                }
                TemporaryTemplateRows.push(row);
            }

            if (beforePartialtiles > 0) {
                baseWidth = Math.floor(grid.template.numCols / beforePartialtiles);
                extraSpots = grid.template.numCols % beforePartialtiles;
                row = '';
                for (i = 0; i < beforePartialtiles; i++) {
                    amt = baseWidth;
                    tileToPush = '';
                    if (extraSpots > 0) {
                        amt = baseWidth + 1;
                        extraSpots--;
                    }
                    if (amt == 1) tileToPush = '. ';
                    else {
                        for (j = 0; j < amt; j++) {
                            tileToPush += String.fromCharCode(runningCharCode) + ' ';
                        }
                        runningCharCode++;
                    }
                    row += tileToPush;
                }
                TemporaryTemplateRows.push(row);
            }

            //push the active tile here, and make it multiple rows
            activetileRow = '';
            for (i = 0; i < grid.template.numCols; i++) {
                activetileRow += 'Z ';
            }
            TemporaryTemplateRows.push(activetileRow);
            TemporaryTemplateRows.push(activetileRow);
            TemporaryTemplateRows.push(activetileRow);

            for (i = 0; i < afterWholeRows; i++) {
                row = '';
                for (j = 0; j < grid.template.numCols; j++) {
                    row += '. ';
                }
                TemporaryTemplateRows.push(row);
            }

            if (afterPartialtiles > 0) {
                baseWidth = Math.floor(grid.template.numCols / afterPartialtiles);
                extraSpots = grid.template.numCols % afterPartialtiles;
                row = '';
                for (i = 0; i < afterPartialtiles; i++) {
                    amt = baseWidth;
                    tileToPush = '';
                    if (extraSpots > 0) {
                        amt = baseWidth + 1;
                        extraSpots--;
                    }
                    if (amt == 1) tileToPush = '. ';
                    else {
                        for (j = 0; j < amt; j++) {
                            tileToPush += String.fromCharCode(runningCharCode) + ' ';
                        }
                        runningCharCode++;
                    }
                    row += tileToPush;
                }
                TemporaryTemplateRows.push(row);
            }

            //rebuild the custom grid template
            // set the new template and resize the grid
            grid.template = Tiles.Template.fromJSON(TemporaryTemplateRows);
        }

        grid.isDirty = true;
        grid.resize();

        // adjust number of tiles to match selected template
        var ids = TILE_IDS.slice(0, grid.template.rects.length);
        grid.updateTiles(ids);
        grid.redraw(true, function() {
            //hacky way to set the height of the grid so it encompasses all of its elements
            //inside redraw()'s onComplete.
            var gridTileFirst = $(".grid-tile:first");
            var gridTileLast = $(".grid-tile:last");

            var gridHeight = gridTileLast.offset().top
                - gridTileFirst.offset().top
                + gridTileLast.height();

            $("#main-grid").css("height", gridHeight);

            //fixes a minor timing bug when resizing to a different grid template
            grid.redraw(false);

            //if there is an active tile, set the height of the tile's content
            //to the height of the tile - the height of the title question at the top,
            //so that its scrollbar fits inside the box.
            if ($('.grid').hasClass('has-active-tile')) {
                $('.dev-tile-content').outerHeight($('.active-tile').height() - $('.dev-tile-number').outerHeight());
            }
        });

    }, 150);

    //Set the grid initially
    debouncedResize();

    //when the window resizes, redraw the grid
    $(window).resize(debouncedResize);

    //Click grid items
    $('.grid').on('click', 'div', function (e) {

        //still playing around to see if this debounce is necessary.
        var alterTemplate = debounce(function(that) {
            if (that.hasClass('grid-tile')) {
                if (tileExpanded == -1) {
                    //register the expanded tile
                    tileExpanded = that.attr('data-tile-id');

                    $('.grid').addClass('has-active-tile');
                    that.addClass('active-tile');
                    $('.active-tile .dev-tile-number').append('<span id="tile-close-button">✖</span>');
                    that.append('<div class="dev-tile-content">' + TILE_TEXT[tileExpanded].content + '</div>');

                    debouncedResize();
                }
                else if (that.attr('data-tile-id') != tileExpanded.toString()) {
                    //checks for clicks outside of the active tile
                    switchToDefaultTemplate();
                }
            }
            else if (that.hasClass('dev-tile-number') && that.find('#tile-close-button').length > 0) {
                switchToDefaultTemplate();
                e.stopPropagation();  // hacky but necessary for the x-button to work without being immediately reversed
            }
        }, 400, true);

        alterTemplate($(this));
    });

    function switchToDefaultTemplate() {
        $('.grid').removeClass('has-active-tile');
        $('.grid > .active-tile').removeClass('active-tile');
        //$('#tile-close-button').remove();
        //$('.dev-tile-content').remove();

        $('#tile-close-button').css('-webkit-animation', 'fadeOut 100ms');
        $('#tile-close-button').bind('webkitAnimationEnd',function(){
            $('#tile-close-button').remove();
        });
        $('.dev-tile-content').css('-webkit-animation', 'fadeOut 100ms');
        $('.dev-tile-content').bind('webkitAnimationEnd',function(){
            $('.dev-tile-content').remove();
        });

        tileExpanded = -1;
        debouncedResize();
    }
});
