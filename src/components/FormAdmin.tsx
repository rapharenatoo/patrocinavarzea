import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, Center, Skeleton, Text, useToast } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import uuid from "react-native-uuid";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { UserPhoto } from "./UserPhoto";
import { Input } from "./Input";
import { Button } from "./Button";

type UserAdminProps = {
  id: string;
  name: string;
  email: string;
  phoneContact: string;
  createdAt: any;
};

const validationSchema = yup.object({
  name: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null)),
  phoneContact: yup
    .string()
    .required("Obrigatório")
    .min(10, "O telefone deve ter pelo menos 10 digítos"),
});

const PHOTO_SIZE = 24;

export function FormAdmin() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoAdmin, setInfoAdmin] = useState<UserAdminProps[]>([]);
  const toast = useToast();

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserAdminProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: auth().currentUser.displayName,
      email: auth().currentUser.email,
      phoneContact: String(infoAdmin[0]?.phoneContact),
    },
  });

  const validateUUIDUser =
    infoAdmin.length === 0 ? String(uuid.v4()) : String(infoAdmin[0]?.id);

  async function handleUserRegister(data: UserAdminProps) {
    setIsLoading(true);

    await firestore()
      .collection("admin")
      .doc(validateUUIDUser)
      .set({
        ...data,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        auth().currentUser.updateProfile({
          displayName: data.name,
        });

        navigation.navigate("home");
        const messageSuccess = toast.show({
          title: "Dados atualizados com sucesso.",
          placement: "top",
          bgColor: "green.500",
        });

        return messageSuccess;
      })
      .catch((error) => {
        setIsLoading(false);

        const messageError = toast.show({
          title: "Algo deu errado! Tente novamente mais tarde.",
          placement: "top",
          bgColor: "red.500",
        });
        console.log(error);
        return messageError;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Center flex={1} px={10} pb={10}>
        {photoIsLoading ? (
          <Skeleton
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            rounded="full"
            startColor="gray.500"
            endColor="gray.300"
          />
        ) : (
          <UserPhoto
            source={{
              uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.xn4yG10rX6X4uhzIgvk93QAAAA%26pid%3DApi&f=1&ipt=2b07fac776e7f1bbd226db1e92657e3d67c649a75fb064d4ae1faa5b5edb51bf&ipo=images",
            }}
            alt="Foto do usuário"
            size={PHOTO_SIZE}
          />
        )}
        <TouchableOpacity onPress={() => {}}>
          <Text
            color="yellow.400"
            fontWeight="bold"
            fontSize="md"
            mt={2}
            mb={8}
          >
            Alterar foto
          </Text>
        </TouchableOpacity>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Nome"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
              isDisabled
            />
          )}
        />

        <Controller
          control={control}
          name="phoneContact"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Telefone"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.phoneContact?.message}
            />
          )}
        />

        <Button
          title="Atualizar"
          mt={8}
          onPress={handleSubmit(handleUserRegister)}
          isLoading={isLoading}
        />

        <Button
          title="Voltar"
          variant="outline"
          mt={6}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Center>
    </ScrollView>
  );
}
