export class RunButton  {

  constructor(props) {
    this.props = props;
    this.btnText = "Run";
    this.btnRunningText = "Stop"
    this.running = false;
    this.init();
  }

  init() {
    let that = this;
    this.props.once('workspaceReady', function(mblockly){
      that.createDom(mblockly.injectWrapper);
    });
  }

  hasStr (text, str) {
    if (text.indexOf(str) > -1) {
      return true;
    } else {
      return false;
    }
  };

  createDom(injectWrapper) {
    var obj = document.createElement("button");
    obj.innerHTML = this.btnText;
    obj.className = "run-btn";
    this.buttonDom = obj;
    document.getElementById(injectWrapper).appendChild(this.buttonDom);
    var that = this;
    this.buttonDom.onclick = function(e) {
      that.clickButton();
    }
  }

  clickButton() {
    if(!this.running) {
      this.runCode();
    } else {
      this.stopCode();
    }
  }

  runCode() {
    var that = this;
    let startBlock = null;

    if (MBlockly.Settings.OPEN_WHEN_BLOCK_FILTER) {
      startBlock = this.getWhenBlock();
    }

    if (!startBlock) {
      return false;
    }

    let code = MBlockly.Runtime.parseCode(startBlock) + this.getFunctionCodes();
    this.runtime = new MBlockly.Runtime();
    this.runtime.callback = function () {
      if (!window.isMotorMoving) {
        that.setRunning(false);
      }
    };
    this.runtime.doInterpreter(code);
    that.setRunning(true);
  }

  stopCode() {
    this.setRunning(false);
    if (this.runtime) {
      this.runtime.stop();
    }
  }

  setRunning(state) {
    if(state) {
      this.running = true;
      this.buttonDom.className = "run-btn running";
      this.buttonDom.innerHTML = this.btnRunningText;
    } else {
      this.running = false;
      this.buttonDom.className = "run-btn";
      this.buttonDom.innerHTML = this.btnText;
    }
  }

  getWhenBlock() {
    let block = null;
    let topBlocks = workspace.getTopBlocks();
    for (let i in topBlocks) {
      // 过滤不是在when块下的block块
      if (topBlocks[i].type == MBlockly.Settings.BEGIN_BLOCK_NAME) {
        block = topBlocks[i];
      }
    }
    return block;
  }

  getFunctionCodes() {
    var topBlocks = Blockly.mainWorkspace.getTopBlocks();
    var functionCodes = "";
    for (var i in topBlocks) {
      var item, blockType, blockName, widgetType, code;
      item = topBlocks[i];
      if(item && item.xmlData) {
        blockName = item.xmlData.getAttribute("type");

        // 存储函数定义相关代码
        if (this.hasStr(blockName, "procedures_defnoreturn")) {
          functionCodes += MBlockly.Runtime.parseCode(item);
        }
      }
    }
    return functionCodes;
  }

  dispose() {
    this.buttonDom.onclick = null;
    this.buttonDom.remove();
  }
}

export default new RunButton();