import { QUERY_KEYS } from '@/constants/query-keys'
import { Task } from '@/schemas/task-schema'
import { useQueryClient } from 'react-query'

export const useSetTaskData = () => {
  const client = useQueryClient()

  const update = (id: string, update: Partial<Task>) => {
    client.setQueryData<Task[] | undefined>(QUERY_KEYS.tasks, (oldTasks) => {
      if (!oldTasks) {
        return []
      }
      return oldTasks.map((task) => {
        if (task.id === id) {
          return { ...task, ...update }
        }
        return task
      })
    })
  }

  const remove = (id: string) => {
    client.setQueryData<Task[] | undefined>(QUERY_KEYS.tasks, (oldTasks) => {
      if (!oldTasks) {
        return []
      }
      return oldTasks.filter((task) => task.id !== id)
    })
  }

  const add = (task: Task | undefined, providedIndex?: number) => {
    if (!task) {
      return
    }
    client.setQueryData<Task[] | undefined>(QUERY_KEYS.tasks, (oldTasks) => {
      if (!oldTasks) {
        return []
      }
      const index = providedIndex ?? oldTasks.length
      return [...oldTasks.slice(0, index), task, ...oldTasks.slice(index)]
    })
  }

  return {
    update,
    remove,
    add,
  }
}
