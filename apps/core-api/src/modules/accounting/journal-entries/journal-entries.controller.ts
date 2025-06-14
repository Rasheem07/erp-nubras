import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';

@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Post()
  async create(@Body() createJournalEntryDto: CreateJournalEntryDto) {
    return await this.journalEntriesService.create(createJournalEntryDto);
  }

  @Get()
  async findAll() {
    return await this.journalEntriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.journalEntriesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJournalEntryDto: UpdateJournalEntryDto) {
    return await this.journalEntriesService.update(+id, updateJournalEntryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.journalEntriesService.remove(+id);
  }
}
