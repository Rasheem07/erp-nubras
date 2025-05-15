

import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let transportMock: { sendMail: jest.Mock };

  beforeEach(async () => {
    // stub out createTransport to return our fake transport
    transportMock = { sendMail: jest.fn().mockResolvedValue({ messageId: 'abc123' }) };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(transportMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call nodemailer.createTransport once', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
  });

  it('sendMail() should invoke transport.sendMail with given options', async () => {
    const mailOpts = {
      to: 'mohdrasheem07@gmail.com',
      from: 'no-reply@gmail.com',
      subject: 'Hello',
      text: 'Hello world',
      html: '<p>Hello world</p>',
    };
    const result = await service.sendMail(mailOpts);

    expect(transportMock.sendMail).toHaveBeenCalledWith(mailOpts);
    expect(result).toEqual({ messageId: 'abc123' });
  });
});
