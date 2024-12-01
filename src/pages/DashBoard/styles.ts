import styled from 'styled-components';

const DashBoard = styled.div`
 background-color: black;
 width: 100%;
 height: 100%;
 
           
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: black;
`
const  Table = styled.table`
   width: 100%;
  border-collapse: collapse;
  overflow-y: auto;
  height: 400px; /* O la altura que desees para el scroll */
  background-color: antiquewhite;
 
`

const StickyHeader = styled.thead`
  position: sticky;
  width: 100%;
  background-color: #343a40; /* Color de fondo para asegurar visibilidad */
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Opcional: añade sombra para mayor visibilidad */
  background-color: white;
`;
export default { DashBoard , Nav ,Table , StickyHeader};