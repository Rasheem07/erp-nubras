import { Transform, Type } from 'class-transformer';
import {
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateJournalEntryDto {
  @IsOptional()
  @IsString()
  refType: string;

  @IsOptional()
  @IsInt()
  refNo: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsString()
  status: string;
  
  @ValidateNested({ each: true })
  @Type(() => journalEntryLine)
  journalEntryLines: journalEntryLine[];
}

export class journalEntryLine {
  @IsInt()
  accountId: number;

  @IsDecimal()
  @Transform(({value}) => value.toString())
  debit: string;

  @IsDecimal()
  @Transform(({value}) => value.toString())
  credit: string;
}
