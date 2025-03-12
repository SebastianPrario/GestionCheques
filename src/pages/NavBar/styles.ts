import styled from 'styled-components';
import { Button } from 'react-bootstrap';

export const CustomButton = styled(Button)`
    font-size: 1rem; /* Tamaño de fuente por defecto */
    padding: 0.5rem 1rem; /* Padding por defecto */

    @media (max-width: 1976px) {
        font-size: 1.75rem; /* Tamaño de fuente para pantallas pequeñas */
        padding: 0.25rem 0.5rem; /* Padding para pantallas pequeñas */
        color: aqua;
    }
`;
export default { CustomButton };