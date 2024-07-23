import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "./api.js";

function App() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const filteredData =
    filter === "all"
      ? data
      : data.filter((item) => {
          if (filter === "done") return item.completed_at;
          if (filter === "undone") return !item.completed_at;
        });

  const searchedData = filteredData
    ? filteredData.filter((item) =>
        item.content.toLowerCase().includes(search.toLowerCase())
      )
    : [];

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
  function handleComplete(id) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    };
    axios
      .patch(`${api.PATCH_COMPLETE}/${id}/toggle`, {}, { headers })
      .then((res) => {
        res.status === 200 &&
          setData(data.map((item) => (item.id === id ? res.data : item)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSearch() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    };
    axios
      .get(`${api.GET_TODOS}?q=${search}`, { headers })
      .then((res) => {
        setData(res.data.todos);
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
          setFilter("all");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ color: "red", textAlign: "center" }}>
        {`${localStorage.getItem("name")}'s Todo List` || "Todo List"}
      </h1>
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
      <div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          搜尋
        </button>
      </div>
      <div>
        <label htmlFor="all">
          <input
            type="radio"
            name="itemStatus"
            id="all"
            value={"all"}
            checked={filter === "all"}
            onChange={() => setFilter("all")}
          />
          all
        </label>
        <label htmlFor="done">
          <input
            type="radio"
            name="itemStatus"
            id="done"
            value={"done"}
            checked={filter === "done"}
            onChange={() => setFilter("done")}
          />
          done
        </label>
        <label htmlFor="undone">
          <input
            type="radio"
            name="itemStatus"
            id="undone"
            value={"undone"}
            checked={filter === "undone"}
            onChange={() => setFilter("undone")}
          />
          undone
        </label>
      </div>
      <ul>
        {searchedData
          ? searchedData?.map((item) => {
              return (
                <li key={item.id} style={{ display: "flex", gap: "10px" }}>
                  <p>{item.content}</p>
                  <button
                    type="button"
                    onClick={() => handleComplete(item.id)}
                    style={{ padding: "2px" }}
                  >
                    {item.completed_at ? "已完成" : "未完成"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: "2px" }}
                  >
                    刪除
                  </button>
                </li>
              );
            })
          : filteredData?.map((item) => {
              return (
                <li key={item.id} style={{ display: "flex", gap: "10px" }}>
                  <p>{item.content}</p>
                  <button
                    type="button"
                    onClick={() => handleComplete(item.id)}
                    style={{ padding: "2px" }}
                  >
                    {item.completed_at ? "已完成" : "未完成"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: "2px" }}
                  >
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
