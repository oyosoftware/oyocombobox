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
    var defaultTextColor = "black";
    var previousInputValue = "";

    var comboBox = document.createElement("div");
    $(comboBox).addClass("oyocombobox");
    comboBox.backgroundColor = defaultBackgroundColor;
    comboBox.selectionColor = defaultSelectionColor;
    comboBox.textColor = defaultTextColor;

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
            var value = $(comboBoxInput).val();
            return value;
        },
        set: function (value) {
            changeValue(value);
        }
    });

    $(window).on("resize", function () {
        var display = $(comboBoxList).css("display");
        if (display === "none") {
            $(comboBoxList).css("display", "block");
        }
        resizeComboBox();
        $(comboBoxList).css("display", display);
    });

    function resizeComboBox() {
        var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
        var comboBoxOptionContents = $(".oyocomboboxoptioncontent", comboBox);
        var hiddenOptionTexts = $(comboBoxOptionTexts).filter(function() {
            return $(this).css("visibility") === "hidden";
        });

        $(comboBoxHeader).css("padding-left", "4px");
        if (comboBoxOptionContents.length === 0) {
            $(comboBoxHeader).css("padding-left", "0px");
        }

        if (comboBoxOptionTexts.length === hiddenOptionTexts.length) {
            $(comboBoxInput).css("max-width", "0px");
            $(comboBoxInput).css("padding", "0px");
            $(comboBoxInput).css("border-width", "0px");
            $(comboBoxInput).css("margin-left", "0px");
            $(comboBoxOptionTexts).css("display", "none");
        } else {
            if (Boolean(comboBoxWidth)) {
                $(comboBox).outerWidth(comboBoxWidth);
                var headerWidth = $(comboBoxHeader).width();
                var selectionBoxWidth = $(comboBoxSelectionBox).outerWidth(true);
                var caretWidth = $(comboBoxCaret).outerWidth(true);
                var width = headerWidth - selectionBoxWidth - caretWidth;
                $(comboBoxInput).outerWidth(width, true);
            }
        }

        if (Boolean(comboBoxHeight)) {
            $(comboBox).css("height", "auto");
            $(comboBoxList).css("height", "auto");
            var maxHeight = $(comboBox).outerHeight();
            if (comboBoxHeight > maxHeight) {
                var listHeight = maxHeight - $(comboBoxHeader).outerHeight();
            } else {
                var listHeight = comboBoxHeight - $(comboBoxHeader).outerHeight();
            }
            var difference = $(comboBoxList).offset().top + listHeight - window.height;
            if (difference > 0) {
                listHeight -= difference + 10;
            }
            var headerHeight = $(comboBoxHeader).outerHeight();
            $(comboBox).outerHeight(headerHeight);
            $(comboBoxList).outerHeight(listHeight);
        }
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
            $(".oyocombobox").each(function (index, element) {
                if ($(".oyocomboboxlist", element).css("display") === "block") {
                    $(".oyocomboboxlist", element).css("display", "none");
                    $(".oyocomboboxcaretdown", element).css("display", "inline");
                    $(".oyocomboboxcaretup", element).css("display", "none");
                    $(".oyocomboboxlist", element).trigger("visibilitychange");
                }
            });
        }
        event.stopImmediatePropagation();
    });

    $(comboBox).on("focusin", function () {
        $(".oyocombobox").not(comboBox).each(function (index, element) {
            if ($(".oyocomboboxlist", element).css("display") === "block") {
                $(".oyocomboboxlist", element).css("display", "none");
                $(".oyocomboboxcaretdown", element).css("display", "inline");
                $(".oyocomboboxcaretup", element).css("display", "none");
                $(".oyocomboboxlist", element).trigger("visibilitychange");
            }
        });
    });

    $(comboBoxCaret).on("click", function () {
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
        }
        $(comboBoxInput).focus();
        var selection = $(".oyoselection", comboBox);
        var scrollTop = comboBoxList.scrollTop;
        var scrollBottom = comboBoxList.scrollTop + $(comboBoxList).innerHeight() - 1;
        var top = comboBoxList.scrollTop + $(selection).position().top + $(selection).outerHeight() / 2;
        if (top < scrollTop || top > scrollBottom) {
            selection[0].scrollIntoView();
        }
    });

    $(comboBoxInput).on("search", function () {
        var inputValue = $(comboBoxInput).val();
        if (inputValue === "") {
            $(comboBoxInput).trigger("keyup");
        }
    });

    $(comboBoxInput).on("keydown", function (event) {
        var keys = [13, 27, 33, 34, 38, 40];
        if (keys.includes(event.which)) {
            event.preventDefault();
        }

        var keys = [33, 34, 38, 40];
        if (keys.includes(event.which)) {
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
            var optionsLength = comboBoxOptions.length;
            var scrollTop = comboBoxList.scrollTop;
            var scrollBottom = comboBoxList.scrollTop + $(comboBoxList).innerHeight() - 1;
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
                var optionsInViewLength = $(comboBoxOptions).filter(function () {
                    var top = scrollTop + $(this).position().top + $(this).outerHeight() / 2;
                    return top > scrollTop && top < scrollBottom;
                }).length;
                if (event.which === 33) {
                    index -= optionsInViewLength - 1;
                    if (index === (0) - (optionsInViewLength - 1)) {
                        index = optionsLength - 1;
                    } else {
                        if (index < 0) {
                            index = 0;
                        }
                    }
                }
                if (event.which === 34) {
                    index += optionsInViewLength - 1;
                    if (index === (optionsLength - 1) + (optionsInViewLength - 1)) {
                        index = 0;
                    } else {
                        if (index > optionsLength - 1) {
                            index = optionsLength - 1;
                        }
                    }
                }
            }

            if (!visible) {
                $(comboBoxList).css("display", "block");
                $(comboBoxList).trigger("visibilitychange");
                $(comboBoxCaretDown).css("display", "none");
                $(comboBoxCaretUp).css("display", "inline");
            }

            if (index !== undefined) {
                $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
                $(comboBoxOptionTexts).css("background-color", comboBox.backgroundColor);
                $(comboBoxOptions).eq(index).css("background-color", comboBox.selectionColor);
                $(comboBoxOptionTexts).eq(index).css("background-color", comboBox.selectionColor);
                $(comboBoxOptions).removeClass("oyoselection");
                $(comboBoxOptions).eq(index).addClass("oyoselection");
                var selection = $(".oyoselection", comboBox);
                var top = comboBoxList.scrollTop + $(selection).position().top + $(selection).outerHeight() / 2;
                if (top < scrollTop || top > scrollBottom) {
                    var keys = [33, 38];
                    if (keys.includes(event.which)) {
                        selection[0].scrollIntoView(true);
                    }
                    var keys = [34, 40];
                    if (keys.includes(event.which)) {
                        selection[0].scrollIntoView(false);
                    }
                }
            }
        }
    });

    $(comboBoxInput).on("keyup", function (event, value) {
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
        var optionsLength = comboBoxOptions.length;
        var index;

        if (event.key) {
            var isCharacter = (event.key.toUpperCase() === String.fromCharCode(event.keyCode));
        }

        var keys = [8, 46];
        if (isCharacter || keys.includes(event.which) || Boolean(value)) {
            var textLength = $(event.target).val().length;
            if (textLength > 0) {
                for (i = 0; i < optionsLength; i++) {
                    var inputString = $(event.target).val().toLowerCase();
                    var optionSubstring = comboBoxOptionTexts.eq(i).prop("value").substr(0, textLength).toLowerCase();
                    if (optionSubstring === inputString) {
                        index = i;
                        break;
                    }
                }
                var inputValue = $(comboBoxInput).val();
                if (inputValue !== previousInputValue) {
                    $(comboBoxInput).trigger("change");
                }
            } else {
                var selection = $(".oyoselection", comboBox);
                $(selection).removeClass("oyoselection");
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
            $(comboBoxList).css("display", "block");
            $(comboBoxList).trigger("visibilitychange");
            $(comboBoxCaretDown).css("display", "none");
            $(comboBoxCaretUp).css("display", "inline");
        }

        if (index === undefined) {
            $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
            $(comboBoxOptionTexts).css("background-color", comboBox.backgroundColor);
            $(comboBoxOptions).removeClass("oyoselection");
            $(comboBoxSelectionBox).html("");
            index = 0;
        }

        if (index !== undefined) {
            $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
            $(comboBoxOptionTexts).css("background-color", comboBox.backgroundColor);
            $(comboBoxOptions).eq(index).css("background-color", comboBox.selectionColor);
            $(comboBoxOptionTexts).eq(index).css("background-color", comboBox.selectionColor);
            $(comboBoxOptions).removeClass("oyoselection");
            $(comboBoxOptions).eq(index).addClass("oyoselection");

            var selection = $(".oyoselection", comboBox);
            if (selection.length > 0) {
                var scrollTop = comboBoxList.scrollTop;
                var scrollBottom = comboBoxList.scrollTop + $(comboBoxList).innerHeight() - 1;
                var top = comboBoxList.scrollTop + $(selection).position().top + $(selection).outerHeight() / 2;
                if (top < scrollTop || top > scrollBottom) {
                    selection[0].scrollIntoView();
                }
            }

            if (event.which === 13 || Boolean(value)) {
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

    $(comboBoxInput).on("change", function (event) {
        var inputValue = $(comboBoxInput).val();
        if (inputValue !== previousInputValue) {
            event.inputValue = inputValue;
            event.previousInputValue = previousInputValue;
            previousInputValue = inputValue;
        } else {
            event.stopImmediatePropagation();
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
        var visible = $(event.target).css("display") !== "none";
        event.visibility = visible;
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
        var inputString = $(comboBoxInput).val().toLowerCase();
        var index = $(comboBoxOptions).filter(function () {
            return $(this).text().toLowerCase().indexOf(inputString) === 0;
        }).eq(0).index();
        if (index === undefined) {
            index = 0;
        }
        $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
        $(comboBoxOptionTexts).css("background-color", comboBox.backgroundColor);
        $(comboBoxOptions).eq(index).css("background-color", comboBox.selectionColor);
        $(comboBoxOptionTexts).eq(index).css("background-color", comboBox.selectionColor);
        $(comboBoxOptions).removeClass("oyoselection");
        $(comboBoxOptions).eq(index).addClass("oyoselection");
    });

    function normalizeText(text) {
        if (typeof text === "object") {
            text = null;
        } else {
            text = text.toString();
        }
        return text;
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
                var selectionWidth = $(comboBoxSelectionBox).width();
                if (optionContentWidth > selectionWidth) {
                    $(comboBoxSelectionBox).width(optionContentWidth);
                }

                var optionContentHeight = $(comboBoxOptionContent).outerHeight(true);
                var selectionHeight = $(comboBoxSelectionBox).height();
                if (optionContentHeight > selectionHeight) {
                    $(comboBoxSelectionBox).height(optionContentHeight);
                }

                var headerHeight = $(comboBoxHeader).height();
                var inputHeight = $(comboBoxInput).outerHeight(true);

                var height = optionContentHeight;
                if (inputHeight > height) {
                    height = inputHeight;
                }

                if (height > headerHeight) {
                    $(comboBoxHeader).height(height / 0.999);
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
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
            $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
            $(comboBoxOptionTexts).css("background-color", comboBox.backgroundColor);
            $(comboBoxOption).css("background-color", comboBox.selectionColor);
            $(comboBoxOptionText).css("background-color", comboBox.selectionColor);
            $(comboBoxOptions).removeClass("oyoselection");
            $(comboBoxOption).addClass("oyoselection");
            $(comboBoxInput).val($(comboBoxOptionText).prop("value"));
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
            $(comboBoxInput).focus();
            var inputValue = $(comboBoxInput).val();
            if (inputValue !== previousInputValue) {
                $(comboBoxInput).trigger("change");
            }
            $(comboBoxOption).trigger("optionselect");
        });

        $(comboBoxOption).on("mousemove", function (event) {
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
            var index = $(event.currentTarget).index();
            $(comboBoxOptions).css("background-color", comboBox.backgroundColor);
            $(comboBoxOptionTexts).css("background-color", comboBox.backgroundColor);
            $(comboBoxOptions).eq(index).css("background-color", comboBox.selectionColor);
            $(comboBoxOptionTexts).eq(index).css("background-color", comboBox.selectionColor);
            $(comboBoxOptions).removeClass("oyoselection");
            $(comboBoxOptions).eq(index).addClass("oyoselection");
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
     * Change the background color and the selection color for the combobox.
     * @param {string} backgroundColor The background color of the combobox.
     * @param {string} selectionColor The color of the selected option.
     */
    comboBox.changeColors = function (backgroundColor = comboBox.backgroundColor, selectionColor = comboBox.selectionColor, textColor = comboBox.textColor) {
        comboBox.changeBackgroundColor(backgroundColor);
        comboBox.changeSelectionColor(selectionColor);
        comboBox.changeTextColor(textColor);
    };

    /**
     * Change the background color for the combobox.
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
     * Change the selection color for the combobox.
     * @param {string} color The selection color of the combobox.
     */
    comboBox.changeSelectionColor = function (color) {
        comboBox.selectionColor = color;
    };

    /**
     * Change the text color for the combobox.
     * @param {string} color The text color of the combobox.
     */
    comboBox.changeTextColor = function (color) {
        comboBox.textColor = color;
        $(comboBoxInput).css("color", color);
        changeInputColor(color);
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
     * Reset the colors for the combobox.
     */
    comboBox.resetColors = function () {
        comboBox.backgroundColor = defaultBackgroundColor;
        $(comboBoxHeader).css("background-color", comboBox.backgroundColor);
        $(comboBoxInput).css("background-color", comboBox.backgroundColor);
        $(comboBoxCaretDown).css("background-color", comboBox.backgroundColor);
        $(comboBoxCaretUp).css("background-color", comboBox.backgroundColor);
        $(comboBoxList).css("background-color", comboBox.backgroundColor);
        comboBox.selectionColor = defaultSelectionColor;
        comboBox.textColor = defaultTextColor;
        $(comboBoxInput).css("color", comboBox.textColor);
        changeInputColor(comboBox.textColor);
    };

    /**
     * Change the placeholder for the combobox input.
     * @param {string} text The text for the placeholder of the combobox input.
     */
    comboBox.changePlaceHolder = function (text) {
        $(comboBoxInput).attr("placeholder", text);
    };

    /**
     * Change the initial text for the combobox input and scroll to its option.
     * @param {string} value The initial text of the combobox input.
     */
    function changeValue(value) {
        value = normalizeText(value);
        $(comboBoxInput).val(value);
        $(comboBoxInput).trigger("keyup", value);
    }

    function htmlUnescape(str) {
        return str
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    changeInputColor(comboBox.textColor);

    return comboBox;
}