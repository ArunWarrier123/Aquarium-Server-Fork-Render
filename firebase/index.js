import admin from "firebase-admin";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({
        path: "src/config.env",
    });
}

// const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "");

const serviceAccount = {
    "type": "service_account",
    "project_id": "aquarium-community",
    "private_key_id": "aeff9152082cbc9c11c667460e99b4c0bac85054",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0lUi7zoGjzt+Y\n44361yGq/DGNNkAoG613+1y92pJ7ngF8dgIZ3VoZ3QKVetRMeRkCwWXJ/7AgFlrV\n4gSzj5I5EPmcW//v5Bt2nfM6S2EHv6pQpEsDQkgpDF+tU5XaH0N2wEu5QaRBEIfV\nCAtyLRxFtiRPvCjHFnc3il2pGFL0+f04DCNl51+XxM/6AWSmHAmm+zcH6QXqkN+9\nq5aJrSvIjANzUuQgNNXQT98Dm8oXwPVsG+8p5LcTEXBF+yfQe89qxyQrVxDMp8WJ\n+lKjhq2YzVVNjFfRPZu3lWXFxVWZ/c075q3wmkCxBY8XvmdhDkWIkzqhPRLjWa48\nZY370pzzAgMBAAECggEAM+3R8p/Zy99LkU2uoHmI5wCKx07YeDAtXBlefAIEqaOw\nTbgptoJezJ0vhwjBUBRqys4OlV3/qdqD2ImcTH520A4/mWUjXjq8YwnczeCrUG0f\nbv0vzQocciFqyg8FQqpG3jlCDU4BC+zTAsHDeNvcC3frTTqQh1/AfKo/cMbb5DIa\noXPH9oZp2QeFQPBxdpCL+xtX1wtw9/+Kf/my7/j+/dFPZEbrdWddkZJsd2pOFeMS\n/UJuyPMCFmcXmPd49xSr1k9Kr1Vlcx/AEr+zxW6ZRxALXwk08wi5gAoA+7VUSxAG\ngUHaPVb/irLaxB577s5t35k/kKz+ccLogvI7Ip0lQQKBgQD0UehZjZwz7O7R9ZgV\np+Ded8N8OLGU19pxaisZg2mIuLWHNCw0BPAaacG0KtKaxseZfGaQH2Kh5IRRR1jV\nTedCq7fl8X8NxWzc580oCKLe5GOoz1rqon9JKR/I2AVb5TwGb4Jia2z9viKqoXFQ\nRTYl6G5+g0RljOrhZwK3i1uo4wKBgQC9N1aLoIN06y1i8EHUIK3xutBYIa4OG/hH\nRAp1xnLQXccJqNQoDAQrLrLssIpMdulRf94RUrH3D55YZiDC1yhpD94jRGkvRvLs\n8kT8PePoDoJ4zjiLarTqTdyXY/Ol6n10vCQF+3KUyBeM6jw+5EgZWXclOrv4M4EN\nk2nDp7FIsQKBgQDSagBLsBQI/FMp6/PRIsYdktN/FmyKHeR5rM/1pyGqqDleeeZf\n3qjSdqZmfkLnHa8lVugV05Hkj6QNQ/8TpYY3+x/kHzonKBJ7pf8gLV/nypax+fL5\nBH3PCmXfWXw0CpbJjBukm5RAbBH7FhM66ICb4TPYLUEonFZlTYwfexuztQKBgBAr\nx5C9Uh7O7p0TDX00ockT/zRZBIgeKdTlYsN4B135dcZEkIUvqbeLES2bVOZ+Dyiw\n9eijGaSUyCKj787XFpQMEB8RfK/Wr3JCrlSkcXLmso3iigCYSQfxSZYCq9MVPE2a\nurVsLPm8NA8OAcIaPnM0KzOaVnA67p+bZqGbFlKxAoGBAKVGbYoIUGV7wqI3kfHC\nB7v3GQanOgjGTef2sswXThx0uKlh5YcGQ73AkG57UrduHuuV23lian66OHZzFqSR\nOBASZJzZL3+Ef7lqGcU42WzzAUuD2Xuxo3oYw6g1vv7hqR/NZvXd7FRssnIJtSRD\nPTpRn8jqpNSH1O4SpP77W4kQ\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ofa5v@aquarium-community.iam.gserviceaccount.com",
    "client_id": "100514089675675640935",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ofa5v%40aquarium-community.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const fcm = admin.messaging(app);

export const verifyToken = async (token) => {
    try {
        await fcm.send({ token }, true);
        return true;
    }
    catch (err) {
        console.log(err.message);
        return false;
    }
};

export const sendNotification = async (token,
    {
        title = "",
        body = "",
        type = "",
        image = "",
    }
) => {

    const isValid = await verifyToken(token);

    if (!isValid) return;

    const message = {
        data: {
            title,
            body,
            type,
            image,
        },
        token,
    };

    try {
        const response = await fcm.send(message);
        console.log("[firebase] successfully sent message:", response);
        return response;
    } catch (err) {
        console.log("[firebase] error sending message:", err.message);
        return err;
    }
}

export const sendNotificationToTopic = async (topic, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        topic,
    };

    try {
        const response = await fcm.send(message);
        return response;
    } catch (err) {
        return err;
    }
}

export const subscribeToTopic = async (token, topic) => {
    try {
        const response = await fcm.subscribeToTopic(token, topic);
        return response;
    } catch (err) {
        return err;
    }
}

export const unsubscribeFromTopic = async (token, topic) => {
    try {
        const response = await fcm.unsubscribeFromTopic(token, topic);
        return response;
    } catch (err) {
        return err;
    }
}

export const sendNotificationToMultipleTokens = async (tokens, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        tokens,
    };

    try {
        const response = await fcm.sendMulticast(message);
        return response;
    } catch (err) {
        return err;
    }
}

export const sendNotificationToMultipleTopics = async (topics, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        topics,
    };

    try {
        const response = await fcm.sendMulticast(message);
        return response;
    } catch (err) {
        return err;
    }
}


