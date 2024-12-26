import axios, { AxiosInstance } from "axios";

const token = JSON.parse(
  localStorage.getItem("user_data") as string
)?.userTocken;

const Axios: AxiosInstance = axios.create({
  baseURL: "https://machine2-backend.onrender.comm/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
  withCredentials: false,
});
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export default Axios;
