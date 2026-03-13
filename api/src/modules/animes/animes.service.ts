import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Anime, AnimeDocument } from "./entities/anime.entity";
import { CreateAnimeDto, UpdateAnimeDto, AnimeQueryDto } from "./dto/anime.dto";

@Injectable()
export class AnimesService {
  constructor(
    @InjectModel(Anime.name) private animeModel: Model<AnimeDocument>,
  ) {}

  async findAll(query: AnimeQueryDto) {
    const filter: any = {};

    if (query.slug) {
      filter.slug = { $regex: query.slug };
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.tags) {
      const tagsArray = query.tags.split(",");
      filter["tags.slug"] = { $in: tagsArray };
    }

    const limit = query.limit || 25;
    const offset = query.offset || 0;

    const [data, total] = await Promise.all([
      this.animeModel
        .find(filter)
        .sort(
          query.sort?.createdAt
            ? {
                createdAt:
                  parseInt(query.sort.createdAt.toString()) === 1
                    ? "asc"
                    : "desc",
              }
            : {},
        )
        .limit(limit)
        .skip(offset)
        .exec(),
      this.animeModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: { total },
    };
  }

  async findOne(id: string): Promise<AnimeDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.animeModel.findById(id).exec();
  }

  async create(createAnimeDto: CreateAnimeDto): Promise<AnimeDocument> {
    const existing = await this.animeModel.findOne({
      slug: createAnimeDto.slug,
    });
    if (existing) {
      throw new ConflictException("Anime with this slug already exists");
    }

    const createdAnime = new this.animeModel({
      ...createAnimeDto,
      stars: createAnimeDto.stars || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
    return createdAnime.save();
  }

  async update(
    id: string,
    updateAnimeDto: UpdateAnimeDto,
  ): Promise<AnimeDocument> {
    const anime = await this.findOne(id);
    if (!anime) {
      throw new NotFoundException("Anime not found");
    }

    const { stars, ...updateData } = updateAnimeDto;

    if (stars) {
      const starField = `stars.${stars.star}`;
      const increment = stars.type === "increment" ? 1 : -1;
      await this.animeModel.updateOne(
        { _id: id },
        { $inc: { [starField]: increment } },
      );
    }

    Object.assign(anime, updateData);
    return anime.save();
  }
}
