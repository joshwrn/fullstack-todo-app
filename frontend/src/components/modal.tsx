import { FloatingPortal } from '@floating-ui/react'
import React from 'react'

export const Modal: React.FC<{
  children: React.ReactNode
  onClose: () => void
}> = ({ children, onClose }) => {
  return (
    <FloatingPortal>
      <div className="fixed top-0 left-0 w-screen h-screen z-10 flex flex-col items-center justify-center">
        <div
          className="absolute flex w-full h-full bg-slate-600 -z-10 opacity-50 backdrop-blur-md"
          onClick={() => {
            onClose()
          }}
        />
        {children}
      </div>
    </FloatingPortal>
  )
}
