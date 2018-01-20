const BlockBuilder = {
  HUE: {
    start: 200,
    move: 218,
    display: 250,
    event: 40,
    detect: 18,
    math: 289,
    control: 330,
    webapi: 355
  },
  blockList: {},
  getBlocks: function() {
    return this.blockList;
  },

  /**
   * Register a block into MBlockly system; add a function to javascript parser;
   * when block is executed, call that added function.
   *
   * @param  {string} blockName - name of the block in xml description
   * @param  {[string]} argList   - list of argument this block takes
   * @param  {function} uiBuilder - a function for building the block
   * @param  {function} handler   - show what is done when the block is run
   * @param  {enum} opOrder   - the operation order of this block
   * @return {void}
   *
   * opOrder types - if you omit this argument, it will generate a normal block;
   * otherwise a valued block. Possible values:
   * Blockly.JavaScript.ORDER_ATOMIC
   * Blockly.JavaScript.ORDER_ADDITION
   * Blockly.JavaScript.ORDER_SUBTRACTION
   * Blockly.JavaScript.ORDER_MULTIPLICATION
   * Blockly.JavaScript.ORDER_DIVISION
   * Blockly.JavaScript.ORDER_COMMA
   * Blockly.JavaScript.ORDER_FUNCTION_CALL
   * Blockly.JavaScript.ORDER_UNARY_NEGATION
   * Blockly.JavaScript.ORDER_NONE
   */
  makeBlock: function(blockName, argList, uiBuilder, handler, opOrder) {
    Blockly.Blocks[blockName] = {
      init: uiBuilder
    };

    Blockly.JavaScript[blockName] = function(block) {
      var argValues = [];
      for (var i = 0; i < argList.length; i++) {
        if (argList[i].charAt(0) == '*') {
          var codeForm = Blockly.JavaScript.valueToCode(block, argList[i].substring(1), Blockly.JavaScript.ORDER_COMMA);
          argValues.push(codeForm.substring(1, codeForm.length - 1));
        } else if (argList[i].charAt(0) == '=') {
          // for number
          var codeForm = Blockly.JavaScript.valueToCode(block, argList[i].substring(1), Blockly.JavaScript.ORDER_COMMA);
          argValues.push(codeForm);
        } else if (argList[i].charAt(0) == '@') {
          // TO FIXED: for statement code
          // var codeForm = Blockly.JavaScript.statementToCode(block, argList[i].substring(1), Blockly.JavaScript.ORDER_COMMA);
          // argValues.push(codeForm);
        } else {
          argValues.push(block.getFieldValue(argList[i]));
        }
      }

      for (var i in argValues) {
        if (typeof(argValues[i]) == 'string' && argValues[i].indexOf('(') == -1) {
          // 不包含语句的参数全部用引号包裹
          argValues[i] = ('"' + argValues[i] + '"');
        }
      }

      var argStr = argValues.join(',');

      if (argStr == '""') {
        argStr = '';
      }

      var code = 'blockly_js_func_' + blockName + '(' + argStr + ')';
      if (opOrder) { // this is a value block, output a value tuple;
        code = [code, opOrder];
      } else { // this is a normal block, output a line of code
        code += ';\n';
      }
      return code;
    }

    this.blockList[blockName] = {
      'argList': argList,
      'handler': handler,
      'funcName': 'blockly_js_func_' + blockName
    };
  }
};

export default BlockBuilder;
