/**
 * Function to extract error messages from various types of error objects or strings
 * @param error The error object or string from which to extract the message
 * @returns The error message as a string
 */
export function getErrorMessage(error: unknown): string {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Internal Server Error";
  }
  return message;
}
