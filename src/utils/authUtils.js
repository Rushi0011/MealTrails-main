// utils/authUtils.js


export const saveUser = (user) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const findUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find((u) => u.email === email && u.password === password);
};

export const setAuthUser = (user) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

export const getAuthUser = () => {
  return JSON.parse(localStorage.getItem("authUser"));
};

export const logout = () => {
  localStorage.removeItem("authUser");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("authUser");
};
