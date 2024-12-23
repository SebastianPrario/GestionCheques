import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from '../../../contexts/AuthContext';
import { Check, Order } from '../../../contexts/CheckContext';
import { headerToken } from '../../../librery/helpers';
import { getApiData } from '../../../services/apiService';
import './PdfDown.css';


interface cheque {
  id: number,
  numero: number,
  importe: string,
  cliente: string,
  librador: string,
  proveedor: string
}
interface OrderDetail {
  id: number;
  destination: string;
  totalAmount: string;
  detail: string;
  creationDate: string;
  delete: boolean;
  user: string;
  cheque: [Check]
}

interface reactProps {
  id: number | undefined
  token : string | undefined
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderBottom: '1px solid #ccc',
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    height: 30, // Establecer una altura fija para todos los renglones
  },
  tableRow2: {
    margin: 'auto',
    flexDirection: 'column',
  },
  tableRow4: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    width: '100px,'
  },
  tableCell2: {
    margin: 'auto',
    marginTop: 5,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    width: '20px,',
    
  },
  tableCell3: {
    margin: 'auto',
    marginTop: 5,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    width: '200px,',
   
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  
  },
  otherPayment: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  
  },
});

export const OrderPDF = (data : any) => {
  const {data: datos } =  data 
  return (
    data ? (
      <Document style={styles.page}>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Orden de Pago</Text>
            <Text>Destino: {datos?.destination}</Text>
            <Text>Detalle: {datos?.detail}</Text>
            <Text>Fecha: {datos?.creationDate}</Text>
          
            <Text style={styles.totalAmount}>Importe Total: $ {datos?.totalAmount}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Cheques Utilizados</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell2}>#</Text>
                <Text style={styles.tableCell}>Número</Text>
                <Text style={styles.tableCell}>Importe</Text>
                <Text style={styles.tableCell}>Cliente</Text>
                <Text style={styles.tableCell}>Librador</Text>
                <Text style={styles.tableCell}>Proveedor</Text>
              </View>
              {datos?.cheque.map((elem: cheque, index: number) => {
                return (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell2}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{elem.numero}</Text>
                    <Text style={styles.tableCell}>{elem.importe}</Text>
                    <Text style={styles.tableCell}>{elem.cliente}</Text>
                    <Text style={styles.tableCell}>{elem.librador}</Text>
                    <Text style={styles.tableCell}>{elem.proveedor}</Text>
                  </View>
                )
              })}
            </View>
          </View> <Text style={styles.otherPayment}>  Otros Pagos  </Text>
          {datos?.otherPayment?.map((elem: any, index: number) => {
                return (
                  <View style={styles.tableRow4} key={index}>
                      <Text style={styles.tableCell3}>{elem.property}</Text>
                      <Text style={styles.tableCell3}>${elem.number}</Text>
                   </View>
                )
              })}
        </Page>
      </Document>
    ) : <>cargando...</>
  )
}


const PdfOrder : React.FC <reactProps>= ({id , token}) => {
 
  const [ dataOrder , setDataOrder ] = useState< OrderDetail | null >(null)
  useEffect(() => {
    if (!dataOrder) {if (id && token)  getOrder (id , token)}
  }, [])

  const getOrder = async (id : number , token : any) => {
    try {
      const headers = token && headerToken(token) 
      const response = headers &&  await  getApiData( `order/${id}`,  headers );
      response && setDataOrder(response.data)
     }catch (error) {console.log(error)}
   }
  console.log(dataOrder)

  return (
    <div className='pdf-container'>
      <PDFViewer style={{width: '100%', height: '100vh'}}>
          <OrderPDF data={dataOrder} />
      </PDFViewer>
    </div>
)};

export default PdfOrder;
