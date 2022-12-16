import { useState, useEffect } from "react";
import { Heading, VStack, ScrollView, Text, Center, Image } from "native-base";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { Button } from "./Button";
import { InfoEmpty } from "./InfoEmpty";

import IllustrationImg from "../assets/icon.png";

type UserAdminProps = {
  id: string;
  name: string;
  email: string;
  phoneContact: string;
};

export function InfoAdmin() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [infoAdmin, setInfoAdmin] = useState<UserAdminProps[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  function handleGoProfile() {
    navigation.navigate("profile");
    console.log(">>>>>>>");
  }

  useEffect(() => {
    const subscriber = firestore()
      .collection("admin")
      .where("email", "==", auth().currentUser.email)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as UserAdminProps[];

        setInfoAdmin(data);
      });

    return () => subscriber();
  }, []);

  return (
    <>
      {infoAdmin.length === 0 ? (
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
                {infoAdmin[0].email}
              </Text>
              <Text
                color="white"
                fontSize="sm"
                mb={1}
                fontFamily="body"
                numberOfLines={1}
              >
                Telefone: {infoAdmin[0].phoneContact}
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
  );
}
