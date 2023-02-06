import { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { Heading, HStack, VStack, Text, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

import { useAuth } from "../hooks/auth";

import { UserPhoto } from "./UserPhoto";
import { AlertModal } from "../components/AlertModal";

import DefaultUserPhotoImg from "../assets/userPhotoDefault.png";

const PHOTO_SIZE = 16;

export function Header() {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  function handleLogout() {
    signOut();
  }

  useEffect(() => {
    const subscriber = () => {
      auth().currentUser?.photoURL;
      auth().currentUser?.displayName;
    };

    return () => subscriber();
  }, []);

  return (
    <HStack bg="gray.600" pt={12} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={
          auth().currentUser?.photoURL
            ? { uri: auth().currentUser?.photoURL }
            : DefaultUserPhotoImg
        }
        defaultSource={DefaultUserPhotoImg}
        alt="Imagem do usuário"
        size={PHOTO_SIZE}
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
          {auth().currentUser?.displayName}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Icon
          as={MaterialIcons}
          name="power-settings-new"
          color="yellow.400"
          size={7}
        />
      </TouchableOpacity>
      <AlertModal
        title="Desconectar"
        text="Tem certeza que deseja desconectar da sua conta?"
        colorScheme="danger"
        isOpen={isOpen}
        onPressPrimary={handleLogout}
        onPressSecondary={onClose}
        cancelRef={cancelRef}
      />
    </HStack>
  );
}
