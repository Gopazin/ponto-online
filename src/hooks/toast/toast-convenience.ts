
import { toast as sonnerToast } from "sonner"
import { toast } from "./use-toast"

// Convenience methods for toast
export const success = (message: string) => {
  sonnerToast.success(message);
  return toast({ 
    title: "Sucesso",
    description: message,
    variant: "default" 
  });
};

export const error = (message: string) => {
  sonnerToast.error(message);
  return toast({ 
    title: "Erro",
    description: message,
    variant: "destructive" 
  });
};

export const warning = (message: string) => {
  sonnerToast.warning(message);
  return toast({ 
    title: "Aviso",
    description: message,
    variant: "default" 
  });
};

export const info = (message: string) => {
  sonnerToast.info(message);
  return toast({ 
    title: "Informação",
    description: message,
    variant: "default" 
  });
};
