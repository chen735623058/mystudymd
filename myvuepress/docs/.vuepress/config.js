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
            text: 'CSS相关',
            link: '/CSSbase/'
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
          ]
        }
      ],
      '/Webgl/': [
        '',
        {
          title: 'webgl学习', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/Webgl/1-Webgl-渲染器'
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

      ]
    }
  }
}