// src/rabbitmq/rabbitmq.service.ts
import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import {
  RABBITMQ_MODULE_OPTIONS,
  RABBITMQ_CHANNEL,
  RabbitMQModuleOptions,
} from './rabbitmq.constants';
import type { Channel, ConsumeMessage, Connection } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  constructor(
    @Inject(RABBITMQ_MODULE_OPTIONS)
    private readonly options: RabbitMQModuleOptions,

    @Inject(RABBITMQ_CHANNEL)
    private readonly channel: Channel,

    @Inject(RABBITMQ_MODULE_OPTIONS)
    private readonly modOpts: RabbitMQModuleOptions,

    @Inject(RABBITMQ_CHANNEL)
    private readonly ch: Channel,
  ) {}

  async publish(
    queue: string,
    message: object,
  ): Promise<boolean> {
    const q = queue || this.options.queue;
    const payload = Buffer.from(JSON.stringify(message));
    return this.channel.sendToQueue(q, payload, { persistent: true });
  }

  async subscribe(
    queue: string,
    onMessage: (msg: ConsumeMessage) => Promise<void> | void,
  ): Promise<void> {
    const q = queue || this.options.queue;
    await this.channel.assertQueue(q, { durable: true });
    this.channel.consume(q, async (msg) => {
      if (!msg) return;
      try {
        await onMessage(msg);
        this.channel.ack(msg);
      } catch {
        this.channel.nack(msg, false, true);
      }
    });
  }

  async onModuleDestroy() {
    try {
      await this.channel.close();
    } catch {}
  }
}
