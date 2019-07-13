

//  <!--获取验证码-->
    $("#btn").click(function () {
        var disabled = $("#btn").attr("disabled");
        if (disabled) {
            return false;
        }
        if (!(/^1[345789]\d{9}$/.test($(".phone").val())) || $(".phone").val() === "") {
            layer.msg('手机号码格式有误', {
                icon: 7,
                anim: 1,
                time: 1500
            });
            return false;
        }
        $.ajax({
//          url: "http://test.daiqianma.cn/credit/app/userLogin/sendRegisterCode.htm",
            url:"http://official.daiqianma.cn/credit/app/userLogin/sendRegisterCode.htm",
            type: "get",
            data: {
                telephone: $(".phone").val(),
            },
            success: function (data) {
                console.log(JSON.parse(data));
                if(JSON.parse(data).status != 0){
                	layer.msg(JSON.parse(data).errMsg, {
		                icon: 7,
		                anim: 1,
		                time: 1500
		            });
		            return false;
                }else{
                	settime();
                }
            }
        });
    });
    //获取验证码
    var countdown = 60;
    var _generate_code = $("#btn");

    function settime() {
        if (countdown == 0) {
            _generate_code.attr("disabled", false);
            _generate_code.html("重新发送");
            countdown = 60;
            return false;
        } else {
            $("#btn").attr("disabled", true);
            _generate_code.html("重新发送(" + countdown + ")");
            countdown--;
        }
        setTimeout(function () {
            settime();
        }, 1000);
    }

    //提交
    $(".submit").click(function () {
        var phone = $(".phone").val();
        var numCode = $(".num").val();
        var password = $(".password").val();
        if (numCode === "") {
        	layer.open({
			    content: '验证码不能为空',
			    skin: 'msg',
			    time: 1.5 
			});
            return false;
        }else if (password === "") {
            layer.msg('密码不能为空', {
                icon: 7,
                anim: 1,
                time: 1500
            });
            return false;
        } else if (password.length < 6 || password.length > 20 || !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(password)) {
            layer.msg('请输入6-20位数字字母组合密码', {
                icon: 7,
                anim: 1,
                time: 1500
            });
            return false;
        }
        $.ajax({
//          url: "http://test.daiqianma.cn/credit/app/userLogin/register.htm",
            url: "http://official.daiqianma.cn/credit/app/userLogin/register.htm",
            type: "post",
            dataType: "json",
            data: {
                telephone: phone,
                password: md5(password),
                code:numCode,
                deviceNumber:"dqmh5"
            },
            beforeSend: function () {
                //loading效果
                this.layerIndex = layer.load(0, {shade: [0.5, '#fff']});
            },
            success: function (data) {
                console.log(data);
                if(data.status != "0"){
                    layer.msg(data.errMsg, {
                        icon: 7,
                        anim: 1,
                        time: 1500
                    });
                    layer.close(this.layerIndex);
                    return false;
                }else{
                	//关闭loading
               	 	layer.close(this.layerIndex);
                	window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.jkl.loanmoney";
                }
            }
        });
    });

