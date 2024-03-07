import React, { useState, useEffect } from "react";
import "./Live.scss";
import { addUser } from "../../store/slices/userInfoSlice";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

const socket = io(`${process.env.REACT_APP_SERVER_LINK}`);
const Live: React.FC = (props) => {
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([""]);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("message", (data: string) => {
      setReceivedMessages([...receivedMessages, data]);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, [receivedMessages]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", message);
      setMessage(message);
    }
  };

  return (
    <div>
      <h1>Live Chat</h1>
      <div>
        {userInfo.isLoggedIn ? <h3>User Name: {userInfo.userEmail}</h3> : <></>}
      </div>
      <div>
        {receivedMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Live;
