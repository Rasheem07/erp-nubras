import { Module } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';
import { JournalRepository } from './repos/journal.repo';

@Module({
  controllers: [JournalEntriesController],
  providers: [JournalEntriesService, JournalRepository],
})
export class JournalEntriesModule {}
