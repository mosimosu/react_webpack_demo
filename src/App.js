import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "./api.js";

function App() {
  const [data, setData] = useState(null);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  function handlePost(text) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    };
    axios
      .post(api.POST_TODOS, { content: text }, { headers })
      .then((res) => {
        res.status === 201 && setData([res.data, ...data]);
        res.status === 201 && setText("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDelete(id) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    };
    axios
      .delete(`${api.DELETE_TODOS}/${id}`, { headers })
      .then((res) => {
        res.status === 200 && setData(data.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    function fetchData() {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      };

      axios
        .get(api.GET_TODOS, { headers })
        .then((res) => {
          setData(res.data.todos);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ color: "red", textAlign: "center" }}>Hello, World!</h1>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePost(text);
            }
          }}
        />
        <button type="button" onClick={() => handlePost(text)}>
          送出
        </button>
      </div>
      <ul>
        {data &&
          data?.map((item) => {
            return (
              <li key={item.id} style={{ display: "flex" }}>
                <p>{item.content}</p>
                <button type="button" onClick={() => handleDelete(item.id)}>
                  刪除
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
