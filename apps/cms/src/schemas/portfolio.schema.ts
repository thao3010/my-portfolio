import { z } from 'zod';



export const portfolioFormSchema = z.object({

  displayName: z.string().max(120),

  headline: z.string().max(200),

  summary: z.string().max(5000),

  isPublished: z.boolean(),

});



export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;


