import Swal from 'sweetalert2';
import axios, { AxiosError } from 'axios';

interface SignUp {
  name: string;
  email: string;
  password: string;
  role: boolean;
}

export const postMethod = async (data: SignUp) => {
  const URL: string | undefined = import.meta.env.VITE_API_URL_SIGNIN;
  try {
    if (URL) {
      const response = await axios.post(URL, data);
      if (response.data === 'usuario o password incorrecta') {
        Swal.fire({
          title: 'Error!',
          text: 'email o contraseña incorrecta',
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      }
      localStorage.setItem('token', response.data?.token);
      return response.data;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'email o contraseña incorrecta',
      icon: 'error',
      confirmButtonText: 'Cool',
    });
    return;
  }
};

export const CheckToken = () => {
  const token = getToken();
  if (token) {
    return true;
  }
  return false;
};

export const getToken = () => {
  return localStorage.getItem('token') || null;
};

export const signUp = async (data: SignUp) => {
  const URL: string | undefined = import.meta.env.VITE_API_URL_SIGNUP;
  try {
    if (URL) {
      const response = await axios.post(URL, data);
      if (response) {
        Swal.fire({
          title: 'Usuario Creado',
          icon: 'success',
          confirmButtonText: 'cerrar',
        });
        return response;
      }
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message === 'email existente') {
        Swal.fire({
          title: 'Error!',
          text: 'Email Existente',
          icon: 'error',
          confirmButtonText: 'cerrar',
        });
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

export const headerToken = (token : string | undefined) =>  { 
  const authorization = {authorization: `Bearer ${token}`}
  return authorization  
}
