import React, { useEffect, useState, useRef } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { UserState } from "../context/userContext";
import moment from "moment/moment";
import { MediaMessage } from "./MediaMessage";
import LinkParser from "react-link-parser";

export const SingleMessage = (props) => {
  // messages
  const { messagesList, isUpoadingMedia, fileType } = props;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(messagesList);
  }, [messagesList]);

  // logged in user
  const { user, selectedChat } = UserState();

  // scroll to bottom when message send
  const ScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  return (
    // component for rendering message used by MessageArea component
    <>
      <Flex w="70%" h="100%" overflowY="scroll" flexDirection="column" p="3">
        {messages.map((item, index) => {
          if (item.sender._id === user._id) {
            if (item.isMedia) {
              return (
                <MediaMessage
                  background="#D34515"
                  sender={true}
                  url={item.content}
                  time={moment(item.createdAt).format("hh:mm a")}
                  type={item.resourceType}
                  size={item.size}
                  key={item._id}
                />
              );
            }

            return (
              <Flex key={index} w="100%" justify="flex-end">
                <Flex
                  borderRadius="10px"
                  bg="#D34515"
                  color="white"
                  minW="120px"
                  maxW="350px"
                  my="1"
                  p="1.5"
                  direction="column"
                  key={item._id}
                >
                  {/* <Text>{item.content}</Text> */}
                  <div className="messageContent">
                    <LinkParser>{item.content}</LinkParser>
                  </div>

                  <Text
                    fontSize="10px"
                    color="gray.100"
                    alignSelf="flex-end"
                    margin="0"
                    padding="0"
                  >
                    {moment(item.createdAt).format("hh:mm a")}
                  </Text>
                </Flex>
              </Flex>
            );
          } else {
            if (item.isMedia) {
              return (
                <MediaMessage
                  background="#006B3E"
                  sender={false}
                  url={item.content}
                  time={moment(item.createdAt).format("hh:mm a")}
                  type={item.resourceType}
                  size={item.size}
                  key={item._id}
                />
              );
            }
            return (
              <Flex key={index} w="100%">
                <Flex
                  borderRadius="10px"
                  bg="#006B3E"
                  color="white"
                  minW="120px"
                  maxW="350px"
                  my="1"
                  p="1.5"
                  direction="column"
                  key={item._id}
                >
                  <Text as="div">
                    {selectedChat.isGroupChat && (
                      <>
                        <span style={{ color: "pink" }}>
                          ~ {item.sender.name}
                        </span>
                        <br />
                      </>
                    )}
                    {/* {item.content} */}
                    <div className="messageContent">
                      <LinkParser>{item.content}</LinkParser>
                    </div>
                  </Text>
                  <Text
                    fontSize="10px"
                    color="gray.100"
                    alignSelf="flex-end"
                    margin="0"
                    padding="0"
                  >
                    {moment(item.createdAt).format("hh:mm a")}
                  </Text>
                </Flex>
              </Flex>
            );
          }
        })}
        {/* 
        if media message is sending then show loading  */}
        {isUpoadingMedia && (
          <MediaMessage
            isUpoadingMedia={isUpoadingMedia}
            sender={true}
            url={null}
            size={null}
            type={fileType}
            time={moment().format("hh:mm a")}
          />
        )}
        <ScrollToBottom />
      </Flex>
    </>
  );
};
