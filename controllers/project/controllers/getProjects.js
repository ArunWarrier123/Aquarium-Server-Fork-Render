import models from "../../../models/index.js";
import utility from "../../../utils/utility.js";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../constants/responseMessages.js";

/// @route GET /api/v1/get-projects

const getProjects = catchAsyncError(async (req, res, next) => {
    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || ResponseMessages.NUMBER_OF_PAGES;

    const totalProjects = await models.Project.find({
        projectStatus: "active",
    }).countDocuments();

    let totalPages = Math.ceil(totalProjects / limit);

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

    const slicedProjects = await models.Project.find({
        projectStatus: "active",
    })
        .select("_id")
        .skip(skip)
        .limit(limit)
        .sort({
            viewsCount: -1,
            downloadsCount: -1,
            likesCount: -1,
            rating: -1,
            title: 1,
            createdAt: -1
        });

    const results = [];

    for (let project of slicedProjects) {
        const projectData = await utility.getProjectData(project._id);

        if (projectData) {
            results.push(projectData);
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

export default getProjects;