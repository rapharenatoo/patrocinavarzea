import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  Text,
  Icon,
  HStack,
  useToast,
  Spinner,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Button } from "../components/Button";

import IllustrationImg from "../assets/icon.png";

export function EmailVerify() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  function handleGoSignIn() {
    navigation.navigate("loginOptions");
  }

  async function handleSendRetryEmail() {
    setIsLoading(true);

    await auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        const messageSuccess = toast.show({
          title: "E-mail enviado com sucesso.",
          placement: "top",
          bgColor: "green.500",
        });

        setIsLoading(false);

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
      <VStack flex={1} px={8} pb={10}>
        <Center mt={10} mb={10}>
          <Image
            source={IllustrationImg}
            alt="Icone do aplicativo"
            w={14}
            h={14}
            resizeMode="center"
          />
        </Center>
        <Center mb={14}>
          <Icon
            as={MaterialCommunityIcons}
            name="email-check"
            size={16}
            color="yellow.400"
            mb={8}
          />

          <Heading
            color="white"
            textAlign="center"
            fontSize="2xl"
            mb={6}
            fontFamily="heading"
          >
            Verique seu e-mail, por favor!
          </Heading>

          <Text
            color="white"
            fontSize="md"
            fontFamily="body"
            textAlign="center"
          >
            Olá, para começar a usar o Patrocina Várzea, precisamos verificar o
            seu e-mail.{`\n\n`}
            Já enviamos o link de verificação. Por favor, verifique e confirme
            seu cadastro. Lembre de verificar também na caixa de SPAM. 
          </Text>
        </Center>
        <Center>
          <Button title="Voltar ao início" mt={8} onPress={handleGoSignIn} />
          <HStack mt={4}>
            <Text color="white" fontSize="sm" fontFamily="body" mr={2}>
              Não recebeu o e-mail?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSendRetryEmail}
            >
              {isLoading ? (
                <Spinner color="yellow.400" fontSize="sm" />
              ) : (
                <Text
                  color="yellow.400"
                  fontSize="sm"
                  fontFamily="body"
                  fontWeight="bold"
                >
                  Enviar novamente
                </Text>
              )}
            </TouchableOpacity>
          </HStack>
        </Center>
      </VStack>
    </ScrollView>
  );
}
