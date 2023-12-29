import { z } from "../../deps.ts";

export const CreateIntlTextSchema = z.object({
  en: z.string().optional(),
  es: z.string().optional(),
  en_jp: z.string().optional(),
  ja_jp: z.string().optional(),
});

export type IntlText = z.infer<typeof CreateIntlTextSchema>;
