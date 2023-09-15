import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// GET STORIES ///

const getStories = catchAsyncError(async (req, res, next) => {
  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || ResponseMessages.NUMBER_OF_PAGES;

  const followings = await models.Follower.find({ follower: req.user._id })
    .select("_id user");

  const followingIds = followings.map((u) => u.user);

  followingIds.push(req.user._id);

  const totalStories = await models.Story.find({
    owner: { $in: followingIds },
    storyStatus: "active",
  }).countDocuments();

  let totalPages = Math.ceil(totalStories / limit);

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

  const slicedStories = await models.Story.find({
    owner: { $in: followingIds },
    storyStatus: "active",
  })
    .select("_id")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const results = [];

  for (let story of slicedStories) {
    const storyData = await utility.getStoryData(story._id, req.user);

    if (storyData) {
      results.push(storyData);
    }
  }

  res.status(200).json({
    success: true,
    currentPage,
    totalPages,
    limit,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    results,
  });
});

export default getStories;
