import { Skeleton as SkeletonNative, Center } from "native-base";

export function Skeleton() {
  return (
    <Center flex={1}>
      <SkeletonNative.Text px={8} mb={8} />
      <SkeletonNative.Text px={8} mb={8} />
      <SkeletonNative.Text px={8} mb={8} />
      <SkeletonNative.Text px={8} mb={8} />
      <SkeletonNative.Text px={8} mb={8} />
    </Center>
  );
}
