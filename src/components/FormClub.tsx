import React, { useState, useEffect, useRef } from "react";
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
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import uuid from "react-native-uuid";
import { TextInputMask, TextInputMaskMethods } from "react-native-masked-text";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { UserPhoto } from "./UserPhoto";
import { Input } from "./Input";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { SelectTaxId } from "../components/SelectTaxId";
import { RadioButton } from "./RadioButton";

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
  type: string;
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
  type: yup.string().required("Selecione CPF ou CNPJ"),
  taxId: yup.string().required("Obrigatório"),
  address: yup.object({
    zipCode: yup
      .string()
      .required("Informe o CEP")
      .min(8, "O CEP deve ter pelo menos 8 caracteres"),
    street: yup.string().required("Informe o endereço"),
    neighborhood: yup.string().required("Informe o bairro"),
    state: yup.string().required("Informe o ES"),
    city: yup.string().required("Informe o cidade"),
  }),
  numberAddress: yup.string().required("Informe o Nº"),
  foundationDate: yup.string(),
  zone: yup.string(),
  clubColors: yup.string(),
  instagram: yup.string(),
  facebook: yup.string(),
  nameContact: yup.string(),
  endDate: yup.string(),
});

type InputMask = TextInputMask & TextInputMaskMethods;

const PHOTO_SIZE = 24;

export function FormClub() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [infoClub, setInfoClub] = useState<UserClubProps[]>([]);
  const [userPhoto, setUserPhoto] = useState(null);
  const [ownField, setOwnField] = useState("NAO");
  const [wantSponsorship, setWantSponsorship] = useState("SIM");
  const [isSponsorship, setIsSponsorship] = useState("NAO");
  const [type, setType] = useState("");
  const ref = useRef<InputMask>(null);

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserClubProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: auth().currentUser.displayName,
      email: auth().currentUser.email,
      taxId: String(infoClub[0]?.taxId),
      address: {
        zipCode: infoClub[0]?.address.zipCode,
        street: infoClub[0]?.address.street,
        neighborhood: infoClub[0]?.address.neighborhood,
        state: infoClub[0]?.address.state,
        city: infoClub[0]?.address.city,
      },
      numberAddress: infoClub[0]?.numberAddress,
      zone: infoClub[0]?.zone,
      foundationDate: infoClub[0]?.foundationDate,
      clubColors: infoClub[0]?.clubColors,
      instagram: infoClub[0]?.instagram,
      facebook: infoClub[0]?.facebook,
      nameContact: infoClub[0]?.nameContact,
      phoneContact: infoClub[0]?.phoneContact,
      ownField: infoClub[0]?.ownField,
      wantSponsorship: infoClub[0]?.wantSponsorship,
      isSponsorship: infoClub[0]?.isSponsorship,
      endDate: infoClub[0]?.endDate,
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

  const validateUUIDUser =
    infoClub.length === 0 ? String(uuid.v4()) : String(infoClub[0]?.id);

  async function handleUserRegister(data: UserClubProps) {
    setIsLoading(true);

    await firestore()
      .collection("club")
      .doc(validateUUIDUser)
      .set({
        ...data,
        ownField,
        wantSponsorship,
        isSponsorship,
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

    console.log(data);
  }

  // const validateTaxId = () => {
  //   const taxIdIsValid = ref.current?.isValid();

  //   if (!taxIdIsValid && typeTaxId === "cpf") {
  //     Alert.alert(
  //       "Dados inválidos",
  //       "O CPF é inválido!\nPor gentileza, insira um CPF válido para continuar."
  //     );
  //   }
  //   if (!taxIdIsValid && typeTaxId === "cnpj") {
  //     Alert.alert(
  //       "Dados inválidos",
  //       "O CNPJ é inválido!\nPor gentileza, insira um CNPJ válido para continuar."
  //     );
  //   }
  // };

  return (
    <>
      {isLoading ? (
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
              Nº de registro:{" "}
              {!!infoClub[0]?.drawId ? infoClub[0]?.drawId : "-"}
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

            <Controller
              control={control}
              name="taxId"
              render={({ field: { onChange, value } }) => (
                <Input
                  bg="gray.600"
                  placeholder="CPF / CNPJ"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
                // <TextInputMask
                //   type={value.length <= 11 ? "cpf" : "cnpj"}
                //   value={value}
                //   placeholder="CPF / CNPJ"
                //   // placeholderTextColor={theme.colors.gray}
                //   onChangeText={onChange}
                //   keyboardType="numeric"
                //   style={{
                //     width: 300,
                //     height: 35,
                //     backgroundColor: "#202024",
                //     borderRadius: 8,
                //     flexDirection: "row",
                //     justifyContent: "center",
                //     alignItems: "center",
                //     paddingHorizontal: 12,
                //     fontSize: 18,
                //     fontFamily: "Roboto_400Regular",
                //     color: "#FFFFFF",
                //     marginBottom: 21,
                //   }}
                //   onEndEditing={() => validateTaxId()}
                //   ref={ref}
                // />
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
                  // value={value}
                  defaultValue={infoClub[0]?.address?.zipCode}
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
                  // value={value}
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
                      // value={value}
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
                      onChangeText={onChange}
                      // value={value}
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
                      onChangeText={onChange}
                      // value={value}
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
                      onChangeText={onChange}
                      // value={value}
                      defaultValue={infoClub[0]?.address?.city}
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
                  // value={value}
                  defaultValue={infoClub[0]?.zone}
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
                  // value={value}
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
                  keyboardType="numeric"
                  onChangeText={onChange}
                  // value={value}
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
                  keyboardType="numeric"
                  onChangeText={onChange}
                  // value={value}
                  defaultValue={infoClub[0]?.nameContact}
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
                  // value={value}
                  defaultValue={infoClub[0]?.phoneContact}
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
                  // value={value}
                  defaultValue={infoClub[0]?.foundationDate}
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
                  // value={value}
                  defaultValue={infoClub[0]?.clubColors}
                  errorMessage={errors.clubColors?.message}
                />
              )}
            />

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
                    value="NAO"
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
                    value="NAO"
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
                    value="NAO"
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

            {isSponsorship === "sim" && (
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Término do patrocínio"
                    keyboardType="numeric"
                    onChangeText={onChange}
                    // value={value}
                    defaultValue={infoClub[0]?.endDate}
                    errorMessage={errors.endDate?.message}
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
