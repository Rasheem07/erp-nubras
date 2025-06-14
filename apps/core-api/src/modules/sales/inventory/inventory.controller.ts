import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  BadRequestException,
  ParseFilePipeBuilder,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateRestockDto } from './dto/create-restock.dto';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/shared/s3/s3.service';
import { Response } from 'express';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly s3: S3Service,
  ) {}

  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post()
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /jpeg|png|gif|webp/ })
        .addMaxSizeValidator({ maxSize: 20 * 1024 * 1024 })
        .build({ errorHttpStatusCode: 422 }),
    )
    file: Express.Multer.File,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    const imageUrl = await this.s3.uploadFile(file, 'products');
    return this.inventoryService.create(imageUrl, createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }

  @Post('restock')
  async restock(@Body() createRestockDto: CreateRestockDto) {
    return await this.inventoryService.restock(createRestockDto);
  }

  @Get('barcodes/:key')
  async getBarcode(@Param('key') key: string, @Res() res: Response) {
    const buffer = await this.s3.downloadFile(`barcodes/${key}`);
    res
      .set({
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
        'Content-Disposition': `attachment; filename="${key}"`,
      })
      .send(buffer);
  }
}
