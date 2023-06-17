import Mock from 'mockjs'
import kuaidi from './kuaidi.json'

// 提供广告位轮播数据的接口
Mock.mock('/mock/kuaidi', {
    code: 200,
    data: kuaidi,
    meta: { status: 200 }
})

