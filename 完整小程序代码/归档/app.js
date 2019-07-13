
import config from './config.js';

App({
    config: config,
    play: function (ev) {
        // 检测账户
        var {ptimes, stimes, price, gid, cost} = ev.target.dataset;

        // 有剩余次数
        if(ptimes + stimes > 0) {
            wx.navigateTo({
                url: 'game?ptimes=' + ptimes + '&stimes=' + stimes + '&price=' + price + '&gid=' + gid + '&cost=' + cost
            });

            return;
        }

        this.pay(price, 0);
    },
    pay: function (price, cut) {

        this.fetch({
            url: '/pay',
            data: {fee: price, cut: cut},
            success: function (info) {
                wx.requestPayment({
                    timeStamp: info.data.timeStamp,
                    nonceStr: info.data.nonceStr,
                    package: info.data.package,
                    signType: info.data.signType,
                    paySign: info.data.paySign,
                    success: function(res) {
                        // 
                    },
                    fail: function(res) {
                        // 
                    }
                });
            }
        });
    },
    login: function (cb) {
        // 检测用户是否登录
        var session_id = wx.getStorageSync('session_id');

        // 已登录
        if(session_id) return cb(session_id);

        // 未登录
        wx.login({
            success: function (res) {
                if(res.code) {
                    wx.request({
                        url: config.baseUrl + '/login',
                        data: {
                            code: res.code
                        },
                        success: function (info) {

                            if(info.data.error) return;
                            
                            // 用户id
                            wx.setStorageSync('session_id', info.data.result.session_id);

                            cb(info.data.result.session_id);
                        }
                    })
                }
            }
        });
    },
    fetch: function (options) {
        this.login(function (session_id) {

            // 验证头信息
            options.header = {
                'x-session': session_id
            }

            options.url = config.baseUrl + options.url;
            
            wx.request(options);
        });
    },
});