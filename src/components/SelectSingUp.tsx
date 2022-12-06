import { useState } from "react";
import { Select, CheckIcon, ISelectProps, FormControl } from "native-base";

type Props = ISelectProps & {
  type: string;
  onChange: () => void;
  errorMessage?: string | null;
};
export function SelectSingUp({
  errorMessage = null,
  type,
  onChange,
  ...rest
}: Props) {
  const invalid = !!errorMessage;

  return (
    <FormControl isRequired isInvalid mb={4}>
      <Select
        selectedValue={type}
        w="full"
        height={12}
        borderColor={invalid ? "red.500" : "gray.600"}
        px={4}
        accessibilityLabel="Selecionar o tipo"
        placeholder="Quem é você?"
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
          label="Clube"
          value="club"
          backgroundColor="muted.800"
          _text={{
            color: "light.500",
          }}
        />
        <Select.Item
          label="Patrocinador"
          value="sponsor"
          backgroundColor="muted.800"
          _text={{
            color: "light.500",
          }}
        />
        <Select.Item
          label="Confecção de Uniformes"
          value="confection"
          backgroundColor="muted.800"
          _text={{
            color: "light.500",
          }}
        />
        <Select.Item
          label="Campeonato"
          value="admin"
          backgroundColor="muted.800"
          _text={{
            color: "light.500",
          }}
        />
      </Select>
      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
