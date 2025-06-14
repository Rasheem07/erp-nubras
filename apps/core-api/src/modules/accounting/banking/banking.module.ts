import { Module } from '@nestjs/common';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';
import { BankAccountsRepository } from './repos/banks.repo';
import { BankDetailsRepository } from './repos/bank-details.repo';
import { ContactsRepository } from '../repos/contacts.repo';
import { AccountsRepository } from '../accounts/accounts.repo';

@Module({
  controllers: [BankingController],
  providers: [
    BankingService,
    BankAccountsRepository,
    AccountsRepository,
    BankDetailsRepository,
    ContactsRepository,
  ]
})
export class BankingModule {}
