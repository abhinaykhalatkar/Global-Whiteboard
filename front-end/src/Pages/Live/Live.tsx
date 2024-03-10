import React, { useState, useEffect } from "react";
import "./Live.scss";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Whiteboard from "../../Components/Whiteboard/Whiteboard";
import { fabric } from "fabric";

const Live: React.FC = (props) => {
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);

  return (
    <div>
      <h1>Live Chat</h1>
      <div>
        {userInfo.isLoggedIn ? <h3>User Name: {userInfo.userEmail}</h3> : <></>}
      </div>
      <div>
        <Whiteboard />
      </div>
    </div>
  );
};

export default Live;
