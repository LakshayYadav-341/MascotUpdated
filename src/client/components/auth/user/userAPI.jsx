export function fetchUserById(userId) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/users/'+userId) 
    const data = await response.json()
    resolve({data})
  }
  );
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/users/'+update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function fetchAllUsers() {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch('http://localhost:8080/users');

    const data = await response.json();
    resolve({ data });
  });
}