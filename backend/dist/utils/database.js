"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCursorPagination = exports.buildAdvancedSort = exports.combineWhereClausesOr = exports.combineWhereClausesAnd = exports.buildNumericRangeFilter = exports.buildDateRangeFilter = exports.buildSearchWhereClause = exports.buildRatingWhereClause = exports.buildStoreWhereClause = exports.buildUserWhereClause = exports.buildSortQuery = exports.buildPaginationQuery = void 0;
const buildPaginationQuery = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return {
        skip,
        take: limit,
    };
};
exports.buildPaginationQuery = buildPaginationQuery;
const buildSortQuery = (sortBy, sortOrder = 'asc') => {
    if (!sortBy)
        return {};
    return {
        orderBy: {
            [sortBy]: sortOrder,
        },
    };
};
exports.buildSortQuery = buildSortQuery;
const buildUserWhereClause = (filters) => {
    const where = {};
    if (filters.name) {
        where.name = {
            contains: filters.name,
            mode: 'insensitive',
        };
    }
    if (filters.email) {
        where.email = {
            contains: filters.email,
            mode: 'insensitive',
        };
    }
    if (filters.address) {
        where.address = {
            contains: filters.address,
            mode: 'insensitive',
        };
    }
    if (filters.role) {
        where.role = filters.role;
    }
    return where;
};
exports.buildUserWhereClause = buildUserWhereClause;
const buildStoreWhereClause = (filters) => {
    const where = {};
    if (filters.name) {
        where.name = {
            contains: filters.name,
            mode: 'insensitive',
        };
    }
    if (filters.address) {
        where.address = {
            contains: filters.address,
            mode: 'insensitive',
        };
    }
    if (filters.email) {
        where.email = {
            contains: filters.email,
            mode: 'insensitive',
        };
    }
    return where;
};
exports.buildStoreWhereClause = buildStoreWhereClause;
const buildRatingWhereClause = (filters) => {
    const where = {};
    if (filters.storeId) {
        where.storeId = filters.storeId;
    }
    if (filters.userId) {
        where.userId = filters.userId;
    }
    if (filters.rating) {
        where.rating = filters.rating;
    }
    return where;
};
exports.buildRatingWhereClause = buildRatingWhereClause;
const buildSearchWhereClause = (searchTerm, fields) => {
    if (!searchTerm || !fields.length)
        return {};
    const searchConditions = fields.map(field => ({
        [field]: {
            contains: searchTerm,
            mode: 'insensitive'
        }
    }));
    return {
        OR: searchConditions
    };
};
exports.buildSearchWhereClause = buildSearchWhereClause;
const buildDateRangeFilter = (startDate, endDate, field = 'createdAt') => {
    const dateFilter = {};
    if (startDate) {
        dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
        dateFilter.lte = new Date(endDate);
    }
    if (Object.keys(dateFilter).length === 0)
        return {};
    return {
        [field]: dateFilter
    };
};
exports.buildDateRangeFilter = buildDateRangeFilter;
const buildNumericRangeFilter = (min, max, field = 'rating') => {
    const numericFilter = {};
    if (min !== undefined) {
        numericFilter.gte = min;
    }
    if (max !== undefined) {
        numericFilter.lte = max;
    }
    if (Object.keys(numericFilter).length === 0)
        return {};
    return {
        [field]: numericFilter
    };
};
exports.buildNumericRangeFilter = buildNumericRangeFilter;
const combineWhereClausesAnd = (clauses) => {
    const validClauses = clauses.filter(clause => clause && Object.keys(clause).length > 0);
    if (validClauses.length === 0)
        return {};
    if (validClauses.length === 1)
        return validClauses[0];
    return {
        AND: validClauses
    };
};
exports.combineWhereClausesAnd = combineWhereClausesAnd;
const combineWhereClausesOr = (clauses) => {
    const validClauses = clauses.filter(clause => clause && Object.keys(clause).length > 0);
    if (validClauses.length === 0)
        return {};
    if (validClauses.length === 1)
        return validClauses[0];
    return {
        OR: validClauses
    };
};
exports.combineWhereClausesOr = combineWhereClausesOr;
const buildAdvancedSort = (sortFields) => {
    if (!sortFields || sortFields.length === 0)
        return [];
    return sortFields.map(({ field, order }) => ({
        [field]: order
    }));
};
exports.buildAdvancedSort = buildAdvancedSort;
const buildCursorPagination = (cursor, field = 'id') => {
    if (!cursor)
        return {};
    return {
        cursor: {
            [field]: cursor
        },
        skip: 1
    };
};
exports.buildCursorPagination = buildCursorPagination;
