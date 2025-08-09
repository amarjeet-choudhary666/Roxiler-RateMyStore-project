import { Prisma } from '@prisma/client';

// Database utility functions for pagination, sorting, and filtering

/**
 * Build pagination query object
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @returns Pagination object with skip and take
 */
export const buildPaginationQuery = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
};

/**
 * Build sort query object
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction (asc/desc)
 * @returns OrderBy object for Prisma
 */
export const buildSortQuery = (sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  if (!sortBy) return {};
  
  return {
    orderBy: {
      [sortBy]: sortOrder,
    },
  };
};

/**
 * Build user filter where clause
 * @param filters - Filter parameters
 * @returns Prisma where clause for User model
 */
export const buildUserWhereClause = (filters: {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
}): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};

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
    where.role = filters.role as any;
  }

  return where;
};

/**
 * Build store filter where clause
 * @param filters - Filter parameters
 * @returns Prisma where clause for Store model
 */
export const buildStoreWhereClause = (filters: {
  name?: string;
  address?: string;
  email?: string;
}): Prisma.StoreWhereInput => {
  const where: Prisma.StoreWhereInput = {};

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

/**
 * Build rating filter where clause
 * @param filters - Filter parameters
 * @returns Prisma where clause for Rating model
 */
export const buildRatingWhereClause = (filters: {
  storeId?: string;
  userId?: string;
  rating?: number;
}): Prisma.RatingWhereInput => {
  const where: Prisma.RatingWhereInput = {};

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

/**
 * Build search where clause for multiple fields
 * @param searchTerm - Search term
 * @param fields - Fields to search in
 * @returns Prisma where clause with OR conditions
 */
export const buildSearchWhereClause = (
  searchTerm: string,
  fields: string[]
): Record<string, any> => {
  if (!searchTerm || !fields.length) return {};

  const searchConditions = fields.map(field => ({
    [field]: {
      contains: searchTerm,
      mode: 'insensitive' as const
    }
  }));

  return {
    OR: searchConditions
  };
};

/**
 * Build date range filter
 * @param startDate - Start date
 * @param endDate - End date
 * @param field - Date field name (default: 'createdAt')
 * @returns Date range filter object
 */
export const buildDateRangeFilter = (
  startDate?: string | Date,
  endDate?: string | Date,
  field: string = 'createdAt'
) => {
  const dateFilter: any = {};

  if (startDate) {
    dateFilter.gte = new Date(startDate);
  }

  if (endDate) {
    dateFilter.lte = new Date(endDate);
  }

  if (Object.keys(dateFilter).length === 0) return {};

  return {
    [field]: dateFilter
  };
};

/**
 * Build numeric range filter
 * @param min - Minimum value
 * @param max - Maximum value
 * @param field - Numeric field name
 * @returns Numeric range filter object
 */
export const buildNumericRangeFilter = (
  min?: number,
  max?: number,
  field: string = 'rating'
) => {
  const numericFilter: any = {};

  if (min !== undefined) {
    numericFilter.gte = min;
  }

  if (max !== undefined) {
    numericFilter.lte = max;
  }

  if (Object.keys(numericFilter).length === 0) return {};

  return {
    [field]: numericFilter
  };
};

/**
 * Combine multiple where clauses with AND logic
 * @param clauses - Array of where clauses
 * @returns Combined where clause
 */
export const combineWhereClausesAnd = (clauses: any[]): any => {
  const validClauses = clauses.filter(clause => 
    clause && Object.keys(clause).length > 0
  );

  if (validClauses.length === 0) return {};
  if (validClauses.length === 1) return validClauses[0];

  return {
    AND: validClauses
  };
};

/**
 * Combine multiple where clauses with OR logic
 * @param clauses - Array of where clauses
 * @returns Combined where clause
 */
export const combineWhereClausesOr = (clauses: any[]): any => {
  const validClauses = clauses.filter(clause => 
    clause && Object.keys(clause).length > 0
  );

  if (validClauses.length === 0) return {};
  if (validClauses.length === 1) return validClauses[0];

  return {
    OR: validClauses
  };
};

/**
 * Build advanced sort with multiple fields
 * @param sortFields - Array of sort configurations
 * @returns OrderBy array for Prisma
 */
export const buildAdvancedSort = (sortFields: Array<{
  field: string;
  order: 'asc' | 'desc';
}>): any[] => {
  if (!sortFields || sortFields.length === 0) return [];

  return sortFields.map(({ field, order }) => ({
    [field]: order
  }));
};

/**
 * Calculate offset for cursor-based pagination
 * @param cursor - Cursor value
 * @param field - Cursor field name
 * @returns Cursor configuration
 */
export const buildCursorPagination = (cursor?: string, field: string = 'id') => {
  if (!cursor) return {};

  return {
    cursor: {
      [field]: cursor
    },
    skip: 1 // Skip the cursor item itself
  };
};