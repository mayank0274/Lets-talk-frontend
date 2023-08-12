import React from "react";
import { Skeleton, Stack } from "@chakra-ui/react";

export const SearchLoader = () => {
  return (
    <>
      <Stack>
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
        <Skeleton height="50px" bg="gray.600" w="80%" />
      </Stack>
    </>
  );
};
