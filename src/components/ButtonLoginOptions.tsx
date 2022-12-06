import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
  title: string;
  color?: "primary" | "secondary";
};

export function ButtonLoginOptions({ title, color, ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={12}
      bg="transparent"
      borderWidth={1}
      borderColor={color === "primary" ? "white" : "yellow.400"}
      rounded="sm"
      _pressed={{
        bg: color === "primary" ? "white" : "yellow.400",
      }}
      variant="outline"
      {...rest}
    >
      <Text
        color={color === "primary" ? "white" : "yellow.400"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
