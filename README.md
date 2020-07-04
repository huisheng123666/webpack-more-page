## webpack多页面打包工具

##### 在pages目录下创建自己需要的页面，webpack会自动注入配置，无需手动操作
规则如下：  
pages/[路由名]/index.html  
pages/[路由名]/index.js (不创建js会帮你自动创建)  
创建新页面需要重新运行打包命令，暂时没办法自动重新打包

#### static为静态目录会复制文件到dist
避免没有npm包的尴尬  

#### 支持css预处理器
支持stylus，less，sass  
只需修改npm 命令 cross-env CSS_ENV=[你使用的css预处理器] NODE_ENV=development webpack-dev-server --mode=development  
同时需要你安装预处理loader  

#### 支持postcss
如需配置只需修改postcss.config.js文件  
如已有模版rem方案