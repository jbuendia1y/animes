interface PaginateMeta {
  total: number;
}

export interface PaginateEndpoint<T = unknown> {
  data: T;
  meta: PaginateMeta;
}

export class Paginate<T = unknown> {
  private data: T;
  private meta: PaginateMeta;

  constructor(data: { data: T; meta: PaginateMeta }) {
    this.data = data.data;
    this.meta = data.meta;
  }

  get values() {
    return {
      data: this.data,
      meta: this.meta,
    };
  }
}
