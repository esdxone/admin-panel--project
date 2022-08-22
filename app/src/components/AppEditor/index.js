import '../../helpers/iframeLoader.js';
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";


const AppEditor = () => {
    const [pageList, setPageList] = useState([]);
    const [pageName, setPageName] = useState("");
    const [currentPage, setCurrentpage] = useState("index.html");
    const [domStructure, setDomStructure] = useState("");
    let virtualDom;

    useEffect(() => {
       onInit(currentPage);
    },[])

    const onInit = (page) => {
        openPage(page);
        loadPageList();
    }

    const openPage = (page) => {
        const frame = document.querySelector('iframe');
        setCurrentpage(page);
        axios
            .get(`../${currentPage}`)
            .then(res => parseToDOM(res.data))
            .then(wrapTextNode)
            .then ((dom) => {
                virtualDom = dom;
                setDomStructure(dom);
                return dom})
            .then(serializeDOMtoString)
            .then(html => axios.post("./api/saveTemplatePage.php", {html}))
            .then(() => frame.load('../temp.html'))
            .then (() => enableEditing())
    }

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

    const loadPageList = () => {
        axios
            .get("./api")
            .then(res => setPageList(res.data))
    }

    const enableEditing = () => {
        document.querySelector('iframe').contentDocument.body.querySelectorAll("text-editor").forEach(item => {
            item.contentEditable = "true";
            item.addEventListener("input", () => {
                onTextEdit(item);
            })
        })

        console.log(virtualDom)
    }

    const unwrapTextNodes = (dom) => {
        dom.body.querySelectorAll("text-editor").forEach(element => {
            element.parentNode.replaceChild(element.firstChild, element);
        })
    }
    const onTextEdit = (element) => {
        const id = element.getAttribute("node-id");
        const vDom = virtualDom;
        vDom.body.querySelector(`[node-id="${id}"]`).innerHTML = element.innerHTML;
        setDomStructure(vDom);
    }

    const savePage = () => {
        console.log(domStructure)
        const newDom = domStructure.cloneNode(domStructure);
        unwrapTextNodes(newDom);
        const html = serializeDOMtoString(newDom);
        axios
            .post("./api/savePage.php", {pageName: currentPage, html})
            .then(res => console.log(res));
    }

    const createPage = () => {
        axios
        .post("./api/createNewPage.php", {"name": pageName })
        .then(res => console.log(res))
        .catch(() => alert("Страница уже существует!"));
    }

    const deletePage = (page) => {
       axios
        .post("./api/deletePage.php", {"name": page})
        .then(res => console.log(res))
        .catch(() => alert("Такой страницы не существует!"))
    }


    // const pages = pageList.map(page => {
    //     return (
    //         <h1 key={page}>
    //             {page}
    //             <a href="#"
    //             onClick={() => delePage(page)}>(x)</a>
    //         </h1>
    //     )
    // })
    return(
        <>
        <button onClick={() => savePage()}>1sdfsa</button>
        <iframe src={currentPage} frameBorder="0"></iframe>

        </>

        // <>
        //     <input onChange={(e) => setPageName(e.target.value)} value={pageName} type="text" />
        //     <button onClick={createPage}>Создать страницу</button>
        //     {pages}
        // </>
    )
}
export default AppEditor;