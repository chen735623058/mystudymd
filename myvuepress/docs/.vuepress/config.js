module.exports = {
  title: '七色枫叶的学习基地', // 设置网站标题
  description: '不积跬步无以至千里，不积小流无以成江河',
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
            text: '前端开发综合知识',
            link: '/guide/'
          },
          {
            text: 'JS相关',
            link: '/JSbase/'
          },
          {
            text: 'Webgl相关',
            link: '/Webgl/'
          },
          {
            text: '游戏相关',
            link: '/games/'
          },
          {
            text: '读书专题---前端工程化体系设计与实践',
            link: '/readbook/'
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
      '/JSbase/': [
        '',
        {
          title: 'JS基础知识', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/JSbase/1-Memoization知识',
            '/JSbase/2-纯函数相关知识',
            '/JSbase/3-偏函数相关知识',
            '/JSbase/4-面试题JS部分',
          ]
        }
      ],
      '/Webgl/': [
        '',
        {
          title: 'webgl学习', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/Webgl/2-webgl-入门',
            '/Webgl/3-webgl-绘制和变换三角形',
            '/Webgl/4-高级变换与动画基础',
            '/Webgl/5-颜色与纹理',
            '/Webgl/6-OpenGL ES着色器语言',
            '/Webgl/7-进入三维世界',
          ]
        }
      ],
      '/guide/': [
        '',
        {
          title: '前端开发综合知识', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/guide/1-PWA相关知识',
            '/guide/2-二 八 十 十六进制转换',
            '/guide/3-懒加载相关实现技术',
          ]
        }
      ],
      '/games/': [
        '',
        {
          title: '游戏开发和设计相关知识', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/games/1-如何科学高效的开始一个游戏的新项目',
            '/games/2-游戏交互音乐浅谈',
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
        }
      ]
    }
  }
}