import React, { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  useToast,
  VStack,
  Heading,
  HStack,
  Checkbox,
  FormControl,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { Input } from "./Input";
import { Button } from "./Button";
import { SelectZone } from "./SelectZone";

type Address = {
  zipCode?: string;
  street?: string;
  neighborhood?: string;
  state?: string;
  city?: string;
};

type UserChampionshipProps = {
  id: string;
  name: string;
  organizer: string;
  phoneOrganizer: string;
  email: string;
  date: string;
  address: Address;
  numberAddress?: string;
  complementAddress?: string;
  zone: string;
  instagram: string;
  qtdTeams: string;
  cashReward: string;
  rewards: Array<string>;
  otherRewards?: string;
  createdAt: any;
};

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Informe o nome do campeonato")
    .nullable()
    .transform((value) => (!!value ? value : null)),
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
  complementAddress: yup.string(),
  organizer: yup.string().required("Informe o nome do organizador"),
  phoneOrganizer: yup
    .string()
    .required("Informe o telefone do organizador")
    .min(10, "O telefone deve ter pelo menos 10 digítos"),
  cashReward: yup.number().required("Informe o prêmio em dinheiro"),
  date: yup.string().required("Informe a data do evento"),
  qtdTeams: yup.string().required("Informe a quantidade de times no evento"),
});

export function FormChampionship() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [otherRewards, setOtherRewards] = useState(false);
  const [address, setAddress] = useState<Address>({
    zipCode: "",
    street: "",
    neighborhood: "",
    state: "",
    city: "",
  });
  const isOtherRewards = () => {
    return String(rewards.find((element) => element === "Outro"));
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserChampionshipProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      organizer: "",
      phoneOrganizer: "",
      email: auth().currentUser.email,
      date: "",
      address: {
        zipCode: "",
        street: "",
        neighborhood: "",
        state: "",
        city: "",
      },
      numberAddress: "",
      instagram: "",
      zone: "",
      qtdTeams: "",
      cashReward: "",
      rewards: [],
      otherRewards: "",
      createdAt: "",
    },
  });

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

  async function handleRegister(data: UserChampionshipProps) {
    setIsLoading(true);

    await firestore()
      .collection("championship")
      .add({
        ...data,
        // address: {
        //   zipCode: address.zipCode,
        //   street: address.street,
        //   neighborhood: address.neighborhood,
        //   state: address.state,
        //   city: address.city,
        // },
        rewards: rewards,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        navigation.navigate("championshipsList");
        const messageSuccess = toast.show({
          title: "Campeonato cadastrado com sucesso.",
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
      <VStack flex={1} px={10} pb={10} mt={8}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Nome do campeonato"
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

        <Heading
          color="yellow.400"
          fontSize="sm"
          mb={2}
          alignSelf="flex-start"
          mt={6}
          fontFamily="heading"
        >
          Informações do organizador
        </Heading>

        <Controller
          control={control}
          name="organizer"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Nome do organizador"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.organizer?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phoneOrganizer"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Telefone"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.phoneOrganizer?.message}
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
              // onEndEditing={() => getAddressFromApi()}
              onChangeText={
                onChange
                // (value) => {
                //   setAddress((old) => ({
                //     ...old,
                //     zipCode: value,
                //   }));
                // }
              }
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
                  onChangeText={
                    onChange
                    // (value) => {
                    // setAddress((old) => ({
                    //   ...old,
                    //   neighborhood: value,
                    // }));
                    // }
                  }
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
                  value={address.city}
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
              errorMessage={errors.complementAddress?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="zone"
          render={({ field: { onChange, value } }) => (
            <SelectZone zone={value} onChange={onChange} />
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
          Sobre o campeonato
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
              errorMessage={errors.instagram?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Data do evento"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.date?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="qtdTeams"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Quantidade de times"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.qtdTeams?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="cashReward"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Premiação em dinheiro"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.cashReward?.message}
            />
          )}
        />

        <VStack>
          <Heading
            color="yellow.400"
            fontSize="sm"
            mb={2}
            alignSelf="flex-start"
            mt={6}
            fontFamily="heading"
          >
            Outras premiações:
          </Heading>
          <FormControl>
            <Checkbox.Group
              accessibilityLabel="Premiações"
              defaultValue={rewards}
              onChange={setRewards}
              value={rewards}
            >
              <HStack space={5}>
                <Checkbox
                  value="Troféu"
                  my={2}
                  colorScheme="yellow"
                  _text={{
                    mx: 2,
                    color: "white",
                    fontSize: "sm",
                    fontFamily: "body",
                  }}
                >
                  Trófeu
                </Checkbox>
                <Checkbox
                  value="Medalhas"
                  my={2}
                  colorScheme="yellow"
                  _text={{
                    mx: 2,
                    color: "white",
                    fontSize: "sm",
                    fontFamily: "body",
                  }}
                >
                  Medalhas
                </Checkbox>
              </HStack>
              <HStack space={2}>
                <Checkbox
                  value="Jogo de Uniforme"
                  my={2}
                  colorScheme="yellow"
                  _text={{
                    mx: 2,
                    color: "white",
                    fontSize: "sm",
                    fontFamily: "body",
                  }}
                >
                  Jogo de Uniforme
                </Checkbox>
              </HStack>
            </Checkbox.Group>
            <Checkbox
              value="other"
              isChecked={otherRewards}
              onChange={setOtherRewards}
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
            {otherRewards && (
              <Controller
                control={control}
                name="otherRewards"
                render={({ field: { onChange, value } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Outros prêmios"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.otherRewards?.message}
                  />
                )}
              />
            )}
            <FormControl.ErrorMessage _text={{ color: "red.500" }}>
              {errors.rewards?.message}
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>

        <Button
          title="Atualizar"
          mt={8}
          onPress={handleSubmit(handleRegister)}
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
