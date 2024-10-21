import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../scripts/firebase";

function Home() {
  const logout = async () => {
    signOut(auth);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Home;
