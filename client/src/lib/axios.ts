import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://localhost:5051/api",
})

export const setAuth = (token: string) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
}