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
        padding: "60px 7.5%",
        backgroundColor: "#F5F5F5",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <h1>Hola Julio</h1>
        <img
          style={{ height: "auto", width: "30px", objectFit: "cover" }}
          src="/images/hand.png"
          alt="waving-hand"
        />
      </div>
      <h2 style={{ marginBottom: "20px" }}>Mi Semana</h2>
      <div className="calendar">
        <div className="calendarRow">
          <div className="card dayCard">
            <p className="day">Lunes</p>
            <p className="activity">Rodar Suave</p>
            <img
              src="/images/check.png"
              alt=""
              style={{
                marginTop: "20px",
                height: "36px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="card dayCard">
            <p className="day">Martes</p>
            <p className="restDay">Descanso</p>
            <img
              src="/images/check.png"
              alt=""
              style={{
                marginTop: "20px",
                height: "36px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="card dayCard">
            <p className="day">Miércoles</p>
            <p className="activity">5x5'</p>
            <img
              src="/images/check.png"
              alt=""
              style={{
                marginTop: "20px",
                height: "36px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
        <div className="calendarRow">
          <div className="card dayCard">
            <p className="day">Lunes</p>
            <p className="activity">Rodar Suave</p>
            <img
              src="/images/check.png"
              alt=""
              style={{
                marginTop: "20px",
                height: "36px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="card dayCard">
            <p className="day">Lunes</p>
            <p className="activity">Rodar Suave</p>
            <img
              src="/images/check.png"
              alt=""
              style={{
                marginTop: "20px",
                height: "36px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="card dayCard">
            <p className="day">Lunes</p>
            <p className="activity">Rodar Suave</p>
            <img
              src="/images/check.png"
              alt=""
              style={{
                marginTop: "20px",
                height: "36px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
