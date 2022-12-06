import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
  title: string;
  variant?: "solid" | "outline";
};

export function Button({ title, variant = "solid", ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={12}
      bg={variant === "outline" ? "transparent" : "yellow.400"}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor="yellow.400"
      rounded="sm"
      _pressed={{
        bg: variant === "outline" ? "gray.400" : "yellow.300",
      }}
      {...rest}
    >
      <Text
        color={variant === "outline" ? "yellow.400" : "gray.700"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
