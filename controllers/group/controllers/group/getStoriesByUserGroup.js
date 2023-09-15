import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// GET STORIES BY USER GROUPS ///

const getStoriesByUserGroups = catchAsyncError(async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));
  }

  const user = await models.User.findById(userId);

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 400));
  }

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || ResponseMessages.NUMBER_OF_PAGES;

  let allStories = [];

  for (const groupId of user.groups) {
    const group = await models.Group.findById(groupId);

    if (!group) return next(new ErrorHandler(ResponseMessages.GROUP_NOT_FOUND, 404));

    const stories = await models.Story.find({
      groupId: group._id,
      storyStatus: 'active',
    });

    for (const story of stories) {
      allStories.push(story);
    }
  }

  let totalPages = Math.ceil(allStories.length / limit);

  if (totalPages <= 0) {
    totalPages = 1;
  }

  if (currentPage <= 1) {
    currentPage = 1;
  }

  if (totalPages > 1 && currentPage > totalPages) {
    currentPage = totalPages;
  }

  let skip = (currentPage - 1) * limit;

  let prevPageIndex = null;
  let hasPrevPage = false;
  let prevPage = null;
  let nextPageIndex = null;
  let hasNextPage = false;
  let nextPage = null;

  if (currentPage < totalPages) {
    nextPageIndex = currentPage + 1;
    hasNextPage = true;
  }

  if (currentPage > 1) {
    prevPageIndex = currentPage - 1;
    hasPrevPage = true;
  }

  const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl
    }`.split("?")[0];

  if (hasPrevPage) {
    prevPage = `${baseUrl}?page=${prevPageIndex}&limit=${limit}`;
  }

  if (hasNextPage) {
    nextPage = `${baseUrl}?page=${nextPageIndex}&limit=${limit}`;
  }
  
  const slicedAllStories = [];

  allStories = allStories.slice(skip, limit * currentPage);

  for (const story of allStories) {
    const storyData = await utility.getStoryData(story._id, req.user);

    if (storyData) {
      slicedAllStories.push(storyData);
    }
  }

  slicedAllStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    success: true,
    currentPage,
    totalPages,
    limit,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    slicedAllStories,
  });
});

export default getStoriesByUserGroups;
