import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Radio,
  FormControl,
  Checkbox,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { TextInputMask, TextInputMaskMethods } from "react-native-masked-text";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { UserPhoto } from "./UserPhoto";
import { Input } from "./Input";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { SelectTaxId } from "./SelectTaxId";
import { SelectZone } from "./SelectZone";
import { InputMask } from "./InputMask";
import { InputMaskTaxId } from "./InputMaskTaxId";

import DefaultUserPhotoImg from "../assets/userPhotoDefault.png";

type DrawIdClub = {
  id: string;
  drawId: number;
};

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
  type: string;
  taxIdType: string;
  taxId: string;
  address?: Address;
  numberAddress?: string;
  foundationDate?: string;
  complementAddress?: string;
  zone?: string;
  clubColors?: string;
  instagram?: string;
  facebook?: string;
  nameContact?: string;
  phoneContact?: string;
  category: Array<string>;
  ownField: string;
  wantSponsorship: string;
  isSponsorship: string;
  endDate?: string;
  createdAt: any;
  drawId: number;
};

type InputMask = TextInputMask & TextInputMaskMethods;

const PHOTO_SIZE = 24;

export function FormClub() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
  const [infoClub, setInfoClub] = useState<UserClubProps[]>([]);
  const [userPhoto, setUserPhoto] = useState(null);
  const [ownField, setOwnField] = useState("");
  const [wantSponsorship, setWantSponsorship] = useState("");
  const [isSponsorship, setIsSponsorship] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [zone, setZone] = useState("");
  const [drawId, setDrawId] = useState<DrawIdClub[]>([]);
  const [taxIdType, setTaxIdType] = useState("cnpj");
  const [address, setAddress] = useState<Address>({
    zipCode: "",
    street: "",
    neighborhood: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    setIsSkeletonLoading(true);

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
        setTaxIdType(data[0]?.taxIdType);
        setOwnField(data[0]?.ownField);
        setWantSponsorship(data[0]?.wantSponsorship);
        setIsSponsorship(data[0]?.isSponsorship);
        setCategory(data[0]?.category);
        setZone(data[0]?.zone);
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

  useEffect(() => {
    const subscriber = firestore()
      .collection("club")
      .orderBy("drawId", "desc")
      .limit(1)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            drawId: doc.data().drawId,
          };
        }) as DrawIdClub[];

        setDrawId(data);
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
      .default(String(infoClub[0]?.taxId)),
    taxIdType: yup
      .string()

      .default(infoClub[0]?.taxIdType),
    address: yup.object({
      zipCode: yup
        .string()
        .required("Informe o CEP")
        .min(8, "O CEP deve ter pelo menos 8 caracteres")
        .default(infoClub[0]?.address?.zipCode),
      street: yup
        .string()
        .required("Informe o endereço")
        .default(infoClub[0]?.address?.street),
      neighborhood: yup
        .string()
        .required("Informe o bairro")
        .default(infoClub[0]?.address?.neighborhood),
      state: yup
        .string()
        .required("Informe o ES")
        .default(infoClub[0]?.address?.state),
      city: yup
        .string()
        .required("Informe o cidade")
        .default(infoClub[0]?.address?.city),
    }),
    numberAddress: yup
      .string()
      .required("Informe o Nº")
      .default(infoClub[0]?.numberAddress),
    complementAddress: yup.string().default(infoClub[0]?.complementAddress),
    zone: yup
      .string()
      .required("Informe a Região / Zona")
      .default(infoClub[0]?.zone),
    foundationDate: yup
      .string()
      .default(infoClub[0]?.foundationDate ? infoClub[0]?.foundationDate : ""),
    clubColors: yup
      .string()
      .default(infoClub[0]?.clubColors ? infoClub[0]?.clubColors : ""),
    instagram: yup
      .string()
      .default(infoClub[0]?.instagram ? infoClub[0]?.instagram : ""),
    facebook: yup
      .string()
      .default(infoClub[0]?.facebook ? infoClub[0]?.facebook : ""),
    nameContact: yup
      .string()
      .default(infoClub[0]?.nameContact ? infoClub[0]?.nameContact : ""),
    phoneContact: yup
      .string()
      .min(10, "O telefone deve ter pelo menos 10 digítos")
      .default(infoClub[0]?.phoneContact ? infoClub[0]?.phoneContact : ""),
    endDate: yup.string().default(infoClub[0]?.endDate),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserClubProps>({
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

  const getDrawId = !infoClub[0]?.drawId
    ? Number(drawId[0]?.drawId) + 1
    : Number(infoClub[0]?.drawId);

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

  async function handleUserRegister(data: UserClubProps) {
    setIsLoading(true);

    await firestore()
      .collection("club")
      .doc(infoClub[0]?.id)
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
        category: category,
        ownField: ownField,
        wantSponsorship: wantSponsorship,
        isSponsorship: isSponsorship,
        drawId: getDrawId,
        type: "club",
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
            <Heading
              color="yellow.400"
              fontSize="sm"
              mb={2}
              alignSelf="flex-start"
              fontFamily="heading"
            >
              Nº de registro: {infoClub[0]?.drawId}
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
                    value={infoClub[0]?.taxId ? infoClub[0]?.taxId : value}
                    onChangeText={onChange}
                    defaultValue={infoClub[0]?.taxId}
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
                    value={infoClub[0]?.taxId ? infoClub[0]?.taxId : value}
                    onChangeText={onChange}
                    defaultValue={infoClub[0]?.taxId}
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
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
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
                    infoClub[0]?.address?.zipCode
                      ? infoClub[0]?.address?.zipCode
                      : value
                  }
                  onChange={onChange}
                  defaultValue={infoClub[0]?.address?.zipCode}
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
                  defaultValue={infoClub[0]?.address?.street}
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
                      defaultValue={infoClub[0]?.numberAddress}
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
                      defaultValue={infoClub[0]?.address?.neighborhood}
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
                      onChangeText={
                        onChange
                        //   (value) => {
                        //   setAddress((old) => ({
                        //     ...old,
                        //     state: value,
                        //   }));
                        // }
                      }
                      value={value}
                      defaultValue={infoClub[0]?.address?.state}
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
                      onChangeText={
                        onChange
                        //   (value) => {
                        //   setAddress((old) => ({
                        //     ...old,
                        //     city: value,
                        //   }));
                        // }
                      }
                      value={value}
                      defaultValue={infoClub[0]?.address?.city}
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
                  defaultValue={infoClub[0]?.complementAddress}
                  errorMessage={errors.complementAddress?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="zone"
              render={({ field: { onChange, value } }) => (
                <SelectZone zone={zone} onChange={onChange} />
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
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoClub[0]?.instagram}
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
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoClub[0]?.facebook}
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
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoClub[0]?.nameContact}
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
                    infoClub[0]?.phoneContact
                      ? infoClub[0]?.phoneContact
                      : value
                  }
                  onChange={onChange}
                  defaultValue={infoClub[0]?.phoneContact}
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
              Informações do clube - time
            </Heading>

            <Controller
              control={control}
              name="foundationDate"
              render={({ field: { onChange, value } }) => (
                <InputMask
                  placeholder="Data de fundação"
                  type={"datetime"}
                  options={{
                    format: "DD/MM/YYYY",
                  }}
                  value={
                    infoClub[0]?.foundationDate
                      ? infoClub[0]?.foundationDate
                      : value
                  }
                  onChange={onChange}
                  defaultValue={infoClub[0]?.foundationDate}
                  errorMessage={errors.foundationDate?.message}
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
              name="clubColors"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Cores do clube - time"
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoClub[0]?.clubColors}
                  errorMessage={errors.clubColors?.message}
                />
              )}
            />

            <VStack mb={4}>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
                Categoria:
              </Text>
              <FormControl>
                <Checkbox.Group
                  accessibilityLabel="Categoria:"
                  defaultValue={category}
                  onChange={setCategory}
                  value={category}
                >
                  <HStack space={5}>
                    <Checkbox
                      value="Juvenil"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Juvenil
                    </Checkbox>
                    <Checkbox
                      value="Sport"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Sport
                    </Checkbox>
                  </HStack>
                  <HStack space={2}>
                    <Checkbox
                      value="Veterano"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Veterano
                    </Checkbox>
                    <Checkbox
                      value="Feminino"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Feminino
                    </Checkbox>
                  </HStack>
                </Checkbox.Group>

                <FormControl.ErrorMessage _text={{ color: "red.500" }}>
                  {errors.category?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <VStack mb={4}>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
                Campo próprio?
              </Text>
              <Radio.Group
                name="ownField"
                accessibilityLabel="campo próprio"
                value={ownField}
                onChange={(e) => {
                  setOwnField(e);
                }}
              >
                <HStack space={4}>
                  <Radio
                    value="SIM"
                    colorScheme="yellow"
                    size="sm"
                    my={1}
                    _text={{
                      color: "gray.100",
                      fontSize: "sm",
                      fontFamily: "body",
                    }}
                  >
                    Sim
                  </Radio>
                  <Radio
                    value="NÃO"
                    colorScheme="yellow"
                    size="sm"
                    my={1}
                    _text={{
                      color: "gray.100",
                      fontSize: "sm",
                      fontFamily: "body",
                    }}
                  >
                    Não
                  </Radio>
                </HStack>
              </Radio.Group>
            </VStack>

            <VStack mb={4}>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
                Deseja receber patrocínio?
              </Text>
              <Radio.Group
                name="wantSponsorship"
                accessibilityLabel="receber patrocínio"
                value={wantSponsorship}
                onChange={(e) => {
                  setWantSponsorship(e);
                }}
              >
                <HStack space={4}>
                  <Radio
                    value="SIM"
                    colorScheme="yellow"
                    size="sm"
                    my={1}
                    _text={{
                      color: "gray.100",
                      fontSize: "sm",
                      fontFamily: "body",
                    }}
                  >
                    Sim
                  </Radio>
                  <Radio
                    value="NÃO"
                    colorScheme="yellow"
                    size="sm"
                    my={1}
                    _text={{
                      color: "gray.100",
                      fontSize: "sm",
                      fontFamily: "body",
                    }}
                  >
                    Não
                  </Radio>
                </HStack>
              </Radio.Group>
            </VStack>

            <VStack mb={4}>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
                Tem patrocínio?
              </Text>
              <Radio.Group
                name="isSponsorship"
                accessibilityLabel="tem patrocínio"
                value={isSponsorship}
                onChange={(e) => {
                  setIsSponsorship(e);
                }}
              >
                <HStack space={4}>
                  <Radio
                    value="SIM"
                    colorScheme="yellow"
                    size="sm"
                    my={1}
                    _text={{
                      color: "gray.100",
                      fontSize: "sm",
                      fontFamily: "body",
                    }}
                  >
                    Sim
                  </Radio>
                  <Radio
                    value="NÃO"
                    colorScheme="yellow"
                    size="sm"
                    my={1}
                    _text={{
                      color: "gray.100",
                      fontSize: "sm",
                      fontFamily: "body",
                    }}
                  >
                    Não
                  </Radio>
                </HStack>
              </Radio.Group>
            </VStack>

            {isSponsorship === "SIM" && (
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <InputMask
                    placeholder="Término do patrocínio"
                    type={"datetime"}
                    options={{
                      format: "DD/MM/YYYY",
                    }}
                    value={infoClub[0]?.endDate ? infoClub[0]?.endDate : value}
                    onChange={onChange}
                    defaultValue={infoClub[0]?.endDate}
                    errorMessage={errors.endDate?.message}
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
            )}

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
