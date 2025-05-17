const {Review} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');


exports.postReview = async (req, res) => {
    try {
        const newReview = await Review.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Review created successfully", review: newReview
        });
    } catch (error) {
        handleError(res, error);
    }
}

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Review not found"});
        }
        await review.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "Review deleted successfully"
        });
    }catch (error) {
        handleError(res, error);
    }
}

exports.updateReview = async (req , res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Review not found"});
        }
        await review.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: "Review updated successfully", review
        });
    }catch (error) {
        handleError(res, error);
    }
}

exports.getReviews = async (req , res) => {
    try{
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Review.findAndCountAll({
            limit, offset, order: [["createdAt", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Reviews not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    }catch (error) {
        handleError(res, error);
    }
}

exports.getReviewById = async (req , res) => {
 try{
     const review = await Review.findByPk(req.params.id);

     if (!review) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Review not found"});
     }

     res.status(HTTP_STATUS.OK).json(review);
 }catch (error) {
     handleError(res, error);
 }
}