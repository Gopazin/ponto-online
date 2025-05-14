
import * as React from "react"
import { toast as sonnerToast } from "sonner"
import { genId } from "./toast-utils"
import { reducer } from "./toast-reducer"
import { initialState, State, ToasterToast, actionTypes } from "./types"
import { success, error, warning, info } from "./toast-convenience"

const listeners: Array<(state: State) => void> = []

let memoryState: State = initialState

function dispatch(action: any) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({
  title,
  description,
  variant,
  ...props
}: Omit<ToasterToast, "id"> & {
  variant?: "default" | "destructive"
}) {
  const id = genId()
  
  // Use sonner toast for actual display
  sonnerToast(title || description, {
    id,
    ...props,
  })

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })
  
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      id,
      title,
      description,
      variant: variant || "default",
      ...props,
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    toast,
    toasts: state.toasts,
    dismiss: (toastId?: string | number) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    sonnerToast,
  }
}

// Attach convenience methods to toast
toast.success = success;
toast.error = error;
toast.warning = warning;
toast.info = info;

export { toast }
