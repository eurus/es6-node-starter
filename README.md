# 作用

* 使用es6的语法写前端和后台代码
* 使用livereload使得前端scss和js编译后自动通知浏览器刷新
* 使用nodemon启动node server，后台更新后自动重启

# 文件格式

| 目录   | 作用   |
| ------- | ------ |
| client/js | 前端es6源文件目录 |
| public/js | 前端js编译生成目录 |
| client/sass | 前端scss源文件目录 |
| public/css | 前端css编译生成目录 |
| server/app.es6 | 服务器入口 |
| run.js | 程序入口 |
| views | 页面 |


# 使用方式

```bash
  npm install
  gulp
```

如果只需要启动node server，也可以使用```npm start```
