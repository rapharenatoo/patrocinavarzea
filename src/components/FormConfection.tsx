import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
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

export function FormConfection() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoConfection, setInfoConfection] = useState<UserConfectionProps[]>(
    []
  );
  const [address, setAddress] = React.useState<Address>({
    zipCode: "",
    street: "",
    neighborhood: "",
    state: "",
    city: "",
  });

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
      });

    return () => subscriber();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserConfectionProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: auth().currentUser.displayName,
      email: auth().currentUser.email,
      phoneContact: String(infoConfection[0]?.phoneContact),
    },
  });

  const validateUUIDUser =
    infoConfection.length === 0
      ? String(uuid.v4())
      : String(infoConfection[0]?.id);

  async function handleUserRegister(data: UserConfectionProps) {
    setIsLoading(true);

    await firestore()
      .collection("confection")
      .doc(validateUUIDUser)
      .set({
        ...data,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        auth().currentUser.updateProfile({
          displayName: data.name,
        });

        navigation.navigate("profileInfo");
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
        </Center>
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
          name="ie"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="I.E."
              onChangeText={onChange}
              value={value}
              errorMessage={errors.ie?.message}
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
          Informações da confecção
        </Heading>

        <Controller
          control={control}
          name="wantSponsor"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Deseja patrocinar? RadioButton"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.wantSponsor?.message}
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
