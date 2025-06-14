import { Injectable } from '@nestjs/common';
import { CreateTaxationDto } from './dto/create-taxation.dto';
import { UpdateTaxationDto } from './dto/update-taxation.dto';

@Injectable()
export class TaxationService {
  create(createTaxationDto: CreateTaxationDto) {
    return 'This action adds a new taxation';
  }

  findAll() {
    return `This action returns all taxation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taxation`;
  }

  update(id: number, updateTaxationDto: UpdateTaxationDto) {
    return `This action updates a #${id} taxation`;
  }

  remove(id: number) {
    return `This action removes a #${id} taxation`;
  }
}
