import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './contexts/AuthContext'
import CheckContext from './contexts/CheckContext'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <AuthProvider>
            <CheckContext>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </CheckContext>
        </AuthProvider>
    </React.StrictMode>
)
