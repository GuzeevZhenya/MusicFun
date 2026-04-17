export function isErrorWithDetailArray(error: unknown): error is { errors: { detail: string }[] } {
  if (!error || typeof error !== 'object') return false

  const possibleError = error as { errors?: unknown }
  if (!Array.isArray(possibleError.errors)) return false

  return possibleError.errors.length > 0 && typeof possibleError.errors[0]?.detail === 'string'
}
