import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Center, ScrollView, useToast } from "native-base";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { ButtonLoginOptions } from "../components/ButtonLoginOptions";

import BackgroundImg from "../assets/background.png";
import IllustrationImg from "../assets/icon.png";

export function LoginOptions() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  function handleGoSignUp() {
    navigation.navigate("signUp");
  }

  function handleGoSignInClub() {
    navigation.navigate("initialTextClub");
  }

  function handleGoSignInSponsor() {
    navigation.navigate("initialTextSponsor");
  }

  function handleGoSignInConfection() {
    navigation.navigate("initialTextConfection");
  }

  function handleGoSignIn() {
    navigation.navigate("signInAdmin");
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
            w={40}
            h={40}
            resizeMode="center"
          />
        </Center>
        <Center>
          <ButtonLoginOptions
            title="CADASTRE-SE"
            color="secondary"
            mb={4}
            onPress={handleGoSignUp}
          />

          <ButtonLoginOptions
            title="CLUBES-TIMES"
            color="primary"
            mb={4}
            onPress={handleGoSignInClub}
          />
          <ButtonLoginOptions
            title="PATROCINADOR"
            color="primary"
            mb={4}
            onPress={handleGoSignInSponsor}
          />
          <ButtonLoginOptions
            title="CONFECÇÃO DE UNIFORMES"
            color="primary"
            mb={4}
            onPress={handleGoSignInConfection}
          />
          <ButtonLoginOptions
            title="CAMPEONATOS"
            color="primary"
            mb={4}
            onPress={handleGoSignIn}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
