import BlockBuilder from '../block-builder';
import { action } from '../../../servo-editor/js/action';

const angleRange = {
  "A": [-180, 180],
  "B": [-120, 120],
  "C": [-120, 120],
  "D": [-180, 180],
  "X": [-180, 180],
  "Y": [0, 120]
};

const speedRange = [0, 2000];

export default class MoveBlocks {
  constructor() {
    this.crateBlocks();
  }

  getAngle(axis, angle) {
    let ang = angle;
    if(ang < angleRange[axis][0]) {
      ang = angleRange[axis][0];
    }
    if(ang > angleRange[axis][1]) {
      ang = angleRange[axis][1];
    }
    return ang;
  }

  crateBlocks () {
    let self = this;

    BlockBuilder.makeBlock('move_axis', ['AXIS', '=ANGLE', '=SPEED'], function() {
      this.jsonInit({
        "message0": '选择轴 %1 角度为 %2 速度为 %3',
        "args0": [
          {
            "type": "field_dropdown",
            "name": "AXIS",
            "options": [
                ['J1', 'A'],
                ['J2', 'B'],
                ['J3', 'C'],
                ['J4', 'D'],
                ['J5', 'X'],
                ['J6', 'Y']
            ]
          },
          {
            "type": "input_value",
            "name": "ANGLE",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "SPEED",
            "check": "Number"
          }
        ],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(axis, angle, speed){
      let nowAngle = self.getAngle(axis.data, angle.data);
      action.move(axis.data, nowAngle, speed.data);
    });

    BlockBuilder.makeBlock('move_all_axis', ['=ANGLE1', '=ANGLE2', '=ANGLE3','=ANGLE4','=ANGLE5','=ANGLE6', '=SPEED'], function() {
      this.jsonInit({
        "message0": '选择轴 J1 角度为 %1 轴 J2 角度为 %2 轴 J3 角度为 %3 轴 J4 角度为 %4 轴 J5 角度为 %5 轴 J6 角度为 %6 速度为 %7',
        "args0": [
          {
            "type": "input_value",
            "name": "ANGLE1",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "ANGLE2",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "ANGLE3",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "ANGLE4",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "ANGLE5",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "ANGLE6",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "SPEED",
            "check": "Number"
          }
        ],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": false,
        "colour": BlockBuilder.HUE.move
      });
    }, function(angle1,angle2,angle3,angle4,angle5,angle6,speed){
      let a1 = self.getAngle('A', angle1.data);
      let a2 = self.getAngle('B', angle2.data);
      let a3 = self.getAngle('C', angle3.data);
      let a4 = self.getAngle('D', angle4.data);
      let a5 = self.getAngle('X', angle5.data);
      let a6 = self.getAngle('Y', angle6.data);
      action.moveAllAxis(a1, a2, a3, a4, a5, a6, speed.data);
    });

    BlockBuilder.makeBlock('move_set_mode', ['ACTION', 'MODE'], function() {
      this.jsonInit({
        "message0": '%1 动作 %2',
        "args0": [
          {
            "type": "field_dropdown",
            "name": "ACTION",
            "options": [
                ['执行', 'open'],
                ['停止', 'close']
            ]
          },
          {
            "type": "field_dropdown",
            "name": "MODE",
            "options": [
                ['拍摄', 'paishe'],
                ['喷漆', 'penqi'],
                ['夹取', 'jiaqu'],
                ['吸取', 'xiqu'],
                ['焊接', 'hanjie']
            ]
          }
        ],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(actionType, mode){
      console.log(actionType.data, mode.data);
      let type = mode.data + '-' + actionType.data;
      action.setMode(type);
    });

    BlockBuilder.makeBlock('move_forward', [], function() {
      this.jsonInit({
        "message0": '前进',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(3);
        this.wait(3.4);
    });

    BlockBuilder.makeBlock('move_backward', [], function() {
      this.jsonInit({
        "message0": '后退',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(2);
        this.wait(3.4);
    });

    BlockBuilder.makeBlock('move_left', [], function() {
      this.jsonInit({
        "message0": '左移动',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(5);
        this.wait(3.4);
    });

    BlockBuilder.makeBlock('move_right', [], function() {
      this.jsonInit({
        "message0": '右移动',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(6);
        this.wait(3.4);
    });

    BlockBuilder.makeBlock('move_turn_left', [], function() {
      this.jsonInit({
        "message0": '左转向',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(7);
        this.wait(1.2);
    });

    BlockBuilder.makeBlock('move_turn_right', [], function() {
      this.jsonInit({
        "message0": '右转向',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(6);
        this.wait(1.2);
    });

    BlockBuilder.makeBlock('move_stand_by', [], function() {
      this.jsonInit({
        "message0": '启动待机',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(1);
        this.wait(1);
    });

    BlockBuilder.makeBlock('move_say_hi', [], function() {
      this.jsonInit({
        "message0": '打招呼',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(5);
        this.wait(3.3);
    });

    BlockBuilder.makeBlock('move_push_up', [], function() {
      this.jsonInit({
        "message0": '俯卧撑',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(11);
        this.wait(9.6);
    });

    BlockBuilder.makeBlock('move_lie', [], function() {
      this.jsonInit({
        "message0": '站立',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(8);
        this.wait(0.5);
    });

    BlockBuilder.makeBlock('move_fight', [], function() {
      this.jsonInit({
        "message0": '战斗模式',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
      action.move(10);
      this.wait(5.5);
    });

    BlockBuilder.makeBlock('move_sleep', [], function() {
      this.jsonInit({
        "message0": '休息',
        "args0": [],
        "previousStatement": true,
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.move
      });
    }, function(){
        action.move(12);
        this.wait(1);
    });
  }
}
