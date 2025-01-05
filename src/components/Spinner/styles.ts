import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  100% {
    transform: rotate(3600deg);
  }`

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 9999;
    background-color: white;
`
const Spinner = styled.div`
  display: inline-block;
  width: 100px;
  height: 100px;
  background: url('http://i.imgur.com/oSHLAzp.png') center center;
  background-size: contain;
  transform-origin: 50% 50%;
  animation: ${rotate} 3s infinite alternate ease-in-out;
  ba
`
const LoadingText = styled.text`
    position: relative;
    z-index: 1;
    margin-top: 30px;
    font-size: 1.5rem;
    font-family: 'Comic Sans MS', cursive, sans-serif;
    margin-left: 0.5em;
`

export default { LoadingContainer, Spinner, LoadingText }
