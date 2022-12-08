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

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

import BackgroundImg from "../assets/background.png";
import IllustrationImg from "../assets/icon.png";

type FormDataPros = {
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
  } = useForm<FormDataPros>({
    resolver: yupResolver(resetPasswordSchema),
  });

  function handleGoSignIn() {
    navigation.navigate("signIn");
  }

  async function handleResetPassword(data: FormDataPros) {
    console.log(data);
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
