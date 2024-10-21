import React, { useState, useEffect, useContext } from "react";
import Auth from "./Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../scripts/firebase.js";
import Home from "./Home.jsx";
import { UserContext } from "../contexts/UserContext.jsx";

function Main() {
  const [action, setAction] = useState("logIn");
  const { user } = useContext(UserContext);

  return (
    <>{user ? <Home /> : <Auth action={action} setAction={setAction} />}</>
  );
}

export default Main;
