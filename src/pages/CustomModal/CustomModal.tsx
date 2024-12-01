import React from 'react';
import Modal from 'react-bootstrap/Modal';

interface CustomModalProps {
  show: boolean;
  onClose: () => void
  children: React.ReactNode;
}


export function CustomModal({ children , show  }: CustomModalProps)  {
 
  return (
    <Modal
    //   {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show = {show}
    >
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
}