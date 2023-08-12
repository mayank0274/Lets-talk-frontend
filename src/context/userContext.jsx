import { createContext, useContext, useState } from "react";

const userContext = createContext();

const UserProvider = ({ children }) => {
  // state for logged in user info
  const [user, setUser] = useState({});

  // state for checking if new chat added to user chat list
  const [newChat, setNewChat] = useState({});

  // state for checking which chat is currently selected => means the chat with logged in user chatting
  const [selectedChat, setSelectedChat] = useState({});

  // state for maintain user all chats
  const [userChats, setUserChats] = useState([]);

  //state for maintaining visibility of  chatarea and chatlist for small screen devices
  const [showChatArea, setShowChatArea] = useState(false);

  // notifications state
  const [notifications, setNotifications] = useState([]);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        newChat,
        setNewChat,
        selectedChat,
        setSelectedChat,
        showChatArea,
        setShowChatArea,
        setUserChats,
        userChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const UserState = () => {
  return useContext(userContext);
};

export default UserProvider;
