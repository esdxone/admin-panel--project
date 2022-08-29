import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ComfirmModal = ({target, method, setModal}) => {
    return (
        <Modal show={target} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title>Подтвердите действие</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите сохранить изменения?</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setModal(false)}>
            Закрыть
        </Button>
        <Button variant="primary" onClick={() => method()}>
            Сохранить
        </Button>
        </Modal.Footer>
    </Modal>
    )
}

export default ComfirmModal;