'use strict';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as line from '@line/bot-sdk'
import {buildReplyText} from 'line-message-builder'
import {phrase} from './phrase'

// channel secretとaccess tokenをFirebaseの環境変数から呼び出す
const config = {
    channelSecret: functions.config().channel.secret as string,
    channelAccessToken: functions.config().channel.accesstoken as string
};



const app = express();
//URL + /webhookで登録したWebhook URLが呼び出されたときに実行される。
app.post('/webhook', line.middleware(config as line.MiddlewareConfig), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((error) => res.json(error));
});

const client = new line.Client(config as line.ClientConfig);
//ユーザから受け取ったイベントについてのハンドリングを実装する
function handleEvent(event:line.MessageEvent) {
    switch (event.message.type) {
        case 'text':
            switch(event.message.text) {
                case '水星':
                    return client.replyMessage(event.replyToken, buildReplyText(phrase.mercury) as line.Message);
                case '金星':
                    return client.replyMessage(event.replyToken, buildReplyText(phrase.venus) as line.Message);
                case '地球':
                    return client.replyMessage(event.replyToken, buildReplyText(phrase.earth) as line.Message);
                case '火星':
                    return client.replyMessage(event.replyToken, buildReplyText(phrase.mars) as line.Message);
            }
    }
    return Promise.resolve(null);
}

exports.app = functions.https.onRequest(app);
