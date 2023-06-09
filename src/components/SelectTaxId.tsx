import { Dispatch, SetStateAction } from "react";
import {
  Select,
  CheckIcon,
  ISelectProps,
  FormControl,
  IInputProps,
} from "native-base";

type Props = ISelectProps & {
  type: string;
  onChange: any;
  errorMessage?: string | null;
};

type ErrorProps = IInputProps;

export function SelectTaxId(
  { errorMessage = null, type, onChange, ...rest }: Props,
  { isInvalid }: ErrorProps
) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <Select
      selectedValue={type}
      w="full"
      height={12}
      borderColor={invalid ? "red.500" : "gray.600"}
      px={4}
      mb={4}
      accessibilityLabel="Selecione CPF ou CNPJ"
      placeholder="Selecione CPF ou CNPJ ..."
      placeholderTextColor="gray.300"
      fontFamily="body"
      color="white"
      _actionSheetContent={{
        bgColor: "gray.600",
      }}
      _selectedItem={{
        bg: "yellow.400",
        endIcon: <CheckIcon size="md" />,
      }}
      _item={{
        bgColor: "gray.600",
        _text: { color: "white", fontSize: "sm" },
        _icon: { color: "white" },
      }}
      _android={{
        bgColor: "gray.600",
        fontSize: "xs",
      }}
      onValueChange={onChange}
      {...rest}
    >
      <Select.Item
        label="CPF"
        value="cpf"
        backgroundColor="muted.800"
        _text={{
          color: "light.500",
        }}
      />
      <Select.Item
        label="CNPJ"
        value="cnpj"
        backgroundColor="muted.800"
        _text={{
          color: "light.500",
        }}
      />
    </Select>
  );
}
