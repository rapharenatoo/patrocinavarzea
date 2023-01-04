import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  useToast,
  Text,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import auth from "@react-native-firebase/auth";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

import BackgroundImg from "../assets/background.png";
import IllustrationImg from "../assets/icon.png";
import { CLUB } from "../utils/constants";

type UserProps = {
  email: string;
  password: string;
};

const signUpSchema = yup.object({
  email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 digítos"),
});

export function SignInConfection() {
  const toast = useToast();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProps>({
    resolver: yupResolver(signUpSchema),
  });

  function handleGoBack() {
    navigation.navigate("loginOptions");
  }

  function handleGoResetPassword() {
    navigation.navigate("resetPassword");
  }

  async function handleSignIn(data: UserProps) {
    setIsLoading(true);

    await auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(({ user }) => {
        const isEmailVerify = user.emailVerified;
        if (!isEmailVerify) {
          const messageError = toast.show({
            title:
              "A verificação do seu email ainda está pendente. Acesse seu e-mail para concluir o cadastro!",
            placement: "top",
            bgColor: "red.500",
          });
          return messageError;
        }
      })
      .catch((error) => {
        setIsLoading(false);

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
        setIsLoading(false);
      });
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.700"
    >
      <VStack flex={1} px={10} pb={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Fundo preto com faixas amarelas"
          resizeMode="repeat"
          position="absolute"
        />
        <Center mt={20} mb={10}>
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
            Acesse sua conta
          </Heading>

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
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Acessar conta"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />

          <TouchableOpacity onPress={handleGoResetPassword}>
            <Text
              color="gray.300"
              fontFamily="body"
              fontWeight="bold"
              fontSize="xs"
              mt={4}
            >
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
        </Center>

        <Button
          title="Voltar para o início"
          variant="outline"
          mt={12}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
