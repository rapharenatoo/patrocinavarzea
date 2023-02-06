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

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

import IllustrationImg from "../assets/icon.png";

type UserProps = {
  email: string;
};

const resetPasswordSchema = yup.object({
  email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
});

export function ResetPassword() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProps>({
    resolver: yupResolver(resetPasswordSchema),
  });

  function handleGoSignIn() {
    navigation.navigate("loginOptions");
  }

  async function handleResetPassword(data: UserProps) {
    setIsLoading(true);

    await auth()
      .sendPasswordResetEmail(data.email)
      .then(() => {
        const messageSuccess = toast.show({
          title: "Enviamos um e-mail para resetar sua senha.",
          placement: "top",
          bgColor: "green.500",
        });
        navigation.navigate("loginOptions");
        return messageSuccess;
      })
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
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.800"
    >
      <VStack flex={1} px={10} pb={10}>
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
          <Heading
            color="yellow.400"
            textAlign="center"
            fontSize="xl"
            mb={6}
            fontFamily="heading"
          >
            Resetar sua senha
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

          <Button
            title="Enviar"
            mt={2}
            onPress={handleSubmit(handleResetPassword)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          title="Voltar para o início"
          variant="outline"
          mt={32}
          onPress={handleGoSignIn}
        />
      </VStack>
    </ScrollView>
  );
}
