<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 09:51:57
 * @LastEditTime: 2019-08-22 10:05:50
 * @LastEditors: Please set LastEditors
 -->
# 使得div水平垂直居中的方法

```css
    .parent{
        width: 300px;
        height: 300px;
        position: relative;
    }

    .child{
        width: 60px;
        height: 60px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #ff00ff;
    }



    .parent{
        width: 300px;
        height: 300px;
        position: relative;
    }
    .child{
        width: 50px;
        height: 50px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: #ffff00;
    }



    .parent{
        display: grid;
    }

    .child{
      justify-self: center;
        align-self: center;
    }


   .parent{
        display:flex;
    }

    .child{
        margin:auto;
    }

```

