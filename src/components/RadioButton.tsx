import { Text, VStack, HStack, Radio, IRadioGroupProps, IRadioProps } from "native-base";

type Props = IRadioGroupProps & IRadioProps & {
  label: string;
  name:string;
  accessibilityLabel: string;
};
export function RadioButton({
  label,
  name,
  onChange,
  accessibilityLabel,
  ...rest
}: Props) {
  return (
    <VStack mb={4}>
      <Text color="gray.100" fontSize="sm" fontFamily="body" mr={2}>
        {label}
      </Text>
      <Radio.Group
        name={name}
        accessibilityLabel={accessibilityLabel}
        {...rest}
      >
        <HStack space={4}>
          <Radio
            value="sim"
            colorScheme="yellow"
            size="sm"
            my={1}
            _text={{
              color: "gray.100",
              fontSize: "sm",
              fontFamily: "body",
            }}
          >
            Sim
          </Radio>
          <Radio
            value="nao"
            colorScheme="yellow"
            size="sm"
            my={1}
            _text={{
              color: "gray.100",
              fontSize: "sm",
              fontFamily: "body",
            }}
          >
            Não
          </Radio>
        </HStack>
      </Radio.Group>
    </VStack>
  );
}
