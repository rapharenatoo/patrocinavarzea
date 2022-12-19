import React, { useState, useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Center,
  Skeleton,
  Text,
  useToast,
  VStack,
  Heading,
  HStack,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import uuid from "react-native-uuid";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { UserPhoto } from "./UserPhoto";
import { Input } from "./Input";
import { Button } from "./Button";

import defaultUserPhotoImg from "../assets/userPhotoDefault.png";

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
  foundationDate: string;
  zone: string;
  clubColors: string;
  instagram: string;
  facebook: string;
  nameContact: string;
  phoneContact: string;
  ownField: string;
  wantSponsorship: string;
  isSponsorship: string;
  endDate: string;
  createdAt: any;
  drawId: number;
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

export function FormClub() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoClub, setInfoClub] = useState<UserClubProps[]>([]);
  const [userPhoto, setUserPhoto] = useState(null);

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
      });

    return () => subscriber();
  }, []);

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserClubProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: auth().currentUser.displayName,
      email: auth().currentUser.email,
      phoneContact: String(infoClub[0]?.phoneContact),
    },
  });

  const validateUUIDUser =
    infoClub.length === 0 ? String(uuid.v4()) : String(infoClub[0]?.id);

  async function handleUserRegister(data: UserClubProps) {
    setIsLoading(true);

    await firestore()
      .collection("club")
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
      <VStack flex={1} px={10} pb={10}>
        <Center flex={1} mt={10}>
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
                uri: userPhoto,
              }}
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
        </Center>
        <Heading
          color="yellow.400"
          fontSize="sm"
          mb={2}
          alignSelf="flex-start"
          fontFamily="heading"
        >
          Nº de registro: {!!infoClub[0]?.drawId ? infoClub[0]?.drawId : "-"}
        </Heading>
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

        <Input bg="gray.600" placeholder="PF ou PJ" />

        <Controller
          control={control}
          name="taxId"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="CPF / CNPJ"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.taxId?.message}
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

        <Heading
          color="yellow.400"
          fontSize="sm"
          mb={2}
          alignSelf="flex-start"
          mt={6}
          fontFamily="heading"
        >
          Endereço
        </Heading>

        <Controller
          control={control}
          name="address.zipCode"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="CEP"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.address?.zipCode?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="address.street"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Endereço"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.address?.street?.message}
            />
          )}
        />

        <HStack w="full">
          <HStack w={20} mr={2}>
            <Controller
              control={control}
              name="numberAddress"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Nº"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.numberAddress?.message}
                />
              )}
            />
          </HStack>
          <HStack w={48}>
            <Controller
              control={control}
              name="address.neighborhood"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Bairro"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.address?.neighborhood?.message}
                />
              )}
            />
          </HStack>
        </HStack>

        <HStack w="full">
          <HStack w={20} mr={2}>
            <Controller
              control={control}
              name="address.state"
              render={({ field: { onChange, value } }) => (
                <Input
                  w={20}
                  bg="gray.600"
                  placeholder="ES"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.address?.state?.message}
                />
              )}
            />
          </HStack>
          <HStack w={48}>
            <Controller
              control={control}
              name="address.city"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Cidade"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.address?.city?.message}
                />
              )}
            />
          </HStack>
        </HStack>

        <Controller
          control={control}
          name="zone"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Região / Zona"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.zone?.message}
            />
          )}
        />

        <Heading
          color="yellow.400"
          fontSize="sm"
          mb={2}
          alignSelf="flex-start"
          mt={6}
          fontFamily="heading"
        >
          Redes socias
        </Heading>

        <Controller
          control={control}
          name="instagram"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Instagram"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.instagram?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="facebook"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Facebook"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.facebook?.message}
            />
          )}
        />

        <Heading
          color="yellow.400"
          fontSize="sm"
          mb={2}
          alignSelf="flex-start"
          mt={6}
          fontFamily="heading"
        >
          Informações de contato
        </Heading>

        <Controller
          control={control}
          name="nameContact"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Nome do contato"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.nameContact?.message}
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

        <Heading
          color="yellow.400"
          fontSize="sm"
          mb={2}
          alignSelf="flex-start"
          mt={6}
          fontFamily="heading"
        >
          Informações do clube - time
        </Heading>

        <Controller
          control={control}
          name="foundationDate"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Data de fundação"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.foundationDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="clubColors"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Cores do clube - time"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.clubColors?.message}
            />
          )}
        />

        {/* ALTERAR PARA O COMPONENTE CORRETO */}
        <Controller
          control={control}
          name="ownField"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Campo próprio?"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.ownField?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="wantSponsorship"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Deseja receber patrocínio?"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.wantSponsorship?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="isSponsorship"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Tem patrocínio?"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.isSponsorship?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Término do patrocínio"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.endDate?.message}
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
      </VStack>
    </ScrollView>
  );
}
