import { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  TextInputMask,
  TextInputMaskProps,
  TextInputMaskMethods,
  TextInputMaskTypeProp,
} from "react-native-masked-text";
import { IInputProps, FormControl, useToast } from "native-base";

type InputMask = TextInputMaskTypeProp;

type Props = TextInputMaskMethods &
  TextInputMaskProps & {
    placeholder: string;
    type: InputMask;
    errorMessage?: string | null;
  };

type ErrorProps = IInputProps;

export function InputMaskTaxId(
  { type, placeholder, errorMessage = null, ...rest }: Props,
  { isInvalid, ...restError }: ErrorProps
) {
  const toast = useToast();
  const [isFocus, setIsFocus] = useState(false);
  const ref = useRef<TextInputMaskMethods & TextInputMaskProps & TextInputMask>(
    null
  );
  const invalid = !!errorMessage || isInvalid;

  const validateTaxId = () => {
    const taxIdIsValid = ref.current?.isValid();
    if (!taxIdIsValid && type === "cpf") {
      const messageError = toast.show({
        title:
          "O CPF é inválido! Por gentileza, insira um CPF válido para continuar.",
        placement: "top",
        bgColor: "red.500",
      });
      return messageError;
    }
    if (!taxIdIsValid && type === "cnpj") {
      const messageError = toast.show({
        title:
          "O CNPJ é inválido! Por gentileza, insira um CNPJ válido para continuar.",
        placement: "top",
        bgColor: "red.500",
      });
      return messageError;
    }
  };

  return (
    <FormControl isInvalid={invalid} mb={4} {...restError}>
      <TextInputMask
        type={type}
        placeholder={placeholder}
        placeholderTextColor="#7C7C8A"
        keyboardType="numeric"
        onEndEditing={validateTaxId}
        style={[styles.input, isFocus && styles.focus, invalid && styles.error]}
        onBlur={() => setIsFocus(false)}
        onFocus={() => setIsFocus(true)}
        ref={ref}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    backgroundColor: "#202024",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: "white",
  },
  focus: {
    borderWidth: 1,
    borderColor: "#facc15",
    backgroundColor: "#121214",
  },
  error: {
    borderWidth: 1,
    borderColor: "#F75A68",
  },
});
