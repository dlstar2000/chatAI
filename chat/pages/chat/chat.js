// pages/chat/chat.js
// https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /* 聊天记录列表 */
        chatLists: [],
        /* 发送的文本内容 */
        sendContent: "",
        /* 添加资源按钮的图片 */
        addImg: "./addImg.jpg",
        /* 是否显示添加资源界面 */
        addFlag: false,
        /* 聊天界面高度 */
        chat_con_height: 100,
    },
    // 显示提示
    showToast: function (title) {
        wx.showToast({
            title: title,
            icon: 'none',
            duration: 1000,
            mask: true
        })
    },
    // 发送信息到界面上
    sendData: async function () {
        // 获取自己发送的消息内容
        let sendContent = this.data.sendContent;
        if (sendContent.trim() == "") {
            // 内容提示
            this.showToast("不能发送空内容")
            return;
        }

        // 将自己发送的消息 添加至列表中
        this.msgDeal(app.globalData.userInfo.avatarUrl, sendContent, 1);

        // 将自己的消息发送至后端 等待结果返回
        let re = await this.sendRequest('http://127.0.0.1:7001/AIChat', {
            msg: sendContent
        }, "get");
        //   请求成功的返回值
        // 得到的回应
        let reply = re.Reply;
        if (!reply) {
            reply = "你在说什么";
        }
        this.msgDeal("./cat.jpg", reply, 1);
    },

    getSimilarWords: async function () {
        // 获取自己发送的消息内容
        let sendContent = this.data.sendContent;
        if (sendContent.trim() == "") {
            // 内容提示
            this.showToast("不能发送空内容")
            return;
        }
        // 将自己发送的消息 添加至列表中
        this.msgDeal(app.globalData.userInfo.avatarUrl, sendContent, 1);

        // 如何得到回应
        // 将自己的消息发送至后端

        let re = await this.sendRequest('http://127.0.0.1:7001/SimilarWords', {
            words: sendContent
        }, "get")
        let reply = re.SimilarWords
        if (!reply) {
            reply = "你在说什么";
        }
        this.msgDeal("./cat.jpg", reply, 1);
    },
   
    // 发起请求
sendRequest: function (url, data, method) {
        return new Promise((reslove, reject) => {
            wx.request({
                url: url,
                data: data,
                method: method,
                success: function (res) {
                    reslove(res.data)
                },
                fail(err) {
                    reject(err)
                }
            })
        })
    },

    msgDeal: function (avatarUrl, chat_content, msgType) {
        // 获取消息列表
        let chatLists = this.data.chatLists;
        chatLists.push({
            avatar_src: avatarUrl,
            chat_content: chat_content,
            msgType: msgType /* 1 代表 文字信息 2 代表 图片信息 */
        })
        // 更新消息列表
        this.setData({
            chatLists: chatLists,
            sendContent: ""
        })
    },
    // 添加资源按钮的事件: 控制模块显隐
    addFlag: function () {
        this.setData({
            addFlag: !this.data.addFlag,
            chat_con_height: this.data.chat_con_height == 100 ? 200 : 100
        })
    },
    getToken: function (client_id, client_secret) {
        return new Promise((reslove, reject) => {
            wx.request({
                url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
                method: "POST",
                header: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                success(res) {
                    reslove(res.data.access_token)
                }
            })
        })
    },
    getTextTuWen: function(token, base64Img){
        return new Promise((reslove, reject) =>{
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + token,
              method: "POST",
              header: {
                  "Content-Type" : "application/x-www-form-urlencoded"
              },
              data:{
                  image: base64Img
              },
              success(res){
                  reslove(res.data);

              }
            })
        })
    },
    getTuWen: async function(){
        let re = await this.chooseImg();
        let filePath = re.tempFilePaths[0];
        let base64Img = await this.getBase64(filePath);
        let token = await this.getToken("xNQ4aD05ULwn2W7yT3NQzIK4", "4ARB5OFHDdcBPX0rBGGqTCCkUAccZiEU");
        let Tuwen = await this.getTextTuWen(token, base64Img);

        console.log(token);
        
        console.log(Tuwen);
        
        this.msgDeal(app.globalData.userInfo.avatarUrl, filePath, 2)
        this.msgDeal("./cat.jpg", Tuwen.words_result[0].words, 1);
        this.setData({
            addFlag: !this.data.addFlag, // 将上拉的选项框 隐藏
            chat_con_height: this.data.chat_con_height == 100 ? 200 : 100
        })
    },
    getSentiment: async function () {
        let sendContent = this.data.sendContent;
        if (sendContent.trim() == "") {
            this.showToast("不能发送空内容")
            return;
        }
        this.msgDeal(app.globalData.userInfo.avatarUrl, sendContent, 1);
        let re = await this.sendRequest('http://127.0.0.1:7001/Sentiment', {
            words: sendContent
        }, "get")
        let reply = re.Sentiment
        if (!reply) {
            reply = "你在说什么";
        }
        this.msgDeal("./cat.jpg", reply, 1);
    },
    getKeywordsExtraction: async function () {
        // 获取自己发送的消息内容
        let sendContent = this.data.sendContent;
        if (sendContent.trim() == "") {
            // 内容提示
            this.showToast("不能发送空内容")
            return;
        }
        // 将自己发送的消息 添加至列表中
        this.msgDeal(app.globalData.userInfo.avatarUrl, sendContent, 1);

        // 如何得到回应
        // 将自己的消息发送至后端

        let re = await this.sendRequest('http://127.0.0.1:7001/KeywordsExtraction', {
            tens: sendContent
        }, "get")
        console.log(re)
        /*JSON.stringify(re.Keywords[0].Word)*/
        let reply = re.Keywords[0].Word
        if (!reply) {
            reply = "你在说什么";
        }
        this.msgDeal("./cat.jpg", reply, 1);
    },









    getTuPianSuZi: function (token, base64Img) {
        return new Promise((reslove, reject) => {
            wx.request({
                url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/numbers?access_token=' + token,
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    image: base64Img
                },
                success(res) {
                    console.log(res);
                    
                    reslove(res.data);
                }
            })
        })
    },
    getBase64: function (filePath) {
        return new Promise((reslove, reject) => {
            wx.getFileSystemManager().readFile({
                filePath: filePath,
                encoding: "base64",
                success(res) {
                    reslove(res.data);
                }
            })
        })
    },

    getImgInfo: function (token, base64Img) {
        return new Promise((reslove, reject) => {
            wx.request({
                url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient?access_token=' + token,
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    image: base64Img
                },
                success(res) {
                    reslove(res.data);
                }
            })
        })
    },
   

    getInfo: async function () {
        // 选择图片 获取图片地址
        let re = await this.chooseImg();
        let filePath = re.tempFilePaths[0];
        // 获取 base64 格式的图片
        let base64Img = await this.getBase64(filePath);
        // 获取token 码
        let token = await this.getToken("BaXCXTkx6TkWufRWSCXVHyme", "7C1P7vBDTyMtsePLREG2v4Yn5aD6AMMj");
        // 请求接口
        let imgInfo = await this.getImgInfo(token, base64Img);

        this.msgDeal(app.globalData.userInfo.avatarUrl, filePath, 2)

        // 回应 处理 返回数据
        this.msgDeal("./cat.jpg", imgInfo.result[0].name, 1);

        this.setData({
            addFlag: !this.data.addFlag, // 将上拉的选项框 隐藏
            chat_con_height: this.data.chat_con_height == 100 ? 200 : 100
        })
    },
    getSuZi: async function () {
        // 选择图片 获取图片地址
        let re = await this.chooseImg();
        let filePath = re.tempFilePaths[0];
        // 获取 base64 格式的图片
        let base64Img = await this.getBase64(filePath);
        // 获取token 码
        let token = await this.getToken("RjxvpCMaqQV1Ssz0BG9nFLQB", "kTcuheNVWd8wgGvbYolsS8zf2We33N8U");
        // 请求接口
        let TuPianSuZi = await this.getTuPianSuZi(token, base64Img);

        this.msgDeal(app.globalData.userInfo.avatarUrl, filePath, 2)
         
       let words =  this.dealTuPianSuZi(TuPianSuZi.words_result)
        // 回应 处理 返回数据
        this.msgDeal("./cat.jpg",words, 1);

        this.setData({
            addFlag: !this.data.addFlag, // 将上拉的选项框 隐藏
            chat_con_height: this.data.chat_con_height == 100 ? 200 : 100
        })
    },
    dealTuPianSuZi:function(words){
        let re = ""
        words.forEach(function(item){
            re+=item.words + " ";
        })
        return re;
        
    },







    chooseImg: function () {
        return new Promise((reslove, reject) => {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    reslove(res);
                }
            })
        })


    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取缓存的聊天记录 如果存在则 显示在界面上 否则 则显示默认的信息
        let chatLists = wx.getStorageSync('chatLists');
        if (chatLists) {
            this.setData({
                chatLists: chatLists
            })
        } else {
            this.setData({
                chatLists: [{
                    avatar_src: "./cat.jpg",
                    chat_content: "你好呀，我是羊仔",
                    msgType: 1 /* 1 代表 文字信息 2 代表 图片信息 */
                }]
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // 页面卸载前设置缓存信息
        wx.setStorageSync('chatLists', this.data.chatLists)

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})