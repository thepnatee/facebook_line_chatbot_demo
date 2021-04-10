const functions = require('firebase-functions');
const request = require('request-promise');
const axios = require('axios');

const token = 'Bearer /rFeJHsIycsqz+XW1LLM4S5+Z+vDJgfdZ+i7kpbiGbHQ0o6zdEPr3pabd+OHdL2R46MtBOC/H3zIxvZhjupr3BWiKFS4vdQAHPap21U+nScrwXrF12MeOyDGfYnfp9NpO19J0kRfq733k3a2CWvBlwdB04t89/1O/w1cDnyilFU='

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
        uri: `https://graph.facebook.com/v10.0/242579006135737/feed?access_token=EAAGQFPzuZBZAgBAFniOZCeMW8mviaX2daCJirJToV80fjmZAFpnZCZB5bFiVEKB6ANTZCRJBiJOsoopcieuX4rOaLZC1UFQpilo45NiQeBro6RgCZC33pwRbFQE0fxb9UNJUDAE9vAG5ZBBFeV9v2YtNOw376D1wpZBcq30bb0iZCIOSHGErqZCjlTvLYZAxVZBuSSQnwM1mwk9VoK9YgZDZD&pretty=0&fields=picture%2Ccreated_time%2Cmessage%2Cvia&limit=25&before=QVFIUkJxWlFrMkRHTHBxZAW83WUp5ZAFZA2NHcyQXRmTEYtS3JWbFJLVUg2bWVKRXQxQWlfei16dERjSE1DWlV0RGdjWmpRZAWVZAcHU1dmw1ZA0FuSFRWNE5CelJicU5jcEZAQMVRqb0NpUDBnakdpd1pWNXRfWkpJSWkwcXFDWXlVWGlrWDRn`,
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