/**
 * Result Type Pattern
 * Provides a type-safe way to handle success and error cases
 * Inspired by Rust's Result type and functional programming patterns
 */

/**
 * Represents a successful result
 */
export interface Success<T> {
  success: true;
  data: T;
}

/**
 * Represents a failed result
 */
export interface Failure<E = Error> {
  success: false;
  error: E;
}

/**
 * Result type that can be either Success or Failure
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Creates a successful result
 */
export function ok<T>(data: T): Success<T> {
  return { success: true, data };
}

/**
 * Creates a failed result
 */
export function err<E = Error>(error: E): Failure<E> {
  return { success: false, error };
}

/**
 * Type guard to check if result is successful
 */
export function isOk<T, E>(result: Result<T, E>): result is Success<T> {
  return result.success === true;
}

/**
 * Type guard to check if result is a failure
 */
export function isErr<T, E>(result: Result<T, E>): result is Failure<E> {
  return result.success === false;
}

/**
 * Unwraps a successful result or throws an error
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.data;
  }
  throw result.error;
}

/**
 * Unwraps a successful result or returns a default value
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (isOk(result)) {
    return result.data;
  }
  return defaultValue;
}

/**
 * Maps the success value of a result
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U,
): Result<U, E> {
  if (isOk(result)) {
    return ok(fn(result.data));
  }
  return result;
}

/**
 * Maps the error value of a result
 */
export function mapErr<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  if (isErr(result)) {
    return err(fn(result.error));
  }
  return result;
}

/**
 * Chains multiple operations that return Results
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>,
): Result<U, E> {
  if (isOk(result)) {
    return fn(result.data);
  }
  return result;
}

/**
 * Wraps an async function that might throw into a Result
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
): Promise<Result<T, Error>> {
  try {
    const data = await fn();
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Wraps a sync function that might throw into a Result
 */
export function tryCatchSync<T>(fn: () => T): Result<T, Error> {
  try {
    const data = fn();
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Collects an array of Results into a single Result
 * Returns Success with array of data if all are successful
 * Returns Failure with first error if any fail
 */
export function collect<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const data: T[] = [];
  
  for (const result of results) {
    if (isErr(result)) {
      return result;
    }
    data.push(result.data);
  }
  
  return ok(data);
}
