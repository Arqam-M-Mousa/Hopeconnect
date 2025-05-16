exports.DEFAULT_PAGE_SIZE = 10;

exports.getPaginationParams = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit), exports.DEFAULT_PAGE_SIZE);
    const offset = (page - 1) * limit;
    return {page, limit, offset};
};

exports.formatPaginatedResponse = (data, page, limit) => ({
    items: data.rows, totalPages: Math.ceil(data.count / limit), currentPage: page, totalItems: data.count
});
