import createGroup from "./group/createGroup.js";
import getGroups from "./group/getGroups.js";
import deleteGroup from "./group/deleteGroup.js";
import getGroupDetails from "./group/getGroupDetails.js";
import addToGroups from "./group/addToGroups.js";
import joinGroup from "./group/joinGroup.js";
import getAllGroups from "./group/getAllGroups.js";
import searchGroup from "./group/searchGroup.js";
import getPostsByUserGroups from "./group/getPostsByUserGroups.js";
import getStoriesByUserGroups from "./group/getStoriesByUserGroup.js";

const groupController = {};

groupController.createGroup = createGroup;
groupController.getGroups = getGroups;
groupController.searchGroup = searchGroup;
groupController.getAllGroups = getAllGroups;
groupController.deleteGroup = deleteGroup;
groupController.getGroupDetails = getGroupDetails;
groupController.addToGroups = addToGroups;
groupController.joinGroup = joinGroup;
groupController.getPostsByUserGroups = getPostsByUserGroups;
groupController.getStoriesByUserGroups = getStoriesByUserGroups;

export default groupController;
