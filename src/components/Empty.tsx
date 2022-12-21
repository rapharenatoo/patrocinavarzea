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

type Props = {
  title: string;
  buttonVisible?: boolean;
};

export function Empty({ title, buttonVisible = true }: Props) {
  return (
    <VStack flex={1} px={2} mt={6}>
      <Center flex={1} pb={4}>
        <Heading
          color="white"
          fontSize="lg"
          mb={2}
          fontFamily="heading"
          textAlign="center"
        >
          {title}
        </Heading>
      </Center>
      <Center>
        <Image
          source={IllustrationImg}
          alt="Icone do aplicativo"
          w={12}
          h={12}
          resizeMode="center"
        />
      </Center>

      {buttonVisible && <Button title="Atualizar" mt={4} onPress={() => {}} />}
    </VStack>
  );
}
