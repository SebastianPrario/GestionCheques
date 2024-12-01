import { useContext, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Check, CheckContext } from '../../contexts/CheckContext';
import { AuthContext } from '../../contexts/AuthContext';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import { CustomModal } from '../CustomModal/CustomModal';
import { createOrderApi } from '../../services/apiService';
import { headerToken } from '../../librery/helpers';


interface EnterCheckProps {
  show: boolean;
  onClose: () => void;
  checkSelection : Check[];
}

interface otherPayment  {
  property: string;
  number: number
}

export const OrderPayment: React.FC<EnterCheckProps> = ( { show , onClose, checkSelection} ) => {
  const [inputsProperty, setInputsProperty] = useState(Array(3).fill(''));
  const [inputsNumber, setInputsNumber] = useState(Array(3).fill('-'));
  const sumCheckAmount =  checkSelection.reduce( (total , check) => total + Number(check.importe),0)
  const formatoMoneda  = (value : number) => {
    return value.toLocaleString('es-AR', { style:'currency', currency:'ARS'})}


  const { Formik } = formik;
  const authContext = useContext(AuthContext)
  const checkContext = useContext(CheckContext)
  const user = authContext && authContext.user

  const schema = yup.object().shape({
    destination: yup
    .string()
    .required('El destino del pago es obligatorio'),
    detail: yup
    .string(),
    importe: yup
    .number(),
  });
  
  const handleInputChangeProperty = (index : number , event:React.MouseEvent<HTMLButtonElement>) => 
    { const newInputs = [...inputsProperty]; 
      const target = event.target as HTMLInputElement;
      newInputs[index] = target.value; 
      setInputsProperty(newInputs); 
    }; 
    const handleInputChangeNumber = (index : number , event:React.MouseEvent<HTMLButtonElement> ) => 
      { const newInputs = [...inputsNumber];
        const target = event.target as HTMLInputElement;
        newInputs[index] = target.value; 
        setInputsNumber(newInputs); 
      };
  const handleSubmit = async ( values, { resetForm } )=>{
    const updatedState = []
    for (let i = 0; i < inputsProperty.length; i += 2)
      { if( inputsProperty[i]=='' || inputsNumber[i]=='-') console.log('no entra')
        else { updatedState.push({ property: inputsProperty[i], number: parseInt(inputsNumber[i]) })}
    }
    values.otherPayment = updatedState
    const headers = headerToken(user?.token)
    await createOrderApi('order', headers , values)
    resetForm();
    onClose()
  }

 
  return (
    <CustomModal show={show} onClose={onClose}>
        <Modal.Header closeButton
          onHide={onClose}>
          <Modal.Title>Egreso de cheques</Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
      initialValues={{
        totalAmount: sumCheckAmount,
        destination: '',
        detail: '',
        creationDate: '2024-04-04',
        chequesId : checkSelection.map( check => check.id),
        otherPayment: []
       
      }}
      
    >
      {({ handleSubmit, handleChange, values,  errors }) => (
       <Container fluid>
          <Form noValidate onSubmit={handleSubmit}>
          <Row>
            <Form.Group
              as={Col}
              md="12"
              controlId="validationFormik101"
              className="position-relative"
            >
              <Form.Label>Destino</Form.Label>
              <Form.Control
                type="string"
                name="destination"
                value={values.destination}
                onChange={handleChange}
                isInvalid={!!errors.destination}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.destination}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormik102"
              className="position-relative"
            >
            <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="string"
                name="detail"
                value={values.detail}
                onChange={handleChange}
                isInvalid={!!errors.detail}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.detail}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Col className='my-2'>Otros Pagos</Col>
          </Row>
          <Form.Group  as={Row}
              md="12"
              controlId="validationFormik102"
              className="position-relative">
                  <Col md={6}>
                   {inputsProperty.map((input, index) => 
                    ( 
                      <Form.Group controlId="formInput1">
                      <Form.Control
                      type="text"
                      value={input} 
                      placeholder={`detalle`} 
                      onChange={(event) => handleInputChangeProperty(index, event)}
                      ></Form.Control>
                    </Form.Group>
                    ))}
                  </Col>
                   <Col md={6}>
                   {inputsNumber.map((input, index) =>                     ( 
                    <Form.Group controlId="formInput1">
                    <Form.Control
                    type="number"
                    value={input} 
                    placeholder='importe' 
                    onChange={(event) => handleInputChangeNumber(index, event)}
                    ></Form.Control>
                    </Form.Group>
                    ))}
                  </Col>
            </Form.Group>
          <Row className="mb-3">
          <Row className='mt-4'>
            <Col> Importe total {formatoMoneda(sumCheckAmount)}</Col>
            <Col> Total Cheques  {checkSelection.length}</Col>
          </Row>      
           
          </Row>
          <div className='d-flex justify-content-center'>
          <Button className='col-4 ms-2'type="submit">Agregar</Button>
           </div>
           
        </Form>
        </Container>

      )}
      
    </Formik>
  
    
    </CustomModal>
  );
}

export default OrderPayment;