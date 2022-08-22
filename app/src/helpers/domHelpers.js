import React from "react";

export const domHelpers = () => {
    const parseToDOM = (str) => {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    }

    const wrapTextNode = (dom) => {
        const body = dom.body;
            let textNodes = [];
            function recNodes(element) {
              element.childNodes.forEach(node => {
                    if (node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0) {
                        textNodes.push(node);
                    } else {
                        recNodes(node);
                    }
                })
            }
        recNodes(body)

        textNodes.forEach((node, i) => {
            const editWrapper =  document.querySelector('iframe').contentDocument.createElement('text-editor');
            node.parentNode.replaceChild(editWrapper, node);
            editWrapper.appendChild(node);
            editWrapper.setAttribute("node-id", i);
            // editWrapper.contentEditable = "true";
        })

        return dom;
    }

    const serializeDOMtoString = (dom) => {
        const serialize = new XMLSerializer();
        return serialize.serializeToString(dom);
    }

    const unwrapTextNodes = (dom) => {
        dom.body.querySelectorAll("text-editor").forEach(element => {
            element.parentNode.replaceChild(element.firstChild, element);
        })
    }
    return {parseToDOM, wrapTextNode, serializeDOMtoString, unwrapTextNodes}
}
