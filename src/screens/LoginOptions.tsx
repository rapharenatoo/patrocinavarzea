import { useState } from "react";
import { VStack, Image, Center, ScrollView, useToast } from "native-base";

import { ButtonLoginOptions } from "../components/ButtonLoginOptions";

import BackgroundImg from "../assets/background.png";
import IllustrationImg from "../assets/icon.png";

export function LoginOptions() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  function handleGoBack() {
    // navigation.goBack();
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
            onPress={handleGoBack}
          />

          <ButtonLoginOptions
            title="CLUBE"
            color="primary"
            mb={4}
            onPress={handleGoBack}
          />
          <ButtonLoginOptions
            title="PATROCINADOR"
            color="primary"
            mb={4}
            onPress={handleGoBack}
          />
          <ButtonLoginOptions
            title="CONFECÇÃO UNIFORMES"
            color="primary"
            mb={4}
            onPress={handleGoBack}
          />
          <ButtonLoginOptions
            title="CAMPEONATOS"
            color="primary"
            mb={4}
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
