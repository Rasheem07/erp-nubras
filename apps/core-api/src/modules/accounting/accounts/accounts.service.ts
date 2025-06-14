import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './accounts.repo';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepo: AccountsRepository) {}

  async create(createAccountDto: CreateAccountDto) {
    const account = await this.findOne(createAccountDto.accNo);
    if(account.length > 0) {
      throw new ConflictException(`Account ${createAccountDto.accNo} already exists!`)
    }
    await this.accountsRepo.create(createAccountDto);
    return { message: `Account ${createAccountDto.name} created succesfully!` };
  }

  async findAll() {
    return await this.accountsRepo.findAll();
  }

  async findOne(id: number) {
    const account = await this.accountsRepo.findOne(id);
    if (!account) {
      throw new NotFoundException(`Account with ${id} not found!`);
    }
    return account;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    await this.accountsRepo.update(id, updateAccountDto);
    return {
      message: `Account ${updateAccountDto.name} updated successfully!`,
    };
  }

  async remove(id: number) {
    await this.accountsRepo.delete(id);
    return {
      message: `Account with ${id} deleted successfully!`,
    };
  }
}
