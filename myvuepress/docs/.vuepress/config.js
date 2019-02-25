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
            text: 'React相关',
            link: '/Reactbase/'
          },
          {
            text: 'CSS相关',
            link: '/CSSbase/'
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
          ]
        }
      ],
      '/Reactbase/': [
        '',
        {
          title: 'React框架知识', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/Reactbase/1-ReactNative环境搭建'
          ]
        }
      ],
      '/guide/': [
        '',
        {
          title: '前端开发综合知识', // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            '/guide/1-PWA相关知识'
          ]
        }

      ]
    }
    // sidebar: [{
    //     title: 'JS相关', // 必要的
    //     sidebarDepth: 2, // 可选的, 默认值是 1
    //     children: [
    //       {
    //         title: 'J', // 必要的
    //         sidebarDepth: 1, // 可选的, 默认值是 1
    //         children: [
    //           '/guide/Singoton'
    //         ]
    //       }

    //     ]
    //   },
    //   {
    //     title: 'CSS',
    //     path: '/guide/',
    //     children: []
    //   }
    // ],
  }
}