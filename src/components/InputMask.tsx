import { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  TextInputMask,
  TextInputMaskProps,
  TextInputMaskMethods,
  TextInputMaskTypeProp,
} from "react-native-masked-text";
import { IInputProps, FormControl } from "native-base";

type InputMask = TextInputMaskTypeProp;

type Props = TextInputMaskMethods &
  TextInputMaskProps & {
    value: string;
    placeholder: string;
    onChange: () => unknown;
    type: InputMask;
    errorMessage?: string | null;
  };

type ErrorProps = IInputProps;

export function InputMask(
  { value, onChange, type, placeholder, errorMessage = null, ...rest }: Props,
  { isInvalid, ...restError }: ErrorProps
) {
  const [isFocus, setIsFocus] = useState(false);
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4} {...restError}>
      <TextInputMask
        type={type}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7C7C8A"
        onChangeText={onChange}
        keyboardType="numeric"
        style={[styles.input, isFocus && styles.focus, invalid && styles.error]}
        onBlur={() => setIsFocus(false)}
        onFocus={() => setIsFocus(true)}
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
