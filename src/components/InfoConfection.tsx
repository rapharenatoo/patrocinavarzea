import { useState } from "react";
import { Heading, VStack, ScrollView, Text } from "native-base";

import { Button } from "./Button";
import { InfoEmpty } from "./InfoEmpty";

export function InfoConfection() {
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
            <VStack pb={4}>
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
                CPF / CNPJ: 32.652.810/0001-19
              </Text>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                I.E.: 846.812.760.741
              </Text>
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
                Contato: Raphael Renato
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

            <VStack pb={4}>
              <Heading
                color="yellow.400"
                fontSize="md"
                mb={1}
                fontFamily="heading"
              >
                Endereço:
              </Heading>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                CEP: 13857-000
              </Text>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={2}
              >
                Avenida Niverson Gomes da Silva, 317 B
              </Text>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                Parque São José
              </Text>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                Estiva Gerbi - SP
              </Text>
            </VStack>

            <VStack pb={4}>
              <Heading
                color="yellow.400"
                fontSize="md"
                mb={2}
                fontFamily="heading"
              >
                Informações gerais:
              </Heading>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                Deseja patrocinar? SIM
              </Text>
            </VStack>
            <Button title="Alterar" mt={4} onPress={() => {}} />
          </VStack>
        </ScrollView>
      )}
    </>
  );
}
