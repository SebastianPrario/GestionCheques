import { useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'

export default function ReportByClient({ inputValue, handleInputValue  ,type}: any) {
  
return (
     <>
                                        <Row className="d-flex mt-2">
                                            <Col className="col-12">
                                                <Form.Label
                                                    htmlFor={`input-${type}`}
                                                >
                                                   
                                                </Form.Label>
                                                <Form.Control
                                                    className="col-6"
                                                    as="textarea"
                                                    name="text"
                                                    aria-describedby={`detailsHelpBlock-${type}`}
                                                    value={inputValue.text}
                                                    onChange={(e) =>
                                                        handleInputValue(e)
                                                    }
                                                />
                                            </Col>
                                           
                                        </Row>
                                    </>
  )
}
