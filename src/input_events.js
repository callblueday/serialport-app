var InputEvent = {
  start: "mousedown",
  move: "mousemove",
  end: "mouseup",
  clientX: function(e) { return e.clientX; },
  clientY: function(e) { return e.clientY; }
}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  var InputEvent = {
    start: "touchstart",
    move: "touchmove",
    end: "touchend",
    clientX: function(e) { return e.changedTouches[0].clientX; },
    clientY: function(e) { return e.changedTouches[0].clientY; }
  }
}


window.Input = InputEvent;

module.exports = InputEvent;
