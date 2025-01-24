'use client'
import React from 'react'
import { useMutation } from 'react-query'
import { BASE_URL } from '@/constants/base-url'
import { useRouter } from 'next/navigation'
import { Task, taskSchema } from '@/schemas/task-schema'
import { Colors } from '@/components/colors'
import { useSetTaskData } from '@/hooks/use-set-task-data'
import { IoArrowBack } from 'react-icons/io5'

const Page: React.FC = () => {
  const [title, setTitle] = React.useState('')
  const [color, setColor] = React.useState<Task['color']>('red')
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const setTaskData = useSetTaskData()
  const createTaskMutation = useMutation({
    mutationFn: async (task: { title: string; color: Task['color'] }) => {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.log('error', errorData)
        setError(errorData.message)
        return
      }
      setTaskData.add(taskSchema.parse(await response.json()))
      router.push('/')
    },
  })

  return (
    <div className="flex flex-col items-center justify-start h-screen w-screen bg-slate-950 p-10">
      <main className="flex flex-col items-center justify-center w-full p-4 bg-slate-900 max-w-xl rounded-xl">
        <header className="flex w-full items-center relative px-4 justify-between ">
          <h1>Create Task</h1>
          <button
            className="border border-slate-700 p-2 rounded-lg bg-slate-800"
            onClick={() => router.push('/')}
          >
            <IoArrowBack />
          </button>
        </header>
        <form
          className="flex w-full flex-col items-start justify-center gap-4 p-4 text-slate-300"
          onSubmit={(e) => {
            e.preventDefault()
            createTaskMutation.mutate({
              title,
              color,
            })
          }}
        >
          <label htmlFor="title">Title</label>
          <input
            className="border border-slate-700 p-2 rounded-lg bg-slate-800 w-full"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Colors selectedColor={color} onClick={(color) => setColor(color)} />
          <div>{error ? <p className="text-red-500">{error}</p> : null}</div>
          <button
            className="w-full border-slate-800 p-2 rounded-lg bg-slate-700"
            type="submit"
            disabled={createTaskMutation.isLoading}
          >
            {createTaskMutation.isLoading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default Page
