import { BadRequestException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesRepository } from './invoices.repo';
import { Response } from 'express';
const PdfPrinter = require('pdfmake/src/printer');
const vfsFonts = require('pdfmake/build/vfs_fonts');

@Injectable()
export class InvoicesService {
  constructor(private readonly invoicesRepo: InvoicesRepository) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    return await this.invoicesRepo.createInvoice(createInvoiceDto);
  }

  async findAll() {
    return await this.invoicesRepo.findAll();
  }

  async findOne(id: number): Promise<any> {
    return await this.invoicesRepo.findOne(id);
  }

  async update(updateInvoiceDto: UpdateInvoiceDto) {
     // 0) Validate that the payload actually has the correct party
    if (updateInvoiceDto.type === 'sales' && (updateInvoiceDto.customerId == null || updateInvoiceDto.supplierId != null)) {
      throw new BadRequestException('A sales invoice must have customerId and no supplierId.');
    }
    if (updateInvoiceDto.type === 'purchase' && (updateInvoiceDto.supplierId == null || updateInvoiceDto.customerId != null)) {
      throw new BadRequestException('A purchase invoice must have supplierId and no customerId.');
    }
    return await this.invoicesRepo.updateInvoice(updateInvoiceDto);
  }

  async downloadInvoicePdf(id: number, res: Response) {
    // prepare fonts and printer
    const fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Bold.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-BoldItalic.ttf',
      },
    };
    const printer = new PdfPrinter(fonts);
    printer.vfs = vfsFonts.vfs;

    const inv = await this.invoicesRepo.findOne(id);
    if (!inv) throw new NotFoundException(`Invoice #${id} not found`);

    // Build Item & Tax tables
    const itemsTable = [
      [
        { text: 'Item ID', style: 'tableHeader' },
        { text: 'Qty', style: 'tableHeader' },
        { text: 'Total', style: 'tableHeader' },
      ],
      ...((inv.items ?? []) as any[]).map((i) => [
        String(i.itemId),
        String(i.quantity),
        i.total,
      ]),
    ];
    const taxesTable = [
      [
        { text: 'Tax', style: 'tableHeader' },
        { text: 'Rate', style: 'tableHeader' },
        { text: 'Apply On', style: 'tableHeader' },
      ],
      ...((inv.taxes ?? []) as any[]).map((t) => [
        t.taxName,
        `${t.rate}%`,
        t.applyOn,
      ]),
    ];

    // Define PDF document
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [50, 60, 50, 60],
      content: [
        // Centered Title
        { text: `INVOICE`, style: 'title', alignment: 'center' },
        {
          text: `#${inv.id}`,
          style: 'invoiceNumber',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        // Two-column Invoice Info
        {
          columns: [
            [
              { text: `Date:`, style: 'label' },
              {
                text: new Date(inv.date).toLocaleDateString(),
                style: 'value',
                margin: [0, 0, 0, 5],
              },
              { text: `Notes:`, style: 'label' },
              { text: inv.notes || '-', style: 'value' },
            ],
            [
              { text: `Due:`, style: 'label' },
              {
                text: new Date(inv.dueDate).toLocaleDateString(),
                style: 'value',
                margin: [0, 0, 0, 5],
              },
              { text: `Status:`, style: 'label' },
              { text: inv.status.toUpperCase(), style: 'statusValue' },
            ],
          ],
          columnGap: 20,
        },

        { text: ' ', margin: [0, 0, 0, 10] },

        // Items Table
        { text: 'Line Items', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto'],
            body: itemsTable,
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },

        // Taxes Table
        { text: 'Taxes & Charges', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto'],
            body: taxesTable,
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },

        // Totals Box
        {
          style: 'totalsBox',
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                { text: 'Net Amount', style: 'totalsLabel' },
                { text: inv.netAmount, style: 'totalsValue' },
              ],
              [
                { text: 'Tax Amount', style: 'totalsLabel' },
                { text: inv.taxAmount, style: 'totalsValue' },
              ],
              [
                { text: 'TOTAL', style: 'totalsLabelBold' },
                { text: inv.totalAmount, style: 'totalsValueBold' },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20],
        },

        // Terms & Conditions Footer
        { text: 'Terms & Conditions', style: 'sectionHeader' },
        {
          text: [
            '• Payment due within 30 days of invoice date.\n',
            '• Late payments incur a 5% late fee.\n',
            '• Remit payments to Your Company Name.\n',
            '\nThank you for your business!',
          ],
          style: 'tinyFooter',
          alignment: 'justify',
        },
      ],
      styles: {
        title: { fontSize: 22, bold: true },
        invoiceNumber: { fontSize: 16, color: '#666' },
        label: { fontSize: 10, color: '#888' },
        value: { fontSize: 11, bold: true },
        statusValue: {
          fontSize: 11,
          bold: true,
          color: '#fff',
          fillColor: '#007bff',
          alignment: 'center',
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
          decoration: 'underline',
        },
        tableHeader: { bold: true, fontSize: 11, fillColor: '#f5f5f5' },
        totalsBox: { margin: [0, 0, 0, 20] },
        totalsLabel: { fontSize: 12 },
        totalsValue: { fontSize: 12, alignment: 'right' },
        totalsLabelBold: { fontSize: 12, bold: true },
        totalsValueBold: { fontSize: 12, bold: true, alignment: 'right' },
        tinyFooter: { fontSize: 9, italics: true },
      },
      defaultStyle: { font: 'Roboto', lineHeight: 1.2 },
    };

    // Generate and stream PDF
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${id}.pdf"`,
    );
    pdfDoc.pipe(res);
    pdfDoc.end();
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
