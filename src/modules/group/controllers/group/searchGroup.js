import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route GET /api/v1/search-group

const searchGroup = catchAsyncError(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorHandler(ResponseMessages.SEARCH_QUERY_REQUIRED, 400));
  }

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || ResponseMessages.NUMBER_OF_PAGES;

  const totalGroups = await models.Group.find(
    {
      $or: [
        {
          groupName: new RegExp(q, "gi"),
        },
      ],
    }).select("_id groupName").countDocuments();

  let totalPages = Math.ceil(totalGroups / limit);

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

  const slicedGroups = await models.Group.find(
    {
      $or: [
        {
          groupName: new RegExp(q, "gi"),
        },
      ],
    }).select("_id groupName createdAt")
    .sort({ groupName: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  res.status(200).json({
    success: true,
    currentPage,
    totalPages,
    limit,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    slicedGroups,
  });
});

export default searchGroup;
