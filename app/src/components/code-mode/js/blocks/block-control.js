import BlockBuilder from '../block-builder';

export default class ControlBlocks {
  constructor() {
    this.crateBlocks();
  }

  crateBlocks() {
    /**
     * repeat forever
     */
    Blockly.Blocks['controls_repeat_forever'] = {
      /**
       * Block for repeat n times (internal number).
       * @this Blockly.Block
       */
      init: function() {
        this.setColour(Blockly.Blocks.loops.HUE);
        this.appendStatementInput('DO')
          .appendField('重复执行');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      }
    };

    Blockly.JavaScript['controls_repeat_forever'] = function(block) {
      // Repeat n times (internal number).
      var branch = Blockly.JavaScript.statementToCode(block, 'DO');
      branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
      var code = 'while (true) {\n' +
        branch + '}\n';
      return code;
    };
  }

}
