import requests from "./requests";

const api = {
    login: (params) => requests.post('/login', params),  //登录
    getMenus: () => requests.get('/menus'),  //菜单导航
    getUsers: (params) => requests.get('/users', { params }), //获取用户数据
    addUser: (params) => requests.post('/users',  params ), // 添加用户
    getUserById: (id) => requests.get(`/users/${id}`),  //根据id查用户
    putUserStatu: (uId, type) => requests.put(`/users/${uId}/state/${type}`),  //修改用户状态
    putUserInfo: ({ id, email, mobile }) => requests.put(`/users/${id}`, { email, mobile }), //修改用户信息
    delUserInfo:(id)=> requests.delete('/users/'+ id)
}
export default api

