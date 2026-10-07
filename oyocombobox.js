/*
 oyocombobox.js 1.0
 tested with jQuery 3.4.1
 http://www.oyoweb.nl

 © 2024 oYoSoftware
 MIT License

 oyocombobox is a component with a dropdown for selecting options.
 You can also fill the options with a second content that visualizes the options.
 */

/*
 Make a combobox component for selecting options.
 @param {number (optional)} comboBoxWidth The width of the combobox component.
 @param {number (optional)} comboBoxHeight The height of the combobox component.
 @return {object} The combobox component.
 */
function oyoComboBox(comboBoxWidth = "auto", comboBoxHeight = "auto") {

    var defaultBackgroundColor = "white";
    var defaultSelectionColor = "#527FC3";
    var defaultHoverColor = "#B3CEB3";
    var defaultTextColor = "black";
    var defaultSelectionTextColor = "white";
    var defaultHoverTextColor = "black";

    oyoComboBoxList = "";
    var optionLinesScroll = 4;
    var dropdownOnly = false;
    var searchTimeout, inputValue = "";
    var comboBoxOptions = [];
    var comboBoxOptionTexts = [];
    var comboBoxOptionWrappers = [];
    var comboBoxOptionContents = [];
    var comboBoxOptionOverlays = [];
    var showInput = true;
    var optionLinesInView = 0;

    var comboBox = document.createElement("div");
    $(comboBox).addClass("oyocombobox");
    comboBox.backgroundColor = defaultBackgroundColor;
    comboBox.selectionColor = defaultSelectionColor;
    comboBox.hoverColor = defaultHoverColor;
    comboBox.textColor = defaultTextColor;
    comboBox.selectionTextColor = defaultSelectionTextColor;
    comboBox.hoverTextColor = defaultHoverTextColor;

    var comboBoxHeader = document.createElement("div");
    $(comboBoxHeader).addClass("oyocomboboxheader");
    $(comboBoxHeader).css("border", "1px solid black");
    $(comboBoxHeader).css("background-color", comboBox.backgroundColor);
    $(comboBoxHeader).css("padding-right", "4px");
    $(comboBoxHeader).css("white-space", "nowrap");
    $(comboBoxHeader).css("position", "relative");
    $(comboBox).append(comboBoxHeader);

    var comboBoxInputIndex = $(".oyocombobox").length;
    var inputName = "oyocomboboxinput" + (comboBoxInputIndex + 1);
    var comboBoxInput = document.createElement("input");
    $(comboBoxInput).attr("name", inputName);
    $(comboBoxInput).addClass("oyocomboboxinput");
    $(comboBoxInput).attr("type", "search");
    $(comboBoxInput).css("background-color", comboBox.selectionColor);
    $(comboBoxInput).css("color", comboBox.selectionTextColor);
    $(comboBoxInput).css("margin", "3px");
    $(comboBoxInput).css("font", "inherit");
    $(comboBoxInput).css("display", "inline-block");
    $(comboBoxInput).css("vertical-align", "middle");
    $(comboBoxInput).css("position", "relative");
    $(comboBoxInput).css("border", "1px solid black");
    $(comboBoxInput).css("outline", "none");
    comboBoxInput.oldValue = "";
    comboBoxInput.currentValue = "1px";
    comboBoxInput.borderWidth = "1px";
    comboBoxInput.focusBorderWidth = "2px";
    changeLayout(comboBoxInput);
    $(comboBoxHeader).append(comboBoxInput);

    var comboBoxInputCancelButton = createInputCancelButton();
    var stylePlaceHolder = $("style[name=oyocomboboxplaceholder]").get(0);
    if (!stylePlaceHolder) {
        var stylePlaceHolder = document.createElement("style");
        $(stylePlaceHolder).attr("name", "oyocomboboxplaceholder");
        $("head").append(stylePlaceHolder);
    }
    var styleCancelButton = $("style[name=oyocomboboxcancelbutton]").get(0);
    if (!styleCancelButton) {
        var styleCancelButton = document.createElement("style");
        $(styleCancelButton).attr("name", "oyocomboboxcancelbutton");
        $("head").append(styleCancelButton);
    }
    changeInputColor(comboBox.selectionTextColor);

    var comboBoxCaret = document.createElement("div");
    $(comboBoxCaret).addClass("oyocomboboxcaret");
    $(comboBoxCaret).css("display", "inline-block");
    $(comboBoxCaret).css("vertical-align", "middle");
    $(comboBoxCaret).css("position", "relative");
    $(comboBoxHeader).append(comboBoxCaret);

    var comboBoxCaretDown = createCaret("down");
    $(comboBoxCaret).append(comboBoxCaretDown);
    var comboBoxCaretUp = createCaret("up");
    $(comboBoxCaret).append(comboBoxCaretUp);
    $(comboBoxCaretDown).css("display", "inline");
    $(comboBoxCaretUp).css("display", "none");

    var comboBoxSelectionBox = document.createElement("div");
    $(comboBoxSelectionBox).addClass("oyocomboboxselectionbox");
    $(comboBoxSelectionBox).css("display", "inline-block");
    $(comboBoxSelectionBox).css("vertical-align", "middle");
    $(comboBoxSelectionBox).css("overflow", "hidden");
    $(comboBoxSelectionBox).css("position", "relative");
    $(comboBoxHeader).prepend(comboBoxSelectionBox);

    var comboBoxSelectionOverlay = document.createElement("div");
    $(comboBoxSelectionOverlay).addClass("oyocomboboxselectionoverlay");
    $(comboBoxSelectionOverlay).css("position", "absolute");
    $(comboBoxSelectionOverlay).css("left", "0px");
    $(comboBoxSelectionOverlay).css("top", "0px");
    $(comboBoxSelectionOverlay).css("opacity", "0");
    $(comboBoxSelectionOverlay).css("z-index", 999);
    $(comboBoxSelectionBox).append(comboBoxSelectionOverlay);

    var comboBoxList = document.createElement("div");
    $(comboBoxList).addClass("oyocomboboxlist");
    $(comboBoxList).attr("tabindex", -1);
    $(comboBoxList).css("border", "1px solid black");
    $(comboBoxList).css("border-top", "none");
    $(comboBoxList).css("display", "none");
    $(comboBoxList).css("z-index", 999);
    $(comboBoxList).css("position", "relative");
    $(comboBoxList).css("overflow-x", "hidden");
    $(comboBoxList).css("overflow-y", "auuto");
    $(comboBoxList).css("background-color", comboBox.backgroundColor);
    $(comboBoxList).attr("tabindex", -1);
    $(comboBox).append(comboBoxList);

    Object.defineProperty(comboBox, "options", {
        get: function () {
            return comboBoxOptions;
        }
    });

    Object.defineProperty(comboBox, "value", {
        get: function () {
            return comboBoxInput.value;
        },
        set: function (value) {
            setValue(value);
        }
    });

    Object.defineProperty(comboBox, "scrollLines", {
        get: function () {
            return optionLinesScroll;
        },
        set: function (value) {
            optionLinesScroll = value;
        }
    });

    Object.defineProperty(comboBox, "dropdown", {
        get: function () {
            return dropdownOnly;
        },
        set: function (value) {
            dropdownOnly = value;
            if (dropdownOnly) {
                $(comboBoxInput).css("caret-color", "transparent");
            } else {
                $(comboBoxInput).css("caret-color", "auto");
            }
        }
    });

    Object.defineProperty(comboBox, "id", {
        get: function () {
            return $(comboBox).find(comboBoxInput).attr("id");
        },
        set: function (value) {
            id = value;
            $(comboBoxInput).attr("id", id);
        }
    });

    Object.defineProperty(comboBox, "showInput", {
        get: function () {
            return showInput;
        },
        set: function (value) {
            showInput = value;
            if (showInput) {
                $(comboBoxOptionTexts).width("auto");
                resizeComboBox();
            }
        }
    });

    Object.defineProperty(comboBox, "readOnly", {
        get: function () {
            return comboBoxInput.readOnly;
        },
        set: function (value) {
            if (value === true) {
                $(comboBoxInput).attr("readonly", "readonly");
                $(comboBoxCaret).css("display", "none");
                $(comboBoxCaret).outerWidth(0, true);
                var border = comboBoxInput.borderWidth;
                $(comboBoxInput).css("border-width", border);
                changeLayout(comboBoxInput, false);
            } else {
                $(comboBoxInput).removeAttr("readonly");
                $(comboBoxCaret).css("display", "inline-block");
                $(comboBoxCaret).outerWidth(15, true);
                var focus = $(":focus").get(0);
                if (Boolean(focus))  {
                    var border = comboBoxInput.focusBorderWidth;
                    $(comboBoxInput).css("border-width", border);
                    changeLayout(comboBoxInput, true);
                    comboBoxInput.currentBorderWidth = comboBoxInput.focusBorderWidth;
                }
            }
        }
    });

    $(window).on("resize", function () {
        resizeComboBox();
    });

    $(window).on("blur", function (event) {
        dropupAll(event);
    });

    $(document).on("click", function (event) {
        dropupAll(event);
    });

    function dropupAll(event) {
        var elements = $(".oyocombobox").add($(".oyocombobox").find("*")).toArray();
        if (elements.indexOf(event.target) === -1) {
            $(".oyocombobox").each(function () {
                hideListBox(this);
                oyoComboBoxList = "up";
                var input = $(".oyocomboboxinput", this).get(0);
                var border = input.borderWidth;
                $(input).css("border-width", border);
                changeLayout(input);
                input.currentBorderWidth = input.borderWidth;
            });
        }
        event.stopImmediatePropagation();
    }

    function hideListBox(context = comboBox) {
        $(".oyocomboboxlist", context).css("display", "none");
        $(".oyocomboboxcaretdown", context).css("display", "inline");
        $(".oyocomboboxcaretup", context).css("display", "none");
        $(".oyocomboboxlist", context).trigger("visibilitychange");
    }

    function showListBox(context = comboBox) {
        $(".oyocomboboxlist", context).css("display", "block");
        $(".oyocomboboxcaretdown", context).css("display", "none");
        $(".oyocomboboxcaretup", context).css("display", "inline");
        $(".oyocomboboxlist", context).trigger("visibilitychange");
    }

    $(comboBox).on("click", function (event) {
        event.stopImmediatePropagation();
    });

    $(comboBox).on("focusin", function () {
        $(".oyocombobox").each(function () {
            if (this === comboBox) {
                if (oyoComboBoxList === "" || oyoComboBoxList === "down") {
                    if (oyoComboBoxList === "down") {
                        showListBox();
                        oyoComboBoxList = "";
                    }
                } else {
                    hideListBox();
                }
                if (!comboBoxInput.readOnly) {
                    if (comboBoxInput.currentBorderWidth !== comboBoxInput.focusBorderWidth) {
                        var border = comboBoxInput.focusBorderWidth;
                        $(comboBoxInput).css("border-width", border);
                        changeLayout(comboBoxInput);
                        comboBoxInput.currentBorderWidth = comboBoxInput.focusBorderWidth;
                    }
                }
                comboBoxInput.setSelectionRange(0, 0);
                comboBoxInput.scrollLeft = 0;
            } else {
                hideListBox(this);
                var input = $(".oyocomboboxinput", this).get(0);
                var border = input.borderWidth;
                $(input).css("border-width", border);
                changeLayout(input);
                input.currentBorderWidth = input.borderWidth;
            }
        });
    });

    function changeLayout(input, focus = true) {
        var difference = parseFloat(input.focusBorderWidth) - parseFloat(input.borderWidth);
        difference = toFloat(difference, 3);
        if ($(input).is(":focus") && focus) {
            $(input).css("padding-left", 2 + "px");
            $(input).css("margin-top", 3 + "px");
            $(input).css("margin-bottom", 3 + "px");
        } else {
            $(input).css("padding-left", (2 + difference) + "px");
            $(input).css("margin-top", (3 + difference) + "px");
            $(input).css("margin-bottom", (3 + difference) + "px");
        }
    }

    $(comboBoxCaret).on("click", function (event) {
        if (comboBoxInput.readOnly) {
            return;
        }
        if ($(comboBoxList).css("display") === "block") {
            oyoComboBoxList = "up";
        } else {
            oyoComboBoxList = "down";
            var index = $(".oyoselection", comboBox).index();
            if (index === -1) {
                index = 0;
                setSelectedOption(index);
            }
            scrollIntoView(index);
        }
        $(comboBoxInput).focus();
        event.stopImmediatePropagation();
    });

/* Keys:
     8 BackSpace
     9 Tab
    13 Enter
    27 Escape
    32 Space
    33 PageUp
    34 PageDown
    35 End
    36 Home
    37 ArrowLeft
    38 ArrowUp
    39 ArrowRight
    40 ArrowDown
    45 Insert
    46 Delete
*/

    $(comboBoxInput).on("keydown", function (event) {
        if (comboBoxInput.readOnly) {
            return;
        }

        var keys = [13, 27, 33, 34, 38, 40];
        if (keys.includes(event.which)) {
            event.preventDefault();
        }

        if (dropdownOnly) {
            var keys = [8, 46];
            if (keys.includes(event.which)) {
                event.preventDefault();
            }
        }

        if (dropdownOnly) {
            var charCode = event.key.charCodeAt(0);
            var isCharacter = (event.key === String.fromCharCode(charCode));
            if (isCharacter) {
                event.preventDefault();
            }
        }

        if (event.which === 9) {
            hideListBox();
            var border = comboBoxInput.borderWidth;
            $(comboBoxInput).css("border-width", border);
            changeLayout(comboBoxInput, false);
            comboBoxInput.currentBorderWidth = comboBoxInput.borderWidth;
        }

        var keys = [33, 34, 38, 40];
        if (keys.includes(event.which)) {
            var comboBoxListHeight = toFloat($(comboBoxList).innerHeight(), 3);
            var optionsLength = comboBoxOptions.length;
            var index;

            var selection = $(".oyoselection", comboBox);
            var length = $(selection).length;
            if (length > 0) {
                index = $(selection).index();
            }

            if (index === undefined) {
                if (event.which === 33 || event.which === 38) {
                    index = optionsLength - 1;
                }
                if (event.which === 34 || event.which === 40) {
                    index = 0;
                }
            }

            var visible = $(comboBoxList).css("display") !== "none";

            var keys = [38, 40];
            if (visible && keys.includes(event.which)) {
                if (event.which === 38) {
                    index -= 1;
                    if (index < 0) {
                        index = optionsLength - 1;
                    }
                }
                if (event.which === 40) {
                    index += 1;
                    if (index > optionsLength - 1) {
                        index = 0;
                    }
                }
            }

            var keys = [33, 34];
            if (visible && keys.includes(event.which)) {
                if (event.which === 33) {
                    index -= optionLinesInView - 1;
                    switch (true) {
                        case index === (0) - (optionLinesInView - 1) :
                            index = optionsLength - 1;
                            break;
                        case index < 0 :
                            index = 0;
                            break;
                    }
                }
                if (event.which === 34) {
                    index += optionLinesInView - 1;
                    switch (true) {
                        case index === (optionsLength - 1) + (optionLinesInView - 1) :
                            index = 0;
                            break;
                        case index > optionsLength - 1 :
                            index = optionsLength - 1;
                            break;
                    }
                }
            }

            if (index !== undefined) {
                setSelectedOption(index);
                var selection = $(".oyoselection", comboBox);
                if (visible) {
                    var height = toFloat($(selection).outerHeight(true), 3);
                    var middle = toFloat($(selection).position().top + height / 2, 3);
                    if (middle <= 0 || middle >= comboBoxListHeight) {
                        var keys = [33, 38];
                        if (keys.includes(event.which)) {
                            scrollIntoView(index, true);
                        }
                        var keys = [34, 40];
                        if (keys.includes(event.which)) {
                            scrollIntoView(index, false);
                        }
                    }
                } else {
                    showListBox();
                    scrollIntoView(index, true);
                }
            }
        }
    });

    $(comboBoxInput).on("keyup", function (event) {
        if (comboBoxInput.readOnly) {
            return;
        }

        var index;

        if (event.key) {
            var charCode = event.key.charCodeAt(0);
            var isCharacter = (event.key === String.fromCharCode(charCode));
        }

        var keys = [8, 46];
        if (isCharacter || keys.includes(event.which)) {
            if (!dropdownOnly) {
                index = searchOption();
            }
            if (dropdownOnly && isCharacter) {
                inputValue += event.key;
                index = searchOption();
            }
            if (!Boolean(comboBoxInput.value)) {
                $(comboBoxInput).trigger("search");
            }
        }

        if (!isCharacter && !keys.includes(event.which)) {
            var selection = $(".oyoselection", comboBox);
            var length = $(selection).length;
            if (length > 0) {
                index = $(selection).index();
            }
        }

        var visible = $(comboBoxList).css("display") !== "none";

        if (!visible && isCharacter) {
            showListBox();
        }

        if (index !== undefined) {
            setSelectedOption(index);

            if (event.which === 13) {
                if (visible) {
                    $(comboBoxOptions).eq(index).trigger("click");
                    event.stopImmediatePropagation();
                }
            }

            var keys = [13, 27];
            if (keys.includes(event.which)) {
                hideListBox();
                comboBoxInput.setSelectionRange(0, 0);
                comboBoxInput.scrollLeft = 0;
            }
        }
    });

    $(comboBoxInput).on("search", function (event) {
        if (comboBoxInput.readOnly) {
            return;
        }
        if (comboBoxInput.value === "") {
            comboBoxInput.oldValue = comboBoxInput.currentValue;
            comboBoxInput.currentValue = comboBoxInput.value;
            $(comboBoxInput).trigger("change");
            setSelectedOption(0);
            $(comboBoxSelectionBox).children().not(comboBoxSelectionOverlay).remove();
            scrollIntoView(0);
        }
    });

    $(comboBox).on("optionselect", function (event) {
        event.selection = event.target;
        event.optioncontent = $(event.target).find(".oyocomboboxoptioncontent").get(0);
        if (!Boolean(event.optioncontent)) {
            delete event.optioncontent;
        }
        event.optiontext = $(event.target).find(".oyocomboboxoptiontext").get(0);
        event.value = event.optiontext.value;
    });

    $(comboBox).on("optionadd", function (event) {
        event.option = event.target;
    });

    $(comboBoxList).on("visibilitychange", function (event) {
        var visible = $(comboBoxList).css("display") !== "none";
        event.visibility = visible;
        if (!visible) {
            var index = searchOption();
            setSelectedOption(index);
        }
    });

    $(comboBoxList).on("wheel", function (event) {
        var firstOption = getFirstOption();

        if (optionLinesScroll > optionLinesInView) {
            optionLinesScroll = optionLinesInView;
        }
        var optionsLength = comboBoxOptions.length;

        if (event.originalEvent.deltaY < 0) {
            var index = $(firstOption).index() - optionLinesScroll;
            switch (true) {
                case index === (0) - (optionLinesScroll) :
                    index = optionsLength - 1;
                    break;
                case index < 0 :
                    index = 0;
                    break;
            }
        } else {
            var index = $(firstOption).index() + optionLinesScroll;
            switch (true) {
                case index === (optionsLength - 1) - (optionLinesInView - 1) + optionLinesScroll:
                    index = 0;
                    break;
                case index > (optionsLength - 1) - (optionLinesInView - 1):
                    index = (optionsLength - 1) - (optionLinesInView - 1);
                    break;
            }
        }
        scrollIntoView(index);
        event.preventDefault();
    });

    $(comboBoxList).on("scrollend", function () {
        var firstOption = getFirstOption();
        var index = $(firstOption).index();
        if (index === -1) {
            index = 0;
        }
        scrollIntoView(index);
    });

    function scrollIntoView(index, top = true) {
        var originalScrollLeft = window.scrollX;
        var originalScrollTop = window.scrollY;
        comboBoxOptions[index].scrollIntoView(top);
        window.scrollTo(originalScrollLeft, originalScrollTop);
    }

    function resizeComboBox() {
        var display = $(comboBoxList).css("display");
        $(comboBoxList).css("display", "block");

        var selectionBoxWidth = $(comboBoxSelectionBox).outerWidth(true);
        var caretWidth = $(comboBoxCaret).outerWidth(true);
        if (comboBoxWidth === "auto") {
            $(comboBoxInput).outerWidth(0, true);
            var listWidth = $(comboBoxList).outerWidth();
            var width = listWidth - selectionBoxWidth + 23 + parseFloat(comboBoxInput.focusBorderWidth);
        } else {
            var headerWidth = $(comboBoxHeader).width();
            var width = headerWidth - selectionBoxWidth - caretWidth;
        }

        if (showInput) {
            width = toFloat(width, 3);
            $(comboBoxInput).outerWidth(width, true);
            $(comboBoxInput).css("opacity", 1);
            $(comboBoxOptionTexts).width("auto");
            $(comboBoxOptionTexts).css("opacity", 1);
        } else {
            $(comboBoxInput).outerWidth(0, true);
            $(comboBoxInput).css("opacity", 0);
            $(comboBoxOptionTexts).width(0);
            $(comboBoxOptionTexts).css("opacity", 0);
        }

        if (comboBoxWidth !== "auto") {
            var width = comboBoxWidth;
            $(comboBox).outerWidth(width);
        }

        var headerHeight = $(comboBoxHeader).outerHeight();
        if (comboBoxHeight !== "auto") {
            var listHeight = comboBoxHeight - headerHeight;
        } else {
            listHeight = 1080;
        }

        var tagName = $(comboBox).parent().get(0).tagName.toLowerCase();
        var htmlOrBody = (tagName === "html" || tagName === "body");
        var restHeight = $(comboBox).position().top + 1.5 * headerHeight;

        var maxHeight = $(window).innerHeight() - restHeight - 1;
        if (!htmlOrBody && comboBoxHeight === "auto") {
            var parent = $(comboBox).parent();
            var maxHeight = $(parent).innerHeight() - restHeight - 1;
        }

        if (listHeight > maxHeight) {
            listHeight = maxHeight;
        }
        listHeight = toFloat(listHeight, 3);
        $(comboBoxList).innerHeight(listHeight);

        resizeComboBoxList(listHeight);
        $(comboBox).outerHeight(headerHeight);
        $(comboBoxList).css("display", display);
    }

    function resizeComboBoxList(maxHeight) {
        if ($(comboBoxList).css("display") === "block") {
            var listHeight = 0;
            optionLinesInView = 0;
            $(comboBoxOptions).each(function() {
                var height = $(this).outerHeight(true);
                if (listHeight + height <= maxHeight) {
                    listHeight += height;
                    optionLinesInView += 1;
                } else {
                    return;
                }
            });
            listHeight = toFloat(listHeight, 3);
            $(comboBoxList).innerHeight(listHeight);

            var index = $(".oyoselection", comboBox).index();
            if (index === -1) {
                index = 0;
                setSelectedOption(index);
            }
            scrollIntoView(index);
        }
    }

    function getFirstOption() {
        var firstOption = $(comboBoxOptions).filter(function () {
            var height = toFloat($(this).outerHeight(true), 3);
            var middle = toFloat($(this).position().top + height / 2, 3);
            return middle > 0;
        }).eq(0);
        return firstOption;
    }

    function searchOption() {
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        if (dropdownOnly) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                inputValue = "";
            }, 1000);
        }
        if (dropdownOnly) {
            if (Boolean(inputValue)) {
                var currentOption = $(comboBoxOptions).filter(function () {
                    return $(this).text().toLowerCase().indexOf(comboBoxInput.currentValue.toLowerCase()) === 0;
                });
                var searchValue = $(currentOption).eq(0).text();
                var pos = $(currentOption).eq(0).text().toLowerCase().indexOf(inputValue.toLowerCase());
                if (pos !== 0) {
                    var searchValue = inputValue;
                }
            } else {
                var searchValue = comboBoxInput.value;
            }
        } else {
            var searchValue = comboBoxInput.value;
        }

        if (Boolean(searchValue)) {
            var foundOptions = $(comboBoxOptions).filter(function () {
                return $(this).text().toLowerCase().indexOf(searchValue.toLowerCase()) === 0;
            });
            var index = foundOptions.eq(0).index();
        }

        if (index === -1) {
            index = undefined;
        }

        return index;
    }

    function setSelectedOption(index) {
        $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
        $(comboBoxOptions).find("*").css("background-color", comboBox.backgroundColor);
        $(comboBoxOptions).find("*").css("color", comboBox.textColor);
        $(comboBoxOptions).eq(index).css("background-color", comboBox.selectionColor);
        $(comboBoxOptions).eq(index).find("*").css("background-color", comboBox.selectionColor);
        $(comboBoxOptions).eq(index).find("*").css("color", comboBox.selectionTextColor);
        $(comboBoxOptions).removeClass("oyoselection");
        $(comboBoxOptions).eq(index).addClass("oyoselection");
    }

    function createInputCancelButton() {
        var svgNS = "http://www.w3.org/2000/svg";
        var inputCancelButton = document.createElementNS(svgNS, "svg");
        $(inputCancelButton).attr("xmlns", "http://www.w3.org/2000/svg");
        $(inputCancelButton).attr("viewBox", "0 0 24 24");
        var path = document.createElementNS(svgNS, "path");
        var d = "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";
        $(path).attr("d", d);
        $(inputCancelButton).append(path);
        return inputCancelButton;
    }

    function createCaret(direction) {
        var svgNS = 'http://www.w3.org/2000/svg';
        var caret = document.createElementNS(svgNS, "svg");
        if (direction === "down") {
            $(caret).addClass("oyocomboboxcaretdown");
        } else {
            $(caret).addClass("oyocomboboxcaretup");
        }
        $(caret).css("width", 15 + "px");
        $(caret).css("height", 15 + "px");
        $(caret).css("background-color", comboBox.backgroundColor);
        $(caret).css("fill", comboBox.selectionColor);
        $(caret).css("position", "relative");
        $(caret).css("vertical-align", "top");

        var polygon = document.createElementNS(svgNS, "polygon");
        $(polygon).addClass("oyofill");
        if (direction === "down") {
            $(polygon).attr("points", "1.5,4.5 13.5,4.5 7.5,10.5");
        }
        if (direction === "up") {
            $(polygon).attr("points", "1.5,10.5 13.5,10.5 7.5,4.5");
        }
        $(caret).append(polygon);
        return caret;
    }

    function setValue(value) {
        value = normalizeText(value);
        comboBoxInput.value = value;
        var index = searchOption();
        $(comboBox.options).eq(index).trigger("click", false);
    }

    /**
     * Change the value of the combobox input.
     * @param {string} value The value of the combobox input.
     * @param {boolean} active Wether the combobox input must be activated.
     */
    comboBox.setValue = function (value, active = false) {
        value = normalizeText(value);
        comboBoxInput.value = value;
        var index = searchOption();
        $(comboBox.options).eq(index).trigger("click", active);
    };

    function normalizeText(text) {
        if (typeof text === "object") {
            text = null;
        } else {
            text = text.toString();
        }
        return text;
    }

    function htmlUnescape(str) {
        return str
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    function toFloat(number, digits) {
        number = number.toFixed(digits);
        number = parseFloat(number);
        return number;
    }

    /**
     * Add an option for the combobox.
     * @param {string} text The text in the option that can be selected for the combobox input.
     * @param {object (optional)} content The extra (visual) content is prepended in the option.
     * @param {boolean (optional)} showText Whether to show the text in the option or not.
     */
    comboBox.addOption = function (text, content, showText = true, selectable = true) {
        var comboBoxOption = document.createElement("div");
        $(comboBoxOption).addClass("oyocomboboxoption");
        if (Boolean(content)) {
            $(comboBoxOption).css("padding-left", "4px");
        } else {
            $(comboBoxOption).css("padding-left", "8px");
        }

        $(comboBoxOption).css("white-space", "nowrap");
        $(comboBoxOption).css("position", "relative");
        $(comboBoxOption).css("background-color", comboBox.backgroundColor);
        $(comboBoxOption).css("color", comboBox.textColor);
        $(comboBoxOption).css("cursor", "pointer");
        $(comboBoxOption).attr("title", text);
        $(comboBoxOption).prop("showText", showText);
        $(comboBoxOption).prop("selectable", selectable);
        $(comboBoxList).append(comboBoxOption);
        comboBoxOptions.push(comboBoxOption);

        text = htmlUnescape(normalizeText(text));
        var comboBoxOptionText = document.createElement("div");
        $(comboBoxOptionText).addClass("oyocomboboxoptiontext");
        $(comboBoxOptionText).html(text);
        $(comboBoxOptionText).prop("value", text);
        $(comboBoxOptionText).css("display", "inline-block");
        $(comboBoxOptionText).css("margin-left", "7px");
        $(comboBoxOptionText).css("position", "relative");
        $(comboBoxOptionText).css("background-color", comboBox.backgroundColor);
        $(comboBoxOptionText).css("color", comboBox.textColor);
        $(comboBoxOptionText).css("overflow", "hidden");
        $(comboBoxOptionText).css("vertical-align", "middle");
        $(comboBoxOption).append(comboBoxOptionText);
        comboBoxOptionTexts.push(comboBoxOptionText);

        if (showText) {
            $(comboBoxOptionText).css("visibility", "visible");
        } else {
            $(comboBoxOptionText).css("visibility", "hidden");
        }

        var comboBoxOptionWrapper = document.createElement("div");
        $(comboBoxOptionWrapper).addClass("oyocomboboxoptionwrapper");
        $(comboBoxOptionWrapper).css("display", "inline-block");
        $(comboBoxOptionWrapper).css("position", "relative");
        $(comboBoxOptionWrapper).css("white-space", "nowrap");
        $(comboBoxOptionWrapper).css("vertical-align", "middle");
        $(comboBoxOption).prepend(comboBoxOptionWrapper);
        comboBoxOptionWrappers.push(comboBoxOptionWrapper);

        if (Boolean(content)) {
            var comboBoxOptionContent = $(content).clone();
            $(comboBoxOptionContent).addClass("oyocomboboxoptioncontent");
            $(comboBoxOptionContent).find("input").add(comboBoxOptionContent).attr("tabindex", -1);
            $(comboBoxOptionContent).css("display", "inline-block");
            $(comboBoxOptionContent).css("white-space", "nowrap");
            $(comboBoxOptionContent).css("position", "absolute");
            $(comboBoxOptionWrapper).append(comboBoxOptionContent);
            comboBoxOptionContents.push(comboBoxOptionContent);
        }

        if (Boolean(content)) {
            var length = $(comboBoxOption).find("input").length;
            if (length > 0) {
                var comboBoxOptionOverlay = document.createElement("div");
                $(comboBoxOptionOverlay).addClass("oyocomboboxoptionoverlay");
                $(comboBoxOptionOverlay).css("position", "absolute");
                $(comboBoxOptionOverlay).css("opacity", "0");
                $(comboBoxOptionOverlay).css("z-index", 999);
                $(comboBoxOptionWrapper).append(comboBoxOptionOverlay);
                comboBoxOptionOverlays.push(comboBoxOptionOverlay);
            }
        }

        var length = $(comboBoxOption).find("[src]").length;
        if (length === 0) {
            resizeSelectionBox(content);
        } else {
            $(comboBoxOptionContent).on("load", function () {
                resizeSelectionBox(content);
            });
        }

        function resizeSelectionBox(content) {
            $(comboBoxList).css("display", "block");
            if (Boolean(content)) {
                var selectionBoxWidth = $(comboBoxSelectionBox).outerWidth();
                var selectionBoxHeight = $(comboBoxSelectionBox).outerHeight();
                var optionContentWidth = $(comboBoxOptionContent).outerWidth(true);
                var optionContentHeight = $(comboBoxOptionContent).outerHeight(true);
                $(comboBoxSelectionBox).css("margin-left", "4px");

                if (optionContentWidth >= selectionBoxWidth) {
                    optionContentWidth = toFloat(optionContentWidth, 3);
                    $(comboBoxSelectionBox).outerWidth(optionContentWidth);
                    $(comboBoxSelectionOverlay).outerWidth(optionContentWidth);
                }
                if (optionContentHeight >= selectionBoxHeight) {
                    optionContentHeight = toFloat(optionContentHeight, 3);
                    $(comboBoxSelectionBox).outerHeight(optionContentHeight);
                    $(comboBoxSelectionOverlay).outerHeight(optionContentHeight);
                }
            }

            var selectionBoxWidth = $(comboBoxSelectionBox).outerWidth();
            var selectionBoxHeight = $(comboBoxSelectionBox).outerHeight();
            $(comboBoxOptionWrappers).each(function () {
                $(this).outerWidth(selectionBoxWidth, true);
                $(this).outerHeight(selectionBoxHeight, true);
            });
            $(comboBoxOptionContents).each(function () {
                var top = ($(this).parent().height() - $(this).outerHeight(true)) / 2;
                top = toFloat(top, 3);
                $(this).css("top", top + "px");
            });
            $(comboBoxOptionOverlays).each(function () {
                $(this).outerWidth(selectionBoxWidth, true);
                $(this).outerHeight(selectionBoxHeight, true);
            });
            $(comboBoxOptionTexts).each(function () {
                var marginLeft = (5 + parseFloat(comboBoxInput.focusBorderWidth)) + "px";
                $(this).css("margin-left", marginLeft);
            });

            var top = ($(comboBoxCaret).height() - $(comboBoxCaretDown).outerHeight(true)) / 2;
            top = toFloat(top, 3);
            $(comboBoxCaretDown).css("top", top + "px");
            $(comboBoxCaretUp).css("top", top + "px");
            resizeComboBox();
            $(comboBoxList).css("display", "none");
        }

        $(comboBoxOption).trigger("optionadd");

        $(comboBoxOption).on("click", function (event, active) {
            if (selectable) {
                comboBoxInput.oldValue = comboBoxInput.currentValue;
                comboBoxInput.value = $(comboBoxOptionText).prop("value");
                comboBoxInput.currentValue = comboBoxInput.value;
                if (comboBoxInput.currentValue !== comboBoxInput.oldValue) {
                    $(comboBoxInput).trigger("change");
                }
                $(comboBoxSelectionBox).children().not(comboBoxSelectionOverlay).remove();
                var length = $(comboBoxOptionContent).length;
                if (length > 0) {
                    var comboBoxSelectionContent = $(comboBoxOptionContent).clone(true).get(0);
                    $(comboBoxSelectionContent).removeClass("oyocomboboxoptioncontent");
                    $(comboBoxSelectionContent).addClass("oyocomboboxselectioncontent");
                    $(comboBoxSelectionContent).css("background-color", comboBox.backgroundColor);
                    $(comboBoxSelectionContent).css("color", comboBox.textColor);
                    $(comboBoxSelectionBox).append(comboBoxSelectionContent);
                }
                var index = $(comboBoxOption).index();
                setSelectedOption(index);
                if (active || event.which === 1) {
                    oyoComboBoxList = "up";
                    $(comboBoxInput).focus();
                }
            } else {
                comboBoxInput.value = comboBoxInput.currentValue;
            }
            $(comboBoxOption).trigger("optionselect");
            hideListBox();
            event.stopImmediatePropagation();
        });

        $(comboBoxOption).on("mouseover", function (event) {
            var selection = $(".oyoselection", comboBox);
            var index = $(event.currentTarget).index();
            if (index !== $(selection).index()) {
                $(event.currentTarget).css("background-color", comboBox.hoverColor);
                $(event.currentTarget).find("*").css("background-color", comboBox.hoverColor);
                $(event.currentTarget).find("*").css("color", comboBox.hoverTextColor);
            }
        });

        $(comboBoxOption).on("mouseout", function (event) {
            var selection = $(".oyoselection", comboBox);
            var index = $(event.currentTarget).index();
            if (index !== $(selection).index()) {
                $(event.currentTarget).css("background-color", comboBox.backgroundColor);
                $(event.currentTarget).find("*").css("background-color", comboBox.backgroundColor);
                $(event.currentTarget).find("*").css("color", comboBox.textColor);
            }
        });
    };

    /**
     * Set the border widths of the input.
     * @param {number or string} borderWidth    Border width of the buttons.
     * @param {number or string} focusBorderWidth Border tab width of the buttons.
     */
    comboBox.setInputBorderWidths = function (borderWidth = comboBoxInput.borderWidth, focusBorderWidth = comboBoxInput.focusBorderWidth) {
        comboBoxInput.borderWidth = parseFloat(borderWidth) + "px";
        comboBoxInput.focusBorderWidth = parseFloat(focusBorderWidth) + "px";
        comboBoxInput.currentBorderWidth = parseFloat(borderWidth) + "px";
        $(comboBoxInput).css("border-width", comboBoxInput.borderWidth);
        changeLayout(comboBoxInput);
        var difference = parseFloat(focusBorderWidth) - parseFloat(borderWidth);
        difference = toFloat(difference, 3);
        $(comboBoxOptionTexts).each(function() {
            var marginLeft = (5 + parseFloat(focusBorderWidth)) + "px";
            $(this).css("margin-left", marginLeft);
        });
    };

    /**
     * Change the colors of the combobox.
     * @param {string} backgroundColor The background color of the combobox.
     * @param {string} selectionColor The color of the selected option.
     * @param {string} hoverColor The color of the hovered option.
     * @param {string} textColor The text color of the combo box.
     * @param {string} selectionTextColor The selection text color of the combobox.
     * @param {string} hoverTextColor The hover text color of the combobox.
     */
    comboBox.changeColors = function (
        backgroundColor = comboBox.backgroundColor,
        selectionColor = comboBox.selectionColor,
        hoverColor = comboBox.hoverColor,
        textColor = comboBox.textColor,
        selectionTextColor = comboBox.selectionTextColor,
        hoverTextColor = comboBox.hoverTextColor) {
        comboBox.changeBackgroundColor(backgroundColor);
        comboBox.changeSelectionColor(selectionColor);
        comboBox.changeHoverColor(hoverColor);
        comboBox.changeTextColors(textColor, selectionTextColor, hoverTextColor);
    };

    /**
     * Change the background color of the combobox.
     * @param {string} color The background color of the combobox.
     */
    comboBox.changeBackgroundColor = function (color) {
        comboBox.backgroundColor = color;
        $(comboBoxHeader).css("background-color", color);
        $(comboBoxCaretDown).css("background-color", color);
        $(comboBoxCaretUp).css("background-color", color);
        $(comboBoxList).css("background-color", color);
    };

    /**
     * Change the selection color of the combobox.
     * @param {string} color The selection color of the combobox.
     */
    comboBox.changeSelectionColor = function (color) {
        comboBox.selectionColor = color;
        $(comboBoxInput).css("background-color", comboBox.selectionColor);
        $(comboBoxCaretDown).css("fill", comboBox.selectionColor);
        $(comboBoxCaretUp).css("fill", comboBox.selectionColor);
    };

    /**
     * Change the hover color of the combobox.
     * @param {string} color The hover color of the combobox.
     */
    comboBox.changeHoverColor = function (color) {
        comboBox.hoverColor = color;
    };

    /**
     * Change the text color of the combobox.
     * @param {string} textColor The text color of the combobox.
     * @param {string} selectionTextColor The selection text color of the combobox.
     * @param {string} hoverTextColor The hover text color of the combobox.
     */
    comboBox.changeTextColors = function (
        textColor = defaultTextColor,
        selectionTextColor = defaultSelectionTextColor,
        hoverTextColor = defaultHoverTextColor) {
        comboBox.textColor = textColor;
        $(comboBoxInput).css("color", selectionTextColor);
        changeInputColor(selectionTextColor);
        comboBox.selectionTextColor = selectionTextColor;
        comboBox.hoverTextColor = hoverTextColor;
    };

    function changeInputColor(color) {
        var CSScolor = "color: " + color + ";";
        var CSSopacity = "opacity: " + "0.75" + ";";
        var CSSappearance = "-webkit-appearance: none;";
        var CSS = "[name=" + inputName + "]::-webkit-input-placeholder {" + CSScolor + CSSopacity + "}";
        if (stylePlaceHolder.sheet.rules[comboBoxInputIndex]) {
            stylePlaceHolder.sheet.deleteRule(comboBoxInputIndex);
        }
        stylePlaceHolder.sheet.insertRule(CSS, comboBoxInputIndex);
        var html = "";
        $(stylePlaceHolder.sheet.rules).each(function () {
            html = html + this.cssText;
        });
        $(stylePlaceHolder).html(html);

        var CSSappearance = "-webkit-appearance: none;";
        var CSSheight = "height: 15px;";
        var CSSwidth = "width: 15px;";
        var CSSbackgroundcolor = "background-color: " + color + ";";
        var outerHTML = comboBoxInputCancelButton.outerHTML;
        outerHTML = outerHTML.replaceAll('"', "'");
        var CSSMaskImage = "-webkit-mask-image: url(\"data:image/svg+xml;utf8," + outerHTML + "\");";
        var CSSbackgroundsize = "background-size: 15px 15px;";
        var CSS = "[name=" + inputName + "]::-webkit-search-cancel-button {" + CSSappearance + CSSheight + CSSwidth + CSSMaskImage + CSSbackgroundcolor + CSSbackgroundsize + "}";
        if (styleCancelButton.sheet.rules[comboBoxInputIndex]) {
            styleCancelButton.sheet.deleteRule(comboBoxInputIndex);
        }
        styleCancelButton.sheet.insertRule(CSS, comboBoxInputIndex);
        var html = "";
        $(styleCancelButton.sheet.rules).each(function () {
            html = html + this.cssText;
        });
        $(styleCancelButton).html(html);
    }

    /**
     * Reset the colors of the combobox.
     */
    comboBox.resetColors = function () {
        comboBox.backgroundColor = defaultBackgroundColor;
        comboBox.selectionColor = defaultSelectionColor;
        comboBox.hoverColor = defaultHoverColor;
        comboBox.textColor = defaultTextColor;
        comboBox.selectionTextColor = defaultSelectionTextColor;
        comboBox.hoverTextColor = defaultHoverTextColor;
        $(comboBoxHeader).css("background-color", defaultBackgroundColor);
        $(comboBoxInput).css("background-color", defaultSelectionColor);
        $(comboBoxInput).css("color", defaultSelectionTextColor);
        changeInputColor(defaultSelectionTextColor);
        $(comboBoxCaretDown).css("background-color", defaultBackgroundColor);
        $(comboBoxCaretUp).css("background-color", defaultBackgroundColor);
        $(comboBoxCaretDown).css("fill", defaultSelectionColor);
        $(comboBoxCaretUp).css("fill", defaultSelectionColor);
        $(comboBoxList).css("background-color", defaultBackgroundColor);
    };

    /**
     * Change the placeholder for the combobox input.
     * @param {string} text The text for the placeholder of the combobox input.
     */
    comboBox.changePlaceHolder = function (text) {
        $(comboBoxInput).attr("placeholder", text);
    };

    return comboBox;
}