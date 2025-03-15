import * as yup from 'yup'

  const schema = yup.object().shape({
        destination: yup
            .string()
            .required('El destino del pago es obligatorio'),
        detail: yup.string().required('El detalle del pago es obligatorio'),
        importe: yup.number(),
    })


    export default schema