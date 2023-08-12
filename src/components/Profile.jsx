import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  DrawerCloseButton,
  useDisclosure,
  Flex,
  Text,
  Avatar,
  Box,
  VStack,
  IconButton,
  useToast,
  Badge,
  Button,
  Tooltip,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Center,
} from "@chakra-ui/react";
import { DeleteIcon, CheckIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import {
  makeRequest,
  chatName,
  profilePic,
  getUsername,
  getEmail,
} from "../utlis/utilityFunctions";
import { UserState } from "../context/userContext";

const chatBoxStyle = {
  borderRadius: "7px",
};

export const Profile = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openProfile = useRef();
  const { chat, closeProfilePanel } = props;
  const { setSelectedChat, selectedChat, userChats, user } = UserState();
  const [loggedInUser, setLoggedInUser] = useState(user);
  const toast = useToast();
  const [leavingGroup, setLeavingGroup] = useState(false);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(chat.name);
  // state for maintaing out of user chats who are not group members
  const [nonGroupMembers, setNonGroupMembers] = useState([]);

  useEffect(() => {
    openProfile.current.click();

    // filter not in group users
    const filterUserChats = userChats.filter((userchat) => {
      if (userchat.isGroupChat) return;
      return !selectedChat.members.some(
        (member) => userchat.members[1]._id == member._id
      );
    });
    setNonGroupMembers(filterUserChats);
  }, [selectedChat]);

  // function for removing group member
  const removeGroupMember = async (grpId, userId) => {
    const url = `/api/chat/removeMember`;
    const body = {
      grpId,
      userId,
    };

    const data = await makeRequest(url, "PATCH", body, true);

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
    setSelectedChat(data.chat);
  };

  // function for left group
  const leftGroup = async (grpId) => {
    const url = `/api/chat/leftGroup`;
    const body = {
      grpId,
    };
    setLeavingGroup(true);
    const data = await makeRequest(url, "PATCH", body, true);
    setLeavingGroup(false);
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
    setSelectedChat({});
  };

  // function fpr renaming group

  const renamegroup = async (grpId) => {
    const url = `/api/chat/renameGroup`;
    const body = {
      grpId,
      newName: newGroupName,
    };

    const data = await makeRequest(url, "PATCH", body, true);

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
    setSelectedChat(data.chat);
  };

  // function for adding member to group
  const addTogroup = async (grpId, userId) => {
    const url = `/api/chat/addMember`;
    const body = {
      grpId,
      userId,
    };

    const data = await makeRequest(url, "PATCH", body, true);

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

    setSelectedChat(data.chat);
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
      <button onClick={onOpen} ref={openProfile} style={{ display: "none" }}>
        open
      </button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose();
          closeProfilePanel(false);
        }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="white" />

          <DrawerBody bg="#212121">
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                name={chatName(chat, user)}
                src={profilePic(chat, user)}
                size="2xl"
                my="15px"
              />
              <Center>
                <Text
                  color="#fff"
                  fontSize={chat.isGroupChat ? "20px" : "30px"}
                  my="10px"
                  ml="15px"
                  w="100%"
                >
                  {chat.isGroupChat && "Group : "} {chatName(chat, user)}
                  {chat.isGroupChat && ` (${chat.members.length} Participants)`}
                </Text>
              </Center>

              {chat.isGroupChat && (
                <Flex w="90%">
                  <Editable defaultValue={newGroupName} color="#fff" w="80%">
                    <EditablePreview
                      color="#fff"
                      border="1px solid #fff"
                      w="80%"
                      paddingLeft="15px"
                      defaultValue={newGroupName}
                    />
                    <Input
                      as={EditableInput}
                      color="#fff"
                      w="80%"
                      focusBorderColor="#fe8040"
                      value={newGroupName}
                      onChange={(e) => {
                        setIsEditingGroupName(true);
                        setNewGroupName(e.target.value);
                      }}
                    />
                  </Editable>
                  {isEditingGroupName && isEditingGroupName && (
                    <>
                      <IconButton
                        icon={<CheckIcon />}
                        size="sm"
                        mr="10px"
                        onClick={() => {
                          renamegroup(chat._id);
                        }}
                      />
                      <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        onClick={() => {
                          setNewGroupName(chat.name);
                          setIsEditingGroupName(false);
                        }}
                      />
                    </>
                  )}
                </Flex>
              )}

              {!chat.isGroupChat && (
                <Flex justifyContent="center" direction="column">
                  <Text color="#fff" fontSize="20px" my="10px">
                    Email : {getEmail(chat, user)}
                  </Text>
                  <Text color="#fff" fontSize="20px" my="10px">
                    Username : {getUsername(chat, user)}
                  </Text>
                </Flex>
              )}

              {chat.isGroupChat && (
                <Flex direction="column" w="90%">
                  <Accordion
                    color="#fff"
                    allowToggle
                    border="1px solid #fff"
                    mt="15px"
                  >
                    <AccordionItem color="#fff">
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left" color="#fff">
                            Add a member{" "}
                            <i
                              className="fa-solid fa-user-plus"
                              style={{ marginLeft: "10px", color: "#fffs" }}
                            ></i>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {nonGroupMembers.length == 0 && (
                          <Text p="10px">
                            Users not found!! Its seem like all your chats are
                            member of this group
                          </Text>
                        )}
                        {nonGroupMembers.length != 0 &&
                          nonGroupMembers.map((user) => {
                            return (
                              <VStack
                                align="stretch"
                                overflowY="scroll"
                                my="5px"
                                key={user._id}
                              >
                                <Flex
                                  h="60px"
                                  bg="gray.600"
                                  alignItems="center"
                                  sx={chatBoxStyle}
                                  cursor="pointer"
                                  onClick={() => {
                                    addTogroup(chat._id, user.members[1]._id);
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
                              </VStack>
                            );
                          })}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>

                  <Text color="#fff" fontSize="20px" my="10px">
                    Group members
                  </Text>

                  {/* <IconButton
                      icon={<AddIcon />}
                      size="sm"
                      mr="10px"
                      onClick={() => {
                        setIsAddingMember(true);
                        onClose();
                      }}
                    /> */}

                  {chat.members.map((user) => {
                    return (
                      <VStack
                        align="stretch"
                        overflowY="scroll"
                        my="5px"
                        key={user._id}
                      >
                        <Flex
                          h="60px"
                          bg="gray.600"
                          alignItems="center"
                          sx={chatBoxStyle}
                          cursor="pointer"
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

                            {chat.groupAdmin == user._id && (
                              <Badge colorScheme="green">Admin</Badge>
                            )}
                          </Text>
                          {chat.groupAdmin == loggedInUser._id && (
                            <IconButton
                              aria-label="remove user"
                              size="sm"
                              isRound={true}
                              icon={<DeleteIcon />}
                              ml="auto"
                              mr="10px"
                              colorScheme="red"
                              onClick={() => {
                                removeGroupMember(chat._id, user._id);
                              }}
                            />
                          )}
                        </Flex>
                      </VStack>
                    );
                  })}
                </Flex>
              )}
            </Flex>
          </DrawerBody>
          {chat.isGroupChat && (
            <DrawerFooter bg="#212121">
              <Button variant="outline" mr={3} onClick={onClose} color="white">
                Cancel
              </Button>

              <Tooltip hasArrow label="leave group" bg="gray.300" color="black">
                <Button
                  colorScheme="red"
                  onClick={() => {
                    leftGroup(chat._id);
                  }}
                  isLoading={leavingGroup}
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </Button>
              </Tooltip>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
