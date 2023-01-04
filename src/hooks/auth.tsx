// import React, { createContext, useContext, useState, ReactNode } from "react";

// type User = {
//   id: string;
//   name: string;
//   type: string;
// };

// type AuthContextData = {
//   signIn: (email: string, password: string) => Promise<void>;
//   isLogging: boolean;
//   user: User | null;
// };

// type AuthProviderProps = {
//   children: ReactNode;
// };

// export const AuthContext = createContext({} as AuthContextData);

// function AuthProvider({ children }: AuthProviderProps) {
//   const [isLogging, setIsLogging] = useState(false);

//   return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
// }

// function useAuth() {
//   const context = useContext(AuthContext);

//   return context;
// }

// export { AuthProvider, useAuth };
