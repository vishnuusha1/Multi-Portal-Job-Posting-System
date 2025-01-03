

/**
 * Builds query options for pagination, sorting, and searching.
 * 
 * @param {Object} queryParams - The query parameters from the request.
 * @param {Array} searchFields - The fields to search within.
 * @returns {Object} The query options for Sequelize.
 */
const buildQueryOptions = (queryParams) => {
  const page = parseInt(queryParams.page) || 1; 
  const pageSize = parseInt(queryParams.pageSize) || 10; 
  const order = queryParams.order === 'desc' ? 'DESC' : 'ASC';
  const field = queryParams.field || 'createdAt';
  const search = queryParams.search || '';

  const queryOptions = {
    search: search, 
    order: [[field, order]],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };

  return queryOptions;
};

module.exports = buildQueryOptions;
