// function for making requests
export const makeRequest = async (
  url,
  method,
  body = null,
  useCredentials = false
) => {
  try {
    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: useCredentials,
      ...(body != null && { body: JSON.stringify(body) }),
    };
    const res = await fetch(url, options);
    const jsonData = await res.json();

    if (res.status >= 400 && res.status <= 500) {
      throw new Error(jsonData.message);
    }
    return jsonData;
  } catch (error) {
    // console.log(error);
    return error;
  }
};

/*
 * these functions are for one to one chats
 * from members array of 0ne to one chats we have to display name,profile etc. of member who is not logged in
 * e.g. if members are A,B and A logged in then we show details of B to A and vice versa
 */

// function for returning chat name
export const chatName = (chat, user) => {
  //console.log(chat);
  if (chat.isGroupChat) {
    return chat.name;
  } else {
    const name =
      user._id == chat.members[0]._id
        ? chat.members[1].name
        : chat.members[0].name;
    return name;
  }
};

// function for returning profile pic
export const profilePic = (chat, user) => {
  if (chat.isGroupChat) {
    return chat.name;
  } else {
    const pic =
      user._id == chat.members[0]._id
        ? chat.members[1].profilePic
        : chat.members[0].profilePic;
    return pic;
  }
};

// function for returning email
export const getEmail = (chat, user) => {
  if (chat.isGroupChat) {
    return;
  } else {
    const email =
      user._id == chat.members[0]._id
        ? chat.members[1].email
        : chat.members[0].email;
    return email;
  }
};

// function for returning username
export const getUsername = (chat, user) => {
  if (chat.isGroupChat) {
    return;
  } else {
    const userName =
      user._id == chat.members[0]._id
        ? chat.members[1].userName
        : chat.members[0].userName;
    return userName;
  }
};
