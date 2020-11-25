<!--
 * @Author: sunxiaofan
 * @Date: 2019-11-04 16:58:06
 * @LastEditTime: 2019-11-04 18:00:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myvuepress\docs\每日一学\1-Vuecli使用的webpack打包技术.md
 -->
# Vuecli使用的webpack打包技术
## 了解 vuecli
1. vuecli 分为三个部分：CLI，CLI服务，CLI插件
- CLI提供脚手架功能和还包含一个管理项目的后台
- CLI服务基于webpack 和 webpack-dev-server之上 提供了内部命令 serve ,build, inspect
- CLI插件 提供了扩展功能

```
用法：create [options] <app-name>

创建一个由 `vue-cli-service` 提供支持的新项目


选项：vue create 的参数

  -p, --preset <presetName>       忽略提示符并使用已保存的或远程的预设选项
  -d, --default                   忽略提示符并使用默认预设选项
  -i, --inlinePreset <json>       忽略提示符并使用内联的 JSON 字符串预设选项
  -m, --packageManager <command>  在安装依赖时使用指定的 npm 客户端
  -r, --registry <url>            在安装依赖时使用指定的 npm registry
  -g, --git [message]             强制 / 跳过 git 初始化，并可选的指定初始化提交信息
  -n, --no-git                    跳过 git 初始化
  -f, --force                     覆写目标目录可能存在的配置
  -c, --clone                     使用 git clone 获取远程预设选项
  -x, --proxy                     使用指定的代理创建项目
  -b, --bare                      创建项目时省略默认组件中的新手指导信息
  -h, --help                      输出使用帮助信息
```


2. CLI服务 （这里有个知识点 NPX是什么？）
```
用法：vue-cli-service serve [options] [entry]

选项：

  --open    在服务器启动时打开浏览器
  --copy    在服务器启动时将 URL 复制到剪切版
  --mode    指定环境模式 (默认值：development)
  --host    指定 host (默认值：0.0.0.0)
  --port    指定 port (默认值：8080)
  --https   使用 https (默认值：false)
```






## vuecli 运行打包后 线上环境调试
> 打包命令

```
用法：vue-cli-service build [options] [entry|pattern]

选项：

  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```

问题： 在打包上线后 chrome中断点调试时 断点中的变量都无法看到内容显示 undefined

解决方法 ： 将mode 模式改成 development