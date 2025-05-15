// src/rabbitmq/rabbitmq.constants.ts
export const RABBITMQ_MODULE_OPTIONS = 'RABBITMQ_MODULE_OPTIONS';
export const RABBITMQ_CONNECTION      = 'RABBITMQ_CONNECTION';
export const RABBITMQ_CHANNEL         = 'RABBITMQ_CHANNEL';

export interface RabbitMQModuleOptions {
  /** e.g. amqp://user:pass@host:5672 */
  uri: string;
  /** default queue name; you can still override per-call */
  queue: string;
  /** how many messages to prefetch */
  prefetchCount?: number;
}

export interface RabbitMQModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<RabbitMQModuleOptions> | RabbitMQModuleOptions;
}
