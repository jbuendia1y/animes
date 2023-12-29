import { Paginate, PaginateEndpoint } from "../models/paginate.model";

export const createPaginateAddapted = <T = unknown>(
  ed: PaginateEndpoint<T>
): Paginate<T> => {
  return new Paginate({
    data: ed.data,
    meta: {
      total: ed.meta.total,
    },
  });
};
