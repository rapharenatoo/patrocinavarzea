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

type UserChampionshipProps = {
  id: string;
  name: string;
  organizer: string;
  phoneOrganizer: string;
  email: string;
  date: string;
  address: Address;
  numberAddress?: string;
  zone: string;
  qtdTeams: string;
  rewards: Array<string>;
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

export function FormChampionship() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

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
      zone: "",
      qtdTeams: "",
      rewards: [],
      createdAt: "",
    },
  });

  async function handleRegister(data: UserChampionshipProps) {
    setIsLoading(true);

    await firestore()
      .collection("championship")
      .add({
        ...data,
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
              keyboardType="numeric"
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
          Sobre o campeonato
        </Heading>

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
              onChangeText={onChange}
              value={value}
              errorMessage={errors.qtdTeams?.message}
            />
          )}
        />

        {/* ALTERAR PARA O COMPONENTE CORRETO */}
        <Controller
          control={control}
          name="rewards"
          render={({ field: { onChange, value } }) => (
            <Input
              bg="gray.600"
              placeholder="Premiações: CheckBox"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.rewards?.message}
            />
          )}
        />

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
