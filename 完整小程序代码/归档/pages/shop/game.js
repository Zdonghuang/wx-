
const App = getApp();

Page({
    data: {
        share: true,
        start: 0,
        duration: 0,
        offset: 0,
        win: false,
        ended: false,
        post: false,
        ptimes: 0,
        stimes: 0,
        gid: 0,
        price: 0,
        text: '',
        cost: 0
    },
    start: function () {
        this.setData({
            start: (new Date).getTime()
        });
    },
    end: function() {
        var start = this.data.start,
            now = (new Date).getTime(),
            duration = now - start,
            self = this;

        // 更新账户余额
        App.fetch({
            url: '/account',
            data: {
                ptimes: self.data.ptimes,
                stimes: self.data.stimes,
                gid: self.data.gid,
                price: self.data.price
            },
            success: function (info) {
                self.setData(info.data);

                wx.setNavigationBarTitle({
                    title: "游戏结束"
                });

                if(duration == 1000) {
                    // 单品充值总额
                    App.fetch({
                        url: '/account/count',
                        data: {
                            gid: self.data.gid
                        },
                        success: function (sum) {
                            // 成功
                            if(sum.data.result > self.data.cost) {
                                self.setData({
                                    win: true
                                });
                            } else {
                                duration -= Math.random() * 99 + 1;
                            }

                            self.rank(duration);
                        }
                    });
                } else {
                    self.rank(duration);
                }
            }
        });

    },
    rank: function (duration) {
        var text = '';
        var offset = ((duration - 1000) / 1000).toFixed(3);

        this.setData({
            ended: true,
            offset: offset,
            duration: (duration / 1000).toFixed(3)
        });

        offset = Math.abs(offset);

        if(offset < 0.01) {
            text = '全国排名前3%';
        } else if(offset < 0.03) {
            text = '全国排名前8%';
        } else if(offset < 0.07) {
            text = '全国排名前11%';
        } else if(offset < 0.1) {
            text = '全国排名前15%';
        } else if(offset < 0.15) {
            text = '全国排名前18%';
        } else if(offset < 0.2) {
            text = '全国排名前20%';
        } else if(offset < 0.3) {
            text = '全国排名前25%';
        } else {
            text = '全国排名前50%';
        }

        // 排名
        this.setData({
            text: text
        });
    },
    again: function (ev) {

        wx.setNavigationBarTitle({
            title: "开始游戏"
        });

        var {times} = ev.target.dataset;

        if(times > 0) {
            this.setData({
                win: false,
                ended: false
            });

            return;
        }

        App.pay(this.data.price);

    },
    share: function () {
        this.setData({
            share: false
        })
    },
    submit: function (ev) {

        var data = ev.detail.value;
        data.gid = this.data.gid;
        data.cost = this.data.cost;

        var self = this;

        wx.showLoading({
            title: '正在提交...'
        });

        App.fetch({
            url: '/shipment',
            data: data,
            success: function (info) {
                self.setData({
                    win: false,
                    ended: false,
                    post: true
                });
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },
    back: function () {
        wx.redirectTo({
            url: 'index'
        });
    },
    onLoad: function (options) {
        // 转发
        wx.showShareMenu({
            withShareTicket: true
        });

        wx.setNavigationBarTitle({
            title: "开始游戏"
        });
        console.log(options)
        this.setData(options);
    },
    onShareAppMessage: function (res) {

        // session_id
        var session_id = wx.getStorageSync('session_id'),
            gid = this.data.item.gid;

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