import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api.js";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  function handleSignup() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const body = {
      user: {
        name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      },
    };

    if (password !== confirmPassword) {
      alert("密碼不一致");
      return;
    } else {
      axios
        .post(api.SIGN_UP, body, { headers })
        .then((res) => {
          res.status === 201 && alert("註冊成功");
          res.status === 201 &&
            localStorage.setItem("token", res.headers.authorization);
          res.status === 201 && navigate("/home");
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.message);
        });
    }
  }
  return (
    <>
      <div>
        <h1>Signup</h1>
        <label htmlFor="name">
          <p>Name</p>
          <input
            type="text"
            id="name"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </label>
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
        <label htmlFor="passwordConfirm">
          <p>Confirm Password</p>
          <input
            type="password"
            id="passwordConfirm"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleSignup}>
          註冊
        </button>
      </div>
    </>
  );
}

export default Signup;
