import { TouchableOpacity } from "react-native";
import { Heading, HStack, VStack, Text, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import { UserPhoto } from "./UserPhoto";

import defaultUserPhotoImg from "../assets/userPhotoDefault.png";

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={defaultUserPhotoImg}
        alt="Imagem do usuário"
        size={16}
        mr={4}
      />

      <VStack flex={1}>
        <Text color="white" fontSize="md">
          Olá,
        </Text>

        <Heading color="white" fontSize="md" fontFamily="heading">
          Raphael Renato
        </Heading>
      </VStack>

      <TouchableOpacity onPress={() => {}}>
        <Icon as={MaterialIcons} name="logout" color="yellow.400" size={7} />
      </TouchableOpacity>
    </HStack>
  );
}
