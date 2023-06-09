import requests from "./requests";

const api = {
    login: (params) => requests.post('/login', params),  //登录的接口
}
export default api