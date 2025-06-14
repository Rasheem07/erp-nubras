// src/accounting/repos/journal.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { journalEntries, journalEntryLines } from 'src/core/drizzle/schema/accounting.schema';

type EntryWithLines = Omit<
  Awaited<ReturnType<JournalRepository['findEntryWithLinesById']>>,
  never
> & {
  debitTotal: number;
  creditTotal: number;
};

@Injectable()
export class JournalRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  /**
   * Fetch all journal entries with their lines, debitTotal, and creditTotal
   */
  async findAllEntries() {
    const result = await this.db.execute(sql`
      SELECT 
      je.*,
      json_agg(json_build_object(
        'id', jel.id,
        'accountId', jel.account_id,
        'debit', jel.debit,
        'credit', jel.credit,
        'createdAt', jel.created_at
      )) AS entries,
      SUM(jel.debit::numeric) AS "debitTotal",
      SUM(jel.credit::numeric) AS "creditTotal"
      FROM accounting_schema.journal_entries je
      LEFT JOIN accounting_schema.journal_entry_lines jel 
        ON je.id = jel.journal_entry_id
      GROUP BY je.id
    `);

    return result.rows.map((row) => ({
      ...row,
      debitTotal: Number(row.debitTotal),
      creditTotal: Number(row.creditTotal),
    }));
  }

  /**
   * Fetch single entry by id, with lines, debitTotal, and creditTotal
   */
  async findEntryWithLinesById(id: number) {
    const [entry] = await this.db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .limit(1);

    if (!entry) return null;

    const lines = await this.db
      .select()
      .from(journalEntryLines)
      .where(eq(journalEntryLines.journalEntryId, id));

    // compute totals
    const debitTotal = lines.reduce((sum, l) => sum + Number(l.debit), 0);
    const creditTotal = lines.reduce((sum, l) => sum + Number(l.credit), 0);

    return {
      ...entry,
      journalEntryLines: lines,
      debitTotal,
      creditTotal,
    };
  }

  async createEntryWithLines(
    data: typeof journalEntries.$inferInsert,
    lines: Omit<typeof journalEntryLines.$inferInsert, 'journalEntryId'| 'id' | 'createdAt' | 'updatedAt'>[],
  ) {
    return this.db.transaction(async (tx) => {
      const [createdEntry] = await tx
        .insert(journalEntries)
        .values(data)
        .returning();
      const entryId = createdEntry.id;

      const createdLines = await tx
        .insert(journalEntryLines)
        .values(
          lines.map((line) => ({
            ...line,
            journalEntryId: entryId,
          })),
        )
        .returning();

      // compute totals
      const debitTotal = createdLines.reduce(
        (sum, l) => sum + Number(l.debit),
        0,
      );
      const creditTotal = createdLines.reduce(
        (sum, l) => sum + Number(l.credit),
        0,
      );

      return {
        ...createdEntry,
        journalEntryLines: createdLines,
        debitTotal,
        creditTotal,
      };
    });
  }

  async updateEntryWithLines(
    id: number,
    entryData: Partial<typeof journalEntries.$inferInsert>,
    lines: Omit<typeof journalEntryLines.$inferInsert, 'journalEntryId'>[],
  ) {
    return this.db.transaction(async (tx) => {
      await tx
        .update(journalEntries)
        .set(entryData)
        .where(eq(journalEntries.id, id));

      await tx
        .delete(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, id));

      const insertedLines = await tx
        .insert(journalEntryLines)
        .values(
          lines.map((line) => ({
            ...line,
            journalEntryId: id,
          })),
        )
        .returning();

      const [updatedEntry] = await tx
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, id));

      // compute totals
      const debitTotal = insertedLines.reduce(
        (sum, l) => sum + Number(l.debit),
        0,
      );
      const creditTotal = insertedLines.reduce(
        (sum, l) => sum + Number(l.credit),
        0,
      );

      return {
        ...updatedEntry,
        journalEntryLines: insertedLines,
        debitTotal,
        creditTotal,
      };
    });
  }

  async deleteEntry(id: number) {
    return this.db.transaction(async (tx) => {
      await tx
        .delete(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, id));
      await tx.delete(journalEntries).where(eq(journalEntries.id, id));
    });
  }
}
