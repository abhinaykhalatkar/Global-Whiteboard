import React, { useState, useEffect } from "react";
import "./Home.scss";
import { addUser } from "../../store/slices/userInfoSlice";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import * as uuid from "uuid";

const Home: React.FC = (props) => {
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(userInfo);
  }, [userInfo]);

  return <div>HOME</div>;
};

export default Home;
