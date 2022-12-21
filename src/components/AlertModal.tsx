import { AlertDialog, Button } from "native-base";

type Props = {
  isOpen: boolean;
  onPressPrimary: () => void;
  onPressSecondary: () => void;
  cancelRef: any;
  colorScheme: string;
  title: string;
  text: string;
};

export function AlertModal({
  isOpen,
  onPressPrimary,
  onPressSecondary,
  cancelRef,
  colorScheme,
  title,
  text,
}: Props) {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onPressSecondary}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton _icon={{ color: "white" }} />
        <AlertDialog.Header
          bgColor="gray.500"
          _text={{ color: "white", fontSize: "lg", fontFamily: "heading" }}
        >
          {title}
        </AlertDialog.Header>
        <AlertDialog.Body
          bgColor="gray.500"
          _text={{ color: "white", fontSize: "sm", fontFamily: "body" }}
        >
          {text}
        </AlertDialog.Body>
        <AlertDialog.Footer bgColor="gray.500">
          <Button.Group space={6}>
            <Button
              variant="ghost"
              colorScheme="coolGray"
              onPress={onPressSecondary}
              ref={cancelRef}
              w={16}
              _text={{ color: "white", fontSize: "sm", fontFamily: "body" }}
            >
              NÃO
            </Button>
            <Button
              colorScheme={colorScheme}
              onPress={onPressPrimary}
              w={16}
              _text={{ color: "white", fontSize: "sm", fontFamily: "body" }}
            >
              SIM
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
