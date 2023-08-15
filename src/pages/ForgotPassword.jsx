import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
  Link,
  Center,
  Text,
} from "@chakra-ui/react";
import { makeRequest } from "../utlis/utilityFunctions";

const sectionStyle = {
  backgroundColor: "#0f0f0f",
  height: "100vh",
  width: "100%",
  display: "grid",
  placeItems: "center",
};

const buttonStyle = {
  _hover: {
    colorScheme: "orange",
  },
};

export const ForgotPassword = () => {
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [c_showPwd, c_setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // get userid from params
  const { id } = useParams();

  // handle user input data
  const handleInput = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // reset passowd function
  const resetPassword = async () => {
    // check for password match
    if (credentials.password != credentials.confirmPassword) {
      toast({
        description: "Password and confirm password not match",
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    // password validation
    const passwordRegex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/m;

    if (
      !passwordRegex.test(credentials.password) ||
      !passwordRegex.test(credentials.confirmPassword)
    ) {
      toast({
        description: `password must contain 1 number (0-9)
    password must contain 1 uppercase letters
    password must contain 1 lowercase letters
    password must contain 1 non-alpha numeric number
    password is 8-16 characters with no space
    
    `,
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 2500,
      });
      return;
    }

    // main request logic
    const url = `/api/auth/resetPassword/${id}`;
    setIsLoading(true);
    const data = await makeRequest(url, "PATCH", credentials);
    setIsLoading(false);

    // handling error
    if (data instanceof Error) {
      const errorMSg = data.message.replaceAll("\\", "");
      toast({
        description: errorMSg,
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    // if no error than show success message
    toast({
      description: data.message,
      position: "bottom-left",
      status: "success",
      isClosable: true,
      duration: 3000,
    });
  };

  return (
    <div style={sectionStyle}>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        w={{ md: "35%", lg: "30%" }}
      >
        <Heading color="#fff">
          <span
            style={{
              color: "#fe8040",
              textAlign: "center",
              paddingRight: "9px",
            }}
          >
            Let's Talk
          </span>
          Reset Password
        </Heading>
        <Box as="div" marginTop="15px" w="80%">
          <FormLabel htmlFor="password" color="#fff">
            New Password
          </FormLabel>

          <InputGroup>
            <Input
              type={showPwd ? "text" : "password"}
              id="password"
              name="password"
              isRequired
              focusBorderColor="#fe8040"
              bg="#454545"
              color="#fff"
              placeholder="********"
              value={credentials.password}
              onChange={handleInput}
            />

            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                  setShowPwd(!showPwd);
                }}
              >
                {showPwd ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>

        <Box as="div" marginTop="15px" w="80%">
          <FormLabel htmlFor="confirmPassword" color="#fff">
            Confirm New Password
          </FormLabel>

          <InputGroup size="md">
            <Input
              type={c_showPwd ? "text" : "password"}
              id="c_password"
              name="confirmPassword"
              isRequired={true}
              focusBorderColor="#fe8040"
              bg="#454545"
              color="#fff"
              placeholder="********"
              value={credentials.confirmPassword}
              onChange={handleInput}
            />

            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                  c_setShowPwd(!c_showPwd);
                }}
              >
                {c_showPwd ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Text color="gray" fontSize="12px" my="5px">
            password must contain 1 number (0-9) password must contain 1
            uppercase letters password must contain 1 lowercase letters password
            must contain 1 non-alpha numeric number password is 8-16 characters
            with no space
          </Text>
        </Box>
        <Box as="div" marginTop="20px" w="80%">
          <Button
            bg="#fe8040"
            color="#fff"
            width="100%"
            sx={buttonStyle}
            isLoading={isLoading}
            onClick={() => {
              resetPassword();
            }}
          >
            Reset Password
          </Button>
        </Box>
        <Center>
          <Link href="/" color="#fff" my="3">
            Go to home page
          </Link>
        </Center>
      </Flex>
    </div>
  );
};
