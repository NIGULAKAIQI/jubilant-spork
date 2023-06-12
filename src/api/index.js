import requests from "./requests";

const api = {
    login: (params) => requests.post('/login', params),  //登录
    getMenus: () => requests.get('/menus'),  //菜单导航
    getUsers: (params) => requests.get('/users', { params }), //获取用户数据
    addUser: (params) => requests.post('/users', params), // 添加用户
    getUserById: (id) => requests.get(`/users/${id}`),  //根据id查用户
    putUserStatu: (uId, type) => requests.put(`/users/${uId}/state/${type}`),  //修改用户状态
    putUserInfo: ({ id, email, mobile }) => requests.put(`/users/${id}`, { email, mobile }), //修改用户信息
    delUserInfo: (id) => requests.delete('/users/' + id),  //删除用户
    putUserRole: ({id,rid}) => requests.put(`/users/${id}/role`,{rid}), //分配用户角色
    getRights: (type) => requests.get(`/rights/${type}`),  //获取权限列表 
    getRoles: () => requests.get('/roles'), //获取角色列表
    addRoles: (params) => requests.post('/roles', params), //添加角色
    searchRoles: (id) => requests.get('/roles/' + id), //查询角色
    putRoles: ({ roleName, roleDesc, roleId }) => requests.put('/roles/' + roleId, { roleName, roleDesc }), //编辑角色
    delRoles: (id) => requests.delete('/roles/' + id), //删除角色
    delRole: ({ roleId, rightId }) => requests.delete(`/roles/${roleId}}/rights/${rightId}`),//删除角色指定权限
    addRights: ({ roleId, rids }) => requests.post(`/roles/${roleId}/rights`, { rids }), //添加权限

}
export default api

