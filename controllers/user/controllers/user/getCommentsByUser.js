import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET USER COMMENTS ///

const getCommentsByUser = catchAsyncError(async (req, res, next) => {
    let user, req_user;

    if (req.method == 'GET') {
        user = await models.User.findById(req.user._id).select("_id accountPrivacy");
        req_user = req.user;
    
        if (!user) {
            return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
        }
    } else if (req.method == 'POST') {
        let { userId } = req.body;

        if (!userId) {
            return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 404));
        }

        user = await models.User.findById(userId).select("_id accountPrivacy");
        req_user = user;
    
        if (!user) {
            return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
        }
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (user.accountPrivacy === "private") {
        const followingStatus = await utility.getFollowingStatus(req_user, user._id);
        const isSameUser = await utility.checkIfSameUser(req_user, user._id);
        if (followingStatus === "following" || isSameUser) {

            const comments = await models.Comment.find({
                user: user._id,
                commentStatus: "active",
            }).select("_id").sort({ createdAt: -1 });

            let totalComments = comments.length;
            let totalPages = Math.ceil(totalComments / limit);

            if (currentPage < 1) {
                currentPage = 1;
            }

            if (currentPage > totalPages) {
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

            const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`.split("?")[0];

            if (hasPrevPage) {
                prevPage = `${baseUrl}?page=${prevPageIndex}&limit=${limit}`;
            }

            if (hasNextPage) {
                nextPage = `${baseUrl}?page=${nextPageIndex}&limit=${limit}`;
            }

            const slicedComments = comments.slice(skip, skip + limit);

            const results = [];

            for (let commentId of slicedComments) {
                const commentData = await utility.getCommentData(commentId, req_user);

                if (commentData) {
                    results.push(commentData);
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

        } else {
            res.status(200).json({
                success: true,
                currentPage: 0,
                totalPages: 0,
                limit: 0,
                hasPrevPage: false,
                prevPage: null,
                hasNextPage: false,
                nextPage: null,
                results: [],
            });
        }
    } else {
        const comments = await models.Comment.find({
            user: user._id,
            commentStatus: "active",
        }).select("_id").sort({ createdAt: -1 });

        let totalComments = comments.length;
        let totalPages = Math.ceil(totalComments / limit);

        if (currentPage < 1) {
            currentPage = 1;
        }

        if (currentPage > totalPages) {
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

        const slicedComments = comments.slice(skip, skip + limit);

        const results = [];

        for (let commentId of slicedComments) {
            const commentData = await utility.getCommentData(commentId, req_user);

            if (commentData) {
                results.push(commentData);
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
    }
});

export default getCommentsByUser;
