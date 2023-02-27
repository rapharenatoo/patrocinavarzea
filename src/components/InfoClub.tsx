import { useState, useEffect } from "react";
import { Heading, VStack, ScrollView, Text, Center, Image } from "native-base";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { AppNavigatorRoutesProps } from "../routes/app.club.routes";

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

type UserClubProps = {
  id: string;
  name: string;
  email: string;
  taxId: string;
  address: Address;
  numberAddress?: string;
  complementAddress?: string;
  foundationDate: string;
  zone: string;
  clubColors: string;
  instagram: string;
  facebook: string;
  nameContact: string;
  phoneContact: string;
  categoryJuvenile: boolean;
  categorySport: boolean;
  categoryVeteran: boolean;
  categoryFemale: boolean;
  ownField: string;
  wantSponsorship: string;
  isSponsorship: string;
  endDate: string;
  createdAt: any;
  drawId: number;
};

export function InfoClub() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [infoClub, setInfoClub] = useState<UserClubProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection("club")
      .where("email", "==", auth().currentUser.email)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as UserClubProps[];

        setInfoClub(data);
        setIsLoading(false);
      });

    return () => subscriber();
  }, []);

  function handleGoProfile() {
    navigation.navigate("profile");
  }

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {!infoClub[0]?.taxId ? (
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
                    CPF / CNPJ: {infoClub[0]?.taxId}
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
                    Contato: {auth().currentUser.displayName}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Telefone: {infoClub[0]?.phoneContact}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Nº de registro: {infoClub[0]?.drawId}
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
                    CEP: {infoClub[0]?.address?.zipCode}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={2}
                  >
                    {infoClub[0]?.address?.street}, {infoClub[0]?.numberAddress}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoClub[0]?.address?.neighborhood}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoClub[0]?.address?.city} - {infoClub[0]?.address?.state}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    {infoClub[0]?.complementAddress}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Região / Zona: {infoClub[0]?.zone}
                  </Text>
                </VStack>

                <VStack pb={4}>
                  <Heading
                    color="yellow.400"
                    fontSize="md"
                    mb={2}
                    fontFamily="heading"
                  >
                    Redes sociais:
                  </Heading>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Instagram: {infoClub[0]?.instagram}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={2}
                  >
                    Facebook: {infoClub[0]?.facebook}
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
                    numberOfLines={2}
                  >
                    Categoria: {infoClub[0]?.categoryJuvenile ? "Juvenil   " : ""}
                    {infoClub[0]?.categorySport ? "Sport   " : ""}
                    {infoClub[0]?.categoryVeteran ? "Veterano   " : ""}
                    {infoClub[0]?.categoryFemale ? "Feminino   " : ""}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={2}
                  >
                    Cores do clube-time: {infoClub[0]?.clubColors}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Deseja receber patrocínio? {infoClub[0]?.wantSponsorship}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Já tem patrocínio? {infoClub[0]?.isSponsorship}
                  </Text>
                  {infoClub[0]?.isSponsorship === "SIM" && (
                    <Text
                      color="white"
                      fontSize="sm"
                      mb={1}
                      fontFamily="body"
                      numberOfLines={1}
                    >
                      Data de término: {infoClub[0]?.endDate}
                    </Text>
                  )}
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Tem campo próprio? {infoClub[0]?.ownField}
                  </Text>
                  <Text
                    color="white"
                    fontSize="sm"
                    mb={1}
                    fontFamily="body"
                    numberOfLines={1}
                  >
                    Data de fundação: {infoClub[0]?.foundationDate}
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

                <Button title="Alterar" mt={4} onPress={handleGoProfile} />
              </VStack>
            </ScrollView>
          )}
        </>
      )}
    </>
  );
}
