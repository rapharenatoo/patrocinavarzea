import React, { useState, useEffect, useCallback } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Center,
  Skeleton as SkeletonNative,
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
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { TextInputMask, TextInputMaskMethods } from "react-native-masked-text";
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { UserPhoto } from "./UserPhoto";
import { Input } from "./Input";
import { Button } from "./Button";
import { InputMask } from "./InputMask";
import { InputMaskTaxId } from "./InputMaskTaxId";
import { Skeleton } from "./Skeleton";
import { SelectTaxId } from "./SelectTaxId";

import DefaultUserPhotoImg from "../assets/userPhotoDefault.png";

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
  type: string;
  taxIdType: string;
  taxId: string;
  ie?: string;
  address: Address;
  numberAddress?: string;
  complementAddress?: string;
  nameContact?: string;
  phoneContact?: string;
  wantSponsor: string;
  createdAt: string;
};

type InputMask = TextInputMask & TextInputMaskMethods;

const PHOTO_SIZE = 24;

export function FormConfection() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
  const [wantSponsor, setWantSponsor] = useState("Não");
  const [taxIdType, setTaxIdType] = useState("cnpj");
  const [userPhoto, setUserPhoto] = useState(null);
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

  const staticValueRadioButton = [
    {
      id: 0,
      text: "Sim",
    },
    {
      id: 1,
      text: "Não",
    },
  ];

  useEffect(() => {
    setIsSkeletonLoading(true);

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
        setTaxIdType(data[0]?.taxIdType);
        setWantSponsor(data[0]?.wantSponsor);
        setAddress({
          zipCode: data[0]?.address?.zipCode,
          street: data[0]?.address?.street,
          neighborhood: data[0]?.address?.neighborhood,
          state: data[0]?.address?.state,
          city: data[0]?.address?.city,
        });
        setIsSkeletonLoading(false);
      });

    return () => subscriber();
  }, []);

  const validationSchema = yup.object({
    name: yup
      .string()
      .nullable()
      .transform((value) => (!!value ? value : null)),
    taxId: yup
      .string()
      .required("Informe o CPF / CNPJ")
      .default(infoConfection[0]?.taxId),
    ie: yup.string().required("Informe o I.E.").default(infoConfection[0]?.ie),
    address: yup.object({
      zipCode: yup
        .string()
        .required("Informe o CEP")
        .min(8, "O CEP deve ter pelo menos 8 caracteres")
        .default(infoConfection[0]?.address?.zipCode),
      street: yup
        .string()
        .required("Informe o endereço")
        .default(infoConfection[0]?.address?.street),
      neighborhood: yup
        .string()
        .required("Informe o bairro")
        .default(infoConfection[0]?.address?.neighborhood),
      state: yup
        .string()
        .required("Informe o ES")
        .default(infoConfection[0]?.address?.state),
      city: yup
        .string()
        .required("Informe o cidade")
        .default(infoConfection[0]?.address?.city),
    }),
    numberAddress: yup
      .string()
      .required("Informe o Nº")
      .default(infoConfection[0]?.numberAddress),
    complementAddress: yup
      .string()
      .default(infoConfection[0]?.complementAddress),
    nameContact: yup
      .string()
      .default(
        infoConfection[0]?.nameContact ? infoConfection[0]?.nameContact : ""
      ),
    phoneContact: yup
      .string()
      .min(10, "O telefone deve ter pelo menos 10 digítos")
      .default(
        infoConfection[0]?.phoneContact ? infoConfection[0]?.phoneContact : ""
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserConfectionProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: auth().currentUser.displayName,
      email: auth().currentUser.email,
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

  // const getAddressFromApi = useCallback(() => {
  //   const code = address.zipCode?.replace(/[^0-9]/g, "");

  //   if (code?.length !== 8) {
  //     return;
  //   }

  //   const url = `https://viacep.com.br/ws/${code}/json/`;

  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data: any) => {
  //       setAddress({
  //         zipCode: data.cep,
  //         street: data.logradouro,
  //         neighborhood: data.bairro,
  //         state: data.uf,
  //         city: data.localidade,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("Error: ", error);
  //     });
  // }, [address?.zipCode]);

  async function handleUserRegister(data: UserConfectionProps) {
    setIsLoading(true);

    await firestore()
      .collection("confection")
      .doc(infoConfection[0]?.id)
      .set({
        ...data,
        email: auth().currentUser.email,
        taxIdType: taxIdType,
        // address: {
        //   zipCode: address.zipCode,
        //   street: address.street,
        //   neighborhood: address.neighborhood,
        //   state: address.state,
        //   city: address.city,
        // },
        wantSponsor: wantSponsor,
        type: "confection",
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
          <VStack flex={1} px={10} pb={10}>
            <Center flex={1} mt={10}>
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

            <SelectTaxId
              type={taxIdType}
              onChange={setTaxIdType}
              defaultValue={taxIdType}
              errorMessage={errors.taxIdType?.message}
            />

            <Controller
              control={control}
              name="taxId"
              render={({ field: { onChange, value } }) =>
                taxIdType === "cnpj" ? (
                  <InputMaskTaxId
                    placeholder="CNPJ"
                    type={"cnpj"}
                    value={
                      infoConfection[0]?.taxId
                        ? infoConfection[0]?.taxId
                        : value
                    }
                    onChangeText={onChange}
                    defaultValue={infoConfection[0]?.taxId}
                    errorMessage={errors.taxId?.message}
                    getElement={function (): TextInput {
                      throw new Error("Function not implemented.");
                    }}
                    getRawValue={function (): string {
                      throw new Error("Function not implemented.");
                    }}
                    isValid={function (): boolean {
                      throw new Error("Function not implemented.");
                    }}
                  />
                ) : (
                  <InputMaskTaxId
                    placeholder="CPF"
                    type={"cpf"}
                    value={
                      infoConfection[0]?.taxId
                        ? infoConfection[0]?.taxId
                        : value
                    }
                    onChangeText={onChange}
                    defaultValue={infoConfection[0]?.taxId}
                    errorMessage={errors.taxId?.message}
                    getElement={function (): TextInput {
                      throw new Error("Function not implemented.");
                    }}
                    getRawValue={function (): string {
                      throw new Error("Function not implemented.");
                    }}
                    isValid={function (): boolean {
                      throw new Error("Function not implemented.");
                    }}
                  />
                )
              }
            />

            <Controller
              control={control}
              name="ie"
              render={({ field: { onChange, value } }) => (
                <InputMaskTaxId
                  placeholder="I.E."
                  type={"only-numbers"}
                  value={infoConfection[0]?.ie ? infoConfection[0]?.ie : value}
                  onChangeText={onChange}
                  defaultValue={infoConfection[0]?.ie}
                  errorMessage={errors.ie?.message}
                  getElement={function (): TextInput {
                    throw new Error("Function not implemented.");
                  }}
                  getRawValue={function (): string {
                    throw new Error("Function not implemented.");
                  }}
                  isValid={function (): boolean {
                    throw new Error("Function not implemented.");
                  }}
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
                <InputMask
                  placeholder="CEP"
                  type="zip-code"
                  value={
                    infoConfection[0]?.address?.zipCode
                      ? infoConfection[0]?.address?.zipCode
                      : value
                  }
                  onChange={onChange}
                  defaultValue={infoConfection[0]?.address?.zipCode}
                  errorMessage={errors.address?.zipCode?.message}
                  getElement={function (): TextInput {
                    throw new Error("Function not implemented.");
                  }}
                  getRawValue={function (): string {
                    throw new Error("Function not implemented.");
                  }}
                  isValid={function (): boolean {
                    throw new Error("Function not implemented.");
                  }}
                  keyboardType="numeric"
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
                  onChangeText={
                    onChange
                    //   (value) => {
                    //   setAddress((old) => ({
                    //     ...old,
                    //     street: value,
                    //   }));
                    // }
                  }
                  value={value}
                  defaultValue={infoConfection[0]?.address?.street}
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
                      defaultValue={infoConfection[0]?.numberAddress}
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
                      onChangeText={
                        onChange
                        //   (value) => {
                        //   setAddress((old) => ({
                        //     ...old,
                        //     neighborhood: value,
                        //   }));
                        // }
                      }
                      value={value}
                      defaultValue={infoConfection[0]?.address?.neighborhood}
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
                      onChangeText={(value) => {
                        setAddress((old) => ({
                          ...old,
                          state: value,
                        }));
                      }}
                      value={address.state}
                      defaultValue={infoConfection[0]?.address?.state}
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
                      onChangeText={(value) => {
                        setAddress((old) => ({
                          ...old,
                          city: value,
                        }));
                      }}
                      value={address.city}
                      defaultValue={infoConfection[0]?.address?.city}
                      errorMessage={errors.address?.city?.message}
                    />
                  )}
                />
              </HStack>
            </HStack>

            <Controller
              control={control}
              name="complementAddress"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Complemento"
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoConfection[0]?.complementAddress}
                  errorMessage={errors.complementAddress?.message}
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
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoConfection[0]?.nameContact}
                  errorMessage={errors.nameContact?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phoneContact"
              render={({ field: { onChange, value } }) => (
                <InputMask
                  placeholder="Telefone"
                  type="cel-phone"
                  options={{
                    maskType: "BRL",
                    withDDD: true,
                    dddMask: "(99) ",
                  }}
                  value={
                    infoConfection[0]?.phoneContact
                      ? infoConfection[0]?.phoneContact
                      : value
                  }
                  onChange={onChange}
                  defaultValue={infoConfection[0]?.phoneContact}
                  errorMessage={errors.phoneContact?.message}
                  getElement={function (): TextInput {
                    throw new Error("Function not implemented.");
                  }}
                  getRawValue={function (): string {
                    throw new Error("Function not implemented.");
                  }}
                  isValid={function (): boolean {
                    throw new Error("Function not implemented.");
                  }}
                  keyboardType="numeric"
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

            <VStack mb={4}>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
                Quer patrocinar?
              </Text>
              <BouncyCheckboxGroup
                data={staticValueRadioButton}
                initial={wantSponsor === "Sim" ? 0 : 1}
                style={{
                  borderColor: "#eab308",
                  marginTop: 2,
                }}
                checkboxProps={{
                  fillColor: "#eab308",
                  unfillColor: "white",
                  iconStyle: {
                    borderColor: "#eab308",
                  },
                  size: 20,
                  textStyle: {
                    textDecorationLine: "none",
                    fontFamily: "Roboto_400Regular",
                    color: "white",
                    fontSize: 14,
                    marginRight: 20,
                  },
                }}
                onChange={(selectedItem: ICheckboxButton) => {
                  setWantSponsor(String(selectedItem.text));
                }}
              />
            </VStack>

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
      )}
    </>
  );
}
