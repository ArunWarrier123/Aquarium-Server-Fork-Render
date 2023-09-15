import authModule from "./controllers/auth/index.js";
import userModule from "./controllers/user/index.js";
import adminModule from "./controllers/admin/index.js";
import postModule from "./controllers/post/index.js";
import notificationModule from "./controllers/notification/index.js";
import tagModule from "./controllers/hashtag/index.js";
import chatModule from "./controllers/chat/index.js";
import locationInfoModule from "./controllers/location-info/index.js";
import updateModule from "./controllers/app_update/index.js";
import projectModule from "./controllers/project/index.js";
import groupModule from "./controllers/group/index.js";
import storyModule from "./controllers/story/index.js";
import videoModule from "./controllers/video/index.js";
import vendorModule from "./controllers/vendor/index.js";
import categoryModule from "./controllers/category/index.js";
import subcategoryModule from "./controllers/subcategory/index.js";
import productModule from "./controllers/product/index.js";

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
