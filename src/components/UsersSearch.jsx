import {
  Flex,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Box,
  Text,
  AbsoluteCenter,
  VStack,
  StackDivider,
  Avatar,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { makeRequest } from "../utlis/utilityFunctions";
import { SearchLoader } from "./SearchLoader";
import { UserChats } from "./UserChats";
import { UserState } from "../context/userContext";

const inputStyle = {
  border: "1px solid #fff",
};

const chatBoxStyle = {
  borderRadius: "7px",
};

export const UsersSearch = () => {
  // drawer state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // search related states
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsMSg, setSearchResultsMSg] = useState("");
  const toast = useToast();
  const {
    newChat,
    setNewChat,
    selectedChat,
    setSelectedChat,
    setShowChatArea,
  } = UserState();

  // handle input
  const handleInput = (e) => {
    setSearchQuery(e.target.value);
  };

  // function for  searching users
  const searchUser = async () => {
    setIsLoading(true);
    const url = `/api/chat/users/?search=${searchQuery}`;
    const data = await makeRequest(url, "GET", null, true);
    setIsLoading(false);

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
    if (data.users.length === 0) {
      setSearchResultsMSg("Users not found");
    } else {
      setSearchResultsMSg("");
    }
    setSearchResults(data.users);
  };

  // search user with debounce functionality
  useEffect(() => {
    let timer;
    if (searchQuery.length > 0) {
      timer = setTimeout(() => {
        searchUser();
      }, 1500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  //create chat when user click on user => chat is like a contact of other person
  const createChat = async (id) => {
    setCreatingChat(true);
    const url = `/api/chat/createChat`;
    const reqBody = {
      userIds: [id],
    };

    const data = await makeRequest(url, "POST", reqBody, true);
    setCreatingChat(false);

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
    setNewChat(data.chat);
    setSelectedChat(data.chat);
    onClose();
    if (window.innerWidth < 1000) {
      setShowChatArea(true);
    }
  };

  return (
    // user search component => user have to find a user to create chat with that
    <Flex>
      <Flex direction="column" w="100%" justifyContent="center">
        <Input
          type="text"
          placeholder="search a user.."
          w="80%"
          bg="#454545"
          mx="auto"
          marginTop="10px"
          sx={inputStyle}
          focusBorderColor="#fe8040"
          color="#fff"
          onClick={onOpen}
        />

        <UserChats />
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#454545">
          <DrawerHeader borderBottomWidth="1px" color="#fff">
            Search user
          </DrawerHeader>
          <DrawerBody>
            <Input
              type="text"
              placeholder="search a user.."
              focusBorderColor="#fe8040"
              color="#fff"
              value={searchQuery}
              onChange={handleInput}
            />
            <Box>
              <Text p="5px" color="white" mb="5px">
                Search a user by name,username or email
              </Text>
            </Box>

            {creatingChat && (
              <Spinner
                size="sm"
                alignSelf="flex-end"
                mr="3px"
                ml="auto"
                color="#fff"
              />
            )}

            {searchResultsMSg != "" && (
              <AbsoluteCenter>
                <Text p="5px" textAlign="center" color="#fff" fontSize="21px">
                  {searchResultsMSg}
                </Text>
              </AbsoluteCenter>
            )}

            {isLoading && <SearchLoader />}

            {searchResults && (
              <VStack
                divider={<StackDivider borderColor="gray.100" />}
                spacing={4}
                align="stretch"
                overflowY="scroll"
              >
                {searchResults.map((user) => {
                  return (
                    <Flex
                      h="60px"
                      bg="gray.600"
                      alignItems="center"
                      sx={chatBoxStyle}
                      key={user._id}
                      cursor="pointer"
                      onClick={() => {
                        createChat(user._id);
                      }}
                    >
                      <Avatar
                        name={user.name}
                        src={user.profilePic}
                        size="md"
                        ml="15px"
                        mr="10px"
                      />
                      <Text
                        textAlign="center"
                        w="35%"
                        fontSize="17px"
                        color="#fff"
                      >
                        {user.name}
                      </Text>
                    </Flex>
                  );
                })}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
