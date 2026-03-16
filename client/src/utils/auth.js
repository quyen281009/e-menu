export const getToken = () => localStorage.getItem("adminToken") || "";

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("adminToken", token);
  } else {
    localStorage.removeItem("adminToken");
  }
};

