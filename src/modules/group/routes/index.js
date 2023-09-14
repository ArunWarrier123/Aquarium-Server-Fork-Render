import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import groupController from "../controllers/index.js";

const groupRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

// Authenticated Routes -------------------------------------------------------

groupRouter
  .route("/create-group")
  .post(
    isAuthenticatedUser,
    groupController.createGroup
  );

groupRouter
  .route("/get-groups")
  .get(isAuthenticatedUser, groupController.getGroups);

groupRouter
  .route("/search-group")
  .get(isAuthenticatedUser, groupController.searchGroup);

groupRouter
  .route("/get-all-groups")
  .get(isAuthenticatedUser, groupController.getAllGroups);

groupRouter
  .route("/group")
  .get(isAuthenticatedUser, groupController.getGroupDetails)
  .delete(isAuthenticatedUser, groupController.deleteGroup);
// .put(isAuthenticatedUser, groupController.updateGroup)

groupRouter
  .route("/add-to-groups")
  .post(isAuthenticatedUser, groupController.addToGroups);

groupRouter
  .route("/join-groups")
  .get(isAuthenticatedUser, groupController.joinGroup)
  .post(isAuthenticatedUser, groupController.joinGroup);

groupRouter
  .route("/get-posts-by-user-groups")
  .get(isAuthenticatedUser, groupController.getPostsByUserGroups);

groupRouter
  .route("/get-stories-by-user-groups")
  .get(isAuthenticatedUser, groupController.getStoriesByUserGroups);

export default groupRouter;
