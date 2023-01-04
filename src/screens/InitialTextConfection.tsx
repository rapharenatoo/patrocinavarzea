import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  Text,
  Box,
} from "native-base";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Button } from "../components/Button";

import BackgroundImg from "../assets/background.png";
import IllustrationImg from "../assets/icon.png";

export function InitialTextConfection() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleGoSignIn() {
    navigation.navigate("signInConfection");
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.700"
    >
      <VStack flex={1} px={6} pb={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Fundo preto com faixas amarelas"
          resizeMode="contain"
          position="absolute"
        />
        <Center mt={10} mb={6}>
          <Image
            source={IllustrationImg}
            alt="Icone do aplicativo"
            w={12}
            h={12}
            resizeMode="center"
          />
          <Heading
            color="yellow.400"
            fontSize="xl"
            mt={4}
            fontFamily="heading"
          >
            CONFECÇÃO DE UNIFORMES
          </Heading>
        </Center>
        <Box flex={1}>
          <Text
            color="white"
            fontSize="md"
            fontFamily="body"
            textAlign="justify"
          >
            {`\b\b\b`}Apostamos nessa parceria por juntar os interesses mútuos
            das empresas de confecções e dos times/clubes, possibilitando
            aumento nas vendas e dando maior visibilidade às suas marcas e
            produtos. É um mercado muito extenso, porém, pouco explorado. Essas
            empresas poderão também, atuar como patrocinadoras de campeonatos.
            Buscaremos patrocinadores para aquisição de seus produtos.
          </Text>
        </Box>

        <Button title="Avançar" mt={8} onPress={handleGoSignIn} />
      </VStack>
    </ScrollView>
  );
}
