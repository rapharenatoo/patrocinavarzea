import { useState, useEffect } from "react";
import { Heading, VStack, ScrollView, Text, Center, Image } from "native-base";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { Button } from "./Button";
import { InfoEmpty } from "./InfoEmpty";
import { Skeleton } from "./Skeleton";

import IllustrationImg from "../assets/icon.png";

type Address = {
  zipCode?: string;
  street?: string;
  neighborhood?: string;
  state?: string;
  city?: string;
};

type UserConfectionProps = {
  id: string;
  name: string;
  email: string;
  taxId: string;
  ie?: number;
  address: Address;
  numberAddress?: string;
  nameContact?: string;
  phoneContact?: string;
  wantSponsor: string;
  createdAt: string;
};

export function InfoConfection() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [infoConfection, setInfoConfection] = useState<UserConfectionProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  function handleGoProfile() {
    navigation.navigate("profile");
  }

  useEffect(() => {
    const subscriber = firestore()
      .collection("confection")
      .where("email", "==", auth().currentUser.email)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as UserConfectionProps[];

        setInfoConfection(data);
        setIsLoading(false);
      });

    return () => subscriber();
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {infoConfection.length === 0 ? (
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
                    CPF / CNPJ: {infoConfection[0].taxId}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    I.E.: {infoConfection[0].ie}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {auth().currentUser.email}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Contato: {infoConfection[0].nameContact}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Telefone: {infoConfection[0].phoneContact}
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
                    CEP: {infoConfection[0].address?.zipCode}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={2}
                  >
                    {infoConfection[0].address?.street},{" "}
                    {infoConfection[0].numberAddress}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoConfection[0].address?.neighborhood}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoConfection[0].address?.city} -{" "}
                    {infoConfection[0].address?.state}
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
                    Deseja patrocinar? {infoConfection[0].wantSponsor}
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
      )}
    </>
  );
}
