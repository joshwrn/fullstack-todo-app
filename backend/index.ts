import express from 'express'
import cors from 'cors'
import { Prisma, PrismaClient, Task } from '@prisma/client'

const prisma = new PrismaClient()

const port = process.env.PORT || 8080

const app = express()
app.use(cors({ origin: 'http://localhost:3000' }), express.json())

app.get('/tasks', async (req, res) => {
  console.log('getting tasks')
  const tasks = await prisma.task.findMany()
  res.json(tasks)
})

app.post('/tasks', async (req, res) => {
  const task = req.body as Pick<Task, 'title' | 'color'>
  if (!task.title) {
    console.log('title is required')
    res.status(400).json({ message: 'Title is required' })
    return
  }
  if (!task.color) {
    console.log('color is required')
    res.status(400).json({ message: 'Color is required' })
    return
  }
  const newTask = await prisma.task.create({
    data: {
      description: '',
      completed: false,
      createdAt: new Date(),
      ...task,
    },
  })
  res.json(newTask)
  return
})

app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const { update } = req.body as { update: Prisma.TaskUpdateInput }
  if (!update.title) {
    res.status(400).json({ message: 'Title is required' })
    return
  }
  if (!update.color) {
    console.log('color is required')
    res.status(400).json({ message: 'Color is required' })
    return
  }
  const updatedTask = await prisma.task.update({
    where: { id },
    data: update,
  })
  res.json(updatedTask)
})

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const deletedTask = await prisma.task.delete({
    where: { id },
  })
  res.json(deletedTask)
})

app.listen(port, () => {
  console.log(`Tasks API listening on port ${port}`)
})
