import React, { useState, useEffect, createContext, useMemo } from "react";
import { ConfigProvider, Button, Input, notification } from "antd";
const { Search } = Input;
import axios from "axios";
import api from "./api.js";
import {
  Wrapper,
  Container,
  StyledButton,
  Title,
  InputSection,
  RadioSection,
  Lists,
} from "./styles.js";

const Context = createContext({
  name: "Default",
});

function App() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const [notificationApi, contextHolder] = notification.useNotification();

  const openNotification = (placement, message) => {
    notificationApi.info({
      message: message,
      description: (
        <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>
      ),
      placement,
    });
  };

  const contextValue = useMemo(
    () => ({
      name: "我只是示範用的啦，可有可無",
    }),
    []
  );

  //* radio button 當選項時，要做的事情
  // const filteredData =
  //   filter === "all"
  //     ? data
  //     : data.filter((item) => {
  //         if (filter === "done") return item.completed_at;
  //         if (filter === "undone") return !item.completed_at;
  //       });

  //* 手動搜尋
  // const searchedData = filteredData
  //   ? filteredData.filter((item) =>
  //       item.content.toLowerCase().includes(search.toLowerCase())
  //     )
  //   : [];

  //* 把上面兩行合併成一行
  const filteredData = data
    ? data.filter((item) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "done" && item.completed_at) ||
          (filter === "undone" && !item.completed_at);
        const matchesSearch = item.content
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      })
    : [];

  function handlePost(text) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    };
    if (text) {
      axios
        .post(api.POST_TODOS, { content: text }, { headers })
        .then((res) => {
          res.status === 201 && setData([res.data, ...data]);
          res.status === 201 && setText("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("請輸入內容");
    }
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
        res.status === 200 && openNotification("topLeft", "刪除成功");
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
        res.status === 200 && openNotification("topLeft", "已完成更新");
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
    <>
      <Context.Provider value={contextValue}>
        {contextHolder}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#000",
            },
            components: {
              Button: {
                colorPrimary: "#1da7ff",
              },
            },
          }}
        >
          <Wrapper>
            <Container>
              <Title>
                <h1>
                  {(localStorage.getItem("name") !== "null" &&
                    `${localStorage.getItem("name")}'s Todo List`) ||
                    "Todo List"}
                </h1>
              </Title>

              <InputSection>
                <Input
                  size="large"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePost(text);
                    }
                  }}
                />
                <Button type="button" onClick={() => handlePost(text)}>
                  送出
                </Button>
              </InputSection>
              <InputSection>
                <Search
                  size="large"
                  loading={search && filteredData.length === 0}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputSection>
              <RadioSection>
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
              </RadioSection>
              <Lists>
                <ul>
                  {filteredData?.map((item) => {
                    return (
                      <li key={item.id} className="item">
                        <p className="text">{item.content}</p>
                        <div>
                          <Button
                            type="primary"
                            onClick={() => handleComplete(item.id)}
                            style={{ padding: "2px" }}
                          >
                            {item.completed_at ? "已完成" : "未完成"}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => handleDelete(item.id)}
                            style={{ padding: "2px" }}
                          >
                            刪除
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                  {/* {searchedData
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
            })} */}
                </ul>
              </Lists>
            </Container>
          </Wrapper>
        </ConfigProvider>
      </Context.Provider>
    </>
  );
}

export default App;
