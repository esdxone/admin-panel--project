import '../../helpers/iframeLoader.js';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { domHelpers } from '../../helpers/domHelpers.js';


const AppEditor = () => {
    const [pageList, setPageList] = useState([]);
    const [pageName, setPageName] = useState("");
    const [currentPage, setCurrentpage] = useState("index.html");
    const [domStructure, setDomStructure] = useState("");
    const {parseToDOM, wrapTextNode, serializeDOMtoString, unwrapTextNodes} = domHelpers();
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
            .then(() => enableEditing())
            .then(() => injectStyle())
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

    const injectStyle = () => {
        const style = document.querySelector('iframe').contentDocument.createElement("style");
        style.innerHTML = `
            text-editor:hover {
                border: 3px solid skyblue;
                padding: 5px;
                display: block;
            }
            text-editor:focus {
                border: 3px solid skyblue;
                padding: 5px;
                display: block;
            }
        `;
        document.querySelector('iframe').contentDocument.head.appendChild(style);

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