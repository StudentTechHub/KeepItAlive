// Common types used across various services

import { Service } from "@prisma/client";

/**
 * Result of a service ping operation
 */
export interface PingResult {
  serviceId: string;
  successful: boolean;
  responseTime?: number;
  statusCode?: number;
  errorMessage?: string;
  timestamp: Date;
}

/**
 * Result of scheduling multiple pings
 */
export interface ScheduleResult {
  totalScheduled: number;
  nextExecutionTime: Date;
}

/**
 * Service with its ping result
 */
export interface ServiceWithPingResult extends Service {
  pingResult?: PingResult;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  maxRequestsPerSecond: number;
  delayBetweenRequests: number; // milliseconds
  maxConcurrentRequests: number;
}

/**
 * Base ping options that apply to all service types
 */
export interface BasePingOptions {
  timeout?: number; // milliseconds
  retryCount?: number;
  retryDelay?: number; // milliseconds
}
