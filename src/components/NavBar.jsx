import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  AvatarBadge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { BellIcon } from "@chakra-ui/icons";
import { UserState } from "../context/userContext";
import { makeRequest } from "../utlis/utilityFunctions";

export const NavBar = () => {
  const {
    user,
    notifications,
    setNotifications,
    setSelectedChat,
    userChats,
    setShowChatArea,
  } = UserState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  //logout function
  const logout = async () => {
    const url = `/api/auth/logout`;

    const data = await makeRequest(url, "GET", null, true);

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
    // navigate to homepage after logout
    navigate("/");
  };

  const getSelectedChat = (chatId) => {
    const chat = userChats.filter((elem) => {
      return elem._id == chatId;
    });
    // console.log(chat[0]);
    return chat[0];
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        as="section"
        bg="#0f0f0f"
        w="100%"
        h="60px"
        color="#fff"
      >
        <Text fontSize="20px" ml="15px">
          <span style={{ color: "#fe8040", fontWeight: "bold" }}>Let's</span>{" "}
          Talk
        </Text>
        <Flex as="section">
          <Menu>
            <MenuButton mr="10px">
              <Avatar
                icon={<BellIcon boxSize={5} color="black" />}
                size="sm"
                mr="10px"
                bg="gray.100"
                cursor="pointer"
              >
                {notifications.length > 0 && (
                  <AvatarBadge boxSize="1.5em" bg="red.500">
                    {notifications.length}
                  </AvatarBadge>
                )}
              </Avatar>
            </MenuButton>
            {notifications.length > 0 && (
              <MenuList bg="#454545" border="none">
                {notifications.map((notification) => {
                  return (
                    <MenuItem
                      bg="#454545"
                      key={notification._id}
                      onClick={() => {
                        setSelectedChat(
                          getSelectedChat(notification.chatId._id)
                        );
                        setShowChatArea(true);
                        setNotifications((elem) => {
                          return notification._id != elem._id;
                        });
                      }}
                    >
                      {notification.chatId?.isGroupChat
                        ? `You have new message from ${notification.chatId.name} `
                        : `You have new message from ${notification.sender.name}`}
                    </MenuItem>
                  );
                })}
              </MenuList>
            )}
          </Menu>

          <Menu>
            <MenuButton mr="25px">
              <Avatar
                name={user.name}
                src={user.profilePic}
                size="sm"
                mr="10px"
              >
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
            </MenuButton>
            <MenuList bg="#454545" border="none">
              <MenuItem bg="#454545" onClick={onOpen}>
                Profile
              </MenuItem>
              <MenuItem
                bg="#454545"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* profile info modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#454545" color="#fff">
            Profile
          </ModalHeader>
          <ModalCloseButton color="#fff" />
          <ModalBody bg="#454545">
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar name={user.name} src={user.profilePic} size="xl" />
              <Text color="#fff" fontSize="19px" my="4px">
                {user.name}
              </Text>
              <Text color="#fff" fontSize="19px" my="4px">
                {user.email}
              </Text>
              <Text color="#fff" fontSize="19px" my="4px">
                {user.userName}
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
