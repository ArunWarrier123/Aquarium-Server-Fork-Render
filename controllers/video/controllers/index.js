import getConference from "./conference/getConference.js";
import getConferences from "./conference/getConferences.js";
import addMember from "./conference/addMember.js";
import removeMember from "./conference/removeMember.js";

import markAsRead from "./videoNotification/markAsRead.js";
import markAllAsRead from "./videoNotification/markAllAsRead.js";
import markAsUnRead from "./videoNotification/markAsUnRead.js";
import getNotification from "./videoNotification/getNotification.js";
import deleteNotification from "./videoNotification/deleteNotification.js";
import deleteAll from "./videoNotification/deleteAll.js";

const videoController = {};

// Conferences
videoController.getConference = getConference;
videoController.getConferences = getConferences;

videoController.addMember = addMember;
videoController.removeMember = removeMember;

// Video Notifications
videoController.markAsRead = markAsRead;
videoController.markAllAsRead = markAllAsRead;
videoController.markAsUnRead = markAsUnRead;
videoController.getNotification = getNotification;
videoController.deleteNotification = deleteNotification;
videoController.deleteAll = deleteAll;

export default videoController;
