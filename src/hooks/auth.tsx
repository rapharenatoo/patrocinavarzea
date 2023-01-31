import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "native-base";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

type User = {
  id: string;
  name: string;
  type: string;
};

type AuthContextData = {
  signIn: (email: string, password: string, type: string) => Promise<void>;
  isLogging: boolean;
  user: User | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const toast = useToast();
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string, type: string) {
    setIsLogging(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        console.log("User: ", `${user} \n\n`);
        if (user.emailVerified === false) {
          const messageError = toast.show({
            title:
              "A verificação do seu email ainda está pendente. Acesse seu e-mail para concluir o cadastro!",
            placement: "top",
            bgColor: "red.500",
          });
          return messageError;
        }

        firestore()
          .collection(type)
          .doc(user.uid)
          .get()
          .then((profile) => {
            const { name, type } = profile.data() as User;
            console.log("Profile: ", `${profile} \n\n`);
            if (profile.exists) {
              const userData = {
                id: user.uid,
                name: name,
                type,
              };
              setUser(userData);
              console.log("Data: ", userData);
            }
          })
          .catch((error) => {
            const messageError = toast.show({
              title: "Não foi possível buscar os dados do usuário.",
              placement: "top",
              bgColor: "red.500",
            });
            return messageError;
          });
      })
      .catch((error) => {
        setIsLogging(false);

        const errorCode = error.code;
        if (
          errorCode == "auth/wrong-password" ||
          errorCode == "auth/user-not-found"
        ) {
          const messageError = toast.show({
            title: "O email e/ou a senha inválida.",
            placement: "top",
            bgColor: "red.500",
          });
          return messageError;
        } else if (errorCode === "auth/network-request-failed") {
          const messageError = toast.show({
            title:
              "Parece que você não está conectado a uma rede! Verifique sua conexão e tente novamente.",
            placement: "top",
            bgColor: "red.500",
          });
          return messageError;
        }
        console.log(errorCode);
      })
      .finally(() => {
        setIsLogging(false);
      });
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isLogging,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
