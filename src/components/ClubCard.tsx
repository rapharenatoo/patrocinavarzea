import {
  Checkbox,
  Heading,
  HStack,
  Text,
  VStack,
  ICheckboxGroupProps,
} from "native-base";

type ClubCard = ICheckboxGroupProps & {
  idCheckBox: string;
  name: string;
  taxId: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    state: string;
    city: string;
  };
  zone: string;
  wantSponsorship: string;
  isSponsorship: string;
};

export function ClubCard({
  idCheckBox,
  name,
  taxId,
  address,
  zone,
  wantSponsorship,
  isSponsorship,
  ...rest
}: ClubCard) {
  return (
    <VStack px={5} py={4} mt={3} bg="gray.600" rounded="md">
      <HStack>
        <Heading
          flex={1}
          pr={2}
          color="yellow.400"
          fontSize="lg"
          textTransform="capitalize"
          numberOfLines={1}
          fontFamily="heading"
          mb={1}
        >
          {name}
        </Heading>
        <Checkbox.Group accessibilityLabel="Patrocinar" {...rest}>
          <Checkbox
            colorScheme="yellow"
            size="sm"
            defaultIsChecked={false}
            accessibilityLabel="selecionar para patrocinar"
            value={idCheckBox}
          />
        </Checkbox.Group>
      </HStack>

      <Text color="gray.100" fontSize="sm" numberOfLines={2} mt={2}>
        CPF / CPNJ: {taxId}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={2} mt={2}>
        {address.city} - {address.state}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Região: Zona {zone}
      </Text>

      <Text color="gray.100" fontSize="sm" numberOfLines={1} mt={2}>
        Quer Patrocínio: {wantSponsorship}
      </Text>
      <Text color="gray.100" fontSize="sm" numberOfLines={1}>
        Patrocinado: {isSponsorship}
      </Text>
    </VStack>
  );
}
