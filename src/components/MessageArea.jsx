import React, { useEffect, useState, useRef } from "react";
import chatAreaBg from "../assets/chatAreaBg.png";
import {
  Box,
  Flex,
  Text,
  Avatar,
  HStack,
  VStack,
  Input,
  Center,
  IconButton,
  useToast,
  Spinner,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { UserState } from "../context/userContext";
import { Profile } from "./Profile";
import { chatName, profilePic, makeRequest } from "../utlis/utilityFunctions";
import { socket } from "../utlis/socketConnection";
import { SingleMessage } from "./SingleMessage";
import { MediaMessage } from "./MediaMessage";

const chatAreaStyle = {
  backgroundImage: `url(${chatAreaBg})`,
};
var compareSelectedChat;

export const MessageArea = () => {
  const {
    selectedChat,
    setSelectedChat,
    showChatArea,
    setShowChatArea,
    user,
    notifications,
    setNotifications,
  } = UserState();

  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [oldMessageList, setOldmessagelist] = useState([]);
  const [isUpoadingMedia, setIsUpoadingMedia] = useState(false);
  const [fetchingOldmessage, setFetchingOldMessage] = useState(false);
  const toast = useToast();
  const openFileSelection = useRef();
  const [fileType, setFileType] = useState("");

  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  // function for sending message
  const sendMessage = async (chatId, mediaInfo = null, queueMsg = "") => {
    const url = `/api/message`;
    let body = {
      chatId,
      message: queueMsg != "" ? queueMsg : message,
    };

    // if message is media add that info
    if (mediaInfo != null) {
      body = {
        chatId,
        message: mediaInfo.url,
        resourceType: mediaInfo.resourceType,
        size: mediaInfo.size,
        isMedia: true,
      };
    }

    const data = await makeRequest(url, "POST", body, true);

    if (data instanceof Error) {
      const errorMSg = data.message.replaceAll("\\", "");
      toast({
        description: errorMSg,
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      setIsUpoadingMedia(false);
      return;
    }
    setMessage("");

    // if some media is sending and we send another message at that time keep uploading media in true state
    isUpoadingMedia ? setIsUpoadingMedia(true) : setIsUpoadingMedia(false);

    // add message created to message3s list
    setOldmessagelist([...oldMessageList, data.message]);

    // emit a new message event that is listened on server and send that message to intendend receivers
    socket.emit("new_message", data.message);
  };

  // function for attaching media
  const sendMedia = async (chatId, e) => {
    const formData = new FormData();
    const file = e.target.files[0];

    if (!file || file == undefined) {
      return;
    }

    setFileType(file.type.split("/")[0]);
    formData.append("file", file);

    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    setIsUpoadingMedia(true);

    try {
      const url = `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/upload`;

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const mediaInfo = {
        url: data.url.toString(),
        resourceType: data.resource_type,
        size: data.bytes,
      };
      sendMessage(chatId, mediaInfo);
    } catch (err) {
      setIsUpoadingMedia(false);
      toast({
        description: err.message,
        position: "bottom-left",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  // load old messages
  const getOldMessages = async () => {
    if (JSON.stringify(selectedChat) == "{}") {
      return;
    }

    const url = `/api/message/${selectedChat._id}`;
    setFetchingOldMessage(true);
    const data = await makeRequest(url, "GET", null, true);
    setFetchingOldMessage(false);
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

    setOldmessagelist(data.messages);
  };

  // fetch message again if other chat is selected
  useEffect(() => {
    getOldMessages();
    compareSelectedChat = selectedChat;
  }, [selectedChat, isUpoadingMedia]);

  // receive message from sockets(sended by another  user) in realtime and addd it to our message list
  useEffect(() => {
    socket.on("send_received_message", (message) => {
      if (
        !compareSelectedChat ||
        compareSelectedChat._id !== message.chatId._id
      ) {
        const isAlreadyAddedToNotifications = notifications.some((elem) => {
          return elem.chatId == message.chatId ? true : false;
        });
        if (!isAlreadyAddedToNotifications) {
          setNotifications([...notifications, message]);
        }
      } else {
        setOldmessagelist([...oldMessageList, message]);
      }
    });
  });

  return (
    // main chat area opens when user click on a chat => uses profile,singlemessage component
    <Flex
      sx={chatAreaStyle}
      w={width > 1000 ? "75%" : showChatArea && width < 1000 ? "100%" : "0%"}
      //  w={{ lg: "75%", md: "100%" }}
      height="90vh"
      direction="column"
      justifyContent="center"
    >
      {JSON.stringify(selectedChat) != "{}" && (
        <div style={{ height: "100%" }}>
          <Flex
            w="100%"
            bg="#212121"
            color="#fff"
            h="45px"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack>
              <IconButton
                colorScheme="white"
                variant="outline"
                aria-label="Back_button"
                size="sm"
                ml="10px"
                icon={<ArrowBackIcon />}
                onClick={() => {
                  setShowChatArea(false);
                  setSelectedChat({});
                }}
                display={{ lg: "block", xl: "none" }}
              />

              <Avatar
                name={chatName(selectedChat, user)}
                src={profilePic(selectedChat, user)}
                size="sm"
                ml="10px"
                cursor="pointer"
                onClick={() => {
                  setShowProfile(true);
                }}
              />
              <Text ml="10px">{chatName(selectedChat, user)}</Text>
            </HStack>
            {showProfile && (
              <Profile chat={selectedChat} closeProfilePanel={setShowProfile} />
            )}
            {/* to be added in next updates */}
            {/* <HStack mr="15px">
              <i
                className="fa-solid fa-phone"
                style={{
                  fontSize: "17px",
                  marginRight: "15px",
                  cursor: "pointer",
                }}
              ></i>
              <i
                className="fa-solid fa-video"
                style={{ fontSize: "17px", cursor: "pointer" }}
              ></i>
            </HStack> */}
          </Flex>

          <VStack height={{ base: "73%", lg: "80%" }} overflowY="scroll">
            {fetchingOldmessage && (
              <AbsoluteCenter>
                <Spinner size="xl" color="#fff" />
              </AbsoluteCenter>
            )}
            {(oldMessageList.length != 0 || isUpoadingMedia) && (
              <SingleMessage
                messagesList={oldMessageList}
                isUpoadingMedia={isUpoadingMedia}
                fileType={fileType}
              />
            )}
          </VStack>

          <HStack>
            <Center w="100%">
              <Input
                type="text"
                w="65%"
                bg="#212121"
                color="#fff"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && message != "") {
                    sendMessage(selectedChat._id);
                  }
                }}
              />

              <i
                className="fa-solid fa-paperclip"
                style={{
                  fontSize: "25px",
                  marginLeft: "15px",
                  cursor: "pointer",
                  color: isUpoadingMedia ? "gray" : "#fff",
                }}
                onClick={() => {
                  if (isUpoadingMedia) return;
                  openFileSelection.current.click();
                }}
              ></i>
              <input
                type="file"
                style={{ display: "none" }}
                ref={openFileSelection}
                onChange={(e) => {
                  sendMedia(selectedChat._id, e);
                }}
              />
              <i
                className="fa-solid fa-paper-plane"
                style={{
                  fontSize: "25px",
                  marginLeft: "15px",
                  cursor: "pointer",
                  color: "#fff",
                }}
                onClick={() => {
                  sendMessage(selectedChat._id);
                }}
              ></i>
            </Center>
          </HStack>
        </div>
      )}
    </Flex>
  );
};
