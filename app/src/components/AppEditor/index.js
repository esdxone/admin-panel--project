import '../../helpers/iframeLoader.js';
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { domHelpers } from '../../helpers/domHelpers.js';
import { TextEditor } from '../TextEditor/index.js';
import LoadingSpinner from '../Spinner/index.js'


const AppEditor = () => {
    const [pageList, setPageList] = useState([]);
    const [pageName, setPageName] = useState("");
    const [currentPage, setCurrentpage] = useState("index.html");
    const [domStructure, setDomStructure] = useState("");
    const [showModal, setshowModal] = useState(false);
    const [success, setSuccsess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
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
                return dom})
            .then(serializeDOMtoString)
            .then(html => axios.post("./api/saveTemplatePage.php", {html}))
            .then(() => frame.load('../temp.html'))
            .then(() => enableEditing())
            .then(() => injectStyle())
            .then(setLoading(false))
    }


    const loadPageList = () => {
        axios
            .get("./api")
            .then(res => setPageList(res.data))
    }

    const enableEditing = () => {
        const mutationDOM = virtualDom;
        document.querySelector('iframe').contentDocument.body.querySelectorAll("text-editor").forEach(element => {
            const id = element.getAttribute("node-id"),
            virtualElement = mutationDOM.body.querySelector(`[node-id="${id}"]`);
            TextEditor(element, virtualElement);
        })
        setDomStructure(mutationDOM);
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



    const savePage = (onSuccess, onError) => {
        setLoading(true);
        const newDom = domStructure.cloneNode(domStructure);
        unwrapTextNodes(newDom);
        const html = serializeDOMtoString(newDom);
        axios
            .post("./api/savePage.php", {pageName: currentPage, html})
            .then(setshowModal(false))
            .then(onSuccess)
            .catch(onError)
            .then(setLoading(false))
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

    return(
        <>
        <LoadingSpinner active={loading}/>
        <div className="panel">
            <button className='save-button' onClick={() => setshowModal(true)}>Опубликовать</button>
        </div>

        <iframe src={currentPage} frameBorder="0"></iframe>

      <Modal show={showModal} onHide={() => setshowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтвердите действие</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите сохранить изменения?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setshowModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={() => savePage(() => setSuccess(true), () => setError(true))}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      <Alert show={success} variant="danger" onClose={() => setSuccess(false)} dismissible>
        <Alert.Heading>Упс, что-то пошло не так!</Alert.Heading>
        <p>
          Обновите страницу и попробуйте еще раз
        </p>
      </Alert>

        <Alert show={error} variant="success" onClose={() => setError(false)} dismissible>
            <Alert.Heading>Страница успешно опубликована</Alert.Heading>
        </Alert>

        </>

        // <>
        //     <input onChange={(e) => setPageName(e.target.value)} value={pageName} type="text" />
        //     <button onClick={createPage}>Создать страницу</button>
        //     {pages}
        // </>
    )
}
export default AppEditor;