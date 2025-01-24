'use client'
import { useMutation, useQuery } from 'react-query'
import Link from 'next/link'
import { BASE_URL } from '@/constants/base-url'
import { Task } from '@/schemas/task-schema'
import { GoTrash as TrashIcon } from 'react-icons/go'
import { useSetTaskData } from '../hooks/use-set-task-data'
import { useQueryParams } from '../hooks/use-query-params'
import { EditTask } from '../components/edit-task-modal'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { returnColor } from '@/components/colors'
import { QUERY_KEYS } from '@/constants/query-keys'
import { DeleteTask } from '@/components/delete-task-modal'
import { format } from 'date-fns'

export default function Home() {
  const setTaskData = useSetTaskData()
  const queryParams = useQueryParams()
  const searchParams = useSearchParams()
  const query = useQuery<Task[]>(
    QUERY_KEYS.tasks,
    async () => {
      const response = await fetch(`${BASE_URL}/tasks`)
      return await response.json()
    },
    {
      staleTime: Infinity,
      refetchOnMount: true,
    }
  )

  const completeTaskMutation = useMutation(
    ['completeTask'],
    async (input: { id: string; newValue: boolean }) => {
      setTaskData.update(input.id, { completed: input.newValue })
      try {
        await fetch(`${BASE_URL}/tasks/${input.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ update: { completed: input.newValue } }),
        })
      } catch (error) {
        setTaskData.update(input.id, { completed: !input.newValue })
        console.error(error)
      }
    }
  )

  return (
    <div className="flex flex-col items-center justify-start h-screen w-screen bg-slate-950 p-10">
      <main className="flex flex-col items-center justify-center w-full p-4 bg-slate-900 max-w-xl rounded-xl">
        <header className="flex w-full items-center relative px-4 justify-between ">
          <h1>Todo List</h1>
          <Link
            href="/create-task"
            className="border border-slate-700 p-2 rounded-lg bg-slate-800"
          >
            <button>
              <p className="text-slate-300 text-sm">Create Task</p>
            </button>
          </Link>
        </header>
        <section className="flex w-full flex-col items-center justify-center gap-4 p-4 text-slate-300">
          {searchParams.get('id') && <EditTask />}
          {searchParams.get('delete') && <DeleteTask />}
          {query.data?.map((task) => (
            <div
              className="flex w-full border border-slate-700 p-2 rounded-lg bg-slate-800 cursor-pointer gap-2 items-center"
              key={task.id}
              onClick={() => {
                queryParams.push('id', task.id)
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onClick={(e) => {
                  e.stopPropagation()
                }}
                onChange={() => {
                  completeTaskMutation.mutate({
                    id: task.id,
                    newValue: !task.completed,
                  })
                }}
                className="cursor-pointer"
              />
              <div
                className={clsx(
                  returnColor(task.color),
                  `w-2 h-2 rounded-full ml-2`
                )}
              />
              {task.title}
              <p className="ml-auto text-xs">
                {format(task.createdAt, 'MM/dd/yyyy')}
              </p>
              <button
                className="rounded-full hover:bg-slate-900 p-1"
                onClick={(e) => {
                  e.stopPropagation()
                  queryParams.push('delete', task.id)
                }}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
