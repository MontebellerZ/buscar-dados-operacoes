import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASEURL;
if (!baseURL) throw new Error("VITE_API_BASEURL deve estar configurado no .env");

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default abstract class BaseService {
  protected static async get<T>(...args: Parameters<typeof api.get>): Promise<T> {
    return await axios
      .get(...args)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }

  protected static async post<T>(...args: Parameters<typeof api.post>): Promise<T> {
    return await api
      .post(...args)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }

  protected static async put<T>(...args: Parameters<typeof api.put>): Promise<T> {
    return await api
      .put(...args)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }

  protected static async patch<T>(...args: Parameters<typeof api.patch>): Promise<T> {
    return await api
      .patch(...args)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }

  protected static async delete<T>(...args: Parameters<typeof api.delete>): Promise<T> {
    return await api
      .delete(...args)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }
}
