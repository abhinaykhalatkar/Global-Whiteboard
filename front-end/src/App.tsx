import "./App.scss";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import Home from "./Pages/Home/Home";
import LogIn from "./Pages/LogIn/LogIn";
import Live from "./Pages/Live/Live";
import Signup from "./Pages/SignUp/Signup";
import { RootState } from "./store/store";
import { addUser } from "./store/slices/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import LogOutBtn from "./Components/LogOutBtn/LogOutBtn";
import CallbackPage from "./Pages/Callback/CallbackPage";

function App() {
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);

  const dispatch = useDispatch();

  const loginCheckHandler = async () => {
    if (localStorage.getItem(process.env.REACT_APP_T0509!)) {
      const headers = {
        // Set the Content-Type header if needed
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(
          process.env.REACT_APP_T0509!
        )}`,
      };
      try {
        const response = await axios.post(
          process.env.REACT_APP_INITIALCHECK_LINK!,
          {},
          { headers }
        );

        if (response.status === 201) {
          dispatch(
            addUser({
              isLoggedIn: response.data.hasOwnProperty("name"),
              userEmail: response.data.email,
            })
          );
        } else if (response.status === 309) console.log(response.data.message);
      } catch (error) {
        console.error(`error ${error}`);
      }
    }
  };

  useEffect(() => {
    loginCheckHandler();
  });

  return (
    <div className="App">
      <LogOutBtn />
      <nav>
        <ul>
          <Link to="/">Home</Link>
          <Link to="/live">Live</Link>
          <Link to="/login">login</Link>
          <Link to="/signup">signup</Link>
        </ul>
      </nav>

      <Routes>
        <Route path="/" caseSensitive element={<Home />} />
        {/* REmove in production*/}
        <Route
          path="/login"
          element={userInfo.isLoggedIn ? <Navigate to="/" /> : <LogIn />}
        />
        {/* <Route path="/login" element={<LogIn />} /> */}
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/live"
          element={userInfo.isLoggedIn ? <Live /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={userInfo.isLoggedIn ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </div>
  );
}

export default App;
