import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "native-base";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

type User = {
  id: string;
  name: string;
  type: string;
};

type AuthContextData = {
  signIn: (email: string, password: string, type: string) => Promise<void>;
  signOut: () => void;
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
    const USER_COLLECTION = `@patrocinavarzea:${type}`;

    setIsLogging(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
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
          .then(async (profile) => {
            const { name, type } = profile.data() as User;
            if (profile.exists) {
              const userData = {
                id: user.uid,
                name: name,
                type,
              };

              await AsyncStorage.setItem(
                USER_COLLECTION,
                JSON.stringify(userData)
              );
              setUser(userData);
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            if (error === "auth/unknown") {
              const messageError = toast.show({
                title:
                  "Usuário não encontrado. Verifique E-MAIL, SENHA e a CATEGORIA que está tentando acessar!",
                placement: "top",
                bgColor: "red.500",
                duration: 15000,
              });
              return messageError;
            }

            if (errorCode === undefined) {
              const messageError = toast.show({
                title:
                  "Usuário não encontrado. Verifique E-MAIL, SENHA e a CATEGORIA que está tentando acessar!",
                placement: "top",
                bgColor: "red.500",
                duration: 15000,
              });

              return messageError;
            }

            const messageError = toast.show({
              title: "Não foi possível buscar os dados do usuário.",
              placement: "top",
              bgColor: "red.500",
            });
            console.log(errorCode);
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

  async function signOut() {
    await auth()
      .signOut()
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        const messageError = toast.show({
          title: `Algo deu errado. Tente novamente mais tarde! Código: ${errorCode}`,
          placement: "top",
          color: "red.500",
        });
        return messageError;
      });
    setUser(null);
  }

  let USER_COLLECTION_LOAD;

  async function loadAdminUserStoreData() {
    USER_COLLECTION_LOAD = "@patrocinavarzea:admin";
    setIsLogging(true);

    const storedUser = await AsyncStorage.getItem(USER_COLLECTION_LOAD);

    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);
    }

    setIsLogging(false);
  }

  async function loadClubUserStoreData() {
    USER_COLLECTION_LOAD = "@patrocinavarzea:club";
    setIsLogging(true);

    const storedUser = await AsyncStorage.getItem(USER_COLLECTION_LOAD);

    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);
    }

    setIsLogging(false);
  }

  async function loadSponsorUserStoreData() {
    USER_COLLECTION_LOAD = "@patrocinavarzea:sponsor";
    setIsLogging(true);

    const storedUser = await AsyncStorage.getItem(USER_COLLECTION_LOAD);

    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);
    }

    setIsLogging(false);
  }

  async function loadConfectionUserStoreData() {
    USER_COLLECTION_LOAD = "@patrocinavarzea:confection";
    setIsLogging(true);

    const storedUser = await AsyncStorage.getItem(USER_COLLECTION_LOAD);

    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);
    }

    setIsLogging(false);
  }

  useEffect(() => {
    loadAdminUserStoreData();
    loadClubUserStoreData();
    loadSponsorUserStoreData();
    loadConfectionUserStoreData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
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
