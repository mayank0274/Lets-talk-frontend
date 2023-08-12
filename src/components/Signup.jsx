import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Tooltip,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

import { makeRequest } from "../utlis/utilityFunctions";
import { color } from "framer-motion";

const buttonStyle = {
  _hover: {
    colorScheme: "orange",
  },
};

export const Signup = () => {
  // states
  const [credentials, setCredentials] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  const [profilePic, setProfilePic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const toast = useToast();

  // handle user input data
  const handleInput = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // handle profile picture upload => cloudinary service
  const handleProfilePic = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];

    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    setIsLoading(true);

    try {
      const url = `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/upload`;

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setProfilePic(data.url.toString());
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast({
        description: err.message,
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  // form validation
  const formValidation = () => {
    const { name, userName, email, password } = credentials;

    if (!name || !userName || !email || !password) {
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

    const passwordRegex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;
    if (!passwordRegex.test(password)) {
      setIsError(true);
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

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      setIsError(true);
      toast({
        description: `Email not valid`,
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 2500,
      });
      return;
    }

    setIsError(false);
  };

  // function for creating account
  const registerUser = async () => {
    // form validation
    formValidation();
    if (isError) {
      return;
    }
    if (!isError) {
      const url = "/api/auth/register";
      const reqBody = {
        ...credentials,
        ...(profilePic != "" && { profilePic }),
      };
      setIsLoading(true);
      const data = await makeRequest(url, "POST", reqBody);
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
    }
  };

  return (
    <>
      <Box h="100%">
        <FormControl>
          <Box as="div" marginTop="15px">
            <FormLabel htmlFor="name">Enter name</FormLabel>
            <Input
              type="text"
              name="name"
              id="name"
              isRequired
              focusBorderColor="#fe8040"
              bg="#454545"
              placeholder="John Doe"
              value={credentials.name}
              onChange={handleInput}
            />
          </Box>

          <Box as="div" marginTop="15px">
            <FormLabel htmlFor="userName">Enter username</FormLabel>
            <Input
              type="text"
              name="userName"
              id="userName"
              isRequired
              focusBorderColor="#fe8040"
              bg="#454545"
              placeholder="iamJohn"
              value={credentials.userName}
              onChange={handleInput}
            />
          </Box>

          <Box as="div" marginTop="15px">
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              type="email"
              name="email"
              id="email"
              isRequired
              focusBorderColor="#fe8040"
              bg="#454545"
              placeholder="johndoe@mail.com"
              value={credentials.email}
              onChange={handleInput}
            />
          </Box>

          <Box as="div" marginTop="15px">
            <FormLabel htmlFor="password">
              <span> Password</span>
              <Tooltip
                hasArrow
                label="password must contain 1 number (0-9) password must contain 1
              uppercase letters password must contain 1 lowercase letters
              password must contain 1 non-alpha numeric number password is 8-16
              characters with no space"
              >
                <InfoOutlineIcon boxSize={4} cursor={"pointer"} ml="5px" />
              </Tooltip>
            </FormLabel>
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
                    registerUser();
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

          <Box as="div" marginTop="15px">
            <FormLabel>Profile picture</FormLabel>
            <Input
              type="file"
              name="profile_pic"
              sx={{
                "::file-selector-button": {
                  height: 10,
                  padding: 0,
                  mr: 4,
                  border: "none",
                  bg: "none",
                  color: "#fff",
                },
                background: "#454545",
              }}
              onChange={(e) => handleProfilePic(e)}
            />
          </Box>

          <Box as="div" marginTop="20px">
            <Button
              bg="#fe8040"
              color="#fff"
              width="100%"
              sx={buttonStyle}
              isLoading={isLoading}
              onClick={() => {
                registerUser();
              }}
            >
              Register
            </Button>
          </Box>
        </FormControl>
      </Box>
    </>
  );
};
