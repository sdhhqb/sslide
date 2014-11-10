(function () {

        //默认config
    var defaultConfig = {
            //图片宽度，单位px
            "picWidth": 600,

            //图片高度，单位px
            "picHeight": 400,

            //轮播代码块的id, 必需参数
            "lbId": "",

            //轮播图片数目，可选范围1-8
            "picNum": 5,

            //轮播图片路径，图片路径的字符串数组，如：["images/slb1.png","images/slb2.png","images/slb3.png"]
            //不传递该参数时，使用../css/iamges目录中slb1.png - slb8.png 的图片，传入图片数组后，picNum的值等于数组的长度。
            "picPath": [],

            //左右切换图片按钮, 默认显示
            "switchBtnShow": true,

            //切换图片圆点, 默认显示
            "switchDotShow": true,

            //鼠标移入是否暂停, 默认暂停
            "pause": true,

            //自动滚动, 默认开启
            "autoSlide": true,

            //滑动间隔时间, 单位毫秒
            "interTime": 3500,

            //是否循环滑动,
            //设为true时，沿一个方向滑动到一端的末尾时，会继续沿该方向滑入另一端末尾的图片。
            //设为false时，沿一个方向滑动到一端的末尾时，会沿相反方向滑到另一端末尾的图片。
            "loop": true,

            //自定义dom
            //容器为<li class="p[x] size_pic"></li>，轮播图片设置为容器的背景
            //容器中可以添加自定义的内容
            "customDom": false
        },
        //自定义config，设置自定义config时一定要传入正确的参数值
        customConfig = {},

        //设置config
        setConfig = function (con) {
            var k;

            if (con === undefined) {
                customConfig = defaultConfig;
            } else {
                for (k in defaultConfig) {
                    if (con[k] !== undefined) {
                        customConfig[k] = con[k];
                    } else {
                        customConfig[k] = defaultConfig[k];
                    }
                }
            }

            //传入的图片路径数组为空，默认最多可以从images目录读取slb1.png - slb8.png的8张图片
            if (customConfig.picPath.length == 0 && customConfig.picNum != 5) {
                customConfig.picNum = customConfig.picNum > 8 ? 8 : customConfig.picNum;
            }
        },

        //设置元素位置
        positionInit = function ($slide, param) {

            var half_height = param.pheight / 2 - 30,
                wRatio = param.picnum + 2,
                tmpstr = "",
                dotstr = "",
                $otmp,
                i;

            //计算图片数目，在页面中添加图片和切换圆点，如果config中同时传入了picPath和picNum，优先采用picPath数组的长度
            if (param.picPath.length > 0) {
                //自定义dom
                if (param.customDom) {
                    $otmp = $slide.find(".pic_box .size_pic");
                    dotstr = '<span class="dot_now"></span>';

                    $otmp.eq(0).attr("style", "background-image: url('" + param.picPath[param.picPath.length - 1] + "')");
                    for (i = 1; i <= param.picPath.length; i++) {
                        $otmp.eq(i).attr("style", "background-image: url('" + param.picPath[i - 1] + "')");
                        if (i < param.picPath.length) {
                            dotstr += '<span></span>';
                        }
                    }
                    $otmp.last().attr("style", "background-image: url('" + param.picPath[0] + "')");
                    $slide.find(".dots").html(dotstr);
                } else {
                    tmpstr = '<li class="p1 size_pic" style="background-image: url(' + param.picPath[param.picPath.length - 1] + ');"></li>';
                    dotstr = '<span class="dot_now"></span>';

                    for (i = 1; i <= param.picPath.length; i++) {
                        tmpstr += '<li class="p' + (i + 1) + ' size_pic" style="background-image: url(' + param.picPath[i - 1] + ');"></li>';
                        if (i < param.picPath.length) {
                            dotstr += '<span></span>';
                        }
                    }
                    tmpstr += '<li class="p' + i + ' size_pic" style="background-image: url(' + param.picPath[0] + ');"></li>';
                    $slide.find(".pic_box").html(tmpstr);
                    $slide.find(".dots").html(dotstr);
                }
            } else {
                //自定义dom
                if (param.customDom) {
                    $otmp = $slide.find(".pic_box .size_pic");
                    dotstr = '<span class="dot_now"></span>';

                    $otmp.eq(0).attr("style", "background-image: url('./css/images/slb" + param.picnum + ".png')");
                    $otmp.last().attr("style", "background-image: url('./css/images/slb1.png')");
                    for (i = 1; i <= param.picnum; i++) {
                        if (i < param.picnum) {
                            dotstr += '<span></span>';
                        }
                    }
                    $slide.find(".dots").html(dotstr);
                } else {
                    tmpstr = '<li class="p1 size_pic" style="background-image: url(./css/images/slb' + param.picnum + '.png)"></li>';
                    dotstr = '<span class="dot_now"></span>';

                    for (i = 1; i <= param.picnum; i++) {
                        tmpstr += '<li class="p' + (i + 1) + ' size_pic"></li>';
                        if (i < param.picnum) {
                            dotstr += '<span></span>';
                        }
                    }
                    tmpstr += '<li class="p' + (i + 1) + ' size_pic" style="background-image: url(./css/images/slb1.png)"></li>';
                    $slide.find(".pic_box").html(tmpstr);
                    $slide.find(".dots").html(dotstr);
                }
            }

            //设置轮播部分元素的样式
            $slide.css({width: param.pwidth + "px", height: param.pheight + "px"});
            $slide.find(".size_pic").css({width: param.pwidth + "px", height: param.pheight + "px"});
            $slide.find(".size_box").css({width: wRatio * param.pwidth + "px", height: param.pheight + "px"});
            $slide.find(".pic_box").css({"margin-left": "-" + param.pwidth + "px"});

            //设置切换按钮位置
            if (param.btnShow) {
                //按钮宽、高为60px，距离边沿20px
                $slide.find(".btnl").css({top: half_height + "px", left: "20px"});
                $slide.find(".btnr").css({top: half_height + "px", left: (param.pwidth - 80) + "px"});
            } else {
                $slide.find(".btnl, .btnr").css({display: "none"});
            }

            //设置切换圆点位置
            if (param.dotShow) {
                //圆点距离底部30px，直径14px, 左右10px边距
                $slide.find(".dots").css({top: (param.pheight - 30) + "px", left: (param.pwidth - 34 * param.picnum) / 2 + "px"});
            } else {
                $slide.find(".dots").css({display: "none"});
            }

        },

        //添加点击事件
        addEvent = function ($slide, param) {
                //图片序号，当前是第几张图片
            var num = 1,
                //按钮锁，图片切换过程中锁定按钮
                lock = 0,
                //定时器
                inter0 = null,
                //function
                interSlide;

            //点击右边按钮，图片向左滚动
            $slide.find(".btnr").click(function () {
                var sstr;
                if (lock == 1) {
                    return 1;
                }
                lock = 1;
                if (num < param.picnum) {
                    num += 1;
                    sstr = -num * param.pwidth;
                    $slide.find(".pic_box").animate({marginLeft: sstr + "px"}, function () {
                        lock = 0;
                    });
                } else {
                    sstr = param.pwidth * (param.picnum + 1);
                    if (param.loop) {
                        $slide.find(".pic_box").animate({marginLeft: "-" + sstr + "px"}, function () {
                            $(this).css({marginLeft: "-" + param.pwidth + "px"});
                            lock = 0;
                        });
                    } else {
                        $slide.find(".pic_box").animate({marginLeft: "-" + param.pwidth + "px"}, function () {
                            lock = 0;
                        });
                    }
                    num = 1;
                }
                $slide.find(".dots span").removeClass("dot_now");
                $slide.find(".dots span").eq(num - 1).addClass("dot_now");
            });

            //点击左边按钮，图片向右滚动
            $slide.find(".btnl").click(function () {
                var sstr;
                if (lock == 1) {
                    return 1;
                }
                lock = 1;
                if (num > 1) {
                    num -= 1;
                    sstr = -num * param.pwidth;
                    $slide.find(".pic_box").animate({marginLeft: sstr + "px"}, function () {
                        lock = 0;
                    });
                } else {
                    num = param.picnum;
                    sstr = param.pwidth * param.picnum;
                    if (param.loop) {
                        $slide.find(".pic_box").animate({marginLeft: "0px"}, function () {
                            $(this).css({marginLeft: "-" + sstr + "px"});
                            lock = 0;
                        });
                    } else {
                        $slide.find(".pic_box").animate({marginLeft: "-" + sstr + "px"}, function () {
                            lock = 0;
                        });
                    }
                }
                $slide.find(".dots span").removeClass("dot_now");
                $slide.find(".dots span").eq(num - 1).addClass("dot_now");
            });

            //点击下方小圆点切换图片
            $slide.find(".dots span").each(function (index) {
                $(this).click(function () {
                    if (lock == 1) {
                        return 1;
                    }
                    lock = 1;
                    num = index + 1;
                    $slide.find(".dots span").removeClass("dot_now");
                    $(this).addClass("dot_now");
                    var sstr = -param.pwidth * index - param.pwidth;
                    $slide.find(".pic_box").animate({marginLeft: sstr + "px"}, function () {
                        lock = 0;
                    });
                });
            });

            //设置鼠标移入，切换按钮显示，根据配置设置是否暂停滑动
            if (param.pause && param.autoSlide) {
                //鼠标移入，停止自动切换图片
                $slide.mouseenter(function () {
                    clearInterval(inter0);
                    $slide.find(".btns").addClass("deep");
                });
                //鼠标离开，启动自动切换图片
                $slide.mouseleave(function () {
                    clearInterval(inter0);
                    inter0 = setInterval(interSlide, param.interTime);
                    $slide.find(".btns").removeClass("deep");
                });
            } else {
                $slide.mouseenter(function () {
                    $slide.find(".btns").addClass("deep");
                });
                $slide.mouseleave(function () {
                    $slide.find(".btns").removeClass("deep");
                });
            }

            //自动轮播
            interSlide = function () {
                var sstr;
                if (lock == 1) {
                    return 1;
                }
                lock = 1;

                //处理图片滚动
                if (num < param.picnum) {
                    num += 1;
                    sstr = -num * param.pwidth;
                    $slide.find(".pic_box").animate({marginLeft: sstr + "px"}, function () {
                        lock = 0;
                    });
                } else {
                    sstr = param.pwidth * (param.picnum + 1);
                    //滚动到首尾时，判断是否循环滚动
                    if (param.loop) {
                        $slide.find(".pic_box").animate({marginLeft: "-" + sstr + "px"}, function () {
                            $(this).css({marginLeft: "-" + param.pwidth + "px"});
                            lock = 0;
                        });
                    } else {
                        $slide.find(".pic_box").animate({marginLeft: "-" + param.pwidth + "px"}, function () {
                            lock = 0;
                        });
                    }
                    num = 1;
                }
                //设置切换圆点显示
                $slide.find(".dots span").removeClass("dot_now");
                $slide.find(".dots span").eq(num - 1).addClass("dot_now");
            };

            //默认启动自动切换图片
            if (param.autoSlide) {
                inter0 = setInterval(interSlide, param.interTime);
            }
        },

        //启动函数
        run = function (config) {
            //处理自定义config
            setConfig(config);

            //读取config
            var picNum = customConfig.picPath.length > 0 ? customConfig.picPath.length : customConfig.picNum,
                $olbs = $("#" + customConfig.lbId);

            if ($olbs.length > 0) {
                //初始化页面元素css
                positionInit($olbs, {
                    "pwidth": customConfig.picWidth,
                    "pheight": customConfig.picHeight,
                    "picnum": picNum,
                    "picPath": customConfig.picPath,
                    "btnShow": customConfig.switchBtnShow,
                    "dotShow": customConfig.switchDotShow,
                    "customDom": customConfig.customDom
                });
                //添加事件
                addEvent($olbs, {
                    "pwidth": customConfig.picWidth,
                    "picnum": picNum,
                    "interTime": customConfig.interTime,
                    "autoSlide": customConfig.autoSlide,
                    "pause": customConfig.pause,
                    "loop": customConfig.loop
                });
            }
        };

    //暴露到全局环境
    if (window.SSlide === undefined) {
        window.SSlide = run;
    }

})();

