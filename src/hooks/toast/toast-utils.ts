
let count = 0

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export const toastTimeouts = new Map<string | number, ReturnType<typeof setTimeout>>()
