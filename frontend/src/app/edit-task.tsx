import React from 'react'
import { useSetTaskData } from '../hooks/use-set-task-data'
import { useSearchParams } from 'next/navigation'
import { FloatingPortal } from '@floating-ui/react'
import { useMutation, useQueryClient } from 'react-query'
import { Task } from '@/schemas/task-schema'
import { BASE_URL } from '@/constants/base-url'
import { useQueryParams } from '../hooks/use-query-params'
import { Colors } from '@/components/colors'

export const EditTask: React.FC = () => {
  const id = useSearchParams().get('id')
  const setTaskData = useSetTaskData()
  const client = useQueryClient()
  const queryParams = useQueryParams()
  const task = client
    .getQueryData<Task[]>(['tasks'])
    ?.find((task) => task.id === id)
  const taskRef = React.useRef({ ...task })

  const resetTask = () => {
    if (!id || !taskRef.current) {
      return
    }
    setTaskData.update(id, taskRef.current)
  }

  const updateTaskMutation = useMutation(
    ['updateTask'],
    async (updates: Partial<Task>) => {
      try {
        if (!task || !id) {
          throw new Error('Task not found')
        }
        await fetch(`${BASE_URL}/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            update: updates,
          }),
        })
        queryParams.push('id', null)
      } catch (error) {
        console.error(error)
        resetTask()
      }
    }
  )

  if (!task || !id) {
    queryParams.push('id', null)
    return null
  }

  return (
    <FloatingPortal>
      <div className="fixed top-0 left-0 w-screen h-screen z-10 flex flex-col items-center justify-center">
        <div
          className="absolute flex w-full h-full bg-slate-600 -z-10 opacity-50 backdrop-blur-md"
          onClick={() => {
            resetTask()
            queryParams.push('id', null)
          }}
        />
        <form className="flex flex-col items-center justify-center w-full p-4 bg-slate-900 max-w-xl rounded-xl border border-slate-700">
          <header className="flex w-full items-center relative px-4 justify-between">
            <p className="text-slate-200">Edit Task</p>
          </header>
          <section className="flex w-full flex-col items-between justify-center gap-4 p-4 text-slate-300">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => {
                setTaskData.update(id, { title: e.target.value })
              }}
              className="border border-slate-700 p-2 rounded-lg bg-slate-800"
            />
            <Colors
              selectedColor={task.color}
              onClick={(color) => {
                setTaskData.update(id, { color })
              }}
            />
          </section>
          <footer className="flex w-full items-center justify-end gap-4 p-4 text-slate-300">
            <button
              className="border border-red-500 p-1 px-3 rounded-lg bg-red-800"
              type="reset"
              onClick={(e) => {
                e.preventDefault()
                resetTask()
                queryParams.push('id', null)
              }}
            >
              Cancel
            </button>
            <button
              className="border border-blue-500 p-1 px-3 rounded-lg bg-blue-700"
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                updateTaskMutation.mutate(task)
              }}
            >
              Save
            </button>
          </footer>
        </form>
      </div>
    </FloatingPortal>
  )
}
