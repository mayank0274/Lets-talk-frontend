import React, { useEffect, useState } from "react";
import {
  VStack,
  Flex,
  Avatar,
  Text,
  Center,
  HStack,
  Button,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { makeRequest, profilePic, chatName } from "../utlis/utilityFunctions";
import { SearchLoader } from "./SearchLoader";
import { CreateGroup } from "./CreateGroup";
import { UserState } from "../context/userContext";
import { socket } from "../utlis/socketConnection";

const chatBoxStyle = {
  borderRadius: "7px",
};

export const UserChats = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openGroupChatPanel, setOpenGroupChatPanel] = useState(false);

  const {
    newChat,
    selectedChat,
    setSelectedChat,
    setShowChatArea,
    setUserChats,
    user,
  } = UserState();

  // load chats
  const loadChats = async () => {
    setIsLoading(true);
    const url = `/api/chat/getAllChats`;

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

    setChats(data.chats);

    // set chat list globally
    setUserChats(data.chats);
  };

  useEffect(() => {
    loadChats();
  }, [newChat]);

  return (
    /* dispaly all chats that user created
     * from here user can create group via create group component OR
     * select a chat for chatting => control moves MessageAreaComponent
     */

    <>
      {chats && (
        <VStack spacing={4} align="stretch" overflowY="scroll" my="20px">
          <HStack>
            <Text color="#fff" mx="35px" fontSize="18px" w="30%">
              My chats
            </Text>

            <Button
              leftIcon={<AddIcon />}
              colorScheme="orange"
              onClick={() => {
                setOpenGroupChatPanel(true);
              }}
            >
              Create Group
            </Button>
          </HStack>

          {chats.length === 0 && !isLoading && (
            <Center>
              <Text color="#fff" fontSize="18px" p="20px" m="20px">
                No chats found. Search a user and start chatting
              </Text>
            </Center>
          )}

          {isLoading && <SearchLoader />}

          {openGroupChatPanel && (
            <CreateGroup closeGroupCreationPanel={setOpenGroupChatPanel} />
          )}

          {chats.map((chat) => {
            return (
              <Flex
                h="60px"
                w="80%"
                bg={selectedChat._id == chat._id ? "#fe8040" : "gray.600"}
                alignItems="center"
                sx={chatBoxStyle}
                key={chat._id}
                cursor="pointer"
                mx="auto"
                onClick={() => {
                  setSelectedChat(chat);
                  setShowChatArea(true);
                  socket.emit("create_room", chat);
                }}
              >
                <Avatar
                  name={chatName(chat, user)}
                  src={profilePic(chat, user)}
                  size="md"
                  ml="15px"
                  mr="10px"
                ></Avatar>
                <Flex direction="column" w="80%">
                  <Text textAlign="center" w="60%" fontSize="17px" color="#fff">
                    {chatName(chat, user)}
                  </Text>
                  <Text
                    textAlign="center"
                    w="60%"
                    fontSize="14px"
                    color="gray.300"
                  >
                    {chat.latestMessage
                      ? chat.latestMessage.content.length > 15
                        ? `${chat.latestMessage.content.slice(0, 15)}...`
                        : chat.latestMessage.content
                      : ""}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
        </VStack>
      )}
    </>
  );
};
