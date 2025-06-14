// src/accounting/journal-entries.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import { JournalRepository } from './repos/journal.repo';

@Injectable()
export class JournalEntriesService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
    private readonly journalRepo: JournalRepository,
  ) {}

  async create(createJournalEntryDto: CreateJournalEntryDto) {
    const { journalEntryLines, ...entryData } = createJournalEntryDto;

    return this.journalRepo.createEntryWithLines(entryData, journalEntryLines);
  }

  async findAll() {
    return this.journalRepo.findAllEntries();
  }

  async findOne(id: number) {
    return this.journalRepo.findEntryWithLinesById(id);
  }

  async update(id: number, updateJournalEntryDto: UpdateJournalEntryDto) {
    const { journalEntryLines, ...entryData } = updateJournalEntryDto;

    return this.journalRepo.updateEntryWithLines(id, entryData, journalEntryLines);
  }

  async remove(id: number) {
    return this.journalRepo.deleteEntry(id);
  }
}
