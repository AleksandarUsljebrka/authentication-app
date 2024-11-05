import { jwtDecode} from "jwt-decode";

const saveToken = (token) => {
  if (!token) {
    return;
  }
  window.localStorage.setItem("token", token);
};

const removeToken = () => {
  window.localStorage.removeItem("token");
};

const getToken = () => {
  const token = window.localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    return decoded;
  } catch (exception) {
    return null;
  }
};
const getRawToken = () => {
  const token = window.localStorage.getItem("token");
  return token;
};

const isTokenExpired = () => {
  const token = getToken();

  if (!token || !token.exp) return true;
  const expirationTime = token.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  return expirationTime < currentTime;
};

const isLoggedin = () => {
  const token = window.localStorage.getItem("token");

  if (!token) {
    return false;
  }

  const decoded = getToken();

  if (!decoded) {
    return false;
  }

  return true;
};
const getTokenRole = () => {
  const decoded = getToken();
  if (decoded && decoded.role) return decoded.role;
  return null;
};
const getTokenEmail = () => {
  const decoded = getToken();
  if (decoded && decoded.email) return decoded.email;
  return null;
};

const getTokenId = () =>{
    const decoded = getToken();
    if(decoded && decoded.id) return decoded.id;
    return null;
}
const getUser = () => {
  const role = getTokenRole();
  const email = getTokenEmail();
  const token = getRawToken();
  const id = getTokenId();

  if (role && email) {
    const user = {
      role: role,
      email: email,
      token:token,
      id:id
    };
    return user;
  }
  return null;
};

const tokenHelper = {
  removeToken,
  saveToken,
  isLoggedin,
  isTokenExpired,
  getToken,
  getRawToken,
  getTokenRole,
  getTokenEmail,
  getUser,
};
export default tokenHelper;
