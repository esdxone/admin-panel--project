import React from "react";
export const TextEditor = (element, virtualElement) => {
    element.addEventListener("click", () => onClick());
    element.addEventListener("blur", () => onBlur());
    element.addEventListener("keypress", (e) => onKeyPress(e));
    element.addEventListener("input", () => onTextEdit());
    if (element.parentNode.nodeName === "A" || element.parentNode.nodeName === "BUTTON") {
        element.addEventListener("contextmenu", (e) => onCtxMenu(e));
    }

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

    const onCtxMenu = (e) => {
        e.preventDefault();
        onClick();
    }

    const onTextEdit = () => {
        virtualElement.innerHTML = element.innerHTML;
    }
}
