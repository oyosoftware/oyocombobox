/*
    oyocombobox.js 1.0
    tested with jQuery 3.4.0
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
function oyoComboBox(comboBoxWidth, comboBoxHeight) {

    var defaultBackgroundColor = "white";
    var defaultSelectionColor = "lightgray";
    var previousInputValue = "";

    var comboBox = document.createElement("div");
    $(comboBox).addClass("oyocombobox");
    var index = ($(".oyocombobox").length) + 1;

    var comboBoxHeader = document.createElement("div");
    $(comboBoxHeader).addClass("oyocomboboxheader");
    $(comboBoxHeader).css("border", "1px solid black");
    $(comboBoxHeader).css("background-color", defaultBackgroundColor);
    $(comboBoxHeader).css("padding", "4px");
    $(comboBoxHeader).css("white-space", "nowrap");
    $(comboBox).append(comboBoxHeader);

    var comboBoxInput = document.createElement("input");
    $(comboBoxInput).addClass("oyocomboboxinput");
    $(comboBoxInput).css("background-color", defaultBackgroundColor);
    $(comboBoxInput).css("margin", "4px");
    $(comboBoxInput).css("font", "inherit");
    $(comboBoxInput).css("display", "inline-block");
    $(comboBoxInput).css("vertical-align", "middle");
    $(comboBoxInput).css("position", "relative");
    $(comboBoxHeader).append(comboBoxInput);

    var comboBoxCaret = document.createElement("div");
    $(comboBoxCaret).addClass("oyocomboboxcaret");
    $(comboBoxCaret).css("display", "inline-block");
    $(comboBoxCaret).css("vertical-align", "middle");
    $(comboBoxCaret).css("position", "relative");
    $(comboBoxHeader).append(comboBoxCaret);

    var comboBoxCaretDown = createCaret("down");
    var comboBoxCaretUp = createCaret("up");
    $(comboBoxCaret).html(comboBoxCaretDown);

    var comboBoxSelectionBox = document.createElement("div");
    $(comboBoxSelectionBox).addClass("oyocomboboxselectionbox");
    $(comboBoxSelectionBox).css("padding-left", "4px");
    $(comboBoxSelectionBox).css("display", "inline-block");
    $(comboBoxSelectionBox).css("vertical-align", "middle");
    $(comboBoxSelectionBox).css("overflow", "hidden");
    $(comboBoxSelectionBox).css("position", "relative");
    $(comboBoxHeader).prepend(comboBoxSelectionBox);

    var comboBoxList = document.createElement("div");
    $(comboBoxList).addClass("oyocomboboxlist");
    $(comboBoxList).css("border", "1px solid black");
    $(comboBoxList).css("border-top", "none");
    $(comboBoxList).css("padding", "2.5px 4px");
    $(comboBoxList).css("display", "none");
    $(comboBoxList).css("position", "relative");
    $(comboBoxList).css("overflow", "auto");
    $(comboBoxList).css("background-color", defaultBackgroundColor);
    $(comboBox).append(comboBoxList);

    Object.defineProperty(comboBox, "options", {
        get: function () {
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            return comboBoxOptions;
        }
    });

    function resizeComboBox() {
        if (Boolean(comboBoxWidth)) {
            $(comboBox).outerWidth(comboBoxWidth);
            var headerWidth = $(comboBoxHeader).width();
            var selectionBoxWidth = $(comboBoxSelectionBox).outerWidth(true);
            var caretWidth = $(comboBoxCaret).outerWidth(true);
            var width = headerWidth - selectionBoxWidth - caretWidth;
            $(comboBoxInput).outerWidth(width, true);
        }

        if (Boolean(comboBoxHeight)) {
            $(comboBox).css("height", "auto");
            var maxHeight = $(comboBox).outerHeight();
            if (comboBoxHeight > maxHeight) {
                $(comboBox).outerHeight(maxHeight);
            } else {
                $(comboBox).outerHeight(comboBoxHeight);
                var height = comboBoxHeight - $(comboBoxHeader).outerHeight();
                $(comboBoxList).outerHeight(height);
            }
        }
    }

    $(comboBox).on("focusout", function () {
        oyoComboBox.focusindex = index;
        oyoComboBox.box = comboBox;
        oyoComboBox.caret = comboBoxCaret;
        oyoComboBox.caretDown = comboBoxCaretDown;
        oyoComboBox.list = comboBoxList;
    });

    $(comboBox).on("focusin", function () {
        if (oyoComboBox.focusindex === undefined) {
            oyoComboBox.focusoutindex = index;
        }
        if (index !== oyoComboBox.focusindex) {
            $(oyoComboBox.list).trigger("switchbefore");
            $(oyoComboBox.caret).html(oyoComboBox.caretDown);
            $(oyoComboBox.list).css("display", "none");
            $(oyoComboBox.list).trigger("visibilitychange");
            $(oyoComboBox.list).trigger("switchafter");
        }
    });

    $(comboBoxCaret).on("click", function() {
        if ($(comboBoxList).css("display") === "block") {
            $(comboBoxList).css("display", "none");
            $(comboBoxCaret).html(comboBoxCaretDown);
        } else {
            if (oyoComboBox.focusindex === undefined) {
                oyoComboBox.focusindex = index;
            }
            if (index !== oyoComboBox.focusindex) {
                $(comboBoxList).trigger("switchbefore");
            }
            $(comboBoxList).css("display", "block");
            if (index !== oyoComboBox.focusindex) {
                $(comboBoxList).trigger("switchafter");
            }
            $(comboBoxCaret).html(comboBoxCaretUp);
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
            var selection = $(".oyoselection", comboBox);
            var length = $(selection).length;
            if (length === 0) {
                $(comboBoxOptions).eq(0).css("background-color", defaultSelectionColor);
                $(comboBoxOptions).eq(0).addClass("oyoselection");
                $(comboBoxOptionTexts).eq(0).css("background-color", defaultSelectionColor);
            }
        }
        $(comboBoxList).trigger("visibilitychange");
        $(comboBoxInput).focus();
    });

    $(comboBoxInput).on("keydown", function (event) {
        var keys = [38, 40];
        if (keys.includes(event.which)) {
            event.preventDefault();
        }
    });

    $(comboBoxInput).on("keyup", function (event, text) {
        var comboBoxOptions = $(".oyocomboboxoption", comboBox);
        var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
        var optionsLength = comboBoxOptions.length;
        var index;

        if (!Boolean(text)) {
            var isCharacter = (event.key.toUpperCase() === String.fromCharCode(event.keyCode));
        } else {
            var isCharacter = true;
        }
        var keys = [8, 46];

        if (isCharacter || keys.includes(event.which)) {
            var textLength = $(event.target).val().length;
            if (textLength > 0) {
                for (i = 0; i < optionsLength; i++) {
                    var inputString = $(event.target).val().toLowerCase();
                    var optionSubstring = comboBoxOptionTexts.eq(i).prop("text").substr(0, textLength).toLowerCase();
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

        if (visible) {
            if (index === undefined) {
                if (event.which === 38) {
                    index = optionsLength;
                }
                if (event.which === 40) {
                    index = -1;
                }
            }
            if (event.which === 38) {
                if (index !== 0) {
                    index -= 1;
                } else {
                    index = optionsLength - 1;
                }
            }
            if (event.which === 40) {
                if (index !== optionsLength - 1) {
                    index += 1;
                } else {
                    index = 0;
                }
            }
        }

        var keys = [38, 40];
        if (!visible && (isCharacter || keys.includes(event.which))) {
            $(comboBoxList).css("display", "block");
            $(comboBoxList).trigger("visibilitychange");
            $(comboBoxCaret).html(comboBoxCaretUp);
        }

        if (index === undefined) {
            $(comboBoxOptions).css("background-color", defaultBackgroundColor);
            $(comboBoxOptionTexts).css("background-color", defaultBackgroundColor);
            $(comboBoxOptions).removeClass("oyoselection");
            $(comboBoxSelectionBox).html("");
        }

        if (index !== undefined) {
            $(comboBoxOptions).css("background-color", defaultBackgroundColor);
            $(comboBoxOptionTexts).css("background-color", defaultBackgroundColor);
            $(comboBoxOptions).eq(index).css("background-color", defaultSelectionColor);
            $(comboBoxOptionTexts).eq(index).css("background-color", defaultSelectionColor);
            $(comboBoxOptions).removeClass("oyoselection");
            $(comboBoxOptions).eq(index).addClass("oyoselection");

            var selection = $(".oyoselection", comboBox);
            var scrollTop = comboBoxList.scrollTop;
            var scrollBottom = comboBoxList.scrollTop + $(comboBoxList).innerHeight() - 1;
            var top = comboBoxList.scrollTop + $(selection).position().top + $(selection).outerHeight() / 1;
            if (top < scrollTop) {
                comboBoxOptions[index].scrollIntoView();
            } else {
                if (top > scrollBottom) {
                    comboBoxOptions[index].scrollIntoView();
                }
            }

            if (event.which === 13 || Boolean(text)) {
                $(comboBoxInput).val($(comboBoxOptions).eq(index).prop("text"));
                $(comboBoxOptions).eq(index).trigger("click");
                $(comboBoxCaret).html(comboBoxCaretDown);
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

    $(comboBox.options).on("select", function (event) {
        var selection = $(".oyoselection", comboBox);
        event.selection = selection;
    });

    $(comboBoxList).on("visibilitychange", function (event) {
        var visible = $(event.target).css("display") !== "none";
        event.visibility = visible;
    });

    $(comboBoxList).on("switchbefore", function (event) {
        var visible = $(event.target).css("display") !== "none";
        event.visibility = visible;
    });

    $(comboBoxList).on("switchafter", function (event) {
        var visible = $(event.target).css("display") !== "none";
        event.visibility = visible;
    });

    function normalizeText(text) {
        try {
            if (typeof text === "object") {
                text = null;
            } else {
                normalizedText = $(text).text();
                if (normalizedText !== "") {
                    text = normalizedText;
                }
            }
        } catch (error) {
        }
        return text;
    }

    /**
     * Add an option for the combobox.
     * @param {string} text The text in the option that can be selected for the combobox input.
     * @param {string, object (optional)} content The extra (visual) content is prepended in the option.
     */
    comboBox.addOption = function (text, content) {
        var comboBoxOption = document.createElement("div");
        $(comboBoxOption).addClass("oyocomboboxoption");
        $(comboBoxOption).css("padding-left", "4px");
        $(comboBoxOption).css("white-space", "nowrap");
        $(comboBoxOption).css("position", "relative");
        $(comboBoxOption).css("cursor", "pointer");
        $(comboBoxList).append(comboBoxOption);

        text = normalizeText(text);

        var comboBoxOptionText = document.createElement("div");
        $(comboBoxOptionText).addClass("oyocomboboxoptiontext");
        $(comboBoxOptionText).css("display", "inline-block");
        $(comboBoxOptionText).css("vertical-align", "middle");
        $(comboBoxOptionText).html(text);
        $(comboBoxOptionText).prop("text", text);
        $(comboBoxOptionText).css("position", "relative");
        $(comboBoxOptionText).css("background-color", defaultBackgroundColor);
        $(comboBoxOption).append(comboBoxOptionText);

        if (Boolean(content)) {
            $(comboBoxOptionText).css("margin-left", "8px");

            var comboBoxOptionContent = $(content).clone();
            $(comboBoxOptionContent).addClass("oyocomboboxoptioncontent");
            $(comboBoxOptionContent).find("input").add(comboBoxOptionContent).attr("tabindex", -1);
            $(comboBoxOptionContent).css("display", "inline-block");
            $(comboBoxOptionContent).css("vertical-align", "middle");
            $(comboBoxOptionContent).css("white-space", "nowrap");
            $(comboBoxOptionContent).css("position", "relative");
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
                    $(comboBoxHeader).height(height/0.999);
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

        $(comboBoxOption).on("click", function () {
            var comboBoxOptions = $(".oyocomboboxoption", comboBox);
            var comboBoxOptionTexts = $(".oyocomboboxoptiontext", comboBox);
            $(comboBoxOptions).css("background-color", defaultBackgroundColor);
            $(comboBoxOptionTexts).css("background-color", defaultBackgroundColor);
            $(comboBoxOption).css("background-color", defaultSelectionColor);
            $(comboBoxOptionText).css("background-color", defaultSelectionColor);
            $(comboBoxOptions).removeClass("oyoselection");
            $(comboBoxOption).addClass("oyoselection");
            $(comboBoxInput).val($(comboBoxOptionText).prop("text"));
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
            $(comboBoxCaret).html(comboBoxCaretDown);
            $(comboBoxInput).focus();
            var inputValue = $(comboBoxInput).val();
            if (inputValue !== previousInputValue) {
                $(comboBoxInput).trigger("change");
            }
            $(comboBoxOption).trigger("select");
        });
    };

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
        $(caret).css("background-color", defaultBackgroundColor);
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
    comboBox.changeColors = function (backgroundColor, selectionColor) {
        defaultBackgroundColor = backgroundColor;
        defaultSelectionColor = selectionColor;
        $(comboBoxHeader).css("background-color", defaultBackgroundColor);
        $(comboBoxInput).css("background-color", defaultBackgroundColor);
        $(comboBoxCaretDown).css("background-color", defaultBackgroundColor);
        $(comboBoxCaretUp).css("background-color", defaultBackgroundColor);
        $(comboBoxList).css("background-color", defaultBackgroundColor);
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
     * @param {string} text The initial text of the combobox input.
     */
    comboBox.changeText = function (text) {
        text = normalizeText(text);
        $(comboBoxInput).val(text);
        $(comboBoxInput).trigger("keyup", text);
    };

    return comboBox;
}