import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TailoringService } from './tailoring.service';
import { CreateTailoringDto } from './dto/create-tailoring.dto';
import { UpdateTailoringDto } from './dto/update-tailoring.dto';

@Controller('tailoring')
export class TailoringController {
  constructor(private readonly tailoringService: TailoringService) {}

  @Post()
  create(@Body() createTailoringDto: CreateTailoringDto) {
    return this.tailoringService.create(createTailoringDto);
  }

  @Get()
  findAll() {
    return this.tailoringService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tailoringService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTailoringDto: UpdateTailoringDto,
  ) {
    return this.tailoringService.update(+id, updateTailoringDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tailoringService.remove(+id);
  }

  @Patch('workflow/:id')
  async updateProgress(@Param('id', ParseIntPipe) workflowId: number) {
    return await this.tailoringService.updateProgress(+workflowId);
  }

  @Patch('notes/:id')
  async updateNotes(
    @Param('id', ParseIntPipe) workflowId: number,
    @Body() data: { notes: string },
  ) {
    return await this.tailoringService.updateWorkFlowNotes(
      +workflowId,
      data.notes,
    );
  }

  @Get("workflow/templates")
  async listTemplates() {
    return await this.tailoringService.listAllWorkflowTempaltes()
  }
}
