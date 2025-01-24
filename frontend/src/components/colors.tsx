import { Task } from '@/schemas/task-schema'
import clsx from 'clsx'
import React from 'react'

export const returnColor = (color: Task['color']) => {
  switch (color) {
    case 'red':
      return 'bg-red-500'
    case 'green':
      return 'bg-green-500'
    case 'blue':
      return 'bg-blue-500'
    default:
      return ''
  }
}

export const Colors: React.FC<{
  selectedColor: Task['color']
  onClick: (color: Task['color']) => void
}> = ({ selectedColor, onClick }) => {
  return (
    <>
      <label htmlFor="color">Color</label>
      <div className="flex w-full items-center justify-between gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className={clsx(
              `w-full p-2 rounded-lg`,
              returnColor(color),
              color !== selectedColor ? 'opacity-50' : ''
            )}
            onClick={(e) => {
              e.preventDefault()
              onClick(color)
            }}
          >
            {color}
          </button>
        ))}
      </div>
    </>
  )
}
const COLORS: Task['color'][] = ['blue', 'green', 'red']
