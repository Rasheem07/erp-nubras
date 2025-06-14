// src/common/s3.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3ModuleOptions } from './s3.module';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(private readonly options: S3ModuleOptions) {
    this.s3 = new S3Client({
      region: options.region,
      credentials: options.credentials,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = '',
  ): Promise<string> {
    const key = `${folder ? `${folder}/` : ''}${Date.now()}-${file.originalname}`;
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.options.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err: any) {
      console.log(err.stack);
      throw new InternalServerErrorException('S3 upload failed');
    }
    return `https://${this.options.bucket}.s3.${this.options.region}.amazonaws.com/${key}`;
  }

  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    folder = '',
    contentType = 'application/octet-stream',
  ): Promise<string> {
    const key = `${folder ? `${folder}/` : ''}${Date.now()}-${filename}`;
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.options.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
    } catch (err: any) {
      throw new InternalServerErrorException('S3 upload failed');
    }
    return `https://${this.options.bucket}.s3.${this.options.region}.amazonaws.com/${key}`;
  }

  async downloadFile(key: string): Promise<Buffer> {
    try {
      const response = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.options.bucket,
          Key:    key,
        })
      );
      const body = response.Body as Readable;

      const chunks: Buffer[] = [];
      for await (const chunk of body) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks);
    } catch (err: any) {
      console.error(err);
      throw new InternalServerErrorException('S3 download failed');
    }
  }
}
