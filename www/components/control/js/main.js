var settings = {
    multiple: 2,
    markCount: 0
};

/**
 * 摇杆控制程序
 */

var space = 18;
var zoomSize = $(document).width() / 3 - space * 2;

function createZone(eleId) {
    var options = {
      zone: document.getElementById(eleId),
      mode: 'static',
      position: {
          left: "50%",
          top: "50%"
      },
      color: '#333',
      threshold: 0.01,
      multitouch: false,
      size: zoomSize,
      restOpacity: 0.8
  };
  var joystick = nipplejs.create(options);
  addJoyStickName(joystick, eleId);
  return joystick;
}

function bindNipple(nippleObj) {
    nippleObj.on('start end', function(evt, data) {

    })
    .on('move', function(evt, data) {

    })
    .on('dir:up dir:left dir:down dir:right', function(evt, data) {
        console.log(data);
    })
    .on('pressure', function(evt, data) {

    });
}

/* 象限
 *
 *   2 | 1
 *   -----
 *   3 | 4
 */
function calControl(distance, degree, position, direction) {
    var speed = 255 * distance / (zoomSize * 0.5);
    var left = 0,
        right = 0;

    // 1
    if (degree >= 0 & degree < 90) {
        right = speed - (90 - degree) * settings.multiple;
        left = -speed;
    }

    // 2
    if (degree >= 90 & degree < 180) {
        right = speed;
        left = -(speed - (degree - 90) * settings.multiple);
    }

    // 3
    if (degree >= 180 & degree < 270) {
        right = -speed;
        left = (speed - (270 - degree) * settings.multiple);
    }

    // 4
    if (degree >= 270 & degree < 360) {
        right = -(speed - (degree - 270) * settings.multiple);
        left = speed;
    }
}

function addJoyStickName(joystick, eleId) {
    var nameMaps = {
        "zoneL": "A-B",
        "zoneC": "X-Y",
        "zoneR": "C-D"
    };
    var nameElStr = '<span class="joystick-name">' + nameMaps[eleId] + '</span>'
    joystick.get().ui.front.innerHTML = nameElStr;
}

var joystickL = createZone("zoneL");
var joystickC = createZone("zoneC");
var joystickR = createZone("zoneR");

bindNipple(joystickL);
bindNipple(joystickC);
bindNipple(joystickR);