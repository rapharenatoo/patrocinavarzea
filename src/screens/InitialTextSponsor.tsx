import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Center, Heading, ScrollView, Text } from "native-base";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Button } from "../components/Button";

import BackgroundImg from "../assets/background.png";
import IllustrationImg from "../assets/icon.png";

export function InitialTextSponsor() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleGoSignIn() {
    navigation.navigate("signIn");
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
            PATROCINADOR
          </Heading>

          <Text
            color="white"
            fontSize="md"
            fontFamily="body"
            textAlign="justify"
          >
            {`\b\b\b`}Possibilidade de expor suas marcas, aumentar as vendas e
            dar maior visibilidade aos seus produtos. O custo para essa
            exposição é muito baixo em vista de outras mídias. É um mercado
            muito extenso, 241 unidades esportivas (campos) em terrenos
            municipais. São mais de 3.856 times, com 20 jogadores em média, um
            total de 77.120 jogadores em um final de semana.{`\n\n`}
            {`\b\b\b`}Os patrocínios poderão ser feitos através de recursos
            financeiros, serviços, produtos tais como: jogos de uniformes,
            chuteiras, bolas, boné, mochilas, troféus, medalhas, produtos
            alimentícios, entre outros, selecionando os times/clubes diretamente
            em nossa plataforma. Possibilidade também de patrocinar um
            campeonato inteiro ou parte dele. Patrocinando o esporte de várzea,
            poderá também patrocinar a cultura simultaneamente, através de leis
            de incentivos (fale com a administração). Seu patrocínio,
            indiretamente estará praticando uma ação social, formando cidadãos,
            oferecendo às crianças e os jovens das periferias, uma melhor
            qualidade de laser e educação.
          </Text>
        </Center>

        <Button title="Avançar" mt={8} onPress={handleGoSignIn} />
      </VStack>
    </ScrollView>
  );
}
