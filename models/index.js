import LoginInfo from "./login-info/loginInfo.js";
import User from "./user/User.js";
import BlockedUser from "./user/BlockedUser.js";
import Notification from "./notification/notification.js";
import Article from "./article/Article.js";
import Comment from "./comment/Comment.js";
import CommentLike from "./comment/CommentLike.js";
import CommentReply from "./comment/CommentReply.js";
import CommentReplyLike from "./comment/CommentReplyLike.js";
import Otp from "./otp/Otp.js";
import Tag from "./tag/tag.js";
import PostLike from "./article/PostLike.js";
import Follower from "./user/Follower.js";
import FollowRequest from "./requests/followRequest.js";
import ChatMessage from "./chat/ChatMessage.js";
import FcmToken from "./user/FcmToken.js";
import PreKeyBundle from "./user/PreKeyBundle.js";
import FeedbackReport from "./reports/feedbackReport.js";
import PostReport from "./reports/PostReport.js";
import StoryReport from "./reports/storyReport.js";
import CommentReport from "./reports/CommentReport.js";
import CommentReplyReport from "./reports/CommentReplyReport.js";
import UserReport from "./reports/UserReport.js";
import AppIssueReport from "./reports/AppIssueReport.js";
import VerificationRequest from "./requests/VerificationRequest.js";
import AuthToken from "./user/AuthToken.js";
import PollVote from "./article/PollVote.js";
import PollOption from "./article/PollOption.js";
import PostMedia from "./media/PostMedia.js";
import Project from "./project/Project.js";
import ProjectScreenshot from "./media/ProjectScreenshot.js";
import Community from "./community/Community.js";
import Story from "./story/Story.js";
import StoryLike from "./story/StoryLike.js";
import Conference from "./video/Conference.js";
import VideoNotification from "./video/VideoNotification.js";
import Vendor from "./vendor/Vendor.js";
import Rating from "./storeratings/storeratings.js";
import Category from "./category/category.js";
import SubCategory from "./subcategory/subCategory.js";
import Product from "./product/Product.js";
import VendorProduct from "./vendorproduct/vendor_product.js";
import VendorOrder from "./vendororder/vendor_order.js";

const models = {};

models.Category = Category
models.SubCategory = SubCategory
models.Product = Product

models.Comment = Comment;
models.CommentLike = CommentLike;
models.CommentReply = CommentReply;
models.CommentReplyLike = CommentReplyLike;

models.PostMedia = PostMedia;

models.OTP = Otp;

models.Tag = Tag;

models.Post = Article;
models.PostLike = PostLike;
models.PollOption = PollOption;
models.PollVote = PollVote;

models.AuthToken = AuthToken;
models.User = User;
models.BlockedUser = BlockedUser;
models.LoginInfo = LoginInfo;
models.Follower = Follower;
models.FcmToken = FcmToken;
models.PreKeyBundle = PreKeyBundle;

models.Notification = Notification;

models.ChatMessage = ChatMessage;

models.FeedbackReport = FeedbackReport;
models.PostReport = PostReport;
models.StoryReport = StoryReport;
models.CommentReport = CommentReport;
models.CommentReplyReport = CommentReplyReport;
models.UserReport = UserReport;
models.AppIssueReport = AppIssueReport;

models.FollowRequest = FollowRequest;
models.VerificationRequest = VerificationRequest;

models.Project = Project;
models.ProjectScreenshot = ProjectScreenshot;

models.Group = Community;

models.Story = Story;
models.StoryLike = StoryLike;

models.Conference = Conference;
models.VideoNotification = VideoNotification;


models.Vendor = Vendor
models.VendorProduct = VendorProduct
models.VendorOrder = VendorOrder
models.Rating = Rating

export default models;
