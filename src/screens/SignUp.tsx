import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { SelectSingUp } from "../components/SelectSingUp";
import { Input } from "../components/Input";
import { InputPassword } from "../components/InputPassword";
import { Button } from "../components/Button";

import IllustrationImg from "../assets/icon.png";

type FormDataPros = {
  type: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

const signUpSchema = yup.object({
  type: yup.string().required("Informe o tipo"),
  name: yup.string().required("Informe o nome"),
  email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 digítos"),
  password_confirm: yup
    .string()
    .required("Confirme a senha")
    .oneOf([yup.ref("password"), null], "A confirmação de senha não confere"),
});

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataPros>({
    resolver: yupResolver(signUpSchema),
  });

  function handleGoLoginOptions() {
    navigation.navigate("loginOptions");
  }

  async function handleSignUp(data: FormDataPros) {
    setIsLoading(true);

    await auth()
      .createUserWithEmailAndPassword(data.email, data.password)

      .then(() => {
        auth().currentUser.updateProfile({
          displayName: data.name,
        });
        auth().currentUser.sendEmailVerification();

        firestore()
          .collection(data.type)
          .doc(auth().currentUser.uid)
          .set({
            name: data.name,
            email: data.email,
            type: data.type,
            createdAt: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {})
          .catch((error) => {
            setIsLoading(false);

            const messageError = toast.show({
              title: "Algo deu errado! Tente novamente mais tarde.",
              placement: "top",
              bgColor: "red.500",
            });
            console.log(error);
            return messageError;
          })
          .finally(() => {
            setIsLoading(false);
          });

        navigation.navigate("emailVerify");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setIsLoading(false);

        if (errorCode === "auth/email-already-in-use") {
          const messageError = toast.show({
            title:
              "O email já está cadastrado no Patrocina Várzea, faça o login para continuar.",
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
        } else {
          const messageError = toast.show({
            title: `Algo deu errado. Tente novamente mais tarde! Código: ${errorCode}`,
            placement: "top",
            bgColor: "red.500",
          });
          console.log(errorCode, errorMessage);
          return messageError;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.800"
    >
      <VStack flex={1} px={10} pb={10}>
        <Center mt={8} mb={4}>
          <Image
            source={IllustrationImg}
            alt="Icone do aplicativo"
            w={32}
            h={32}
            resizeMode="center"
          />
        </Center>
        <Center>
          <Heading color="yellow.400" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <SelectSingUp
                type={value}
                onChange={onChange}
                errorMessage={errors.type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <InputPassword
                placeholder="Senha"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <InputPassword
                placeholder="Confirme a senha"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title="Criar conta"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          title="Voltar para o início"
          variant="outline"
          mt={8}
          onPress={handleGoLoginOptions}
        />
      </VStack>
    </ScrollView>
  );
}
