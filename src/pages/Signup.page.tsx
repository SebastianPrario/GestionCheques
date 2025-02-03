import { Container, Grid, Box, Typography, Stack } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { FC, useState } from 'react'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'
import { boolean, object, string, TypeOf } from 'zod'
import FormInput from '../components/FormInput'
import Styles from './Login/styles'
import { signUp } from '../librery/helpers'
import { useNavigate } from 'react-router-dom'

// 👇 SignUp Schema with Zod
const signupSchema = object({
    name: string().min(1, 'Nombre es requerido').max(70),
    email: string().min(8, 'Email es requerido').email('Email es invalido'),
    password: string()
        .min(1, 'Password es requerida')
        .min(8, 'Password debe ser de al menos 8 caracteres')
        .max(32, 'Password debe ser de menos de 32 caracteres'),
    passwordConfirm: string().min(1, 'Confirmar Password'),
    role: boolean(),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Password no coinciden',
})

// 👇 Infer the Schema to get TypeScript Type
type ISignUp = TypeOf<typeof signupSchema>

const SignupPage: FC = () => {
    // 👇 Default Values
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const defaultValues: ISignUp = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: false,
    }

    // 👇 Object containing all the methods returned by useForm
    const methods = useForm<ISignUp>({
      defaultValues,
    })

    const handleCheckboxChange = () => {
        if (isChecked) setIsChecked(false)
        else {
            setIsChecked(true)
        }
    }

    const onSubmitHandler: SubmitHandler<ISignUp> = async (values: ISignUp) => {
        const data = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: isChecked,
        }

        const response: any = await signUp(data)
        if (response?.status === 201) {
            navigate('/')
        }
    }
    return (
        <Container
            maxWidth='lg'
            sx={{
                height: '100%',
                backgroundColor: { xs: '#fff', md: '#f4f4f4' },
            }}
        >
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
                    <Grid
                        container
                        sx={{
                            boxShadow: { sm: '0 0 5px #ddd' },
                            py: '6rem',
                            px: '1rem',
                        }}
                    >
                        <FormProvider {...methods}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    textAlign: 'center',
                                    width: '100%',
                                    mb: '1.5rem',
                                    pb: { sm: '3rem' },
                                }}
                            >
                                Gestión de Cheques
                            </Typography>
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
                                        onSubmit={methods.handleSubmit(
                                            onSubmitHandler
                                        )}
                                    >
                                        <Typography
                                            variant="h6"
                                            component="h1"
                                            sx={{
                                                textAlign: 'center',
                                                mb: '1.5rem',
                                            }}
                                        >
                                            Crear Nuevo Usuario
                                        </Typography>

                                        <FormInput
                                            label="Nombre"
                                            type="text"
                                            name="name"
                                            focused
                                            required
                                        />
                                        <FormInput
                                            label="Email"
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
                                            focused
                                        />
                                        <FormInput
                                            type="password"
                                            label="Confirmar Password"
                                            name="passwordConfirm"
                                            required
                                            focused
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                onChange={handleCheckboxChange}
                                            />{' '}
                                            Administrador
                                        </label>
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
                                            Crear
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{}}>
                                    <Typography
                                        variant="h6"
                                        component="p"
                                        sx={{
                                            paddingLeft: { sm: '3rem' },
                                            mb: '1.5rem',
                                            textAlign: 'center',
                                        }}
                                    ></Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        sx={{
                                            paddingLeft: { sm: '3rem' },
                                            rowGap: '1rem',
                                        }}
                                    ></Box>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center">
                                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                                    <Typography
                                        sx={{ fontSize: '0.9rem', mb: '1rem' }}
                                    >
                                        Ya tienes cuenta?{' '}
                                        <Styles.LinkItem to="/">ir</Styles.LinkItem>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </FormProvider>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SignupPage
