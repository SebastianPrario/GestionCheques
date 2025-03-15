import * as yup from 'yup'
import { format, isAfter, isEqual, differenceInDays } from 'date-fns'

const schema = yup.object().shape({
    numero: yup
        .string()
        .matches(
            /^\d{8}$/,
            'El número debe tener exactamente 8 dígitos numéricos'
        )
        .required('El número es obligatorio'),
    importe: yup
        .number()
        .positive('El importe debe ser un valor positivo')
        .required('El importe es obligatorio'),
    cliente: yup.string().required('El nombre del cliente es requerido'),
    librador: yup.string().required('Nombre del Emisor requerido'),
    fechaEmision: yup
        .date()
        .default(() => new Date())
        .test(
            'is-valid-format',
            'El formato debe ser aaaa/mm/dd',
            function (value) {
                const formattedDate = format(value, 'yyyy/MM/dd')
                return /^\d{4}\/\d{2}\/\d{2}$/.test(formattedDate)
            }
        )
        .required('La fecha es obligatoria'),
    fechaEntrega: yup
        .date()
        .default(() => new Date())
        .test(
            'is-before',
            'La fecha de pago debe ser posterior o igual a la fecha de emisión',
            function (value) {
                const { fechaEmision } = this.parent
                return (
                    isEqual(value, fechaEmision) || isAfter(value, fechaEmision)
                )
            }
        )
        .test(
            'max-difference',
            'La diferencia entre la fecha de emisión y la fecha de pago no puede ser mayor a 360 días',
            function (value) {
                const { fechaEmision } = this.parent
                return differenceInDays(value, fechaEmision) <= 360
            }
        )
        .test(
            'is-valid-format',
            'El formato debe ser aaaa/mm/dd',
            function (value) {
                const formattedDate = format(value, 'yyyy/MM/dd')
                return /^\d{4}\/\d{2}\/\d{2}$/.test(formattedDate)
            }
        )
        .required('La fecha es obligatoria'),
})

export default schema
