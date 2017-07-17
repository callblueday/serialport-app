var Utils = {
    // 将信息贴在图形框中
    addMsg: function(msgStr) {
        var p = msgStr + "<br/>";
        $('.msg').append(p);
        this.toBottom();
    },
    // 将滚动条始终置于页面底部
    toBottom: function() {
        var scrollOffset = $('.msg')[0].scrollHeight - $('.msg').height();
        $('.msg').animate({scrollTop: scrollOffset}, 0);
    }
};

module.exports = Utils;