import {
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  Text,
  Icon,
  HStack,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Button } from "../components/Button";

import BackgroundImg from "../assets/background.png";
import IllustrationImg from "../assets/icon.png";
import { TouchableOpacity } from "react-native";

export function EmailVerify() {
  function handleGoBack() {
    // navigation.goBack();
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.700"
    >
      <VStack flex={1} px={8} pb={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Fundo preto com faixas amarelas"
          resizeMode="contain"
          position="absolute"
        />
        <Center mt={10} mb={10}>
          <Image
            source={IllustrationImg}
            alt="Icone do aplicativo"
            w={14}
            h={14}
            resizeMode="center"
          />
        </Center>
        <Center mb={16}>
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
            Verique se e-mail, por favor!
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
            que é você mesmo.
          </Text>
        </Center>
        <Center>
          <Button title="Voltar ao login" mt={8} onPress={handleGoBack} />
          <HStack mt={4}>
            <Text color="white" fontSize="sm" fontFamily="body" mr={2}>
              Não recebeu o e-mail?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                //navigation.navigate("retryEmailVerify");
              }}
            >
              <Text
                color="yellow.400"
                fontSize="sm"
                fontFamily="body"
                fontWeight="bold"
              >
                Enviar novamente
              </Text>
            </TouchableOpacity>
          </HStack>
        </Center>
      </VStack>
    </ScrollView>
  );
}
