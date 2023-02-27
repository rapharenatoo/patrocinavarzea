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

type Sponsorships = {
  id: string;
};

type UserSponsorProps = {
  id: string;
  name: string;
  email: string;
  taxId: string;
  ie: string;
  address: Address;
  numberAddress: string;
  complementAddress?: string;
  nameContact: string;
  phoneContact: string;
  wantSponsor: string;
  categoryJuvenile: boolean;
  categorySport: boolean;
  categoryVeteran: boolean;
  categoryFemale: boolean;
  sponsorSleeve: boolean;
  sponsorFront: boolean;
  sponsorBack: boolean;
  sponsorProducts: boolean;
  sponsorOther: boolean;
  sponsorOtherDescription: string;
  sponsorships: Sponsorships[];
  createdAt: string;
};

export function InfoSponsor() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [infoSponsor, setInfoSponsor] = useState<UserSponsorProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function handleGoProfile() {
    navigation.navigate("profile");
  }

  useEffect(() => {
    const subscriber = firestore()
      .collection("sponsor")
      .where("email", "==", auth().currentUser.email)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as UserSponsorProps[];

        setInfoSponsor(data);
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
          {!infoSponsor[0]?.taxId ? (
            <InfoEmpty />
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              bg="gray.800"
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
                    CPF / CNPJ: {infoSponsor[0].taxId}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    I.E.: {infoSponsor[0].ie}
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
                    Contato: {infoSponsor[0].nameContact}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Telefone: {infoSponsor[0].phoneContact}
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
                    CEP: {infoSponsor[0].address?.zipCode}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={2}
                  >
                    {infoSponsor[0].address?.street},{" "}
                    {infoSponsor[0].numberAddress}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoSponsor[0].address?.neighborhood}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoSponsor[0].address?.city} -{" "}
                    {infoSponsor[0].address?.state}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoSponsor[0].complementAddress}
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
                    Deseja patrocinar? {infoSponsor[0]?.wantSponsor}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={3}
                  >
                    Categoria(s) de patrocínio:{" "}
                    {infoSponsor[0]?.categoryJuvenile ? "Juvenil   " : ""}
                    {infoSponsor[0]?.categorySport ? "Sport   " : ""}
                    {infoSponsor[0]?.categoryVeteran ? "Veterano   " : ""}
                    {infoSponsor[0]?.categoryFemale ? "Feminino   " : ""}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={3}
                  >
                    Tipo(s) de patrocínio:{" "}
                    {infoSponsor[0]?.sponsorSleeve ? "Manga   " : ""}
                    {infoSponsor[0]?.sponsorFront ? "Frente   " : ""}
                    {infoSponsor[0]?.sponsorBack ? "Costas   " : ""}
                    {infoSponsor[0]?.sponsorProducts
                      ? "Doação de Produtos "
                      : ""}
                  </Text>
                  {infoSponsor[0]?.sponsorOther ? (
                    <Text
                      color="white"
                      fontSize="sm"
                      mb={1}
                      fontFamily="body"
                      numberOfLines={2}
                    >
                      Outro(s) tipo(s):{" "}
                      {!!infoSponsor[0]?.sponsorOtherDescription
                        ? infoSponsor[0]?.sponsorOtherDescription
                        : "-"}
                    </Text>
                  ) : null}
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

                <Button title="Alterar" mt={4} onPress={handleGoProfile} />
              </VStack>
            </ScrollView>
          )}
        </>
      )}
    </>
  );
}
