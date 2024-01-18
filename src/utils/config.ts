import { z } from "zod";

const schema = z.object({
  TMDB_URL: z.string(),
  TMDB_TOKEN: z.string(),
});

export const env = schema.parse(process.env);
