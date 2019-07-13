	
	//获取url链接后面的手机号参数，赋值给邀请人手机号
	console.log(window.location.search.substr(1,11));
	var phoneNums=window.location.search.substr(1,11);
	if(phoneNums != ""){
		$(".phoneTwo").val(phoneNums).attr("disabled","disabled");
	}else{
		$(".phoneTwo").val("");
	}
//  获取验证码
    $("#btn").click(function () {
        var disabled = $("#btn").attr("disabled");
        if (disabled) {
            return false;
        }
        if (!(/^1[345789]\d{9}$/.test($(".phone").val())) || $(".phone").val() === "") {
			layer.open({
			    content: '手机号码格式有误',
			    skin: 'msg',
			    time: 1.5 
			  });
            return false;
        }
        $.ajax({
            url: "http://youdaikeshop.cn/loan/app/userLogin/sendRegisterCode.htm",
            type: "get",
            data: {
                telephone: $(".phone").val()
            },
            success: function (data) {
                console.log(JSON.parse(data));
                if(JSON.parse(data).status != 0){
		            layer.open({
					    content: JSON.parse(data).errMsg,
					    skin: 'msg',
					    time: 1.5 
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
        var phone2 = $(".phoneTwo").val();
        var numCode = $(".num").val();
        var passwords = $(".password").val();
        
        if (numCode === "") {
        	layer.open({
			    content: '验证码不能为空',
			    skin: 'msg',
			    time: 1.5 
			});
            return false;
        }else if (passwords === "") {
        	layer.open({
			    content: '密码不能为空',
			    skin: 'msg',
			    time: 1.5 
			});
            return false;
        } else if (passwords.length < 6 || passwords.length > 20 || !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(passwords)) {
            layer.open({
			    content: '请输入6-20位数字字母组合密码',
			    skin: 'msg',
			    time: 1.5 
			});
            return false;
        }else if(phone2 != ""){
        	if (!(/^1[345789]\d{9}$/.test(phone2))) {
				layer.open({
				    content: '邀请人手机号码格式有误',
				    skin: 'msg',
				    time: 1.5 
				  });
	            return false;
	        }
        }
        
        $.ajax({
            url: "http://youdaikeshop.cn/loan/app/userLogin/register.htm",
            type: "post",
            dataType: "json",
            data: {
                telephone: phone,
                password: md5(passwords),
                code:numCode,
                inviteTelephone:phone2,
                deviceNumber:"ydkh5"
            },
            beforeSend: function () {
                //loading效果
//              this.layerIndex = layer.load(0, {shade: [0.5, '#fff']});
                this.layerIndex = layer.open({
		                    shadeClose: false,
		                    type: 2,
		                    content: '拼命提交中...'
		                });
            },
            success: function (data) {
                console.log(data);
                if(data.status != "0"){
                    layer.open({
					    content: data.errMsg,
					    skin: 'msg',
					    time: 1.5 
					});
                    layer.close(this.layerIndex);
                    return false;
                }else{
                	//关闭loading
               	 	layer.close(this.layerIndex);
                	window.location.href="http://android.myapp.com/myapp/detail.htm?apkName=com.jkl.loan&ADTAG=mobile";
                }
                
              
            }
        });
    });

