const Service = require('egg').Service;

// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");

const NlpClient = tencentcloud.nlp.v20190408.Client;

const clientConfig = {
    credential: {
        secretId: "AKIDub3arw4Rt4zFH2e2LPBh04rMrVt0tYz9",
        secretKey: "3tvikhU1lXB3f16wFK8zgAWxhDVZSQAk",
    },
    region: "ap-guangzhou",
    profile: {
        httpProfile: {
            endpoint: "nlp.tencentcloudapi.com",
        },
    },
};

class chatService extends Service {
    async reply(query) {


        const client = new NlpClient(clientConfig);
        const params = {
            "Query": query
        };
        let replay = new Promise(function (resolve, reject) {
            client.ChatBot(params).then(
                (data) => {
                    resolve(data);
                },
                (err) => {
                    reject(err);
                }
            );
        })

        return replay;
    }

    async getSimilarWords(words) {

        const client = new NlpClient(clientConfig);
        const params = {
            "Text": words
        };
        let re = new Promise(function (resolve, reject) {
            client.SimilarWords(params).then(
                (data) => {
                    resolve(data);
                },
                (err) => {
                    reject(err);
                }
            );
        })
        return re;
    }
    async  getSentiment(words) {
        const client = new NlpClient(clientConfig);
        const params = {
            "Text": words
        };
        let er = new Promise(function (resolve, reject) {
            client.SentimentAnalysis(params).then(
                (data) => {
                    resolve(data);
                },
                (err) => {
                    reject("error", err);
                }
            );
        })
        return er;
    }
    async  getKeywordsExtraction(tens) {
        const client = new NlpClient(clientConfig);
        const params = {
            "Text": tens
        };
        let res = new Promise(function (resolve, reject) {
            client.KeywordsExtraction(params).then(
                (data) => {
                    resolve(data);
                },
                (err) => {
                    reject("error", err);
                }
            );
        })
        return res;
    }
}

module.exports = chatService;