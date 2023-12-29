export interface IAnimeFavorite {
  id: string;
  stars: number;
  animeId: string;
  userId: string;
}

export class AnimeFavorite {
  private id: string;
  private stars: number;
  private animeId: string;
  private userId: string;

  constructor(data: IAnimeFavorite) {
    this.id = data.id;
    this.stars = data.stars;
    this.animeId = data.animeId;
    this.userId = data.userId;
  }

  get values(): IAnimeFavorite {
    return {
      id: this.id,
      stars: this.stars,
      animeId: this.animeId,
      userId: this.userId,
    };
  }
}

export class AnimeFavoriteFilter {
  private options: { userId?: string; animeId?: string };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options?: { userId?: string; animeId?: string };
    page: { limit: number; offset: number };
  }) {
    this.options = filters.options ?? {};
    this.page = filters.page;
  }

  get values() {
    const options: { userId?: string; animeId?: string } = {
      userId: this.options.userId,
      animeId: this.options.animeId,
    };

    return { options, page: this.page };
  }
}
