/**
 * @fileOverview handles data operations.
 */
class Storage {

  constructor() {
    // 用于存储项目数据
    this.storageKey = 'MyProjectData';
    // 用于返回前项目的自动保存
    this.stashedWorkspaceId = "HelloToWork";
    window.storeList = this.storeList = [];

    // 用于存储用户项目数据
    this.loadProjects();
  }

  fetchData() {
    return this.storeList;
  }

  // 存储当前项目
  saveProject(data) {
    console.log('save successfully')
  }

  // 加载指定项目
  loadProjectById(id) {
    for (var i in this.storeList) {
      var item = this.storeList[i];
      if (item.id == id) {
        this.clearWorkspace();
        var xml = item.xmlData;
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
        this.storeList[i].time = new Date().getTime();
        this.save();
      }
    }
  }

  // 将当前工作区保存到栈中
  stashWorksapce(id, projectHasBeenSaved) {
    console.log('stash workspace');
    var data = {};
    var item = this.getProjectById(id) || {};
    data.id = item.id;
    data.name = item.name;
    data.saved = projectHasBeenSaved;
    var xml = Blockly.Xml.workspaceToDom(workspace);
    data.xmlData = Blockly.Xml.domToText(xml);
    data.time = new Date().getTime();
    var result = JSON.stringify(data);
    window.localStorage[this.stashedWorkspaceId] = result;
  }

  // 将栈中保存的状态恢复到工作区
  resumeWorkspace(callback) {
    // console.log('resume workspace');
    // var dataString = window.localStorage[this.stashedWorkspaceId];
    // if(dataString && JSON.parse(dataString)) {
    //   var data = JSON.parse(dataString);
    //   callback && callback(data);
    // }else{
    //   BlocklyService.renderPresetBlocks(MBlockly.Settings.DEFAULT_PRESET_BLOCK);
    // }
  }

  /**
   * generate an id for current project.
   * @return {[type]} [description]
   */
  generateId(name) {
    var id = name + new Date().getTime();
    return id;
  }

  /**
   * add a project to store.
   */
  add(name, callback) {
    var data = {};
    var id = this.generateId(name);
    console.log('add project: ' + id);

    data.id = id;
    data.name = name;
    var xml = Blockly.Xml.workspaceToDom(workspace);
    data.xmlData = Blockly.Xml.domToText(xml);
    data.time = new Date().getTime();
    this.storeList.unshift(data);
    this.save();

    this.showTip('success', '保存成功');
    return id;
  }

  /**
   * delete a project.
   */
  delete(id, callback) {
    console.log('delete：' + id);

    var dataArray = this.storeList;
    for (var i = 0; i < dataArray.length; i++) {
      if (dataArray[i].id == id) {
        if (isNaN(i) || i > this.storeList.length) {
          return false;
        }
        this.storeList.splice(i, 1);
        this.save();
        console.log('delete successfully');
        break;
      }
    }
  }

  reName(id, newName) {
    for (var i = 0; i < this.storeList.length; i++) {
      if (this.storeList[i].id == id) {
        if (isNaN(i) || i > this.storeList.length) {
          return false;
        }
        this.storeList[i].name = newName;
        this.save();
        break;
      }
    }
  }

  /**
   * [checkRepeatName description]
   * @param  {string} name [description]p
   * @return {[type]}      [description]
   */
  isProjectNameRepeat(id, name) {
    for (var i = 0; i < this.storeList.length; i++) {
      if (this.storeList[i].name == name && this.storeList[i].id != id) {
        return true;
      }
    }
    return false;
  }

  /**
   * update a project.
   */
  update(id, callback) {
    console.log('update：' + id);

    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xmlData = Blockly.Xml.domToText(xml);

    for (var i = 0; i < this.storeList.length; i++) {
      if (this.storeList[i].id == id) {
        if (isNaN(i) || i > this.storeList.length) {
          return false;
        }
        this.storeList[i].xmlData = xmlData;
        this.storeList[i].time = new Date().getTime();
        this.save();
        this.showTip('success', _i18n['SAVE_SUCCESS']);
        break;
      }
    }
  }

  /**
   * duplicate a project.
   */
  duplicate(id) {

  }

  /**
   * get one project by id.
   * @param  {number} id project's id.
   * @return {object}   the query project data.
   */
  getProjectById(id) {
    var data = null;
    for (let item of this.storeList) {
      if (item.id == id) {
        data = item;
        return data;
      }
    }
    return data;
  }

  /**
   * featch all data.
   */
  loadProjects() {
    if (typeof projectFile != 'undefined') {
      this.loadProjectsFromFiles();
    } else {
      this.loadProjectsFromLocalStorage();
    }
  }

  save() {
    if (typeof projectFile != 'undefined') {
      this.saveToFiles();
    } else {
      this.saveToLocalStorage();
    }
  }

  clearWorkspace() {
    Blockly.mainWorkspace.clear();
  }


  /* 存放数据在localstorage */
  saveToLocalStorage() {
    var result = JSON.stringify(this.storeList);
    window.localStorage[this.storageKey] = result;
  }

  loadProjectsFromLocalStorage() {
    var dataString = window.localStorage[this.storageKey];
    if (dataString && JSON.parse(dataString).length) {
      this.storeList = JSON.parse(dataString);
    } else {
      this.storeList = [
        // {
        //   'xmlData': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="when_start" id="OcxCCD38zyUPRLVDVGA1" x="-29" y="125"></block><block type="when_start" id="PiUysfGdkZ61HRSuEHdl" x="-28" y="187"></block></xml>',
        //   'name': '1run forward and backward',
        //   'time': '1479975175671',
        //   'id': '6'
        // },
        // {
        //   'xmlData': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="when_start" id="OcxCCD38zyUPRLVDVGA1" x="-29" y="125"></block><block type="when_start" id="PiUysfGdkZ61HRSuEHdl" x="-28" y="187"></block><block type="when_start" id="TcnwnZn7nphYvkuynCwg" x="-30" y="269"></block><block type="when_start" id="1WnXIo05YAlnBT5I4hyx" x="-31" y="370"></block></xml>',
        //   'name': '2run forward and backward',
        //   'time': '1479975175681',
        //   'id': '5'
        // },
        // {
        //   'xmlData': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="when_start" id="OcxCCD38zyUPRLVDVGA1" x="-29" y="125"></block><block type="when_start" id="1WnXIo05YAlnBT5I4hyx" x="226" y="158"></block><block type="when_start" id="TcnwnZn7nphYvkuynCwg" x="96" y="293"></block><block type="when_start" id="PiUysfGdkZ61HRSuEHdl" x="227" y="522"></block></xml>',
        //   'name': '3run forward and backward',
        //   'time': '1479975175771',
        //   'id': '4'
        // },
        // {
        //   'xmlData': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="when_start" id="OcxCCD38zyUPRLVDVGA1" x="-29" y="125"></block><block type="when_start" id="1WnXIo05YAlnBT5I4hyx" x="226" y="158"></block><block type="when_start" id="TcnwnZn7nphYvkuynCwg" x="96" y="293"></block><block type="when_start" id="kCRYqIWIjSTNl1gO3Um5" x="-71" y="533"></block><block type="when_start" id="PiUysfGdkZ61HRSuEHdl" x="227" y="522"></block></xml>',
        //   'name': '4run forward and backward',
        //   'time': '1479975176671',
        //   'id': '3'
        // },
        // {
        //   'xmlData': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="when_start" id="TcnwnZn7nphYvkuynCwg" x="83" y="31"></block><block type="when_start" id="kCRYqIWIjSTNl1gO3Um5" x="-30" y="94"></block><block type="when_start" id="1WnXIo05YAlnBT5I4hyx" x="186" y="83"></block><block type="when_start" id="OcxCCD38zyUPRLVDVGA1" x="269" y="135"></block><block type="when_start" id="PiUysfGdkZ61HRSuEHdl" x="336" y="192"></block></xml>',
        //   'name': '5run forward and backward',
        //   'time': '1479975185671',
        //   'id': '2'
        // },
        // {
        //   'xmlData': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="when_start" id="TcnwnZn7nphYvkuynCwg" x="143" y="-13"></block><block type="when_start" id="1WnXIo05YAlnBT5I4hyx" x="142" y="56"></block><block type="when_start" id="kCRYqIWIjSTNl1gO3Um5" x="-30" y="94"></block><block type="when_start" id="OcxCCD38zyUPRLVDVGA1" x="303" y="91"></block><block type="when_start" id="9FIJPG5ECuz8Rg25WA5U" x="150" y="149"></block><block type="when_start" id="PiUysfGdkZ61HRSuEHdl" x="150" y="233"></block><block type="when_start" id="ZP8o4UtrFVNMqGaZb9b2" x="9" y="287"></block><block type="when_start" id="lS87SeFX55ZGriKGivR2" x="289" y="288"></block><block type="when_start" id="WqU2NzQeieHYUvfKOky7" x="12" y="367"></block><block type="when_start" id="uKFxNVcFjgcr4EOuc9oN" x="291" y="369"></block><block type="when_start" id="lclAjRDAMuvokc83VRoh" x="-24" y="478"></block><block type="when_start" id="hVBUU83L57UbpOry17B3" x="324" y="478"></block></xml>',
        //   'name': '6run forward and backward',
        //   'time': '1479975275671',
        //   'id': '1'
        // }
      ];
    }
    return this.storeList;
  }

  /* 存放数据在文件系统 */
  saveToFiles() {
    console.log('save files');
    var result = JSON.stringify(this.storeList);
    projectFile.save(result, function(status) {
      console.log('保存成功');
    });
  }

  loadProjectsFromFiles() {
    var that = this;
    projectFile.load(function(status, result) {
      if (result && JSON.parse(result).length) {
        that.storeList = JSON.parse(result);
        console.log('load data from files');
      }
    });
  }

  showTip (msg) {

  }

}

const storage = new Storage();
export default storage;
