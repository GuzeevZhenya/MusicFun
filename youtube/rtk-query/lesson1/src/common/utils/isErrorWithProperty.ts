// export function isErrorWithMessage(error: unknown): error is { message: string } {
//   return typeof error === 'object' && error != null && 'message' in error && typeof (error as any).message === 'string'
// }

export function isErrorWithProperty<T extends string>(error: unknown, property: T): error is Record<T, string> {
  const value =
    typeof error === 'object' && error !== null && property in error
      ? (error as Record<string, unknown>)[property]
      : undefined

  return typeof value === 'string' && value !== undefined
}
