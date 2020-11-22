'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 新建了一个路由  http://127.0.0.1:7001/chat
  router.get('/chat', controller.chat.index);
  // 闲聊
  router.get('/AIChat', controller.chat.AIChat);
  // 相似词
  router.get('/SimilarWords', controller.chat.SimilarWords);
  // 要求写出 实体信息查询 接口 目标 前后端打通
  //情感分析
  router.get('/Sentiment',controller.chat.Sentiment);
  router.get('/KeywordsExtraction',controller.chat.KeywordsExtraction);
  
};
