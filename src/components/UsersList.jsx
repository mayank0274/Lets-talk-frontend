import React, { useState } from "react";
import { UsersSearch } from "./UsersSearch";
import { UserState } from "../context/userContext";

export const UsersList = () => {
  const { showChatArea } = UserState();

  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  return (
    /* wrapper for user search component => uses UserSearch component */
    <div
      style={{
        backgroundColor: "#0f0f0f",
        height: "90vh",
        width: window.innerWidth < 1000 ? "100%" : "25%",
        display: showChatArea && width < 1000 ? "none" : "block",
        // display: showChatArea && window.innerWidth < 1000 ? "none" : "block",
      }}
      className="userSearch"
    >
      <UsersSearch />
    </div>
  );
};
