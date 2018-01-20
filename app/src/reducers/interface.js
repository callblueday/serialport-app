const LINKDIALOG_SHOW = 'linkdialog_show';
const LINKDIALOG_HIDE = 'linkdialog_hide';

const initialState = {
  "dialogVisible": false,
  "message": ""
};

let visible = initialState.dialogVisible;

const interfaceUi = function (state = initialState, action) {

  switch (action.type) {
    case LINKDIALOG_SHOW:
      visible = false;
      return Object.assign({}, state, {
        dialogVisible: true
      });
    case LINKDIALOG_HIDE:
      visible = true;
      return Object.assign({}, state, {
        dialogVisible: false
      });
    default:
      return state;
  }
}

interfaceUi.openLinkDialog = function (status) {
  return {
      type: LINKDIALOG_SHOW,
      status: status
  }
};

interfaceUi.closeLinkDialog = function (status) {
  return {
      type: LINKDIALOG_HIDE,
      status: status
  }
};

interfaceUi.toggleLinkDialog = function (status) {
  visible = !visible;
  let type = visible ? LINKDIALOG_HIDE : LINKDIALOG_SHOW;
  return {
      type: type,
      status: status
  }
};

module.exports = interfaceUi;
