## 主要目录说明
/
  - app : web程序源码文件
    - src : 源文件
    - build : 编译后的文件
  - platforms: 各个不同的平台
  - res: 资源文件
  - www：待编译打包的文件

## 源码编译

注意：步骤 1-3 都是在 `app` 目录下完成，步骤 4 在根目录下。

1. 进入 `app` 目录，执行指令

```
npm install
```

2. 在浏览器中浏览项目，注意本项目以移动端为主，需要将浏览器调整为移动端模式，推荐 chrome 浏览器下调试。

```
npm start
```

3. 编译项目

```
npm run build
```

4. 退出到根目录，拷贝 `app/build/` 目录下的所有文件到 `www` 目录中，为打包做准备

```
cd ../
npm run cp
```


# 移动应用打包

全局安装 cordova，教程参考：[http://cordova.apache.org/](http://cordova.apache.org/)

## 环境安装
### 环境安装

```
npm install
```

### 添加编译平台

```
cordova platform add android
cordova platform add ios
```
### 安装依赖插件

```
cordova plugin add cordova-plugin-ble-central
cordova plugin add cordova-plugin-crosswalk-webview

```
### build & run

```
# 打包安卓
cordova build android

# 打包 iOS
cordova build ios
```

打包好的 apk 路径会在控制台上输出。例如生成的 apk 位置为：`xxx/anno/platforms/android/build/outputs/apk/android-debug.apk`
