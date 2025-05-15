// src/sms/sms.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';
import { SMS_MODULE_OPTIONS, TWILIO_CLIENT, SmsModuleOptions } from './sms.constants';

// A minimal Twilio client stub
class TwilioClientStub {
  messages = {
    create: jest.fn().mockResolvedValue({ sid: 'SM123', status: 'sent' }),
  };
}

describe('SmsService', () => {
  let service: SmsService;
  const mockOpts: SmsModuleOptions = {
    accountSid: 'ACxxx',
    authToken: 'authToken',
    from: '+15550000000',
  };
  const clientStub = new TwilioClientStub();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        { provide: SMS_MODULE_OPTIONS, useValue: mockOpts },
        { provide: TWILIO_CLIENT, useValue: clientStub },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sendSms() calls Twilio.messages.create with correct args', async () => {
    const to = '+15551112222';
    const body = 'Hello World';
    const res = await service.sendSms(to, body);

    expect(clientStub.messages.create).toHaveBeenCalledWith({
      to,
      from: mockOpts.from,
      body,
    });
    expect(res).toEqual({ sid: 'SM123', status: 'sent' });
  });

  it('sendBulkSms() sends to all recipients', async () => {
    const recipients = ['+10000000001', '+10000000002'];
    const body = 'Bulk Message';
    const results = await service.sendBulkSms(recipients, body);

    expect(clientStub.messages.create).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });
});
