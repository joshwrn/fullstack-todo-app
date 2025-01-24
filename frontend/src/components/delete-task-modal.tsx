import { Modal } from './modal'
import React from 'react'
import { useSetTaskData } from '@/hooks/use-set-task-data'
import { useSearchParams } from 'next/navigation'
import { useMutation, useQueryClient } from 'react-query'
import { useQueryParams } from '@/hooks/use-query-params'
import { Task } from '@/schemas/task-schema'
import { BASE_URL } from '@/constants/base-url'
import { QUERY_KEYS } from '@/constants/query-keys'

export const DeleteTask: React.FC = () => {
  const id = useSearchParams().get('delete')
  const client = useQueryClient()
  const queryParams = useQueryParams()
  const tasks = client.getQueryData<Task[]>(QUERY_KEYS.tasks)
  const task = client
    .getQueryData<Task[]>(QUERY_KEYS.tasks)
    ?.find((task) => task.id === id)
  const setTaskData = useSetTaskData()

  const deleteTaskMutation = useMutation(
    ['deleteTask'],
    async (input: { id: string }) => {
      const taskToDelete = tasks?.find((task) => task.id === input.id)
      const taskIndex = tasks?.findIndex((task) => task.id === input.id)
      setTaskData.remove(input.id)
      try {
        await fetch(`${BASE_URL}/tasks/${input.id}`, {
          method: 'DELETE',
        })
        queryParams.push('delete', null)
      } catch (error) {
        setTaskData.add(taskToDelete, taskIndex)
        console.error(error)
      }
    }
  )

  if (!id || !task) {
    return null
  }
  return (
    <Modal onClose={() => {}}>
      <form className="flex flex-col items-center justify-center w-fit p-4 bg-slate-900 max-w-xl rounded-xl border border-slate-700">
        <header className="flex w-full items-center relative px-4 justify-between">
          <h2 className="text-slate-200">
            Are you sure you want to delete this task?
          </h2>
        </header>
        <footer className="flex w-full items-center justify-end gap-4 p-4 text-slate-300">
          <button
            className="border border-red-500 p-1 px-3 rounded-lg w-full bg-red-800"
            type="reset"
            onClick={(e) => {
              e.preventDefault()
              queryParams.push('delete', null)
            }}
          >
            Cancel
          </button>
          <button
            className="border border-blue-500 p-1 px-3 rounded-lg w-full bg-blue-700"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              deleteTaskMutation.mutate({ id })
            }}
          >
            Confirm
          </button>
        </footer>
      </form>
    </Modal>
  )
}
