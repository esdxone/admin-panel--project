import React from "react";
export const TextEditor = (element, virtualElement) => {
    element.addEventListener("click", () => onClick());
    element.addEventListener("blur", () => onBlur());
    element.addEventListener("keypress", (e) => onKeyPress(e));
    element.addEventListener("input", () => onTextEdit());

    const onClick = () => {
        element.contentEditable = "true";
        element.focus();
    }

    const onBlur = () => {
        element.removeAttribute("contenteditable");
    }

    const onKeyPress = (e) => {
        if (e.keyCode === 13) {
            element.blur();
        }
    }

    const onTextEdit = () => {
        virtualElement.innerHTML = element.innerHTML;
    }
}
