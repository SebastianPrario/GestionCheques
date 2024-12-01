import React, { createContext, useContext, useState } from 'react';

interface User {
  // Define las propiedades del usuario según tu aplicación
  name: string;
  userId: string;
  role: string;
  token: string;
}

// Define el tipo para el contexto
interface AuthContextType {
  user: User | null ;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signInUser:  (arg0: User) => void | null;
  signOutUser: () => void | null;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
const token = sessionStorage.getItem('userGestionToken')

const inicialState = {
  name: "",
  userId: "",
  role: "",
  token: token || ""
}
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState< User | null >(inicialState);

  const signInUser = (user : User) => {
    if (user) {
      sessionStorage.setItem( 'userGestionToken' , `${user.token}`)
      setUser(user)
    }
  }
  const signOutUser = () =>{
    sessionStorage.removeItem('userGestionToken');
    setUser(null)
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signInUser,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;
