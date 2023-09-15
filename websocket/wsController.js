import cloudinary from "cloudinary";
import models from "../models/index.js";
import eventTypes from "./eventTypes.js";
import {
    sendNotification
} from "../firebase/index.js";
// import {
//     escapeRegex
// } from '../modules/video/controllers/common/helper.js';
import utility from "../utils/utility.js";
// import strings from '../modules/video/controllers/config/app.config.js';
import ResponseMessages from "../constants/responseMessages.js";

// const HTTPS = process.env.WS_HTTPS.toLowerCase() === 'true';
// const APP_HOST = process.env.WS_APP_HOST;

const wsController = async (ws, message, wssClients, req) => {
    const {
        type,
        payload
    } = JSON.parse(message);

    const client = wssClients.find((client) => client.userId === ws.userId);

    if (!client) {
        ws.send(
            JSON.stringify({
                success: false,
                type: 'error',
                message: ResponseMessages.CLIENT_NOT_CONNECTED,
            })
        );
        ws.close();
        return;
    }

    switch (type) {
        case eventTypes.SEND_MESSAGE:
            try {
                const {
                    message,
                    receiverId,
                    mediaFile,
                    replyTo,
                } = payload;

                if ((!message && !mediaFile) || !receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                if (receiverId === ws.userId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CANNOT_MESSAGE_YOURSELF
                    }));
                }

                if (mediaFile) {
                    if (!mediaFile.public_id) {
                        return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
                    }
                    if (!mediaFile.url) {
                        return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
                    }
                    if (!mediaFile.mediaType) {
                        return next(new ErrorHandler(ResponseMessages.MEDIA_TYPE_REQUIRED, 400));
                    }
                    if (mediaFile.mediaType === "video" && !mediaFile.thumbnail) {
                        return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_REQUIRED, 400));
                    }

                    if (mediaFile.mediaType === "video" && !mediaFile.thumbnail.public_id) {
                        return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_PUBLIC_ID_REQUIRED, 400));
                    }

                    if (mediaFile.mediaType === "video" && !mediaFile.thumbnail.url) {
                        return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_URL_REQUIRED, 400));
                    }
                }

                const chatMessage = await models.ChatMessage.create({
                    message: message,
                    sender: ws.userId,
                    receiver: receiverId,
                    mediaFile: mediaFile,
                    replyTo: replyTo,
                });

                const chatMessageData = await utility.getChatData(chatMessage._id);

                const fcmToken = await models.FcmToken.findOne({
                        user: receiverId
                    })
                    .select("token");

                if (fcmToken) {
                    let name = `${chatMessageData.sender.fname} ${chatMessageData.sender.lname}`;
                    await sendNotification(
                        fcmToken.token, {
                            title: name,
                            body: name + " sent you a message.",
                            type: "Chats",
                            image: chatMessageData.sender.avatar.url,
                        }
                    );
                }

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'send-message',
                        message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                        data: chatMessageData
                    }));

                    chatMessage.delivered = true;
                    chatMessage.deliveredAt = Date.now();
                    await chatMessage.save();
                }

                const updatedChatMessageData = await utility.getChatData(chatMessage._id);

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'send-message',
                        message: ResponseMessages.CHAT_MESSAGE_SENT_SUCCESS,
                        data: updatedChatMessageData,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_NOT_SENT,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.GET_UNDELIVERED_MESSAGES:
            try {
                const receiverId = ws.userId;

                if (!receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const messages = await models.ChatMessage.find({
                    receiver: receiverId,
                    delivered: false,
                }).sort({
                    createdAt: -1
                });

                let totalMessages = messages.length;

                if (totalMessages > 0) {

                    for (let i = 0; i < totalMessages; i++) {
                        const chatMessageData = await utility.getChatData(messages[i]._id);
                        client.send(JSON.stringify({
                            success: true,
                            type: 'get-undelivered-messages',
                            message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                            data: chatMessageData
                        }));

                        messages[i].delivered = true;
                        messages[i].deliveredAt = Date.now();
                        await messages[i].save();
                    }
                }
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGES_NOT_RECEIVED,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.READ_MESSAGE:
            try {
                const {
                    messageId
                } = payload;

                if (!messageId) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.INVALID_DATA
                        })
                    );
                }

                const message = await models.ChatMessage.findById(messageId);

                if (!message) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CHAT_MESSAGE_NOT_FOUND
                        })
                    );
                }

                if (message.receiver.toString() !== ws.userId.toString()) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.UNAUTHORIZED
                        })
                    );
                }

                if (message.seen) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CHAT_MESSAGE_ALREADY_READ
                        })
                    );
                }

                message.seen = true;
                message.seenAt = Date.now();
                await message.save();

                const chatMessageData = await utility.getChatData(message._id);

                let senderId = message.sender.toHexString();

                const sender = wssClients.find(
                    (client) => client.userId === senderId
                );

                if (sender) {
                    sender.send(JSON.stringify({
                        success: true,
                        type: 'read-message',
                        message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                        data: chatMessageData
                    }));
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'read-message',
                        message: ResponseMessages.CHAT_MESSAGE_READ_SUCCESS,
                        data: chatMessageData,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_READ_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.DELETE_MESSAGE:
            try {
                const {
                    messageId
                } = payload;

                if (!messageId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));

                }

                const message = await models.ChatMessage.findById(messageId);
                const receiverId = message.receiver.toHexString();

                if (!message) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_NOT_FOUND
                    }));
                }

                if (message.sender.toString() !== ws.userId.toString()) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.UNAUTHORIZED
                    }));
                }

                if (message.mediaFile && message.mediaFile.public_id && message.mediaFile.public_id !== '') {
                    let publicId = message.mediaFile.public_id;
                    let mediaType = message.mediaFile.mediaType;

                    if (mediaType === "video") {
                        let thumbnailPublicId = message.mediaFile.thumbnail.public_id;
                        if (thumbnailPublicId) {
                            await cloudinary.v2.uploader.destroy(thumbnailPublicId);
                        }
                        await cloudinary.v2.uploader.destroy(publicId, {
                            resource_type: "video"
                        });
                    } else {
                        await cloudinary.v2.uploader.destroy(publicId);
                    }
                }

                await message.remove();

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'delete-message',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                        messageId: messageId,
                    }));
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'delete-message',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                        messageId: messageId,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.DELETE_MESSAGES:
            try {
                const {
                    messageIds
                } = payload;

                if (!messageIds || messageIds.length === 0) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const messages = await models.ChatMessage.find({
                    _id: {
                        $in: messageIds
                    }
                });

                if (!messages || messages.length === 0) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_NOT_FOUND
                    }));
                }

                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i];
                    const receiverId = message.receiver.toHexString();

                    if (message.sender.toString() !== ws.userId.toString()) {
                        return ws.send(JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.UNAUTHORIZED
                        }));
                    }

                    if (message.mediaFile && message.mediaFile.public_id && message.mediaFile.public_id !== '') {
                        let publicId = message.mediaFile.public_id;
                        let mediaType = message.mediaFile.mediaType;

                        if (mediaType === "video") {
                            let thumbnailPublicId = message.mediaFile.thumbnail.public_id;
                            if (thumbnailPublicId) {
                                await cloudinary.v2.uploader.destroy(thumbnailPublicId);
                            }
                            await cloudinary.v2.uploader.destroy(publicId, {
                                resource_type: "video"
                            });
                        } else {
                            await cloudinary.v2.uploader.destroy(publicId);
                        }
                    }

                    await message.remove();

                    const receiver = wssClients.find(
                        (client) => client.userId === receiverId
                    );

                    if (receiver) {
                        receiver.send(JSON.stringify({
                            success: true,
                            type: 'delete-messages',
                            message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                            messageId: message._id,
                        }));
                    }

                    client.send(
                        JSON.stringify({
                            success: true,
                            type: 'delete-messages',
                            message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                            messageId: message._id,
                        })
                    );
                }
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.MESSAGE_TYPING:
            try {
                const {
                    receiverId,
                    status
                } = payload;

                if (!receiverId || !status) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'message-typing',
                        message: ResponseMessages.CHAT_MESSAGE_TYPING,
                        data: {
                            senderId: ws.userId,
                            status: status
                        }
                    }));
                }
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_TYPING_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.GET_ONLINE_USERS:
            try {
                let currentUser = await models.User.findById(ws.userId)
                    .select("showOnlineStatus");

                if (currentUser.showOnlineStatus === false) {
                    return;
                }

                const onlineUsers = wssClients
                    .filter(client => client.userId !== ws.userId)
                    .map(client => client.userId);

                ws.send(JSON.stringify({
                    success: true,
                    type: 'get-online-users',
                    message: ResponseMessages.ONLINE_USERS,
                    data: onlineUsers
                }));
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.ONLINE_USERS_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.CHECK_ONLINE_USERS:
            try {
                const {
                    userIds
                } = payload;

                if (!userIds || userIds.length === 0) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                let currentUser = await models.User.findById(ws.userId)
                    .select("showOnlineStatus");

                if (currentUser.showOnlineStatus === false) {
                    return;
                }

                for (let i = 0; i < userIds.length; i++) {
                    const userId = userIds[i];

                    let user = await models.User.findById(userId)
                        .select("showOnlineStatus");

                    if (user.showOnlineStatus === true) {
                        let onlineUser = wssClients.find(
                            (client) => client.userId === userId
                        );

                        if (onlineUser) {
                            client.send(
                                JSON.stringify({
                                    success: true,
                                    type: 'check-online-users',
                                    message: "user online",
                                    data: {
                                        userId: userId,
                                        status: "online",
                                    },
                                })
                            );
                        }
                    }
                }

            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.ONLINE_USERS_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.START_CONFERENCE:
                let {
                    title,
                    description,
                    mode,
                    isPrivate,
                    isLive,
                    speaker,
                    members,
                    broadcastedAt
                } = payload;

                if (speaker !== client.userId) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.SPEAKER_NOT_AUTHENTICATED,
                        })
                    );
                    break;
                }

                if (!title) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CONFERENCE_TITLE_REQUIRED,
                        })
                    );
                    break;
                }

                if (!description) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CONFERENCE_DESCRIPTION_REQUIRED,
                        })
                    );
                    break;
                }

                if (!mode) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CONFERENCE_MODE_REQUIRED,
                        })
                    );
                    break;
                }

                if (!speaker) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.SPEAKER_ID_REQUIRED,
                        })
                    );
                    break;
                }

                if (!members) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.MEMBERS_REQUIRED,
                        })
                    );
                    break;
                }

                if (!broadcastedAt) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.BROADCASTED_AT_REQUIRED,
                        })
                    );
                    break;
                }

                const conference = await models.Conference.create({
                    title: title,
                    description: description,
                    mode: mode,
                    speaker: speaker,
                    isPrivate: isPrivate !== undefined ? isPrivate : true,
                    isLive: isLive !== undefined ? isLive : true,
                    broadcastedAt: broadcastedAt
                });

                members = members.split(',');

                for (const memberId of members) {
                    const member = await models.User.findById(memberId).select("_id");

                    if (!member) {
                        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 400));
                    }

                    const userInConference = await models.Conference.find({
                        "_id": conference._id,
                        "members": {
                            $in: [member._id]
                        }
                    });

                    if (userInConference.length !== 0) {
                        return next(new ErrorHandler(ResponseMessages.USER_ALREADY_EXISTS_IN_CONFERENCE, 400));
                    }

                    conference.members.push(member._id);
                    await conference.save();
                }

                // const conferenceData = await utility.getConferenceData(conference._id, req.user);

                for (const memberId of members) {
                    const receiver = wssClients.find(
                        (client) => client.userId === memberId
                    );

                    if (receiver) {
                        receiver.send(JSON.stringify({
                            success: true,
                            type: 'start-conference',
                            mode: mode,
                            senderId: speaker,
                            receiverId: memberId,
                            conference: conference,
                            message: `${ResponseMessages.CONFERENCE_STARTED} ${client.fname} ${client.lname}`,
                        }));
                    }
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'start-conference',
                        mode: mode,
                        senderId: speaker,
                        receiverId: members,
                        conference: conference,
                        message: ResponseMessages.CONFERENCE_CREATE_SUCCESS,
                    })
                );
            break;

        case eventTypes.ACCEPT_CONFERENCE:
            try {
                const {
                    conferenceId,
                    receiverId,
                    mode
                } = payload;

                if (!conferenceId) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CONFERENCE_ID_REQUIRED,
                        })
                    );
                    break;
                }

                await models.Conference.updateOne({
                    _id: conferenceId
                }, {
                    isAccepted: true,
                    isRejected: false
                });

                const user = await models.User.findById(receiverId);

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'accept-conference',
                        mode: mode,
                        senderId: client.userId,
                        receiverId: receiverId,
                        message: `${ResponseMessages.CONFERENCE_ACCEPTED} by ${user.fname} ${user.lname}.`,
                    }));
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'accept-conference',
                        mode: mode,
                        senderId: client.userId,
                        receiverId: receiverId,
                        message: `${ResponseMessages.CONFERENCE_ACCEPTED} by ${user.fname} ${user.lname}.`,
                    })
                );

            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: err,
                    })
                );
            }
            break;

        case eventTypes.REJECT_CONFERENCE:
            try {
                const {
                    receiverId,
                    conferenceId,
                    mode
                } = payload;

                if (!conferenceId) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CONFERENCE_ID_REQUIRED,
                        })
                    );
                    break;
                }

                await models.Conference.updateOne({
                    _id: conferenceId
                }, {
                    isLive: false,
                    isRejected: true,
                    isAccepted: false,
                });

                const user = await models.User.findById(receiverId);

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'reject-conference',
                        mode: mode,
                        senderId: client.userId,
                        receiverId: receiverId,
                        message: `${ResponseMessages.CONFERENCE_REJECTED} by ${user.fname} ${user.lname}.`,
                    }));
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'reject-conference',
                        mode: mode,
                        senderId: client.userId,
                        receiverId: receiverId,
                        message: `${ResponseMessages.CONFERENCE_REJECTED} by ${user.fname} ${user.lname}.`,
                    })
                );

            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: err,
                    })
                );
            }
            break;

        case eventTypes.END_CONFERENCE:
            try {
                const {
                    conferenceId,
                    receiverId,
                    mode
                } = payload;

                if (!conferenceId) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CONFERENCE_ID_REQUIRED,
                        })
                    );
                    break;
                }

                await models.Conference.updateOne({
                    _id: conferenceId
                }, {
                    isLive: false,    
                    finishedAt: Date.now()
                });

                // strings.setLanguage(user.language);

                // const conferenceUrl = `${'http' + (HTTPS ? 's' : '') + ':\/\/' + APP_HOST}/conference?c=${conference._id}`;

                // const linkRegex = escapeRegex(conference._id.toString());
                // const messageRegex = escapeRegex(strings.CONFERENCE_NOTIFICATION_CLOSED);

                // const videoNotification = await models.VideoNotification.findOne({
                //     $and: [{
                //         user: user._id
                //     }, {
                //         $and: [{
                //             message: {
                //                 $regex: messageRegex,
                //                 $options: 'i'
                //             }
                //         }, {
                //             link: {
                //                 $regex: linkRegex,
                //                 $options: 'i'
                //             }
                //         }]
                //     }]
                // });

                // if (!videoNotification) {
                //     const data = {
                //         user: user._id,
                //         isRequest: false,
                //         message: `${speaker.fname} ${speaker.lname} ${strings.CONFERENCE_NOTIFICATION_CLOSED} '${conference.title}'.`,
                //         isLink: true,
                //         link: conferenceUrl
                //     }

                //     await models.VideoNotification.create(data);
                // }

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'end-conference',
                        mode: mode,
                        senderId: client.userId,
                        receiverId: receiverId,
                        message: ResponseMessages.CONFERENCE_ENDED,
                    }));
                }
                
                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'end-conference',
                        mode: mode,
                        senderId: client.userId,
                        receiverId: receiverId,
                        message: ResponseMessages.CONFERENCE_ENDED,
                    })
                );

            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: err,
                    })
                );
            }
            break;

        default:
            ws.send(
                JSON.stringify({
                    success: false,
                    type: 'error',
                    message: ResponseMessages.INVALID_ACTION,
                })
            );
            break;
    }
};

export default wsController;