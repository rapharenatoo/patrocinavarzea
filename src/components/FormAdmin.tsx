import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Center,
  Skeleton as SkeletonNative,
  Text,
  useToast,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { UserPhoto } from "./UserPhoto";
import { Input } from "./Input";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";

import DefaultUserPhotoImg from "../assets/userPhotoDefault.png";

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
    .required("Informe o telefone")
    .min(10, "O telefone deve ter pelo menos 10 digítos"),
});

const PHOTO_SIZE = 24;

export function FormAdmin() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
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
        setIsSkeletonLoading(false);
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
      phoneContact: !!infoAdmin[0]?.phoneContact
        ? infoAdmin[0]?.phoneContact
        : "",
    },
  });

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
            placement: "top",
            bgColor: "red.500",
          });
        }
        await auth().currentUser.updateProfile({
          photoURL: photoSelected.assets[0].uri,
        });

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleUserRegister(data: UserAdminProps) {
    setIsLoading(true);

    await firestore()
      .collection("admin")
      .doc(infoAdmin[0]?.id)
      .set({
        ...data,
        email: auth().currentUser.email,
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
    <>
      {isSkeletonLoading ? (
        <Skeleton />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Center flex={1} px={10} pb={10}>
            {photoIsLoading ? (
              <SkeletonNative
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.300"
              />
            ) : (
              <UserPhoto
                source={
                  auth().currentUser?.photoURL
                    ? { uri: auth().currentUser?.photoURL }
                    : DefaultUserPhotoImg
                }
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              />
            )}
            <TouchableOpacity onPress={handleUserPhotoSelect}>
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
                  value={value} // HERE
                  defaultValue={infoAdmin[0]?.phoneContact}
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
      )}
    </>
  );
}
