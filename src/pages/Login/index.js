import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api.js";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  function handleLogin() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const body = {
      user: {
        email: email,
        password: password,
      },
    };

    axios
      .post(api.LOGIN, body, { headers })
      .then((res) => {
        console.log(res);
        res.status === 200 &&
          localStorage.setItem("token", res.headers.authorization);
        res.status === 200 && localStorage.setItem("name", res.data.nickname);
        res.status === 200 && navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <h1>Login</h1>
      <div>
        <label htmlFor="email">
          <p>Email</p>
          <input
            type="text"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          <p>Password</p>
          <input
            type="password"
            id="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleLogin}>
          登入
        </button>
      </div>
    </>
  );
}

export default Login;
