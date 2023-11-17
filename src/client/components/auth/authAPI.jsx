
export async function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'content-type': 'application/json' },
    });

    const data = await response.json();
    // TODO: on the server, it will only return some info of the user (not the password)
    resolve({ data });
  });
}




export async function checkUser(loginInfo) {
  return new Promise (async (resolve, reject) => {
    const email = loginInfo.email;
    const password = loginInfo.password;

    try {
      const response = await fetch(`http://localhost:8080/users?email=${email}`);
      const data = await response.json();

      // console.log({ data });

      if (data.length) {
        if (password === data[0].password) {
          // Omit password from the returned user data
          resolve({ data: data[0] });
        } else {
          reject({ message: 'wrong credentials' });
        }
      } else {
        reject({ message: 'user not found' });
      }
    } catch (error) {
      reject({ message: 'error fetching user data' });
    }
  });
}


export function signOut(userId) {
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info
    resolve({ data: 'success' });
  });
}