import { useState } from "react";
import { Heading, VStack, ScrollView, Text, Center, Image } from "native-base";

import { Button } from "./Button";
import { InfoEmpty } from "./InfoEmpty";

import IllustrationImg from "../assets/icon.png";

export function InfoAdmin() {
  const [isEmpty, setIsEmpty] = useState(false);
  return (
    <>
      {isEmpty ? (
        <InfoEmpty />
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bg="gray.700"
          pt={5}
        >
          <VStack flex={1} px={6} pb={10}>
            <VStack pb={4} flex={1}>
              <Heading
                color="yellow.400"
                fontSize="md"
                mb={2}
                fontFamily="heading"
              >
                Informações pessoais:
              </Heading>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                bllackdev@gmail.com
              </Text>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                Telefone: (11) 98910-0204
              </Text>
            </VStack>
            <Center mb={2}>
              <Image
                source={IllustrationImg}
                alt="Icone do aplicativo"
                w={12}
                h={12}
                resizeMode="center"
              />
            </Center>

            <Button title="Alterar" mt={4} onPress={() => {}} />
          </VStack>
        </ScrollView>
      )}
    </>
  );
}
