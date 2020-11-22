'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
    async index() {
        const { ctx } = this;
        ctx.body = '这是我的chat路由';
    }

    async AIChat() {
        const { ctx } = this;
        // 接收小程序发送来的数据
        // get 提交的数据
        let query = ctx.request.query.msg;
        let reply = await ctx.service.chatService.reply(query);

        ctx.body = reply;

    }

    async SimilarWords(){
        const { ctx } = this;
        // 接收小程序发送来的数据
        // get 提交的数据
        let words = ctx.request.query.words;
        let SimilarWords = await ctx.service.chatService.getSimilarWords(words);      
        ctx.body = SimilarWords;
    }
    
    async Sentiment(){
        const { ctx } = this;
        // 接收小程序发送来的数据
        // get 提交的数据
        let words = ctx.request.query.words;
        let Sentiment= await ctx.service.chatService.getSentiment(words);

        ctx.body =Sentiment;
    }
    async KeywordsExtraction(){
        const { ctx } = this;
        // 接收小程序发送来的数据
        // get 提交的数据
        let tens = ctx.request.query.tens;
        let KeywordsExtraction= await ctx.service.chatService.getKeywordsExtraction(tens);

        ctx.body =KeywordsExtraction;
    }
}

module.exports = ChatController;