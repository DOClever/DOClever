<template>
    <div>
        <div class="footer hidden-xs-only">
            <div class="wrap">
                <el-row :gutter="30">
                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" :offset="1">
                        <div class="fbox1 ">
                            <h3>服务电话</h3>
                            <p class="fline"></p>
                            <div class="txt">
                                <p class="tel">186-0218-9741</p>
                                <p>（周一至周日 9:00——18:00）</p>
                                <p class="zx"><a href="http://wpa.qq.com/msgrd?v=3&uin=624473248&site=qq&menu=yes"><img src="../../web/resource/pic/footer-qq.png"></a> </p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                        <div class="fbox1 ">
                            <h3>快速入口</h3>
                            <p class="fline"></p>
                            <div class="txt">
                                <ul style="padding:0">
                                    <li><a href="../custom/custom.html">定制化服务</a></li>
                                    <li><a href="../about/about.html">关于我们</a></li>
                                    <li><a href="../donate/donate.html">桌面端众筹</a></li>
                                    <li><a href="../help/help.html">帮助中心</a></li>
                                </ul>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                        <div class="fbox1 lxwm">
                            <h3>联系我们</h3>
                            <p class="fline"></p>
                            <div class="txt">
                                <p><img src="../../web/resource/pic/QQ.png"> <span>&nbsp;&nbsp;624473248</span> </p>
                                <p><img src="../../web/resource/pic/email.png"> <span>&nbsp;&nbsp;624473248@qq.com</span> </p>
                                <p><img src="../../web/resource/pic/address.png"> <span>&nbsp;&nbsp;&nbsp;安徽省合肥市高新创新产业园2期</span> </p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                        <div class="fbox2 ">
                            <h3>官方微信</h3>
                            <p class="fline"></p>
                            <div class="txt">
                                <img src="../../web/resource/pic/foot-wx.jpg">
                                <p style="margin: 0;padding: 5px 0 0 ;color: #999">微信扫一扫关注我们</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="foot">
            <p class="tc">©           2016-2018 合肥市道克莱尔信息科技有限公司 皖ICP备17002996号</p>
            <slot></slot>
        </div>
    </div>
</template>