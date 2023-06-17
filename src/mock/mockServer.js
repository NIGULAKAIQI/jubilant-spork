import Mock from 'mockjs'
import kuaidi from './kuaidi.json'
Mock.mock('/mock/kuaidi',{code:200,data:kuaidi,meta:{status:200}
})

