import urls, { basePath } from "@utils/urls";
import axios from "axios";


export async function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    const res = await axios.post(basePath + urls.auth.register, userData, {
      headers: {
        "Content-Type": "multiipart/form-data"
      }
    }).then(res => res.data).catch(err => err.response?.data || err.request)
    return (res?.status == "success" ? resolve(res) : reject(res))
  });
}

export async function checkUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    const email = loginInfo.email;
    const password = loginInfo.password;

    try {
      const res = await axios.post(basePath + urls.auth.login, {
        email,
        password
      }).then(res => res.data).catch(err => err.response?.data || err.request);

      if (res?.status === "success") {
        resolve(res);
      } else {
        const errorMessage = res?.message || "Wrong Credentials";
        reject(new Error(errorMessage));
      }
    } catch (error) {
      reject(new Error("An unexpected error occurred"));
    }
  });
}

export async function updateLoggedInUser() {
  return new Promise(async (resolve, reject) => {

    try {
      const res = await axios.get(basePath + urls.user.getLoggedInUser, {
        headers : {
          authorization : `Bearer ${JSON.parse(localStorage.getItem('session'))?.token}`
        }
      }).then(res => res.data).catch(err => err.response?.data || err.request);

      if (res?.status === "success") {
        resolve(res);
      } else {
        const errorMessage = res?.message || "Wrong Credentials";
        reject(new Error(errorMessage));
      }
    } catch (error) {
      reject(new Error("An unexpected error occurred"));
    }
  });
}


export function signOut() {
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info
    resolve({ data: 'success' });
  });
}