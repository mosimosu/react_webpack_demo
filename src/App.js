import React, { useState, useEffect, createContext, useMemo } from "react";
import { ConfigProvider, Button, Input, notification, Modal } from "antd";
const { Search } = Input;
import axios from "axios";
import api from "./api.js";
import {
  Wrapper,
  Container,
  Title,
  InputSection,
  RadioSection,
  Lists,
} from "./styles.js";
import useTodos from "./hooks/useData.js";

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

  const { datas, error, isLoading } = useTodos(token);

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const showDeleteConfirm = (id) => {
    !isModalVisible && setDeleteId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleDelete(deleteId);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
        <Modal
          title="Are you sure you want to delete this item?"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>This action cannot be undone.</p>
        </Modal>
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
                            onClick={() => showDeleteConfirm(item.id)}
                            style={{ padding: "2px" }}
                          >
                            刪除
                          </Button>
                        </div>
                      </li>
                    );
                  })}
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
