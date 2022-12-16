import {
  Heading,
  VStack,
  ScrollView,
  Text,
  Center,
  Image,
  Box,
} from "native-base";

import { Button } from "./Button";

import IllustrationImg from "../assets/icon.png";

export function ChampionshipEmpty() {
  return (
    <VStack flex={1} px={6} pb={10}>
      <Center pb={4} flex={1}>
        <Heading
          color="white"
          fontSize="lg"
          mb={2}
          fontFamily="heading"
          textAlign="center"
        >
          Não há campeonatos cadastrados.
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
  );
}
