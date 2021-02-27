import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import { Context, AuthorizedContext } from "./context";

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(-180)
  @Max(180)
  @Field((_type) => Float)
  longitude!: number;
}

@InputType()
class BoundsInput {
  @Field((_type) => CoordinatesInput)
  sw!: CoordinatesInput;

  @Field((_type) => CoordinatesInput)
  ne!: CoordinatesInput;
}
@InputType()
class StallInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => Int)
  bedrooms!: number;
}

@ObjectType()
class Stall {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => String)
  publicId(): string {
    const parts = this.image.split("/");
    return parts[parts.length - 1];
  }

  @Field((_type) => Int)
  bedrooms!: number;

  @Field((_type) => [Stall])
  async nearby(@Ctx() ctx: Context) {
    const bounds = getBoundsOfDistance(
      { latitude: this.latitude, longitude: this.longitude },
      10000
    );

    return ctx.prisma.stall.findMany({
      where: {
        latitude: { gte: bounds[0].latitude, lte: bounds[1].latitude },
        longitude: { gte: bounds[0].longitude, lte: bounds[1].longitude },
        id: { not: { equals: this.id } },
      },
      take: 25,
    });
  }
}

@Resolver()
export class StallResolver {
  @Query((_returns) => Stall, { nullable: true })
  async stall(@Arg("id") id: string, @Ctx() ctx: Context) {
    return await ctx.prisma.stall.findOne({ where: { id: parseInt(id, 10) } });
  }
  @Query((_returns) => [Stall], { nullable: false })
  async stalls(@Arg("bounds") bounds: BoundsInput, @Ctx() ctx: Context) {
    return ctx.prisma.stall.findMany({
      where: {
        latitude: { gte: bounds.sw.latitude, lte: bounds.ne.latitude },
        longitude: { gte: bounds.sw.longitude, lte: bounds.ne.longitude },
      },
      take: 50,
    });
  }
  @Authorized()
  @Mutation((_returns) => Stall, { nullable: true })
  async createStall(
    @Arg("input") input: StallInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    return await ctx.prisma.stall.create({
      data: {
        userId: ctx.uid,
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Stall, { nullable: true })
  async updateStall(
    @Arg("id") id: string,
    @Arg("input") input: StallInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    const stallId = parseInt(id, 10);
    const stall = await ctx.prisma.stall.findOne({ where: { id: stallId } });

    if (!stall || stall.userId !== ctx.uid) return null;

    return await ctx.prisma.stall.update({
      where: { id: stallId },
      data: {
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
      },
    });
  }
  @Authorized()
  @Mutation((_returns) => Boolean, { nullable: false })
  async deleteStall(
    @Arg("id") id: string,
    @Ctx() ctx: AuthorizedContext
  ): Promise<boolean> {
    const stallId = parseInt(id, 10);
    const stall = await ctx.prisma.stall.findOne({ where: { id: stallId } });

    if (!stall || stall.userId !== ctx.uid) return false;

    await ctx.prisma.stall.delete({
      where: { id: stallId },
    });
    return true;
  }
}
