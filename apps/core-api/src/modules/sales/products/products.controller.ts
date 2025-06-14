import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { extname } from 'path';
import { diskStorage, memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/shared/s3/s3.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
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
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    const imageUrl = await this.s3.uploadFile(file, 'products');

    return this.productsService.create(imageUrl, createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log("invoked find one in products")
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Patch(':id/disable')
  disable(@Param('id') id: string) {
    return this.productsService.disable(+id);
  }

  @Patch(':id/enable')
  enable(@Param('id') id: string) {
    return this.productsService.enable(+id);
  }

  @Get('list/catalog')
  async listActive() {
    return await this.productsService.listActiveProductsGrouped();
  }

  @Get('list/products')
  async listProds() {
    return await this.productsService.listAllProducts();
  }

  @Get('list/categories')
  listCats() {
    return this.productsService.listAllCatagories();
  }

  @Post('categories')
  async addNewCat(@Body() body: { name: string }) {
    return await this.productsService.addNewCategory(body.name);
  }
}
