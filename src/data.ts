import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchData = async (page: number) => {
  try {
    const response = await axios.get(`${API_URL}/artworks?page=${page}`);
    return response.data;
  } catch (e) {
    console.log("error fetching data", e);
  }
};