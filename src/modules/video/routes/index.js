import {
  Router
} from "express";
import authMiddleware from "../../../middlewares/auth.js";
import videoController from "../controllers/index.js";

const videoRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

// Authenticated Routes -------------------------------------------------------

// CONFERENCES

videoRouter
  .route("/get-conference")
  .get(isAuthenticatedUser, videoController.getConference);

videoRouter
  .route("/get-conferences")
  .get(isAuthenticatedUser, videoController.getConferences);

videoRouter
  .route("/add-member-to-conference")
  .post(isAuthenticatedUser, videoController.addMember);

videoRouter
  .route("/remove-member-from-conference")
  .post(isAuthenticatedUser, videoController.removeMember);
  
// VIDEO NOTIFICATIONS

videoRouter
  .route("/mark-vn-as-read")
  .get(
    isAuthenticatedUser,
    videoController.markAsRead
  );

videoRouter
  .route("/mark-all-vn-as-read")
  .get(
    isAuthenticatedUser, 
    videoController.markAllAsRead
  );

videoRouter
  .route("/mark-vn-as-unread")
  .get(
    isAuthenticatedUser, 
    videoController.markAsUnRead
  );

videoRouter
  .route("/get-video-notification")
  .get(
    isAuthenticatedUser, 
    videoController.getNotification
  );

videoRouter
  .route("/delete-video-notification")
  .delete(
    isAuthenticatedUser, 
    videoController.deleteNotification
  );

videoRouter
  .route("/delete-all-video-notifications")
  .delete(
    isAuthenticatedUser, 
    videoController.deleteAll
  );
  
export default videoRouter;
