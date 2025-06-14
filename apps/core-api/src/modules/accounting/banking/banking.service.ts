import { Injectable } from '@nestjs/common';
import { CreateBankingDto } from './dto/create-banking.dto';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { BankAccountsRepository } from './repos/banks.repo';
import { BankDetailsRepository } from './repos/bank-details.repo';
import { ContactsRepository } from '../repos/contacts.repo';
import { AccountsRepository } from '../accounts/accounts.repo';

@Injectable()
export class BankingService {
  constructor(
    private readonly bankRepo: BankAccountsRepository,
    private readonly bankDetailsRepo: BankDetailsRepository,
    private readonly contactsRepo: ContactsRepository,
    private readonly accRepo: AccountsRepository,
  ) {}

  async create(createBankDto: CreateBankingDto) {
    const acc = await this.accRepo.create({
      ...createBankDto.accountDetails,
      balance: createBankDto.balance,
    });
    const contact = await this.contactsRepo.create(createBankDto.contact);
    const additionalBankDetails = await this.bankDetailsRepo.create({
      ...createBankDto.additionalDetails,
      contactId: contact[0].id,
    });
    await this.bankRepo.create({
      ...createBankDto.bankDetails,
      accNo: acc[0].accNo,
      additionalDetailsId: additionalBankDetails[0].id,
      balance: createBankDto.balance,
    });
    return { message: 'Bank account created successfully!' };
  }

  async findAll() {
    return await this.bankRepo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} banking`;
  }

  update(id: number, updateBankingDto: UpdateBankingDto) {
    return `This action updates a #${id} banking`;
  }

  remove(id: number) {
    return `This action removes a #${id} banking`;
  }
}
