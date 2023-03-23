import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  Text,
  Icon,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AppNavigatorRoutesProps } from "../routes/app.sponsor.routes";

import { Button } from "../components/Button";

import IllustrationImg from "../assets/icon.png";

export function EmailSponsor() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleGoHome() {
    navigation.navigate("home");
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="gray.800"
    >
      <VStack flex={1} px={8} pb={10}>
        <Center mt={10} mb={10}>
          <Image
            source={IllustrationImg}
            alt="Icone do aplicativo"
            w={14}
            h={14}
            resizeMode="center"
          />
        </Center>
        <Center mb={14}>
          <Icon
            as={MaterialCommunityIcons}
            name="check-decagram"
            size={16}
            color="yellow.400"
            mb={8}
          />

          <Heading
            color="white"
            textAlign="center"
            fontSize="2xl"
            mb={12}
            fontFamily="heading"
          >
            Solicitação de Patrocínio realizada com sucesso!
          </Heading>

          <Text
            color="white"
            fontSize="md"
            fontFamily="body"
            textAlign="center"
          >
            Nossa equipe entrará em contato com você nos próximos dias.{`\n\n`}
          </Text>
        </Center>
        <Center>
          <Button title="Voltar ao início" mt={8} onPress={handleGoHome} />
        </Center>
      </VStack>
    </ScrollView>
  );
}
