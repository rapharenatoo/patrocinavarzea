import {
    Input as InputNativeBase,
    IInputProps,
    FormControl,
  } from "native-base";
  
  type Props = IInputProps & {
    errorMessage?: string | null;
  };
  
  export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
    const invalid = !!errorMessage || isInvalid;
  
    return (
      <FormControl isInvalid={invalid} mb={4}>
        <InputNativeBase
          bg="gray.600"
          h={12}
          px={4}
          borderWidth={0}
          color="white"
          fontFamily="body"
          placeholderTextColor="gray.300"
          isInvalid={invalid}
          _invalid={{
            borderWidth: 1,
            borderColor: "red.500",
          }}
          _focus={{
            bg: "gray.700",
            borderWidth: 1,
            borderColor: "yellow.400",
          }}
          {...rest}
        />
        <FormControl.ErrorMessage _text={{ color: "red.500" }}>
          {errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
    );
  }
  