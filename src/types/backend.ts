export type ResponseType = "ERROR" | "SUCCESS" | "INFO" | "WARN";

/**
 * Base interface for all internal responses
 */
export interface CommonInternalResponseBase<TType = ResponseType> {
  success: boolean;
  type?: TType;
  title: string;
  message?: string;
  redirect?: string;
}

/**
 * Interface for successful responses
 */
export interface CommonInternalResponseSuccess<TData, TType = "SUCCESS" | "INFO" | "WARN">
  extends CommonInternalResponseBase<TType> {
  success: true;
  data: TData;
}

/**
 * Interface for unsuccessful responses
 */
export interface CommonInternalResponseError<
  TType = "ERROR" | "INFO" | "WARN",
  TErrorData = unknown
> extends CommonInternalResponseBase<TType> {
  success: false;
  data?: never; // Kept for backward compatibility
  errorData?: TErrorData; // New property for error data
}

/**
 * Union type that encompasses both successful and unsuccessful responses
 */
export type CommonInternalResponse<TData, TType = ResponseType, TErrorData = unknown> =
  | CommonInternalResponseSuccess<TData, Extract<TType, "SUCCESS" | "INFO" | "WARN">>
  | CommonInternalResponseError<Extract<TType, "ERROR" | "INFO" | "WARN">, TErrorData>;
