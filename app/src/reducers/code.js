const MENU_SHOW = 'menu_show';
const MENU_HIDE = 'menu_hide';

const initialState = {
  "menuVisible": false,
  "projectChanged": false,
  "projectId": false
};

let visible = initialState.menuVisible;

const code = function (state = initialState, action) {

  switch (action.type) {
    case MENU_SHOW:
      visible = false;
      return Object.assign({}, state, {
        menuVisible: true
      });
    case MENU_HIDE:
      visible = true;
      return Object.assign({}, state, {
        menuVisible: false
      });
    default:
      return state;
  }
}

code.openMenu = function (status) {
  return {
      type: MENU_SHOW,
      status: status
  }
};

code.closeMenu = function (status) {
  return {
      type: MENU_HIDE,
      status: status
  }
};

module.exports = code;
