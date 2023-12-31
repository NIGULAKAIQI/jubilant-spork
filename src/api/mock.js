import axios from "axios";

const mock = axios.create({
    baseURL: "/mock",
    // baseURL: 'http://43.143.0.76:8889/api/private/v1',
    timeout: 5000
})
// 添加请求拦截器
mock.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config);
    config.headers.Authorization = sessionStorage.getItem('token')
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
mock.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default mock