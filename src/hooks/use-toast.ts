
import * as React from "react"
import { toast as sonnerToast, type ToastT, type ExternalToast } from "sonner"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastT & {
  id: string | number
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string | number, ReturnType<typeof setTimeout>>()

const initialState: State = {
  toasts: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // If no toast id, dismiss all
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
          })),
        }
      }

      // Find the toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t } : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action

      // If no toast id, remove all
      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      // Find the toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = initialState

function dispatch(action: Action) {
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

// Métodos de conveniência para o toast
const success = (message: string) => {
  sonnerToast.success(message);
  return toast({ 
    title: "Sucesso",
    description: message,
    variant: "default" 
  });
};

const error = (message: string) => {
  sonnerToast.error(message);
  return toast({ 
    title: "Erro",
    description: message,
    variant: "destructive" 
  });
};

const warning = (message: string) => {
  sonnerToast.warning(message);
  return toast({ 
    title: "Aviso",
    description: message,
    variant: "default" 
  });
};

const info = (message: string) => {
  sonnerToast.info(message);
  return toast({ 
    title: "Informação",
    description: message,
    variant: "default" 
  });
};

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

// Adiciona os métodos de conveniência ao objeto toast
toast.success = success;
toast.error = error;
toast.warning = warning;
toast.info = info;

export { toast }
