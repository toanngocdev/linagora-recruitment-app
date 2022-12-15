import { UserTypes } from "@/types";
import axios from "axios";

interface ResponseUser {
  users: UserTypes.User[];
}

export const getUsers = async (): Promise<UserTypes.User[] | undefined> => {
  try {
    const response = await axios.get<ResponseUser | undefined>("users/");

    if (response && response.data) return response.data.users;

    return Promise.reject();
  } catch (error) {
    console.error(error);
  }
};
