const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const sendFriendRequest = async (senderId, recipientId) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderId, recipientId }),
  };

  const response = await fetch(`${BACKEND_URL}/friends/send`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to send friend request");
  }
  const data = await response.json();
  return data;
};

export const acceptFriendRequest = async (userId, friendId) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, friendId }),
  };

  const response = await fetch(`${BACKEND_URL}/friends/accept`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to accept friend request");
  }
  const data = await response.json();
  return data;
};

export const declineFriendRequest = async (userId, friendId) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, friendId }),
  };

  const response = await fetch(
    `${BACKEND_URL}/friends/decline`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to decline friend request");
  }
  const data = await response.json();
  return data;
};

export const removeFriend = async (userId, friendId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, friendId }),
  };

  const response = await fetch(`${BACKEND_URL}/friends/remove`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to remove friend");
  }
  const data = await response.json();
  return data;
};

export const getFriends = async (userId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/friends/${userId}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch friends");
  }
  const data = await response.json();
  return data;
};

export const getFriendRequests = async (userId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/friends/requests/${userId}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch friend requests");
  }
  const data = await response.json();
  return data;
};
