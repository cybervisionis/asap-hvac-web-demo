export type SortOrder = 'asc' | 'desc';

export interface ListQueryOptions {
  filterable?: string[];
  sortable?: string[];
  defaultSort?: string;
  defaultSortOrder?: SortOrder;
  defaultLimit?: number;
  maxLimit?: number;
}

export interface ListQuery {
  filters: Record<string, string[]>;
  sort?: { field: string; order: SortOrder };
  pagination: { page: number; limit: number; offset: number };
}

export interface ListMeta {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface ListResult<T> {
  items: T[];
  meta: ListMeta;
}

export type RawQuery = Record<string, undefined | string | string[] | number | boolean>;

const normalizeParam = (value: RawQuery[string]): string[] => {
  if (value === undefined) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

export function parseListQuery(raw: RawQuery, options: ListQueryOptions = {}): ListQuery {
  const { filterable = [], sortable = [], defaultSort, defaultSortOrder = 'asc', defaultLimit = 25, maxLimit = 100 } = options;

  const pageRaw = normalizeParam(raw.page)[0];
  const limitRaw = normalizeParam(raw.limit)[0];

  const page = Math.max(1, pageRaw ? Number.parseInt(pageRaw, 10) || 1 : 1);
  const limit = Math.min(maxLimit, Math.max(1, limitRaw ? Number.parseInt(limitRaw, 10) || defaultLimit : defaultLimit));

  const filters: Record<string, string[]> = {};
  filterable.forEach((key) => {
    const values = normalizeParam(raw[key]);
    if (values.length > 0) {
      filters[key] = values;
    }
  });

  const sortRaw = normalizeParam(raw.sort)[0];
  let sort: ListQuery['sort'];

  if (sortRaw) {
    const [field, orderPart] = sortRaw.split(':');
    const order = orderPart?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    if (sortable.includes(field)) {
      sort = { field, order };
    }
  } else if (defaultSort && sortable.includes(defaultSort)) {
    sort = { field: defaultSort, order: defaultSortOrder };
  }

  return {
    filters,
    sort,
    pagination: {
      page,
      limit,
      offset: (page - 1) * limit
    }
  };
}

const matchesFilter = (value: unknown, expected: string[]): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => expected.includes(String(entry)));
  }

  return expected.includes(String(value));
};

export function applyListQuery<T extends object>(items: T[], query: ListQuery): ListResult<T> {
  const { filters, sort, pagination } = query;

  let filteredItems = items;
  Object.entries(filters).forEach(([field, expected]) => {
    filteredItems = filteredItems.filter((item) => matchesFilter((item as Record<string, unknown>)[field], expected));
  });

  if (sort) {
    const { field, order } = sort;
    filteredItems = [...filteredItems].sort((a, b) => {
      const aRecord = a as Record<string, unknown>;
      const bRecord = b as Record<string, unknown>;
      const aValue = aRecord[field];
      const bValue = bRecord[field];

      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      return 0;
    });
  }

  const total = filteredItems.length;
  const start = pagination.offset;
  const end = start + pagination.limit;
  const pagedItems = filteredItems.slice(start, end);

  return {
    items: pagedItems,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      hasNextPage: end < total
    }
  };
}
