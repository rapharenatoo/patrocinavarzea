import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Input,
  Icon,
  ScrollView,
  FlatList,
  Spinner,
  Center,
  Text,
  useToast,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import email from "react-native-email";

import { AppNavigatorRoutesProps } from "../routes/app.admin.routes";

import { ClubCard } from "../components/ClubCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { Empty } from "../components/Empty";
import { Button } from "../components/Button";
import { AlertModal } from "../components/AlertModal";

type Address = {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  state: string;
  city: string;
};

type ClubProps = {
  id: string;
  name: string;
  taxId: string;
  phoneOrganizer: string;
  email: string;
  address: Address;
  zone: string;
  wantSponsorship: string;
  isSponsorship: string;
};

type Sponsorships = Array<string>;

type SponsorProps = {
  id: string;
  name: string;
  sponsorships: Sponsorships;
};

export function ClubList() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [textSearch, setTextSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [club, setClub] = useState<ClubProps[]>([]);
  const [selectedClub, setSelectedClub] = useState<Sponsorships>([]);
  const [sponsor, setSponsor] = useState<SponsorProps[]>([]);
  const [list, setList] = useState(club);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  useEffect(() => {
    const subscriber = firestore()
      .collection("club")
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ClubProps[];

        setClub(data);
        setList(data);
        setIsLoading(false);
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection("sponsor")
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as SponsorProps[];

        setSponsor(data);
        setIsLoading(false);
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    if (textSearch === "") {
      setList(club);
      setIsLoading(false);
    } else {
      setList(
        club.filter((item) => {
          if (
            item.name.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
            item.address?.city.toLowerCase().indexOf(textSearch.toLowerCase()) >
              -1 ||
            item.zone.toLowerCase().indexOf(textSearch.toLowerCase()) > -1
          ) {
            return true;
          } else {
            return false;
          }
        })
      );
      setIsLoading(false);
    }
  }, [textSearch]);

  async function handleSendEmail() {
    setIsLoading(true);

    const to = ["bllackdev@gmail.com"];

    email(to, {
      subject: `Novos Patrocínios de ${sponsor[0].name}`,
      body: `Desejo patrocinar o(s) seguinte(s) Clube(s) - Time(s): \n\n${selectedClub
        .toString()
        .replace(/,/g, "\n")} \n\n\nAtenciosamente, \n\n${sponsor[0].name}`,
      checkCanOpen: true,
    })
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        console.error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const validateUUIDUserSponsor = String(sponsor[0]?.id);

  async function handleSponsorClubs() {
    await firestore()
      .collection("sponsor")
      .doc(validateUUIDUserSponsor)
      .set(
        {
          sponsorships: selectedClub,
        },
        { merge: true }
      )
      .then(() => {
        setIsOpen(false);
        handleSendEmail();

        const messageSuccess = toast.show({
          title:
            "Parabéns você acabou de patrocinar! Entre os próximos dias nossa equipe entrará em contato.",
          placement: "top",
          bgColor: "green.500",
          duration: 15000,
        });

        return messageSuccess;
      })
      .catch((error) => {
        setIsLoading(false);

        const messageError = toast.show({
          title: "Algo deu errado! Tente novamente mais tarde.",
          placement: "top",
          bgColor: "red.500",
          duration: 10000,
        });
        console.log(error);
        return messageError;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Clubes - Times" />

      <VStack flex={1} px={8} mt={6}>
        <Text color="gray.100" fontSize="sm" fontFamily="body" mb={2}>
          Clubes selecionados: {selectedClub.length}
        </Text>
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
          <>
            <FlatList
              data={list}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ClubCard
                  name={item.name}
                  taxId={item.taxId}
                  address={{
                    zipCode: item.address.zipCode,
                    street: item.address.street,
                    number: item.address.number,
                    neighborhood: item.address.neighborhood,
                    state: item.address.state,
                    city: item.address.city,
                  }}
                  zone={item.zone}
                  wantSponsorship={item.wantSponsorship}
                  isSponsorship={item.isSponsorship}
                  idCheckBox={item.name}
                  onChange={setSelectedClub}
                  value={selectedClub}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Empty
                  title="Não há clubes para patrocinar."
                  buttonVisible={false}
                />
              }
              _contentContainerStyle={{ pb: 2 }}
            />

            <Button
              title="Patrocinar"
              mt={2}
              mb={2}
              onPress={() => {
                selectedClub.length === 0
                  ? toast.show({
                      title:
                        "Selecione pelo menos um Clube-Time para continuar.",
                      placement: "top",
                      bgColor: "red.500",
                    })
                  : setIsOpen(true);
              }}
              isLoading={isLoading}
            />
            <AlertModal
              title="Patrocinar"
              text="Tem certeza que deseja patrocinar o(s) Clube(s)-Time(s)
            selecionado(s)?"
              colorScheme="yellow"
              isOpen={isOpen}
              onPressPrimary={handleSponsorClubs}
              onPressSecondary={onClose}
              cancelRef={cancelRef}
            />
          </>
        )}
      </VStack>
    </VStack>
  );
}
