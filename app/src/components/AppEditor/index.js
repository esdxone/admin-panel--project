import axios from "axios";
import React, { useEffect, useState } from "react";


const AppEditor = () => {
    const [pageList, setPageList] = useState([]);
    const [pageName, setPageName] = useState("");

    useEffect(() => {
        loadPageList();
    },[pageList])

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

    const pages = pageList.map(page => {
        return (
            <h1 key={page}>
                {page}
                <a href="#"
                onClick={() => delePage(page)}>(x)</a>
            </h1>
        )
    })

    return(
        <>
            <input onChange={(e) => setPageName(e.target.value)} value={pageName} type="text" />
            <button onClick={createPage}>Создать страницу</button>
            {pages}
        </>
    )
}
export default AppEditor;