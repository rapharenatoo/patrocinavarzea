import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Input,
  Icon,
  ScrollView,
  FlatList,
  Spinner,
  Center,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { ChampionshipCard } from "../components/ChampionshipCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { Empty } from "../components/Empty";

type Rewards = {
  uniform: boolean;
  medal: boolean;
  trophy: boolean;
  money: boolean;
};

type Address = {
  zipCode: string;
  street: string;
  neighborhood: string;
  state: string;
  city: string;
};

type ChampionshipProps = {
  id: string;
  name: string;
  organizer: string;
  phoneOrganizer: string;
  email: string;
  date: string;
  address: Address;
  numberAddress: string;
  zone: string;
  qtdTeams: string;
  instagram: string;
  cashReward: number;
  rewardsTrophy: boolean;
  rewardsMedals: boolean;
  rewardsUniform: boolean;
  rewardsOther: boolean;
  rewardsOtherDescription?: string;
};

export function ChampionshipsList() {
  const [textSearch, setTextSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [championships, setChampionships] = useState<ChampionshipProps[]>([]);
  const [list, setList] = useState(championships);

  useEffect(() => {
    setIsLoading(true);
    const subscriber = firestore()
      .collection("championship")
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ChampionshipProps[];

        setChampionships(data);
        setList(data);
        setIsLoading(false);
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    if (textSearch === "") {
      setList(championships);
    } else {
      setList(
        championships.filter((item) => {
          if (
            item.name.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
            item.organizer.toLowerCase().indexOf(textSearch.toLowerCase()) >
              -1 ||
            item.zone.toLowerCase().indexOf(textSearch.toLowerCase()) > -1
          ) {
            return true;
          } else {
            return false;
          }
        })
      );
    }
  }, [textSearch]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Lista de Campeonatos" />

      <VStack flex={1} px={8} mt={8}>
        <Input
          bg="gray.600"
          h={12}
          px={4}
          mb={2}
          borderWidth={0}
          color="white"
          fontFamily="body"
          placeholderTextColor="gray.300"
          placeholder="Buscar"
          onChangeText={setTextSearch}
          _focus={{
            bg: "gray.700",
            borderWidth: 1,
            borderColor: "yellow.400",
          }}
          InputLeftElement={
            <Icon
              ml={4}
              size="sm"
              color="gray.300"
              as={<Ionicons name="ios-search" />}
            />
          }
        />
        {isLoading ? (
          <Center flex={1}>
            <Spinner color="yellow.400" size={24} />
          </Center>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChampionshipCard
                name={item.name}
                organizer={item.organizer}
                date={item.date}
                address={{
                  zipCode: item.address.zipCode,
                  street: item.address.street,
                  neighborhood: item.address.neighborhood,
                  state: item.address.state,
                  city: item.address.city,
                }}
                numberAddress={item.numberAddress}
                zone={item.zone}
                qtdTeams={item.qtdTeams}
                instagram={item.instagram}
                cashReward={item.cashReward}
                rewardsTrophy={item.rewardsTrophy}
                rewardsMedals={item.rewardsMedals}
                rewardsUniform={item.rewardsUniform}
                rewardsOther={item.rewardsOther}
                rewardsOtherDescription={item.rewardsOtherDescription}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Empty
                title="Não há campeonatos cadastrados."
                buttonVisible={false}
              />
            }
            _contentContainerStyle={{ pb: 2 }}
          />
        )}
      </VStack>
    </VStack>
  );
}
