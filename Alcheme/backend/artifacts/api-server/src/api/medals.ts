import { Router, type IRouter } from "express";
import { getAllBadgesWithCards } from "../models/supabase.js";
import { serverError } from "../utils/response.js";

const router: IRouter = Router();

router.get("/medals", async (req, res) => {
  try {
    const badgesWithCards = await getAllBadgesWithCards();

    const medals = badgesWithCards.map(({ badge, cards, ores }) => ({
      id: badge.id,
      text: badge.name,
      date: badge.created_at,
      tokenId: badge.token_id,
      description: badge.description,
      cards: cards.map((card) => ({
        id: card.id,
        text: card.name,
        date: card.created_at,
        ores: ores.map((ore) => ({
          date: new Date(ore.created_at).toLocaleDateString(),
          content: ore.content,
        })),
      })),
    }));

    res.json({ data: medals });
  } catch (err) {
    req.log.error({ err }, "Failed to get medals");
    serverError(res);
  }
});

export default router;
