<!--
 * @Author: your name
 * @Date: 2019-11-07 18:09:21
 * @LastEditTime: 2019-11-20 16:12:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myvuepress\docs\每日一学\3-Chrome自动填充的密码的样式.md
 -->
# 修改chrome下保存用户名密码的默认字体

input:-webkit-autofill ｛-webkit-text-fill-color: #FFF;｝


@-webkit-keyframes autofill {
    to {
        color: #fff;
        background: transparent;
    }
}

input:-webkit-autofill {
    -webkit-animation-name: autofill;
    -webkit-animation-fill-mode: both;
}