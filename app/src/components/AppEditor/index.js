import '../../helpers/iframeLoader.js';
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";


const AppEditor = () => {
    const [pageList, setPageList] = useState([]);
    const [pageName, setPageName] = useState("");
    const [currentPage, setCurrentpage] = useState("index.html");

    useEffect(() => {
       onInit(currentPage);
    },[])

    const onInit = (page) => {
        openPage(page);
        loadPageList();
    }

    const openPage = (page) => {
        setCurrentpage(`../${page}`);
        document.querySelector('iframe').load(currentPage, () => {
            const body = document.querySelector('iframe').contentDocument.body;
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

            textNodes.forEach(node => {
                const editWrapper =  document.querySelector('iframe').contentDocument.createElement('text-editor');

                node.parentNode.replaceChild(editWrapper, node);
                editWrapper.appendChild(node);
                editWrapper.contentEditable = "true";
            })
        })
    }

    const loadPageList = () => {
        axios
            .get("./api")
            .then(res => setPageList(res.data))
    }

    const createPage = () => {
        axios
        .post("./api/createNewPage.php", {"name": pageName })
        .then(res => console.log(res))
        .catch(() => alert("Страница уже существует!"));
    }

    const delePage = (page) => {
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
        <iframe src={currentPage} frameBorder="0"></iframe>
        // <>
        //     <input onChange={(e) => setPageName(e.target.value)} value={pageName} type="text" />
        //     <button onClick={createPage}>Создать страницу</button>
        //     {pages}
        // </>
    )
}
export default AppEditor;