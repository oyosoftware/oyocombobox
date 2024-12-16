/*
 oyocombobox.js 1.0
 tested with jQuery 3.4.0
 http://www.oyoweb.nl

 © 2024 oYoSoftware
 MIT License

 oyocombobox is a component with a dropdown for selecting options.
 You can also fill the options with a second content that visualizes the options.
 */

/**
 Make a combobox component for selecting options.
 @param {number (optional)} comboBoxWidth The width of the combobox component.
 @param {number (optional)} comboBoxHeight The height of the combobox component.
 @return {object} The combobox component.
 */
function oyoComboBox(comboBoxWidth, comboBoxHeight) {

    var defaultBackgroundColor = "white";
    var defaultSelectionColor = "#527FC3";
    var defaultHoverColor = "#B3CEB3";
    var defaultTextColor = "black";
    var defaultSelectionTextColor = "white";
    var defaultHoverTextColor = "black";
    var optionLinesScroll = 4;
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
    $(comboBox).append(comboBoxHeader);

    var comboBoxInputIndex = $(".oyocombobox").length;
    var inputName = "oyocomboboxinput" + (comboBoxInputIndex + 1);
    var comboBoxInput = document.createElement("input");
    $(comboBoxInput).addClass("oyocomboboxinput");
    $(comboBoxInput).attr("id", inputName);
    $(comboBoxInput).attr("type", "search");
    $(comboBoxInput).css("background-color", comboBox.backgroundColor);
    $(comboBoxInput).css("color", comboBox.textColor);
    $(comboBoxInput).css("margin", "4px");
    $(comboBoxInput).css("font", "inherit");
    $(comboBoxInput).css("display", "inline-block");
    $(comboBoxInput).css("vertical-align", "middle");
    $(comboBoxInput).css("position", "relative");
    $(comboBoxInput).css("border", "1px solid black");
    $(comboBoxInput).css("outline", "none");
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
    changeInputColor(comboBox.textColor);

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

    var comboBoxList = document.createElement("div");
    $(comboBoxList).addClass("oyocomboboxlist");
    $(comboBoxList).css("border", "1px solid black");
    $(comboBoxList).css("border-top", "none");
    $(comboBoxList).css("display", "none");
    $(comboBoxList).css("position", "relative");
    $(comboBoxList).css("overflow", "auto");
    $(comboBoxList).css("background-color", comboBox.backgroundColor);
    $(comboBox).append(comboBoxList);

    Object.defineProperty(comboBox, "options", {
        get: function () {
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            return comboBoxOptions;
        }
    });

    Object.defineProperty(comboBox, "value", {
        get: function () {
            var value = comboBoxInput.value;
            return value;
        },
        set: function (value) {
            changeValue(value);
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

    $(window).on("resize", function () {
        var display = $(comboBoxList).css("display");
        $(comboBoxList).css("display", "block");
        resizeComboBox();
        optionLinesInView = 0;
        setOptionLinesInView();
        var index = $(".oyoselection", comboBox).index();
        if (index !== -1) {
            resizeComboBoxList(index, true);
        }
        $(comboBoxList).css("display", display);
    });

    function resizeComboBox() {
        var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
        var comboBoxOptionContents = $(".oyocomboboxoptioncontent", comboBox);
        var hiddenOptionTexts = $(comboBoxOptionTexts).filter(function () {
            return $(this).css("visibility") === "hidden";
        });

        $(comboBoxHeader).css("padding-left", "4px");
        if (comboBoxOptionContents.length === 0) {
            $(comboBoxHeader).css("padding-left", "0px");
        }

        if (comboBoxOptionTexts.length !== hiddenOptionTexts.length) {
            if (Boolean(comboBoxWidth)) {
                $(comboBox).outerWidth(comboBoxWidth);
                var headerWidth = Math.round($(comboBoxHeader).width());
                var selectionBoxWidth = $(comboBoxSelectionBox).outerWidth(true);
                var caretWidth = $(comboBoxCaret).outerWidth(true);
                var width = headerWidth - selectionBoxWidth - caretWidth;
                $(comboBoxInput).outerWidth(width, true);
            }
        } else {
            $(comboBoxInput).css("max-width", "0px");
            $(comboBoxInput).css("padding", "0px");
            $(comboBoxInput).css("border-width", "0px");
            $(comboBoxInput).css("margin-left", "0px");
            $(comboBoxOptionTexts).css("display", "none");
        }

        if (Boolean(comboBoxHeight)) {
            var headerHeight = Math.round($(comboBoxHeader).outerHeight());
            var listHeight = comboBoxHeight - headerHeight;
            var comboBoxListOffsetTop = Math.round($(comboBoxList).offset().top);
            var maxHeight = window.height - comboBoxListOffsetTop - 10;
            if (listHeight > maxHeight) {
                listHeight = maxHeight;
            }
            $(comboBox).outerHeight(headerHeight);
            $(comboBoxList).outerHeight(listHeight);
        }
    }

    function setOptionLinesInView() {
        var display = $(comboBoxList).css("display");
        $(comboBoxList).css("display", "block");
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        var optionsLength = comboBoxOptions.length;
        var comboBoxListHeight = Math.round($(comboBoxList).innerHeight());
        optionLinesInView = optionsLength;
        for (i = 0; i < optionsLength; i++) {
            var listHeight = 0, optionsInViewLength = 0;
            var indexFrom = i;
            if (indexFrom > (optionsLength - 1) - (optionLinesInView - 1)) {
                indexFrom = (optionsLength - 1) - (optionLinesInView - 1);
            }
            var indexTo = indexFrom + optionLinesInView;
            for (j = indexFrom; j < indexTo; j++) {
                var option = $(comboBoxOptions).eq(j);
                var optionHeight = $(option).outerHeight();
                if (listHeight + optionHeight <= comboBoxListHeight) {
                    listHeight += optionHeight;
                    optionsInViewLength += 1;
                } else {
                    break;
                }
            }
            if (optionLinesInView === 0 || (optionsInViewLength < optionLinesInView)) {
                optionLinesInView = optionsInViewLength;
            }
            if (indexFrom === (optionsLength - 1) - (optionLinesInView - 1)) {
                break;
            }
        }
        $(comboBoxList).css("display", display);
    }

    function resizeComboBoxList(index, top) {
        if ($(comboBoxList).css("display") === "block") {
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var optionsLength = comboBoxOptions.length;
            if (top) {
                var indexFrom = index;
                if (indexFrom === (optionsLength - 1)) {
                    indexFrom = indexFrom - (optionLinesInView - 1);
                }
            } else {
                var indexFrom = index - (optionLinesInView - 1);
                if (indexFrom < 0) {
                    indexFrom = 0;
                }
            }
            var indexTo = indexFrom + optionLinesInView;
            if (indexTo > (optionsLength - 1)) {
                var indexFrom = (optionsLength - 1) - (optionLinesInView - 1);
                var indexTo = (optionsLength);
            }
            var listHeight = 0;
            for (i = indexFrom; i < indexTo; i++) {
                var height = comboBoxOptions.eq(i).outerHeight();
                listHeight += height;
            }
            $(comboBoxList).innerHeight(listHeight);

            if (window.event.type === "keydown" || window.event.type === "keyup") {
                var selection = $(".oyoselection", comboBox).get(0);
                if (top) {
                    selection.scrollIntoView(true);
                } else {
                    selection.scrollIntoView(false);
                }
            } else {
                comboBoxOptions[index].scrollIntoView();
            }
            if (window.event.type === "click" || window.event.type === "scrollend") {
                comboBoxList.scrollEnabled = true;
            } else {
                comboBoxList.scrollEnabled = false;
                $(comboBoxList).off("scrollend", scrollEnd);
            }
        }
    }

    function searchOption() {
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        var foundOptions = $(comboBoxOptions).filter(function () {
            return $(this).text().toLowerCase().indexOf(comboBoxInput.value.toLowerCase()) === 0;
        });
        var index = foundOptions.eq(0).index();
        if (comboBoxInput.value === "") {
            index = -1;
        }
        if (index === -1) {
            index = 0;
            $(comboBoxSelectionBox).html("");
        }
        return index;
    }

    function setSelectedOption(index) {
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
        $(comboBoxOptions).find("*").css("background-color", comboBox.backgroundColor);
        $(comboBoxOptions).find("*").css("color", comboBox.textColor);
        $(comboBoxOptions).eq(index).css("background-color", comboBox.selectionColor);
        $(comboBoxOptions).eq(index).find("*").css("background-color", comboBox.selectionColor);
        $(comboBoxOptions).eq(index).find("*").css("color", comboBox.selectionTextColor);
        $(comboBoxOptions).removeClass("oyoselection");
        $(comboBoxOptions).eq(index).addClass("oyoselection");
    }

    $(window).on("focusout", function (event) {
        if (event.target === window) {
            $(document).trigger("click");
        }
        event.stopImmediatePropagation();
    });

    $(document).on("click", function (event) {
        var elements = $(".oyocombobox").add($(".oyocombobox").find("*")).toArray();
        if (elements.indexOf(event.target) === -1) {
            $(".oyocombobox").each(function () {
                if ($(".oyocomboboxlist", this).css("display") === "block") {
                    $(".oyocomboboxlist", this).css("display", "none");
                    $(".oyocomboboxcaretdown", this).css("display", "inline");
                    $(".oyocomboboxcaretup", this).css("display", "none");
                    $(".oyocomboboxlist", this).trigger("visibilitychange");
                }
            });
        }
        event.stopImmediatePropagation();
    });

    $(comboBox).on("focusin", function () {
        $(".oyocombobox").not(comboBox).each(function () {
            if ($(".oyocomboboxlist", this).css("display") === "block") {
                $(".oyocomboboxlist", this).css("display", "none");
                $(".oyocomboboxcaretdown", this).css("display", "inline");
                $(".oyocomboboxcaretup", this).css("display", "none");
                $(".oyocomboboxlist", this).trigger("visibilitychange");
            }
        });
    });

    $(comboBoxCaret).on("click", function () {
        if (optionLinesInView === 0) {
            setOptionLinesInView();
        }
        if ($(comboBoxList).css("display") === "block") {
            $(comboBoxList).css("display", "none");
            $(comboBoxList).trigger("visibilitychange");
            $(comboBoxCaretDown).css("display", "inline");
            $(comboBoxCaretUp).css("display", "none");
        } else {
            $(comboBoxList).css("display", "block");
            $(comboBoxList).trigger("visibilitychange");
            $(comboBoxCaretDown).css("display", "none");
            $(comboBoxCaretUp).css("display", "inline");
            var index = $(".oyoselection", comboBox).index();
            if (index === -1) {
                index = 0;
                setSelectedOption(index);
            }
            resizeComboBoxList(index, true);
        }
        $(comboBoxInput).focus();
    });

    $(comboBoxInput).on("keydown", function (event) {
        if (optionLinesInView === 0) {
            setOptionLinesInView();
        }

        comboBoxInput.oldValue = comboBoxInput.value;

        var keys = [13, 27, 33, 34, 38, 40];
        if (keys.includes(event.which)) {
            event.preventDefault();
        }

        var keys = [33, 34, 38, 40];
        if (keys.includes(event.which)) {
            var comboBoxListHeight = Math.round($(comboBoxList).innerHeight());
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var optionsLength = comboBoxOptions.length;
            var scrollTop = comboBoxList.scrollTop;
            var scrollBottom = scrollTop + comboBoxListHeight;
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
                    var selectionPosition = Math.round($(selection).position().top);
                    var selectionMargin = Math.round($(selection).outerHeight() / 2);
                    var top = scrollTop + selectionPosition + selectionMargin;
                    if (top < scrollTop || top > scrollBottom) {
                        var keys = [33, 38];
                        if (keys.includes(event.which)) {
                            resizeComboBoxList(index, true);
                        }
                        var keys = [34, 40];
                        if (keys.includes(event.which)) {
                            resizeComboBoxList(index, false);
                        }
                    }
                } else {
                    $(comboBoxList).css("display", "block");
                    $(comboBoxList).trigger("visibilitychange");
                    $(comboBoxCaretDown).css("display", "none");
                    $(comboBoxCaretUp).css("display", "inline");
                    resizeComboBoxList(index, true);
                }
            }
        }
    });

    $(comboBoxInput).on("keyup", function (event) {
        if (optionLinesInView === 0) {
            setOptionLinesInView();
        }
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        var index;

        if (event.key) {
            var isCharacter = (event.key.toUpperCase() === String.fromCharCode(event.keyCode));
        }

        var keys = [8, 46];
        if (isCharacter || keys.includes(event.which)) {
            index = searchOption();
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
            $(comboBoxList).css("display", "block");
            $(comboBoxList).trigger("visibilitychange");
            $(comboBoxCaretDown).css("display", "none");
            $(comboBoxCaretUp).css("display", "inline");
        }

        if (index !== undefined) {
            setSelectedOption(index);
            if (isCharacter || keys.includes(event.which)) {
                var selection = $(".oyoselection", comboBox);
                if (selection.length > 0) {
                    resizeComboBoxList(index, true);
                }
            }

            if (event.which === 13) {
                if (visible) {
                    $(comboBoxOptions).eq(index).trigger("click");
                    $(comboBoxList).css("display", "none");
                    $(comboBoxList).trigger("visibilitychange");
                    $(comboBoxCaretDown).css("display", "inline");
                    $(comboBoxCaretUp).css("display", "none");
                    event.stopImmediatePropagation();
                }
            }

            if (event.which === 27) {
                $(comboBoxList).css("display", "none");
                $(comboBoxList).trigger("visibilitychange");
                $(comboBoxCaretDown).css("display", "inline");
                $(comboBoxCaretUp).css("display", "none");
            }
        }
    });

    $(comboBoxInput).on("search", function () {
        if (comboBoxInput.value === "") {
            comboBoxInput.oldValue = comboBoxInput.newValue;
            comboBoxInput.newValue = comboBoxInput.value;
            $(comboBoxInput).trigger("change");
            setSelectedOption(0);
            $(comboBoxSelectionBox).html("");
            resizeComboBoxList(0, 1);
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
        if (optionLinesScroll > optionLinesInView) {
            optionLinesScroll = optionLinesInView;
        }
        var comboBoxListHeight = Math.round($(comboBoxList).innerHeight());
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        var optionsLength = comboBoxOptions.length;
        var scrollTop = comboBoxList.scrollTop;
        var scrollBottom = comboBoxList.scrollTop + comboBoxListHeight;
        var optionsInView = $(comboBoxOptions).filter(function () {
            var optionPosition = Math.round($(this).position().top);
            var optionMargin = Math.round($(this).outerHeight() / 2);
            var top = scrollTop + optionPosition + optionMargin;
            return top >= scrollTop && top <= scrollBottom;
        });
        if (event.originalEvent.deltaY < 0) {
            var index = $(optionsInView).eq(0).index() - optionLinesScroll;
            switch (true) {
                case index === (0) - (optionLinesScroll) :
                    index = optionsLength - 1;
                    break;
                case index < 0 :
                    index = 0;
                    break;
            }
        } else {
            var index = $(optionsInView).eq(0).index() + optionLinesScroll;
            switch (true) {
                case index === (optionsLength - 1) - (optionLinesInView - 1) + optionLinesScroll:
                    index = 0;
                    break;
                case index > (optionsLength - 1) - (optionLinesInView - 1):
                    index = (optionsLength - 1) - (optionLinesInView - 1);
                    break;
            }
        }
        resizeComboBoxList(index, true);
        event.preventDefault();
    });

    $(comboBoxList).on("scrollend", function () {
        if (!comboBoxList.scrollEnabled) {
            comboBoxList.scrollEnabled = true;
            $(comboBoxList).on("scrollend", scrollEnd);
        }
    });

    $(comboBoxList).on("scrollend", scrollEnd);

    function scrollEnd(event) {
        var visible = $(comboBoxList).css("display") !== "none";
        if (visible) {
            var comboBoxListHeight = Math.round($(comboBoxList).innerHeight());
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var scrollTop = comboBoxList.scrollTop;
            var scrollBottom = comboBoxList.scrollTop + comboBoxListHeight;
            var optionsInView = $(comboBoxOptions).filter(function () {
                var optionPosition = Math.round($(this).position().top);
                var optionMargin = Math.round($(this).outerHeight() / 2);
                var top = scrollTop + optionPosition + optionMargin;
                return top >= scrollTop && top <= scrollBottom;
            });
            var index = $(optionsInView).eq(0).index();
            resizeComboBoxList(index, true);
        }
        event.preventDefault();
    }

    /**
     * Add an option for the combobox.
     * @param {string} text The text in the option that can be selected for the combobox input.
     * @param {object (optional)} content The extra (visual) content is prepended in the option.
     * @param {boolean (optional)} showText Whether to show the text in the option or not.
     */
    comboBox.addOption = function (text, content, showText = true) {
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
        $(comboBoxList).append(comboBoxOption);
        var length = $(".oyocomboboxoption", comboBox).length;

        text = htmlUnescape(normalizeText(text));

        var comboBoxOptionText = document.createElement("div");
        $(comboBoxOptionText).addClass("oyocomboboxoptiontext");
        $(comboBoxOptionText).css("display", "inline-block");
        $(comboBoxOptionText).css("vertical-align", "middle");
        $(comboBoxOptionText).html(text);
        $(comboBoxOptionText).prop("value", text);
        $(comboBoxOptionText).css("position", "relative");
        $(comboBoxOptionText).css("background-color", comboBox.backgroundColor);
        $(comboBoxOptionText).css("color", comboBox.textColor);
        $(comboBoxOption).append(comboBoxOptionText);

        if (showText) {
            $(comboBoxOptionText).css("visibility", "visible");
        } else {
            $(comboBoxOptionText).css("visibility", "hidden");
        }

        if (Boolean(content)) {
            $(comboBoxOptionText).css("margin-left", "8px");

            var comboBoxOptionContent = $(content).clone();
            $(comboBoxOptionContent).addClass("oyocomboboxoptioncontent");
            $(comboBoxOptionContent).find("input").add(comboBoxOptionContent).attr("tabindex", -1);
            $(comboBoxOptionContent).css("display", "inline-block");
            $(comboBoxOptionContent).css("vertical-align", "middle");
            $(comboBoxOptionContent).css("white-space", "nowrap");
            $(comboBoxOptionContent).css("position", "relative");
            $(comboBoxOptionContent).attr("title", text);
            $(comboBoxOption).prepend(comboBoxOptionContent);

            var length = $(comboBoxOption).find("input").length;
            if (length > 0) {
                $(comboBoxList).css("display", "block");
                var optionContentWidth = $(comboBoxOptionContent).outerWidth(true);
                var optionHeight = $(comboBoxOption).outerHeight();
                var comboBoxOptionOverlay = document.createElement("div");
                $(comboBoxOptionOverlay).addClass("oyocomboboxoptionoverlay");
                $(comboBoxOptionOverlay).outerWidth(optionContentWidth);
                $(comboBoxOptionOverlay).outerHeight(optionHeight);
                $(comboBoxOptionOverlay).css("position", "absolute");
                $(comboBoxOptionOverlay).css("left", "0px");
                $(comboBoxOptionOverlay).css("top", "0px");
                $(comboBoxOptionOverlay).css("z-index", 999);
                $(comboBoxOption).append(comboBoxOptionOverlay);
                $(comboBoxList).css("display", "none");
            }

            function load() {
                $(comboBoxList).css("display", "block");

                var optionContentWidth = $(comboBoxOptionContent).outerWidth(true);
                var selectionBoxWidth = $(comboBoxSelectionBox).outerWidth();
                if (optionContentWidth > selectionBoxWidth) {
                    $(comboBoxSelectionBox).outerWidth(optionContentWidth);
                }

                var optionContentHeight = $(comboBoxOptionContent).outerHeight(true);
                var selectionBoxHeight = $(comboBoxSelectionBox).outerHeight();
                if (optionContentHeight > selectionBoxHeight) {
                    $(comboBoxSelectionBox).innerHeight(optionContentHeight);
                }

                $(comboBoxCaretDown).css("vertical-align", "top");
                $(comboBoxCaretUp).css("vertical-align", "top");
                var caretHeight = $(comboBoxCaret).height();
                var caretDownHeight = $(comboBoxCaretDown).outerHeight();
                var top = (caretHeight - caretDownHeight) / 2;
                $(comboBoxCaretDown).css("top", top);
                $(comboBoxCaretUp).css("top", top);
                resizeComboBox();

                $(comboBoxList).css("display", "none");
            }

            var length = $(comboBoxOption).find("[src]").length;
            if (length === 0) {
                load();
            } else {
                $(comboBoxOptionContent).on("load", function () {
                    load();
                });
            }
        } else {
            $(comboBoxList).css("display", "block");
            resizeComboBox();
            $(comboBoxList).css("display", "none");
        }

        $(comboBoxOption).trigger("optionadd");

        $(comboBoxOption).on("click", function () {
            comboBoxInput.oldValue = comboBoxInput.value;
            comboBoxInput.value = $(comboBoxOptionText).prop("value");
            comboBoxInput.newValue = comboBoxInput.value;
            if (comboBoxInput.newValue !== comboBoxInput.oldValue) {
                $(comboBoxInput).trigger("change");
            }
            var index = $(comboBoxOption).index();
            setSelectedOption(index);

            $(comboBoxSelectionBox).html("");

            var length = $(comboBoxOptionContent).length;
            if (length > 0) {
                var comboBoxSelectionContent = $(comboBoxOptionContent).clone();
                $(comboBoxSelectionContent).removeClass("oyocomboboxoptioncontent");
                $(comboBoxSelectionContent).addClass("oyocomboboxselectioncontent");
                $(comboBoxSelectionBox).html(comboBoxSelectionContent);

                var headerHeight = $(comboBoxHeader).height();
                var optionContentHeight = $(comboBoxOptionContent).outerHeight(true);
                var inputHeight = $(comboBoxInput).outerHeight(true);

                $(comboBoxSelectionBox).height(optionContentHeight);
                $(comboBoxSelectionContent).css("vertical-align", "top");

                $(comboBoxSelectionBox).css("top", 0);
                $(comboBoxInput).css("top", 0);
                $(comboBoxCaret).css("top", 0);
                if (optionContentHeight < inputHeight) {
                    var top = (headerHeight - inputHeight) / 2;
                    $(comboBoxSelectionBox).css("top", top);
                    $(comboBoxInput).css("top", top);
                    $(comboBoxCaret).css("top", top);
                }

                var length = $(comboBoxOption).find("input").length;
                if (length > 0) {
                    var comboBoxSelectionOverlay = $(comboBoxOptionOverlay).clone();
                    $(comboBoxSelectionOverlay).removeClass("oyocomboboxoptionoverlay");
                    $(comboBoxSelectionOverlay).addClass("oyocomboboxselectionoverlay");
                    $(comboBoxSelectionOverlay).height(optionContentHeight);
                    $(comboBoxSelectionBox).append(comboBoxSelectionOverlay);
                }
            }

            $(comboBoxList).css("display", "none");
            $(comboBoxList).trigger("visibilitychange");
            $(comboBoxCaretDown).css("display", "inline");
            $(comboBoxCaretUp).css("display", "none");
            $(comboBoxOption).trigger("optionselect");
            $(comboBoxInput).focus();
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
        $(caret).css("fill", "black");
        $(caret).css("position", "relative");

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
        $(comboBoxInput).css("background-color", color);
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
        textColor,
        selectionTextColor = defaultSelectionTextColor,
        hoverTextColor = defaultHoverTextColor) {
        comboBox.textColor = textColor;
        $(comboBoxInput).css("color", textColor);
        $(comboBoxCaretDown).css("fill", textColor);
        $(comboBoxCaretUp).css("fill", textColor);
        changeInputColor(textColor);
        comboBox.selectionTextColor = selectionTextColor;
        comboBox.hoverTextColor = hoverTextColor;
    };

    function changeInputColor(color) {
        var CSScolor = "color: " + color + ";";
        var CSSopacity = "opacity: " + "0.75" + ";";
        var CSSappearance = "-webkit-appearance: none;";
        var CSS = "#" + inputName + "::-webkit-input-placeholder {" + CSScolor + CSSopacity + "}";
        if (stylePlaceHolder.sheet.rules[comboBoxInputIndex]) {
            stylePlaceHolder.sheet.deleteRule(comboBoxInputIndex);
        }
        stylePlaceHolder.sheet.insertRule(CSS, comboBoxInputIndex);
        var html = "";
        $(stylePlaceHolder.sheet.rules).each(function (index, rule) {
            html = html + rule.cssText;
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
        var CSS = "#" + inputName + "::-webkit-search-cancel-button {" + CSSappearance + CSSheight + CSSwidth + CSSMaskImage + CSSbackgroundcolor + CSSbackgroundsize + "}";
        if (styleCancelButton.sheet.rules[comboBoxInputIndex]) {
            styleCancelButton.sheet.deleteRule(comboBoxInputIndex);
        }
        styleCancelButton.sheet.insertRule(CSS, comboBoxInputIndex);
        var html = "";
        $(styleCancelButton.sheet.rules).each(function (index, rule) {
            html = html + rule.cssText;
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
        $(comboBoxInput).css("background-color", defaultBackgroundColor);
        $(comboBoxCaretDown).css("background-color", defaultBackgroundColor);
        $(comboBoxCaretUp).css("background-color", defaultBackgroundColor);
        $(comboBoxList).css("background-color", defaultBackgroundColor);
        $(comboBoxInput).css("color", defaultTextColor);
        $(comboBoxCaretDown).css("fill", defaultTextColor);
        $(comboBoxCaretUp).css("fill", defaultTextColor);
        changeInputColor(defaultTextColor);
    };

    /**
     * Change the placeholder for the combobox input.
     * @param {string} text The text for the placeholder of the combobox input.
     */
    comboBox.changePlaceHolder = function (text) {
        $(comboBoxInput).attr("placeholder", text);
    };

    function changeValue(value) {
        comboBoxInput.oldValue = comboBoxInput.value;
        value = normalizeText(value);
        comboBoxInput.value = value;
        comboBoxInput.newValue = comboBoxInput.value;
        if (comboBoxInput.newValue !== comboBoxInput.oldValue) {
            $(comboBoxInput).trigger("change");
        }
        var index = searchOption();
        setSelectedOption(index);
    }

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

    return comboBox;
}