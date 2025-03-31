export const trim = (string, limit = 100) => {
  if (string.length <= limit) return string;
  return string.substring(0, limit) + '...';
}

export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const getHeaders = () => {
  const token = localStorage.getItem("access-token");
  return {
    authorization: "Bearer " + token,
    "content-type": "application/json",
  }
}
