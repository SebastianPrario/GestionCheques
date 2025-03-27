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
    data: Check[]
    reportOptions: string
    inputValue?: string
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
        margin: 0,
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

export const OrderPDF: React.FC<PdfReportProps> = ({
    data,
    reportOptions,
    inputValue,
}) => {
    console.log(inputValue)

    const sumaCheques = data?.reduce(
        (acc, curr) => acc + Number(curr.importe),
        0
    )
    return data ? (
        <Document style={styles.page}>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.header}>Listado de Cheques</Text>
                    <Text style={styles.header2}>{reportOptions}</Text>
                    {inputValue && (
                        <Text style={styles.text}>Cliente: {inputValue}</Text>
                    )}
                    <Text style={styles.text}></Text>
                </View>

                <View style={styles.section}>
                    {reportOptions === 'Cheques en Cartera' && (
                        <Text style={styles.header2}>
                            Monto Cheques en cartera:{' '}
                            {formatCurrency(sumaCheques)}
                        </Text>
                    )}
                    {reportOptions === 'Cheques por Cliente' && (
                        <Text style={styles.header2}>
                            Monto Cheques recibido de {inputValue} :{' '}
                            {formatCurrency(sumaCheques)}
                        </Text>
                    )}
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Número</Text>
                            <Text style={styles.tableCell}>Importe</Text>
                            <Text style={styles.tableCell}>Librador</Text>
                            <Text style={styles.tableCell}>Fecha Pago</Text>
                            <Text style={styles.tableCell}>Estado</Text>
                        </View>
                        {data.map((elem: Check, index: number) => {
                            return (
                                <View style={styles.tableRow} key={index}>
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
                                            elem.fechaEntrega
                                        ).toLocaleDateString('es-AR')}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {elem.estado}
                                    </Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </Page>
        </Document>
    ) : (
        <>cargando...</>
    )
}

const PdfReport: React.FC<PdfReportProps> = ({
    data,
    reportOptions,
    inputValue,
}) => {
    return (
        <div className="pdf-container">
            <PDFViewer style={{ width: '100%', height: '100vh' }}>
                <OrderPDF
                    data={data}
                    reportOptions={reportOptions}
                    inputValue={inputValue}
                />
            </PDFViewer>
        </div>
    )
}

export default PdfReport
