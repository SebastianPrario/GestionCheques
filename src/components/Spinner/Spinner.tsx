import Styled from './styles'

export default function Spinner() {
    return (
        <Styled.LoadingContainer>
            <Styled.Spinner></Styled.Spinner>
            <Styled.LoadingText>Cargando...</Styled.LoadingText>
        </Styled.LoadingContainer>
    )
}
