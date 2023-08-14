/* eslint-disable */
  
  import filename from '../../server/code/filename'
import filename1 from '../../server/code/filename1'
import test2 from '../../server/code/test2'

  
  const asyncRouter = [
  {
    path: "/filename",
    name: "filename",
    component: filename
  },{
    path: "/filename1",
    name: "filename1",
    component: filename1
  },{
    path: "/test2",
    name: "test2",
    component: test2
  }
  ]
  export default asyncRouter
  