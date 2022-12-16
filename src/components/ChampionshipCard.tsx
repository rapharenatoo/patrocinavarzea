import { Heading, HStack, Text, VStack } from "native-base";

type ChampionshipProps = {
  name: string;
  organizer: string;
  date: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    state: string;
    city: string;
  };
  zone: string;
  qtdTeams: string;
};

export function ChampionshipCard({
  name,
  organizer,
  date,
  address,
  zone,
  qtdTeams,
}: ChampionshipProps) {
  return (
    <VStack px={5} py={4} mt={3} bg="gray.600" rounded="md">
      <Heading
        color="yellow.400"
        fontSize="lg"
        textTransform="capitalize"
        numberOfLines={1}
        fontFamily="heading"
        mb={1}
      >
        {name}
      </Heading>

      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Organizador: {organizer}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={2}>
        Data: {date} - Qtd Times: {qtdTeams}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1} mt={2}>
        CEP: {address.zipCode}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={2}>
        End: {address.street}, {address.number}, {address.neighborhood}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        {address.city} - {address.state}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Região: Zona {zone}
      </Text>
    </VStack>
  );
}
