<!--
 * @Author: your name
 * @Date: 2019-10-30 15:14:17
 * @LastEditTime: 2019-10-30 15:14:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myvuepress\docs\100\css\8-css文字不换行超过部分用....md
 -->
设置文字不换行，超过的部分用“...”代替

 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
 width: 210px;


 
 
1.white-space
① normal 默认，空白会被浏览器忽略

② pre 空白会被浏览器保留。其行为方式类似HTML中的<pre>标签

③ nowrap 文本不会换行，文本会在同一行上继续，直到遇到<br>标签（开始换行）为止

④ pre-wrap 保留空白符序列，但是正常地进行换行

⑤ pre-line 合并空白符序列，但是保留换行符

⑥ inherit 规定应该从父元素继承white-space 属性的值

2 word-break

① normal 使用浏览器默认的换行规则

② break-all 允许在单词内换行

③ keep-all 只能在半角空格或连字符处换行

3 text-overflow

① clip ： 修剪文本

② ellipsis : 显示省略符号来代表被修剪的文本

③ string : 使用给定的字符串来代表被修剪的文本