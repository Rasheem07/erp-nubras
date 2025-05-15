// src/rabbitmq/rabbitmq.module.ts
import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import * as amqp from 'amqplib';
import {
  RABBITMQ_MODULE_OPTIONS,
  RABBITMQ_CONNECTION,
  RABBITMQ_CHANNEL,
  RabbitMQModuleOptions,
  RabbitMQModuleAsyncOptions,
} from './rabbitmq.constants';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: RABBITMQ_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider: Provider = {
      provide: RABBITMQ_CONNECTION,
      useFactory: async () => {
        const conn = await amqp.connect(options.uri);
        return conn;
      },
    };
    const channelProvider: Provider = {
      provide: RABBITMQ_CHANNEL,
      useFactory: async (conn: amqp.Connection) => {
        const ch = await conn.createChannel();
        await ch.assertQueue(options.queue, { durable: true });
        if (options.prefetchCount) {
          ch.prefetch(options.prefetchCount);
        }
        return ch;
      },
      inject: [RABBITMQ_CONNECTION],
    };

    return {
      module: RabbitMQModule,
      providers: [optionsProvider, connectionProvider, channelProvider, RabbitMQService],
      exports: [RabbitMQService],
    };
  }

  static forRootAsync(opts: RabbitMQModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: RABBITMQ_MODULE_OPTIONS,
      useFactory: opts.useFactory,
      inject: opts.inject || [],
    };
    const connectionProvider: Provider = {
      provide: RABBITMQ_CONNECTION,
      useFactory: async (options: RabbitMQModuleOptions) => {
        const conn = await amqp.connect(options.uri);
        return conn;
      },
      inject: [RABBITMQ_MODULE_OPTIONS],
    };
    const channelProvider: Provider = {
      provide: RABBITMQ_CHANNEL,
      useFactory: async (
        options: RabbitMQModuleOptions,
        conn: amqp.Connection,
      ) => {
        const ch = await conn.createChannel();
        await ch.assertQueue(options.queue, { durable: true });
        if (options.prefetchCount) {
          ch.prefetch(options.prefetchCount);
        }
        return ch;
      },
      inject: [RABBITMQ_MODULE_OPTIONS, RABBITMQ_CONNECTION],
    };

    return {
      module: RabbitMQModule,
      imports: opts.imports || [],
      providers: [optionsProvider, connectionProvider, channelProvider, RabbitMQService],
      exports: [RabbitMQService],
    };
  }
}
