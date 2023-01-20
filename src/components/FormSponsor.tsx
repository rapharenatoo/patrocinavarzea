import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
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

import { AppNavigatorRoutesProps } from "../routes/app.sponsor.routes";

import { UserPhoto } from "./UserPhoto";
import { Input } from "./Input";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";

import DefaultUserPhotoImg from "../assets/userPhotoDefault.png";

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
  nameContact: string;
  phoneContact: string;
  wantSponsor: string;
  categoryTeamsSponsor: Array<string>;
  sponsorshipType: Array<string>;
  otherSponsorship: string;
  sponsorships: Sponsorships[];
  createdAt: string;
};

const PHOTO_SIZE = 24;

export function FormSponsor() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
  const [infoSponsor, setInfoSponsor] = useState<UserSponsorProps[]>([]);
  const [userPhoto, setUserPhoto] = useState(null);
  const [wantSponsor, setWantSponsor] = useState("");
  const [categoryTeamsSponsor, setCategoryTeamsSponsor] = useState<string[]>(
    []
  );
  const [sponsorshipType, setSponsorshipType] = useState<string[]>([]);
  const [otherSponsorship, setOtherSponsorship] = useState(false);
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
        setWantSponsor(data[0]?.wantSponsor);
        setCategoryTeamsSponsor(data[0]?.categoryTeamsSponsor);
        setSponsorshipType(data[0]?.sponsorshipType);
        setIsSkeletonLoading(false);
      });

    return () => subscriber();
  }, []);

  const validationSchema = yup.object({
    name: yup
      .string()
      .nullable()
      .transform((value) => (!!value ? value : null)),
    // type: yup.string().required("Selecione CPF ou CNPJ"),
    taxId: yup
      .string()
      .required("Informe o CPF / CNPJ")
      .default(infoSponsor[0]?.taxId),
    ie: yup.string().required("Informe o I.E.").default(infoSponsor[0]?.ie),
    address: yup.object({
      zipCode: yup
        .string()
        .required("Informe o CEP")
        .min(8, "O CEP deve ter pelo menos 8 caracteres")
        .default(infoSponsor[0]?.address?.zipCode),
      street: yup
        .string()
        .required("Informe o endereço")
        .default(infoSponsor[0]?.address?.street),
      neighborhood: yup
        .string()
        .required("Informe o bairro")
        .default(infoSponsor[0]?.address?.neighborhood),
      state: yup
        .string()
        .required("Informe o ES")
        .default(infoSponsor[0]?.address?.state),
      city: yup
        .string()
        .required("Informe o cidade")
        .default(infoSponsor[0]?.address?.city),
    }),
    numberAddress: yup
      .string()
      .required("Informe o Nº")
      .default(infoSponsor[0]?.numberAddress),
    nameContact: yup
      .string()
      .default(infoSponsor[0]?.nameContact ? infoSponsor[0]?.nameContact : ""),
    phoneContact: yup
      .string()
      .min(10, "O telefone deve ter pelo menos 10 digítos")
      .default(
        infoSponsor[0]?.phoneContact ? infoSponsor[0]?.phoneContact : ""
      ),
    otherSponsorship: yup
      .string()
      .default(
        infoSponsor[0]?.otherSponsorship ? infoSponsor[0]?.otherSponsorship : ""
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSponsorProps>({
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

  async function handleUserRegister(data: UserSponsorProps) {
    setIsLoading(true);

    await firestore()
      .collection("sponsor")
      .doc(infoSponsor[0]?.id)
      .set({
        ...data,
        wantSponsor: wantSponsor,
        categoryTeamsSponsor: categoryTeamsSponsor,
        sponsorshipType: sponsorshipType,
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

            {/* <Input bg="gray.600" placeholder="PF ou PJ" /> */}

            <Controller
              control={control}
              name="taxId"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="CPF / CNPJ"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoSponsor[0]?.taxId}
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
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoSponsor[0]?.ie}
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
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoSponsor[0]?.address?.zipCode}
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
                  defaultValue={infoSponsor[0]?.address?.street}
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
                      defaultValue={infoSponsor[0]?.numberAddress}
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
                      defaultValue={infoSponsor[0]?.address?.neighborhood}
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
                      defaultValue={infoSponsor[0]?.address?.state}
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
                      defaultValue={infoSponsor[0]?.address?.city}
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
                  onChangeText={onChange}
                  value={value}
                  defaultValue={infoSponsor[0]?.nameContact}
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
                  defaultValue={infoSponsor[0]?.phoneContact}
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
              Informações do patrocinador
            </Heading>

            <VStack mb={4}>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
                Deseja patrocinar?
              </Text>
              <Radio.Group
                name="wantSponsor"
                accessibilityLabel="patrocinar"
                value={wantSponsor}
                onChange={(e) => {
                  setWantSponsor(e);
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
                Quantidade de times à patrtocinar:
              </Text>
              <FormControl>
                <Checkbox.Group
                  accessibilityLabel="tipos de times para patrocinar"
                  defaultValue={categoryTeamsSponsor}
                  onChange={setCategoryTeamsSponsor}
                  value={categoryTeamsSponsor}
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
                  {errors.categoryTeamsSponsor?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <VStack>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
                Tipo de patrocínio:
              </Text>
              <FormControl>
                <Checkbox.Group
                  accessibilityLabel="tipos de times para patrocinar"
                  defaultValue={sponsorshipType}
                  onChange={setSponsorshipType}
                  value={sponsorshipType}
                >
                  <HStack space={5}>
                    <Checkbox
                      value="Manga"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Manga
                    </Checkbox>
                    <Checkbox
                      value="Frente"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Frente
                    </Checkbox>
                  </HStack>
                  <HStack space={5}>
                    <Checkbox
                      value="Costas"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Costas
                    </Checkbox>
                    <Checkbox
                      value="Doação de produtos"
                      my={2}
                      colorScheme="yellow"
                      _text={{
                        mx: 2,
                        color: "white",
                        fontSize: "sm",
                        fontFamily: "body",
                      }}
                    >
                      Doação de produtos
                    </Checkbox>
                  </HStack>
                </Checkbox.Group>
                <Checkbox
                  value="other"
                  isChecked={otherSponsorship}
                  onChange={setOtherSponsorship}
                  mt={2}
                  mb={4}
                  colorScheme="yellow"
                  _text={{
                    mx: 2,
                    color: "white",
                    fontSize: "sm",
                    fontFamily: "body",
                  }}
                >
                  Outro
                </Checkbox>
                {otherSponsorship && (
                  <Controller
                    control={control}
                    name="otherSponsorship"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        bg="gray.600"
                        placeholder="Outros patrocínios"
                        onChangeText={onChange}
                        value={value}
                        defaultValue={infoSponsor[0]?.otherSponsorship}
                        errorMessage={errors.otherSponsorship?.message}
                      />
                    )}
                  />
                )}

                <FormControl.ErrorMessage _text={{ color: "red.500" }}>
                  {errors.sponsorshipType?.message}
                </FormControl.ErrorMessage>
              </FormControl>
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
