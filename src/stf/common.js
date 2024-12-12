import axios from "axios";
import Cookies from "js-cookie";

const API_STF_URL = "https://api.stepstothefuture.store/";
const API_GHN_URL = "https://online-gateway.ghn.vn/";
const TOKEN_GHN = "f86da177-6445-11ef-abe2-7eb77a66607c";

const configGhn = {
  method: "get",
  url: "",
  data: {},
};

export async function ghnExecAPI(configs = configGhn) {
  if (!configs) throw new Error('Missing "configs"!');
  if (!configs.url) throw new Error('Missing "configs.url"!');

  try {
    const response = await axios({
      method: configs.method || "get",
      url: API_GHN_URL + configs.url,
      data: configs.data || {},
      params: configs.data || {},
      headers: {
        "Content-Type": "application/json",
        token: TOKEN_GHN,
      },
    });

    if (response.status !== 200) {
      return [response, null];
    }

    return [null, response];
  } catch (error) {
    return [error, null];
  }
}

const configStf = {
  method: "get",
  url: "",
  data: {},
};
export async function stfExecAPI(configs = configStf) {
  if (!configs) throw new Error('Missing "configs"!');
  if (!configs.url) throw new Error('Missing "configs.url"!');

  const token = Cookies.get("token");

  try {
    const response = await axios({
      method: configs.method || "get",
      url: API_STF_URL + configs.url,
      data: configs.data || {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return [response, null];
    }

    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
}
