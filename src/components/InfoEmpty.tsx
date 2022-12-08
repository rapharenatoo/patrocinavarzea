import { Heading, VStack, ScrollView, Text, Center, Image } from "native-base";

import { Button } from "./Button";

import IllustrationImg from "../assets/icon.png";

export function InfoEmpty() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.700"
      pt={5}
    >
      <VStack flex={1} px={6} pb={10}>
        <Center pb={4} flex={1}>
          <Heading color="white" fontSize="lg" mb={2} fontFamily="heading" textAlign="center">
            Atualize seus dados para serem exibidos.
          </Heading>
        </Center>
        <Center mb={2}>
          <Image
            source={IllustrationImg}
            alt="Icone do aplicativo"
            w={12}
            h={12}
            resizeMode="center"
          />
        </Center>

        <Button title="Atualizar" mt={4} onPress={() => {}} />
      </VStack>
    </ScrollView>
  );
}
