import { BrowserRouter, Route, Link } from 'react-router-dom';
import { comm } from './comm';

class App {

  constructor() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  }

  onDeviceReady() {
    const exitApp = () => {
      navigator.app.exitApp();
    };

    const onBackKeyDown = () => {
      document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
      document.addEventListener("backbutton", exitApp, false);//绑定退出事件
      // 3秒后重新注册
      let intervalID = window.setInterval(function () {
        window.clearInterval(intervalID);
        document.removeEventListener("backbutton", exitApp, false); // 注销返回键
        document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
      }, 3000);

      comm.disconnect();
    };

    document.addEventListener('backbutton', onBackKeyDown);
  }
}

//实例化 app
const app = new App();
export default app;
