import requests from "./requests";

const api = {
    // 登录
    login: (params) => requests.post('/login', params),  //登录

    // 菜单导航
    getMenus: () => requests.get('/menus'),  //菜单导航

    // 用户列表
    getUsers: (params) => requests.get('/users', { params }), //获取用户数据
    addUser: (params) => requests.post('/users', params), // 添加用户
    getUserById: (id) => requests.get(`/users/${id}`),  //根据id查用户
    putUserStatu: (uId, type) => requests.put(`/users/${uId}/state/${type}`),  //修改用户状态
    putUserInfo: ({ id, email, mobile }) => requests.put(`/users/${id}`, { email, mobile }), //修改用户信息
    delUserInfo: (id) => requests.delete('/users/' + id),  //删除用户

    // 角色列表与权限
    putUserRole: ({ id, rid }) => requests.put(`/users/${id}/role`, { rid }), //分配用户角色
    getRights: (type) => requests.get(`/rights/${type}`),  //获取权限列表 
    getRoles: () => requests.get('/roles'), //获取角色列表
    addRoles: (params) => requests.post('/roles', params), //添加角色
    searchRoles: (id) => requests.get('/roles/' + id), //查询角色
    putRoles: ({ roleName, roleDesc, roleId }) => requests.put('/roles/' + roleId, { roleName, roleDesc }), //编辑角色
    delRoles: (id) => requests.delete('/roles/' + id), //删除角色
    delRole: ({ roleId, rightId }) => requests.delete(`/roles/${roleId}}/rights/${rightId}`),//删除角色指定权限
    addRights: ({ roleId, rids }) => requests.post(`/roles/${roleId}/rights`, { rids }), //添加权限

    // 商品列表
    getGoodsCategories: (params) => requests.get('/categories', { params }), // 获取商品参数列表
    addGoodsCategorie: (params) => requests.post('/categories', params), //添加商品分类
    delGoodsCategorie: (id) => requests.delete('/categories/' + id), //删除商品分类
    getGoodsCategoriesById: (id) => requests.get('/categories/' + id), //根据id查询商品分类
    putCate: ({ id, cat_name }) => requests.put('/categories/' + id, { cat_name }), //修改商品分类

    // 分类参数管理
    getParams: ({ id, sel }) => requests.get(`/categories/${id}/attributes?sel=${sel}`), //获取商品分类参数
    addParams: (id, params) => requests.post(`/categories/${id}/attributes`, params), //添加商品分类参数
    getParamsById: ({ cat_id, attr_id, attr_sel, attr_vals }) => requests.get(`/categories/${cat_id}/attributes/${attr_id}`, { attr_sel, attr_vals }),//根据id查询寻商品分类参数
    putparamsById: (cat_id, { attr_id, attr_sel, attr_name, attr_vals }) => requests.put(`/categories/${cat_id}/attributes/${attr_id}`, { attr_name, attr_sel, attr_vals }),//编辑商品分类参数
    delParamsById: ({ cat_id, attr_id }) => requests.delete(`/categories/${cat_id}/attributes/${attr_id}`),//删除商品分类参数
    eitdParamsById: ({ cat_id, attr_id, attr_vals, attr_sel, attr_name }) => requests.put(`/categories/${cat_id}/attributes/${attr_id}`, { attr_sel, attr_vals, attr_name }), // 编辑提交参数

    // 商品列表
    getGoods: (params) => requests.get('/goods', { params }), //获取商品列表
    getGoodsById: (id) => requests.get(`/goods/${id}`),  //根据id查商品
    delGoodsInfo: (id) => requests.delete('/goods/' + id),  //删除商品
    addGoods: (params) => requests.post("/goods", params), //添加商品


}
export default api

