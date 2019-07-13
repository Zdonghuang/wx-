
const App = getApp();

Page({
    data: {
        share: true,
        id: 0,
        item: {}
    },
    play: App.play,
    share: function () {
        this.setData({
            share: false
        })
    },
    onLoad: function (options) {
        // 转发
        wx.showShareMenu({
            withShareTicket: true
        });

        // 设置导航标题
        wx.setNavigationBarTitle({
            title: "游戏规则"
        });

        // 获取url参数
        this.setData({
            id: options.id
        });
    },
    onShow: function () {

        var self = this;

        wx.showLoading({
            title: '正在加载...'
        });

        // 根据商品id获取商品信息
        App.fetch({
            url: '/goods/detail',
            data: {
                gid: self.data.id
            },
            success: function (info) {
                self.setData({
                    item: info.data
                })
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },
    onShareAppMessage: function (res) {

        // session_id
        var session_id = wx.getStorageSync('session_id'),
            gid = this.data.item.id;

        return {
            title: '利用空闲时间，来摸个iphone',
            path: '/pages/shop/index?session_id=' + session_id + '&sgid=' + gid,
            imageUrl: 'http://mobao.botue.com/uploads/thumb.jpg',
            success: function () {
                // console.log(111)
            },
            fail: function () {}
        }
    }
});