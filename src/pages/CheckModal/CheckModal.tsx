import { Container, Modal } from "react-bootstrap";
import { CustomModal } from "../CustomModal/CustomModal";
import { CheckData } from "../NavBar/NavBar";

interface CheckModalProps {
    show: boolean;
    onClose: () => void;
    data: CheckData | null
}

export default function CheckModal  ({ show , onClose , data }: CheckModalProps ) {
    console.log(data)
  return (
    <CustomModal show={show} onClose={onClose}>
       <Modal.Header closeButton
          onHide={onClose}>
          <Modal.Title>Datos Cheque</Modal.Title>
        </Modal.Header>
    <Container>
        <h2>Estado : {data?.estado}</h2>
        <h4>Numero: {data?.numero}</h4>
        <h4>Importe: {data?.importe}</h4>
        <h4>Cliente: {data?.cliente}</h4>
        <h4>Librador: {data?.librador}</h4>
        <h4>Fecha Emision: {data?.fechaEmision}</h4>
        <h4>Fecha Entrega: {data?.fechaEntrega}</h4>
        <h4>Banco: {data?.banco}</h4>
        {data?.order && 
        <div className="text-primary">
        <h4 >Este cheque se encuentra imputado en la orden Nro. {data?.order?.id}</h4>
        <h4>fue entregado a {data?.order?.destination} </h4>
        <h4>con fecha {data?.order?.creationDate.slice(0,10)} </h4>
        </div>
        }
    </Container>
    </CustomModal>
  )
}
