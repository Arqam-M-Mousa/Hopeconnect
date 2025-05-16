exports.HTTP_STATUS = {
    OK: 200, CREATED: 201, BAD_REQUEST: 400, UNAUTHORIZED: 401, NOT_FOUND: 404, SERVER_ERROR: 500
};
exports.handleError = (res, error) => {
    console.error('Operation failed:', error);
    return res.status(exports.HTTP_STATUS.SERVER_ERROR).json({
        message: "Server error", error: error.message
    });
};
