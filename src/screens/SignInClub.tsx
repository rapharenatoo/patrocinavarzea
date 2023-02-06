import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Center, Heading, ScrollView, Text } from "native-base";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { useAuth } from "../hooks/auth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

import IllustrationImg from "../assets/icon.png";

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

export function SignInClub() {
  const { signIn, isLogging } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
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
    signIn(data.email, data.password, "club");
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
            isLoading={isLogging}
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
