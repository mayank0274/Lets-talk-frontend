import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../utlis/utilityFunctions";
import { NavBar } from "../components/NavBar";
import { UsersList } from "../components/UsersList";
import { MessageArea } from "../components/MessageArea";
import { UserState } from "../context/userContext";
import { Flex } from "@chakra-ui/react";
import { socket } from "../utlis/socketConnection";

export const ChatPage = () => {
  const { user, setUser } = UserState();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // fetch user detaila when user log in
      const data = await makeRequest("/api/auth/user", "get", null, true);
      setUser(data.user);

      // if error redirect to homepage
      if (data instanceof Error) {
        return navigate("/");
      }

      // socket connection
      socket.emit("user_connected", data.user);
    })();
  }, []);

  return (
    // main chat page
    <>
      <NavBar />
      <Flex>
        <UsersList />
        <MessageArea />
      </Flex>
    </>
  );
};
