const functions = require('firebase-functions');
const request = require('request-promise');
const axios = require('axios');

const token = 'Bearer xxxxxxx'

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': token
};

exports.Chatbot = functions.https.onRequest((request, response) => {

    let event = request.body.events[0]
    let message = event.message.text

    // https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects

    if (event.type === "message") {
        switch (event.message.type) {
            case 'text':
                if (message === 'สวัสดี') {
                    replyText(request);
                }else if (message === 'ข่าว') {
                    NewPost(request);
                }
                break;
            default:
                break;
        }

    }


});

const replyText = request => {
    return axios({
        method: 'post',
        url: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        data: JSON.stringify({
            replyToken: request.body.events[0].replyToken,
            messages: [{
                type: "text",
                text: request.body.events[0].message.text
            }]
        })
    });
};


const NewPost = res => {
    return request({
        method: `GET`,
        uri: `yyyy`,
        json: true
    }).then((response) => {
        const message = JSON.stringify(response.data[0])
        return push(res, message);
    }).catch((error) => {
        return res.status(500).send(error);
    });
}

const push = (res, msg) => {
    return axios({
        method: 'post',
        url: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        data: JSON.stringify({
            replyToken: res.body.events[0].replyToken,
            messages: [{
                type: "text",
                text: msg
            }]
        })
    });
}