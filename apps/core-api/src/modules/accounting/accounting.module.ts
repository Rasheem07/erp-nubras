import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { AccountsModule } from './accounts/accounts.module';
import { BankingModule } from './banking/banking.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ExpensesModule } from './expenses/expenses.module';
import { PaymentsModule } from './payments/payments.module';
import { TaxationModule } from './taxation/taxation.module';
import { BudgetingModule } from './budgeting/budgeting.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  controllers: [AccountingController],
  providers: [AccountingService],
  imports: [AccountsModule, BankingModule, JournalEntriesModule, InvoicesModule, ExpensesModule, PaymentsModule, TaxationModule, BudgetingModule, SettingsModule],
})
export class AccountingModule {}
