/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-02-21 09:41:13
 * @LastEditTime: 2020-11-25 20:10:10
 * @LastEditors: Please set LastEditors
 */
module.exports = {
  title: '七色枫叶的学习基地', // 设置网站标题
  description: '只要开始了就不算晚，希望这次能坚持下去',
  base: '/fengyestudybase/',
  themeConfig: {
    nav: [{
        text: '主页',
        link: '/'
      },
      {
        text: '我的学习',
        items: [
          {
            text: '读书心得',
            link: '/readbook/'
          },
          {
            text: '每日一学',
            link: '/learnonceaday/'
          }
        ]
      },
      {
        text:'我的项目',
        items:[
          {
            text: 'manifest编辑器',
            link: 'https://chen735623058.github.io/manifestEdit/dist/index.html#/'
          }
        ]
      },
      {
        text: 'github',
        link: 'https://github.com/chen735623058'
      },
    ],
    sidebar: {
      '/learnonceaday/': [
        '',
        {
          title: '每日一学', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/learnonceaday/1-PWA相关知识',
            '/learnonceaday/2-二 八 十 十六进制转换',
            '/learnonceaday/3-Chrome自动填充的密码的样式',
            '/learnonceaday/4-Server-X学习',
            '/learnonceaday/5-require和import的区别',
            '/learnonceaday/6-图说 WebAssembly',
            '/learnonceaday/7-前端埋点技术',
            '/learnonceaday/8-ES7 你都懂了吗？带你了解 ES7 的神器 decorator',
            '/learnonceaday/9-Lighthouse前端性能监控',
            '/learnonceaday/10-Vuecli使用的webpack打包技术',
            '/learnonceaday/11-富文本原理实战',
            '/learnonceaday/12-懒加载相关实现技术',
          ]
        }
      ],
      '/readbook/': [
        '',
        {
          title: '前端工程化读书笔记', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/readbook/1-前端工程化体系设计与实践/1-前言',
            '/readbook/1-前端工程化体系设计与实践/2-前端工程简史',
            '/readbook/1-前端工程化体系设计与实践/3-脚手架',
            '/readbook/1-前端工程化体系设计与实践/4-项目构建',
            '/readbook/1-前端工程化体系设计与实践/5-本地开发服务器',
            '/readbook/1-前端工程化体系设计与实践/6-部署',
          ]
        },
        {
          title: 'webgl学习', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/readbook/3-webGL/2-webgl-入门',
            '/readbook/3-webGL/3-webgl-绘制和变换三角形',
            '/readbook/3-webGL/4-高级变换与动画基础',
            '/readbook/3-webGL/5-颜色与纹理',
            '/readbook/3-webGL/6-OpenGL ES着色器语言',
            '/readbook/3-webGL/7-进入三维世界',
            '/readbook/3-webGL/8-光照',
            '/readbook/3-webGL/9-层次模型',
          ]
        },
        {
          title: 'ThreeJS学习', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/readbook/4-ThreeJS/1-前言',
            '/readbook/4-ThreeJS/2-使用Three.js创建你的第一个三维场景',
            '/readbook/4-ThreeJS/3- 构建Three.js场景的基本组件',
            '/readbook/4-ThreeJS/4-学习使用Threejs中的光源',
            '/readbook/4-ThreeJS/5-使用Threejs中的材质'
          ]
        }
      ]
    }
  }
}