import React, { act, useEffect, useState } from "react";
import bg from "../images/bg.png";
import googleIcon from "../images/googleIcon.png";
import { auth } from "../scripts/firebase.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { UserContext } from "../contexts/UserContext.jsx";

function Auth({ action, setAction }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const provider = new GoogleAuthProvider();

  const resetErrors = () => {
    setEmailError(null);
    setPasswordError(null);
  };

  const handleSubmit = async () => {
    try {
      if (action === "logIn") {
        await signInWithEmailAndPassword(auth, email, password);
      }
      if (action === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          setEmailError("Email inválido");
          break;
        case "auth/invalid-credential":
          setEmailError("Email y/o contraseña incorrectos");
        default:
          break;
      }
    }
  };

  const providerLogIn = async () => {
    try {
      signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error.code);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "80px",
      }}
    >
      <div className="card">
        <div style={{ width: "181px", height: "144px", margin: "auto" }}>
          <img
            src="/images/logo.png"
            alt=""
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <h2 style={{ paddingLeft: "5%" }}>
          {action === "logIn" ? "Iniciar Sesión" : "Registrarse"}
        </h2>
        <form action="" style={{ width: "90%", marginLeft: "5%" }}>
          <div class="mb-3">
            <p for="exampleInputEmail" style={{ textAlign: "left" }}>
              Email
            </p>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail"
              aria-describedby="emailHelp"
              onChange={resetErrors}
            />
          </div>
          {emailError && (
            <p style={{ color: "red", margin: "auto 20px" }}>{emailError}</p>
          )}
          <div class="mb-3">
            <p for="exampleInputEmail" style={{ textAlign: "left" }}>
              Contraseña
            </p>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword"
              onChange={resetErrors}
            />
            {passwordError && (
              <p style={{ color: "red", margin: "auto 20px" }}>
                {passwordError}
              </p>
            )}
          </div>
        </form>
        <button
          className="primaryButton"
          onClick={handleSubmit}
          style={{ margin: "20px auto" }}
        >
          {action === "logIn" ? "Iniciar Sesión" : "Registrarse"}
        </button>
        <p style={{ fontSize: "14px", fontWeight: "300" }}>
          {action === "logIn" ? "No tienes cuenta? " : "Ya tienes cuenta? "}
          <span
            onClick={() => {
              setAction(action === "register" ? "logIn" : "register");
            }}
          >
            {action === "logIn" ? "Registrarse" : "Iniciar Sesión"}
          </span>
        </p>
        <button
          style={{
            width: "260px",
            height: "50px",
            borderColor: "#DADCE0",
            borderRadius: "15px",
            borderStyle: "solid",
            borderWidth: "2px",
            margin: "20px auto",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
          onClick={providerLogIn}
        >
          <div
            style={{
              width: "25px",
              height: "25px",
              backgroundImage: `url(${googleIcon})`,
            }}
          ></div>
          <p style={{ fontSize: "14px", fontWeight: "500" }}>
            Iniciar Sesión con Google
          </p>
        </button>
      </div>
    </div>
  );
}

export default Auth;
