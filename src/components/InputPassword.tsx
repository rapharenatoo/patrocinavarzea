import {
  Input as InputNativeBase,
  IInputProps,
  FormControl,
  Pressable,
  Icon,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

type Props = IInputProps & {
  errorMessage?: string | null;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export function InputPassword({
  errorMessage = null,
  isInvalid,
  showPassword,
  setShowPassword,
  ...rest
}: Props) {
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
        type={showPassword ? "text" : "password"}
        InputRightElement={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Icon
              as={
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                />
              }
              size={6}
              mr="4"
              color="gray.300"
            />
          </Pressable>
        }
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
