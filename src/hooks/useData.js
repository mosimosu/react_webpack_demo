import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../api";

const fetchData = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token,
  };

  const { data } = await axios.get(api.GET_TODOS, { headers });
  console.log(data);
  return data.todos;
};

const useTodos = (token) => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: () => fetchData(token),
  });
};

export default useTodos;
