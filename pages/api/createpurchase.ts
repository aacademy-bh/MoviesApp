import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function purchase(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token) {
    const userDetails: any = jwtDecode(req.query.token as string);
    const movies = req.body.moviesIDs || [];
    let discountAmount = 0;

    const purchased = (
      await prisma.purchases.findMany({
        where: {
          OR: movies.map((movieId: string) => ({
            moviesIDs: { has: movieId },
          })),
          userID: userDetails.id,
        },
      })
    ).flatMap(({ moviesIDs }) => moviesIDs);

    const isPurchasedBefore = !!purchased;

    const toBePurchased = movies.filter(
      (id: string) => !purchased.includes(id)
    );

    if (req.body.discountCode) {
      const data = await prisma.discount.findFirstOrThrow({
        where: {
          code: req.body.discount,
        },
      });

      if (data) {
        discountAmount = req.body.amount / (data.amount * 100);
      }
    }

    const data = await prisma.purchases.create({
      data: {
        moviesIDs: toBePurchased,
        amount: req.body.amount - discountAmount,
        user: {
          connect: {
            id: userDetails.id,
          },
        },
      },
    });
    try {
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  }
}
