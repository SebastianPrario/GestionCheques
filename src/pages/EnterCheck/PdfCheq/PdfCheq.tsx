import { formatCurrency } from '../../../librery/helpers'
import '../../OrdersView/Pdfview/PdfDown.css'

interface PdfCheqProps {
    chequesInfo?: {
        nroCheque: number
        fechaRechazo: string
        monto: number
        fechaPago: string
        fechaPagoMulta: string
        causal: string
    }[]
}

const PdfCheq: React.FC<PdfCheqProps> = ({ chequesInfo }) => {
    console.log(chequesInfo)
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Información de Cheques
            </h1>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '20px',
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                            Nro Cheque
                        </th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                            Fecha Rechazo
                        </th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                            Monto
                        </th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                            Fecha Pago
                        </th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                            Fecha Pago Multa
                        </th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                            Causal
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {chequesInfo?.map((cheque, index) => (
                        <tr key={index}>
                            <td
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                {cheque.nroCheque}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                {cheque.fechaRechazo}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                {formatCurrency(cheque.monto)}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                {cheque.fechaPago ? cheque.fechaPago : 'impago'}
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                {cheque.fechaPagoMulta ? cheque.fechaPagoMulta : 'impaga'} 
                            </td>
                            <td
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                {cheque.causal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <footer style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Fuente : Banco Central República Argentina</p>
            </footer>
        </div>
    )
}

export default PdfCheq
