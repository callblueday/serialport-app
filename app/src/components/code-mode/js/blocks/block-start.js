import BlockBuilder from '../block-builder';

export default class StartBlocks {
  constructor() {
    this.crateBlocks();
  }

  crateBlocks () {
    BlockBuilder.makeBlock('when_start', [], function(){
      this.jsonInit({
        "message0": '当开始时',
        "args0": [],
        "nextStatement": true,
        "inputsInline": true,
        "colour": BlockBuilder.HUE.start
      });
    }, function(){ });
  }

}
