import { TouchableOpacity } from "react-native";
import { Heading, HStack, VStack, Text, Icon, useToast } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { UserPhoto } from "./UserPhoto";

import defaultUserPhotoImg from "../assets/userPhotoDefault.png";

export function Header() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  function handleLogout() {
    auth()
      .signOut()
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        const messageError = toast.show({
          title: `Algo deu errado. Tente novamente mais tarde! Código: ${errorCode}`,
          placement: "top",
          color: "red.500",
        });
        return messageError;
      });
  }

  return (
    <HStack bg="gray.600" pt={12} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={defaultUserPhotoImg}
        alt="Imagem do usuário"
        size={16}
        mr={4}
      />

      <VStack flex={1} mr={2}>
        <Text color="white" fontSize="md">
          Olá,
        </Text>

        <Heading
          color="white"
          fontSize="md"
          fontFamily="heading"
          numberOfLines={2}
        >
          Raphael Renato
        </Heading>
      </VStack>

      <TouchableOpacity onPress={handleLogout}>
        <Icon
          as={MaterialIcons}
          name="power-settings-new"
          color="yellow.400"
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  );
}
