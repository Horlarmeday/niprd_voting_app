import axios from 'axios'
import winston from 'winston'

const emailClientUrl = 'https://emailclienturl.com/send'

export async function sendMail({content, user}) {
    try {
        const response = await axios.post(emailClientUrl, { content, user });
        return response;
    } catch (e) {
        winston.error(e.message, e);
        return new Error('Message failed to send');
    }
}