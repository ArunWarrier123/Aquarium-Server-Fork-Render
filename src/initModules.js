import authModule from "./modules/auth/index.js";
import userModule from "./modules/user/index.js";
import adminModule from "./modules/admin/index.js";
import postModule from "./modules/post/index.js";
import notificationModule from "./modules/notification/index.js";
import tagModule from "./modules/hashtag/index.js";
import chatModule from "./modules/chat/index.js";
import locationInfoModule from "./modules/location-info/index.js";
import updateModule from "./modules/app_update/index.js";
import projectModule from "./modules/project/index.js";
import groupModule from "./modules/group/index.js";
import storyModule from "./modules/story/index.js";
import videoModule from "./modules/video/index.js";
import vendorModule from "./modules/vendor/index.js";
import categoryModule from "./modules/category/index.js";
import subcategoryModule from "./modules/subcategory/index.js";
import productModule from "./modules/product/index.js";

const initModules = (app) => {
  authModule.init(app);

  subcategoryModule.init(app);
  categoryModule.init(app);
  productModule.init(app);

  userModule.init(app);
  adminModule.init(app);
  tagModule.init(app);
  postModule.init(app);
  notificationModule.init(app);
  chatModule.init(app);
  locationInfoModule.init(app);
  updateModule.init(app);
  projectModule.init(app);
  groupModule.init(app);
  storyModule.init(app);
  videoModule.init(app);
  vendorModule.init(app);
};

export default initModules;
