import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  points: z.array(z.object({
    x: z.number(),
    y: z.number(),
  })).length(5),
})

export const addStudentSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  points: z.array(z.object({
    x: z.number(),
    y: z.number(),
  })).length(5),
})

export const addVideoSchema = z.object({
  url: z.string().url(),
  chapter: z.string().min(1).max(100),
})

export const addTaskSchema = z.object({
  title: z.string().min(1).max(255),
  assignedTo: z.number().optional(),
})

export const updateTaskSchema = z.object({
  id: z.number(),
  completed: z.boolean(),
})

