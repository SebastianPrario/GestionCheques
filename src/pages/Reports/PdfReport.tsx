import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
} from '@react-pdf/renderer'
import { formatCurrency } from '../../librery/helpers'
import { Check } from '../../contexts/CheckContext'


interface PdfReportProps {
    data : Check[]
    reportOptions : string
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
    header2: {
        fontSize: 15,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text: {
        fontSize: 15,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'left',
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
        height: 30,
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
        marginTop: 0,
        textAlign: 'right',
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        width: '100px',
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
        width: '20px',
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
        width: '200px',
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
})

export const OrderPDF: React.FC<PdfReportProps> = ({data , reportOptions  }) => {
    console.log(reportOptions)
   
    const sumaCheques = data?.reduce(
        (acc, curr) => acc + Number(curr.importe),
        0
    )
    return data ? (
        <Document style={styles.page}>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.header}>Listado de Cheques</Text>
                    <Text style={styles.header2}>
                      { reportOptions }
                    </Text>
                    <Text style={styles.text}></Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.header2}>Monto Cheques en cartera:  {formatCurrency(sumaCheques)}</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell2}>#</Text>
                            <Text style={styles.tableCell}>Número</Text>
                            <Text style={styles.tableCell}>Importe</Text>
                            <Text style={styles.tableCell}>Librador</Text>
                            <Text style={styles.tableCell}>Fecha</Text>
                        </View>
                        {data.map((elem: Check , index: number) => {
                            return (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell2}>
                                        {index + 1}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {elem.numero}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {formatCurrency(Number(elem.importe))}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {elem.librador}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {new Date(
                                            elem.fechaEmision
                                        ).toLocaleDateString('es-AR')}
                                    </Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
                {/* {datos?.otherPayment[0].number !== 0 && (
                    <>
                        <Text style={styles.otherPayment}>
                            Otros Valores y Retenciones
                        </Text>
                        {datos?.otherPayment.map((elem: any, index: number) => {
                            if (elem.number !== 0)
                                return (
                                    <View style={styles.tableRow4} key={index}>
                                        <Text style={styles.tableCell3}>
                                            {elem.property}
                                        </Text>
                                        <Text style={styles.tableCell3}>
                                            ${elem.number}
                                        </Text>
                                    </View>
                                )
                        })}
                    </>
                )} */}
            </Page>
        </Document>
    ) : (
        <>cargando...</>
    )
}

const PdfReport: React.FC<PdfReportProps> = ({data , reportOptions}) => {
  
    return (
        <div className="pdf-container">
            <PDFViewer style={{ width: '100%', height: '100vh' }}>
                <OrderPDF 
                data={data}
                reportOptions={reportOptions}
               /> 
            </PDFViewer>
        </div>
    )
}

export default PdfReport
