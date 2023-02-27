import React, { useState } from "react";
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  useToast,
  VStack,
  Heading,
  HStack,
  FormControl,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { Input } from "./Input";
import { Button } from "./Button";
import { SelectZone } from "./SelectZone";
import { InputMask } from "./InputMask";

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
  rewardsTrophy: boolean;
  rewardsMedals: boolean;
  rewardsUniform: boolean;
  rewardsOther: boolean;
  rewardsOtherDescription?: string;
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
  cashReward: yup.string().required("Informe o prêmio em dinheiro"),
  date: yup.string().required("Informe a data do evento"),
  qtdTeams: yup.string().required("Informe a quantidade de times no evento"),
});

export function FormChampionship() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [rewardsTrophy, setRewardsTrophy] = useState(false);
  const [rewardsMedals, setRewardsMedals] = useState(false);
  const [rewardsUniform, setRewardsUniform] = useState(false);
  const [rewardsOther, setRewardsOther] = useState(false);
  const [address, setAddress] = useState<Address>({
    zipCode: "",
    street: "",
    neighborhood: "",
    state: "",
    city: "",
  });
  let bouncyCheckboxRef: BouncyCheckbox | null = null;

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
      complementAddress: "",
      instagram: "",
      zone: "",
      qtdTeams: "",
      cashReward: "",
      rewardsTrophy: false,
      rewardsMedals: false,
      rewardsUniform: false,
      rewardsOther: false,
      rewardsOtherDescription: "",
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
        rewardsTrophy: rewardsTrophy,
        rewardsMedals: rewardsMedals,
        rewardsUniform: rewardsUniform,
        rewardsOther: rewardsOther,
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
            <InputMask
              placeholder="Telefone"
              type="cel-phone"
              options={{
                maskType: "BRL",
                withDDD: true,
                dddMask: "(99) ",
              }}
              value={value}
              onChange={onChange}
              errorMessage={errors.phoneOrganizer?.message}
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
          Endereço
        </Heading>

        <Controller
          control={control}
          name="address.zipCode"
          render={({ field: { onChange, value } }) => (
            <InputMask
              placeholder="CEP"
              type="zip-code"
              value={value}
              onChange={onChange}
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
                  value={value}
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
            <InputMask
              placeholder="Data do evento"
              type={"datetime"}
              options={{
                format: "DD/MM/YYYY",
              }}
              value={value}
              onChange={onChange}
              errorMessage={errors.date?.message}
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
            <InputMask
              placeholder="Premiação em dinheiro"
              type={"money"}
              options={{
                precision: 2,
                separator: ",",
                delimiter: ".",
                unit: "R$ ",
                suffixUnit: "",
              }}
              value={value}
              onChange={onChange}
              errorMessage={errors.cashReward?.message}
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
            <HStack space={5} mt={2}>
              <BouncyCheckbox
                size={20}
                fillColor="#eab308"
                unfillColor="#FFFFFF"
                text="Trófeu"
                iconStyle={{ borderColor: "#eab308", borderRadius: 4 }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 4 }}
                textStyle={{
                  textDecorationLine: "none",
                  fontFamily: "Roboto_400Regular",
                  color: "white",
                  fontSize: 14,
                }}
                ref={(ref: any) => (bouncyCheckboxRef = ref)}
                isChecked={rewardsTrophy}
                onPress={() => setRewardsTrophy(!rewardsTrophy)}
              />
              <BouncyCheckbox
                size={20}
                fillColor="#eab308"
                unfillColor="#FFFFFF"
                text="Medalhas"
                iconStyle={{ borderColor: "#eab308", borderRadius: 4 }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 4 }}
                textStyle={{
                  textDecorationLine: "none",
                  fontFamily: "Roboto_400Regular",
                  color: "white",
                  fontSize: 14,
                }}
                ref={(ref: any) => (bouncyCheckboxRef = ref)}
                isChecked={rewardsMedals}
                onPress={() => setRewardsMedals(!rewardsMedals)}
              />
            </HStack>
            <HStack space={2} mt={2} mb={2}>
              <BouncyCheckbox
                size={20}
                fillColor="#eab308"
                unfillColor="#FFFFFF"
                text="Jogo de Uniforme"
                iconStyle={{ borderColor: "#eab308", borderRadius: 4 }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 4 }}
                textStyle={{
                  textDecorationLine: "none",
                  fontFamily: "Roboto_400Regular",
                  color: "white",
                  fontSize: 14,
                }}
                ref={(ref: any) => (bouncyCheckboxRef = ref)}
                isChecked={rewardsUniform}
                onPress={() => setRewardsUniform(!rewardsUniform)}
              />
            </HStack>
            <BouncyCheckbox
              size={20}
              fillColor="#eab308"
              unfillColor="#FFFFFF"
              text="Outro"
              iconStyle={{ borderColor: "#eab308", borderRadius: 4 }}
              innerIconStyle={{ borderWidth: 2, borderRadius: 4 }}
              textStyle={{
                textDecorationLine: "none",
                fontFamily: "Roboto_400Regular",
                color: "white",
                fontSize: 14,
              }}
              ref={(ref: any) => (bouncyCheckboxRef = ref)}
              isChecked={rewardsOther}
              onPress={() => setRewardsOther(!rewardsOther)}
            />
            {rewardsOther && (
              <Controller
                control={control}
                name="rewardsOtherDescription"
                render={({ field: { onChange, value } }) => (
                  <Input
                    bg="gray.600"
                    mt={2}
                    placeholder="Outros prêmios"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.rewardsOtherDescription?.message}
                  />
                )}
              />
            )}
            <FormControl.ErrorMessage _text={{ color: "red.500" }}>
              {/* {errors.rewards?.message} */}
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
