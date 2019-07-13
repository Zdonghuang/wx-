
const App = getApp();

Page({
    data: {
        items: [],
        account: 0,
        recharge: false
    },
    charge: function () {
        this.setData({
            recharge: !this.data.recharge
        });
    },
    buy: function (ev) {

        let {price, cut} = ev.target.dataset;

        App.pay(price, 0);
    },
    play: App.play,
    onLoad: function (options) {
        // 奖励分享用户
        var session_id = wx.getStorageSync('session_id');
        if(!session_id && options.sgid) {
            wx.request({
                url: App.config.baseUrl + '/share',
                data: {
                    session_id: options.session_id,
                    sgid: options.sgid
                }
            });
        }
    },
    onShow: function () {
        var self = this;

        self.setData({
            recharge: false
        });
        
        wx.showLoading({
            title: '正在加载...'
        });

        // 获取商品列表
        App.fetch({
            url: '/goods',
            success: function (res) {
                self.setData({
                    items: res.data.result.items,
                    account: res.data.result.account
                });
            },
            complete: function () {
                wx.hideLoading();
            }
        })
    }
})