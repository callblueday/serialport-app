var Input = require("./input_events");
var LinkDialog = require("./link_dialog");
var HostInterface = require("./hostInterface");
var Utils = require("./utils");


var linkDialog = new LinkDialog();
linkDialog.onConnect = function(){
    // TODO: after bluetooth connected, dosomething
};


$('#link-button').on(Input.start, function(e){
    linkDialog.open();
    e.preventDefault();
});

$('#btn-cmd-add').on(Input.start, function(e){
    var item = '<div class="cmd-item">' +
                    '<div class="form-group col-xs-9 cmd">' +
                        '<input type="text" class="form-control cmd-input" placeholder="ff 55 03 10 00 11 12 13">' +
                    '</div>' +
                    '<button type="button" class="btn btn-default col-xs-3 btn-send">Send</button>' +
                '</div>';
    $('.form-inline').append(item);
});


$('.form-inline').on(Input.start, '.cmd-item .btn-send', function(e){
    console.log(1)
    var value = $(this).parent().find(".cmd-input").val();
    if(value.length) {
        // send serial data
        var valueArray = value.split(" "), hexArray = [], decimalArray = [];

        if($('[name=cmdMode]:checked').val() == "hex") {
            for(var i in valueArray) {
                if(valueArray[i]) {
                    hexArray.push(parseInt(valueArray[i], 16).toString(16));
                    decimalArray.push(parseInt(valueArray[i], 16));
                }
            }
            Utils.addMsg(hexArray.join(" "));
            HostInterface.sendBluetoothRequest(decimalArray);
        } else {
            Utils.addMsg(value);
            HostInterface.sendBluetoothRequest(value, 'ascii');
        }
    }
});