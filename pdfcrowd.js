var pdfcrowd = {
    //
    // Prevents table rows from splitting across pages. The function
    // dynamically splits a table into smaller ones that fit the page
    // height and inserts page break accordingly.
    //
    splitTable: function(tableClass, printableHeight, breakClass, widthRatio) {
        ratio = widthRatio || 1.0;
        var tables = $(tableClass);
        for(var i=0; i<tables.length; ++i) {
            var splitIndices = [0];
            var table = $(tables[i]);
            var rows = table.children("tbody").children();
            
            var tableTop = ratio * table.offset().top;
            
            // find the preceding page break (if any)
            var precedingPageBreakTop = 0;
            var pageBreaks = $("." + breakClass);
            for (var j=pageBreaks.length-1; j>=0; --j) {
                var pageBreakTop = ratio * $(pageBreaks[j]).offset().top;
                if (pageBreakTop < tableTop) {
                    precedingPageBreakTop = pageBreakTop;
                    break;
                }
            }
            
            // account for border-spacing
            var borderSpacing = 0;
            if (table.css("border-collapse") === "separate" && rows.length > 1) {
                borderSpacing = $(rows[1]).offset().top - $(rows[0]).offset().top - $(rows[0]).outerHeight();
                borderSpacing *= ratio;
            }
            
            var currHeight = (tableTop - precedingPageBreakTop) % printableHeight;
            rows.each(function(i, row) {
                var rowHeight = ratio * ($(rows[i]).outerHeight() + borderSpacing);
                currHeight += rowHeight;
                if (rowHeight > printableHeight) {
                    currHeight = currHeight % printableHeight;
                } else {
                    if (currHeight > printableHeight) {
                        splitIndices.push(i);
                        currHeight = ratio * ($(rows[i]).outerHeight() + 2 * borderSpacing);
                    }
                }
            });
            
            splitIndices.push(undefined);
            
            // replaceWith returns the table
            var wrapper = $('<div></div>');
            table  = table.replaceWith(wrapper);
            table.empty();
            
            
            for (var j=0; j<splitIndices.length-1; ++j) {
                var newTable = table.clone();
                $("<tbody />").appendTo(newTable);
                rows.slice(splitIndices[j], splitIndices[j+1])
                    .appendTo(newTable.children('tbody'));
                newTable.appendTo(wrapper);
                if (splitIndices[j+1] !== undefined) {
                    $('<div class="' + breakClass + '"></div>').appendTo(wrapper);
                }
                    }
        }
    }
};
