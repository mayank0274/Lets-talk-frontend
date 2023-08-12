import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  useDisclosure,
  Flex,
  Text,
  Avatar,
  Input,
  Box,
  VStack,
  IconButton,
  Button,
  useToast,
  useIds,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import { UserState } from "../context/userContext";
import { makeRequest, chatName, profilePic } from "../utlis/utilityFunctions";

const chatBoxStyle = {
  borderRadius: "7px",
};

export const CreateGroup = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openGroupCreationPanel = useRef();
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userIds, setUserIds] = useState([]);
  const { userChats, setNewChat, user } = UserState();
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [userChatList, setUserChatList] = useState(userChats);
  const [creatingChat, setCreatingChat] = useState(false);

  const toast = useToast();

  useEffect(() => {
    openGroupCreationPanel.current.click();
  }, []);

  const filterUsers = () => {
    const filterArray = userChats.filter((user) => {
      // console.log(user.members[1].name);
      return user.members[1].name.includes(searchQuery);
    });

    setUserChatList(filterArray);
  };

  //create chat when user click on chat
  const createGroupChat = async () => {
    if (!groupName) {
      toast({
        description: "Groupname is required",
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 2000,
      });
      return;
    }

    if (userIds.length < 2) {
      toast({
        description:
          "Group creation require minimum three members including you",
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 2000,
      });
      return;
    }

    setCreatingChat(true);
    const url = `/api/chat/createChat`;
    const reqBody = {
      groupName,
      userIds: userIds,
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
        duration: 2000,
      });
      return;
    }
    setNewChat(data.chat);
    onClose();
  };

  return (
    <>
      <button
        onClick={onOpen}
        ref={openGroupCreationPanel}
        style={{ display: "none" }}
      >
        open
      </button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => {
          onClose();
          props.closeGroupCreationPanel(false);
        }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="white" />

          <DrawerBody bg="#212121">
            <Box>
              <Text p="5px" color="white" mb="5px">
                Enter Group Name
              </Text>
            </Box>

            <Input
              type="text"
              placeholder="Enter Group Name..."
              focusBorderColor="#fe8040"
              color="#fff"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
            {/* 
            {useIds.length > 1 && (
              <Flex flexWrap="wrap">{userIds.map((user) => {})}</Flex>
            )} */}

            <Box>
              <Text p="5px" color="white" mb="5px">
                Select group members from your chats
              </Text>
            </Box>

            <Input
              type="text"
              placeholder="Search a user..."
              focusBorderColor="#fe8040"
              color="#fff"
              marginBottom="15px"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                filterUsers();
              }}
            />

            {userChatList && (
              <VStack spacing={4} align="stretch" overflowY="scroll">
                {userChatList.map((user) => {
                  if (user.isGroupChat) return;
                  return (
                    <Flex
                      h="60px"
                      bg={
                        userIds.includes(user.members[1]._id)
                          ? "#fe8040"
                          : "gray.600"
                      }
                      alignItems="center"
                      sx={chatBoxStyle}
                      key={user.members[1]._id}
                      cursor="pointer"
                      onClick={() => {
                        if (userIds.includes(user.members[1]._id)) {
                          const newUserIdArray = userIds.filter((elem) => {
                            return elem != user.members[1]._id;
                          });
                          setUserIds(newUserIdArray);
                          return;
                        }
                        setUserIds([...userIds, user.members[1]._id]);
                      }}
                    >
                      <Avatar
                        name={chatName(user, loggedInUser)}
                        src={profilePic(user, loggedInUser)}
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
                        {chatName(user, loggedInUser)}
                      </Text>
                    </Flex>
                  );
                })}
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter bg="#212121">
            <Button variant="outline" mr={3} onClick={onClose} color="white">
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              isLoading={creatingChat}
              onClick={() => {
                createGroupChat();
              }}
            >
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
