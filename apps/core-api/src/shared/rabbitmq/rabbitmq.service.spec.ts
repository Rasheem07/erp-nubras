// src/rabbitmq/rabbitmq.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import {
  RABBITMQ_MODULE_OPTIONS,
  RABBITMQ_CHANNEL,
  RabbitMQModuleOptions,
} from './rabbitmq.constants';
import { RabbitMQService } from './rabbitmq.service';
import type { Channel, ConsumeMessage } from 'amqplib';

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let channel: Partial<Channel>;
  const opts: RabbitMQModuleOptions = {
    uri: 'amqp://localhost:5672',
    queue: 'test-queue',
    prefetchCount: 5,
  };

  beforeEach(async () => {
    // stubbed channel
    channel = {
      sendToQueue: jest.fn().mockReturnValue(true),
      assertQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
      nack: jest.fn(),
      prefetch: jest.fn(),
      close: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        { provide: RABBITMQ_MODULE_OPTIONS, useValue: opts },
        { provide: RABBITMQ_CHANNEL, useValue: channel },
      ],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('publish() calls sendToQueue with correct args', async () => {
    const msg = { foo: 'bar' };
    const result = await service.publish('custom-queue', msg);
    expect(channel.sendToQueue).toHaveBeenCalledWith(
      'custom-queue',
      Buffer.from(JSON.stringify(msg)),
      { persistent: true },
    );
    expect(result).toBe(true);
  });

  it('subscribe() sets up a consumer and acks on success', async () => {
    const fakeMsg: Partial<ConsumeMessage> = {
      content: Buffer.from('{"hello":"world"}'),
      fields: {} as any,
      properties: {} as any,
    };
    // simulate onMessage being called by consume
    ;(channel.consume as jest.Mock).mockImplementation((q, cb) => {
      cb(fakeMsg as ConsumeMessage);
      return Promise.resolve({ consumerTag: 'tag' });
    });

    const handler = jest.fn().mockResolvedValue(undefined);
    await service.subscribe('q', handler);
    expect(channel.assertQueue).toHaveBeenCalledWith('q', { durable: true });
    expect(channel.consume).toHaveBeenCalledWith('q', expect.any(Function));
    // handler should be called
    expect(handler).toHaveBeenCalledWith(fakeMsg);
    expect(channel.ack).toHaveBeenCalledWith(fakeMsg);
  });

  it('subscribe() nacks on handler error', async () => {
    const fakeMsg: Partial<ConsumeMessage> = {
      content: Buffer.from('{"foo":"baz"}'),
      fields: {} as any,
      properties: {} as any,
    };
    (channel.consume as jest.Mock).mockImplementation((q, cb) => {
      cb(fakeMsg as ConsumeMessage);
      return Promise.resolve({ consumerTag: 'tag' });
    });

    const handler = jest.fn().mockRejectedValue(new Error('fail'));
    await service.subscribe('', handler);
    expect(channel.nack).toHaveBeenCalledWith(fakeMsg, false, true);
  });
});
