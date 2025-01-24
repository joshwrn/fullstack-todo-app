import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
  color: z.union([z.literal('red'), z.literal('green'), z.literal('blue')]),
  createdAt: z.date(),
})

export type Task = z.infer<typeof taskSchema>
