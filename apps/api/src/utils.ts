export function once<T>(fn: () => T): () => T {
  let called = false
  let result: T

  return () => {
    if (!called) {
      called = true
      result = fn()
    }
    return result
  }
}
