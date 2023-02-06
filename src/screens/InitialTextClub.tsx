import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Center, Heading, ScrollView, Text } from "native-base";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Button } from "../components/Button";

import IllustrationImg from "../assets/icon.png";

export function InitialTextClub() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleGoSignIn() {
    navigation.navigate("signInClub");
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.800"
    >
      <VStack flex={1} px={6} pb={10}>
        <Center mt={10} mb={4}>
          <Image
            source={IllustrationImg}
            alt="Icone do aplicativo"
            w={12}
            h={12}
            resizeMode="center"
          />
        </Center>
        <Center>
          <Heading color="yellow.400" fontSize="xl" mb={6} fontFamily="heading">
            CLUBES-TIMES
          </Heading>

          <Text
            color="white"
            fontSize="md"
            fontFamily="body"
            textAlign="justify"
          >
            {`\b\b\b`}São mais de 241 unidades esportivas (campos) em terrenos
            municipais, com administração da PMSP , espalhados pelas regiões,
            norte, sul, leste, oeste, grande ABC e outros municípios ao redor da
            capital de São Paulo. Estamos falando em 16 times (que jogam das
            9:00 as 17:00 hrs), no final de semana, multiplicados por 241
            campos, totalizam 3.856 times, que multiplicado por 20 jogadores em
            média em cada time, temos um total de 77.120 jogadores, em um final
            de semana, sem contar demais públicos. {`\n`}
            {`\b\b\b`}Fontes de informações:
            https://www.prefeitura.sp.gov.br/cidade/secretarias/esportes/menu/index.php?p=263447
            {`\n\n`}
            {`\b\b\b`}O cadastro no aplicativo é muito importante para
            fortalecer, valorizar, dar visibilidade e trazer benefícios ao seu
            time/clube, tais como: atrair potenciais patrocinadores, adquirir
            uniformes e demais produtos esportivos tais como, bolas, chuteiras,
            troféus, mochilas, etc. Além de concorrer a brindes promocionais a
            serem sorteados pelo aplicativo através da loteria federal.
          </Text>
        </Center>

        <Button title="Avançar" mt={8} onPress={handleGoSignIn} />
      </VStack>
    </ScrollView>
  );
}
