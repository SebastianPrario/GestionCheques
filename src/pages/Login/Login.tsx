import {
    Container,
    Grid,
    Box,
    Typography,
    Stack
   
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { FC, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from '../../components/FormInput'
import { postMethod } from '../../librery/helpers'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from '../../components/Spinner/Spinner'
import { ILogin, loginSchema } from './types'
import Styles from './styles'

const LoginPage: FC = () => {
    const navigate = useNavigate()
    const {
        handleSubmit,
        formState: { errors },
    } = useForm()
   
    
    const defaultValues: ILogin = {
        email: '',
        password: '',
    }
    const [loading, setIsLoading] = useState(false)
    const {  signInUser } = useAuth()
    const methods = useForm<ILogin>({
        resolver: zodResolver(loginSchema),
        defaultValues,
    })

    // 👇 Submit Handler
    const onSubmit = async () => {
        setIsLoading(true)
        try {
            const { email, password } = methods.watch()
            const data = {
                email,
                password,
            }

            // Realiza la llamada a la API aquí
            const response = await postMethod(data)
           
            signInUser({
                name: response.payload.sub,
                userId: response.payload.userId,
                role: response.payload.role,
                token: response.token,
            })
            if (response.token) {
                
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Error logging in:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                height: '100vh',
                backgroundColor: { xs: '#fff', md: '#f4f4f4' },
            }}
        >
            { loading && <Spinner/>}
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ width: '100%', height: '100%' }}
            >
                <Grid
                    item
                    sx={{
                        maxWidth: '70rem',
                        width: '100%',
                        backgroundColor: '#fff',
                    }}
                >
                    <FormProvider {...methods}>
                        <Grid
                            container
                            sx={{
                                boxShadow: { sm: '0 0 5px #ddd' },
                                py: '6rem',
                                px: '1rem',
                            }}
                        >
                            <Grid
                                item
                                container
                                justifyContent="space-between"
                                rowSpacing={5}
                                sx={{
                                    maxWidth: { sm: '45rem' },
                                    marginInline: 'auto',
                                }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    sx={{
                                        borderRight: { sm: '1px solid #ddd' },
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                        sx={{ paddingRight: { sm: '3rem' } }}
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <Typography
                                            variant="h6"
                                            component="h1"
                                            sx={{
                                                textAlign: 'center',
                                                mb: '1.5rem',
                                            }}
                                        >
                                            Gestion de Cheques - Ingreso
                                        </Typography>

                                        <FormInput
                                            label="Ingrese su email"
                                            type="email"
                                            name="email"
                                            focused
                                            required
                                        />
                                        <FormInput
                                            type="password"
                                            label="Password"
                                            name="password"
                                            required
                                            
                                        />

                                        <LoadingButton
                                            loading={false}
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                py: '0.8rem',
                                                mt: 2,
                                                width: '80%',
                                                marginInline: 'auto',
                                            }}
                                        >
                                            INGRESAR
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}></Grid>
                            </Grid>
                            <Grid container justifyContent="center">
                                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                                    <Typography
                                        sx={{ fontSize: '0.9rem', mb: '1rem' }}
                                    >
                                        crear usuario{' '}
                                        <Styles.LinkItem to="/signup">
                                            click aqui
                                        </Styles.LinkItem>
                                    </Typography>
                                    {/* <Typography sx={{ fontSize: '0.9rem' }}>
                    Forgot your{' '}
                    <LinkItem to='/forgotPassword'>password?</LinkItem>
                  </Typography> */}
                                </Stack>
                            </Grid>
                        </Grid>
                    </FormProvider>
                </Grid>
            </Grid>
        </Container>
    )
}

export default LoginPage
