<!--
 * @Author: your name
 * @Date: 2019-12-05 14:26:39
 * @LastEditTime: 2020-11-25 20:12:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myvuepress\docs\每日一学\8-ES7 你都懂了吗？带你了解 ES7 的神器 decorator.md
 -->
# ES7 你都懂了吗？带你了解 ES7 的神器 decorator
https://toutiao.io/posts/23ve11/preview
es7带来了很多更强大的方法，比如async/await,decorator等，相信大家对于async/await已经用的很熟练了，下面我们来讲一下decorator。

何为decorator？
官方说法，修饰器（Decorator）函数，用来修改类的行为。这样讲对于初学者来说不是很好理解，通俗点讲就是我们可以用修饰器来修改类的属性和方法，比如我们可以在函数执行之前改变它的行为。因为decorator是在编译时执行的，使得让我们能够在设计时对类、属性等进行标注和修改成为了可能。decorator不仅仅可以在类上面使用，还可以在对象上面使用，但是decorator不能修饰函数，因为函数存在变量提升。decorator相当于给对象内的函数包装一层行为。decorator本身就是一个函数，他有三个参数target（所要修饰的目标类）, name（所要修饰的属性名）, descriptor（该属性的描述对象）。后面我们会让大家体会到decorator的强大魅力。

大型框架都在使用decorator？
Angular2中的TypeScript Annotate就是标注装潢器的另一类实现。

React中redux2也开始利用ES7的Decorators进行了大量重构。

Vue如果你在使用typescript，你会发现vue组件也开始用Decorator了，就连vuex也全部用Decorators重构。

如何在vue中使用ts