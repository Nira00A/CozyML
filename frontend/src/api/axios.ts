import axios from "axios";
require("dotenv").config();

const api = axios.create({
  baseURL: process.env.NEST_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
