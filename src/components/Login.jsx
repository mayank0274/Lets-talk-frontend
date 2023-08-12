import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  Link,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { makeRequest } from "../utlis/utilityFunctions";

const buttonStyle = {
  _hover: {
    colorScheme: "orange",
  },
};

export const Login = () => {
  // states
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [resetPwdEmail, setResetPwdEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // handle user input data
  const handleInput = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // form validation
  const formValidation = () => {
    const { email, password } = credentials;

    if (!email || !password) {
      setIsError(true);
      toast({
        description: "All fields are required",
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 2500,
      });
      return;
    }

    setIsError(false);
  };

  // function for login
  const login = async () => {
    // form validation
    formValidation();
    if (isError) {
      return;
    }
    if (!isError) {
      const url = "/api/auth/login";
      setIsLoading(true);
      const data = await makeRequest(url, "POST", credentials);
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
      navigate("/chat");
    }
  };

  // function for sending reset pwd email
  const sendResetPwdEmail = async () => {
    if (resetPwdEmail == "") {
      toast({
        description: "Email can't be empty",
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    const url = "/api/auth/forgotPasswordEmail";
    setIsLoading(true);
    const data = await makeRequest(url, "POST", { email: resetPwdEmail });
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
    <>
      <Box>
        <FormControl>
          <Box as="div" marginTop="15px">
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              isRequired
              focusBorderColor="#fe8040"
              bg="#454545"
              placeholder="johndoe@mail.com"
              value={credentials.email}
              onChange={handleInput}
            />
          </Box>

          <Box as="div" marginTop="15px">
            <FormLabel htmlFor="password">Password</FormLabel>

            <InputGroup size="md">
              <Input
                type={showPwd ? "text" : "password"}
                id="password"
                name="password"
                isRequired
                focusBorderColor="#fe8040"
                bg="#454545"
                placeholder="********"
                value={credentials.password}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    login();
                  }
                }}
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

          <Box as="div" marginTop="20px">
            <Button
              bg="#fe8040"
              color="#fff"
              width="100%"
              sx={buttonStyle}
              onClick={() => {
                login();
              }}
              isLoading={isLoading}
            >
              Login
            </Button>
          </Box>
          <Box as="div" marginTop="20px">
            <Button
              bg="#fe8040"
              color="#fff"
              width="100%"
              sx={buttonStyle}
              onClick={() => {
                setCredentials({
                  email: "guestuser@mail.com",
                  password: "Qwerty!111",
                });
              }}
            >
              Fill Guest User Details
            </Button>
          </Box>
          <Center>
            <Box as="div" marginTop="20px">
              <Link onClick={onOpen}>Forgot Password ?</Link>
            </Box>
          </Center>
        </FormControl>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#454545">
          <ModalHeader color="#fff">Forgot Password</ModalHeader>
          <ModalCloseButton color="#fff" />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel color="#fff">Enter your email</FormLabel>
              <Input
                type="email"
                id="email"
                name="email"
                isRequired
                focusBorderColor="#fe8040"
                bg="#0f0f0f"
                color="#fff"
                placeholder="joe@mail.com"
                value={resetPwdEmail}
                onChange={(e) => {
                  setResetPwdEmail(e.target.value);
                }}
              />
              <Box as="div" marginTop="20px">
                <Button
                  bg="#fe8040"
                  color="#fff"
                  width="100%"
                  sx={buttonStyle}
                  onClick={() => {
                    sendResetPwdEmail();
                  }}
                >
                  Send Password Reset Email
                </Button>
              </Box>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
