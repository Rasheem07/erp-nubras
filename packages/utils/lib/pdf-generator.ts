import PDFDocument from "pdfkit"
import blobStream from "blob-stream"
import FileSaver from "file-saver"
import { formatCurrency } from "./format-currency"
import { Invoice } from "../src/types"


// PDF generation function
export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: `Invoice ${invoice.invoiceNumber}`,
          Author: "Nubras Tailoring",
        },
      })

      // Pipe its output to a blob
      const stream = doc.pipe(blobStream())

      // Set some basic styles
      doc.font("Helvetica")

      // Add company logo and header
      doc.fontSize(24).font("Helvetica-Bold").text("INVOICE", { align: "left" })
      doc.fontSize(12).font("Helvetica").text(`#${invoice.invoiceNumber}`, { align: "left" })

      doc.moveUp(2)
      doc.fontSize(16).font("Helvetica-Bold").text("Nubras Tailoring", { align: "right" })
      doc.fontSize(10).font("Helvetica").text("Dubai, UAE", { align: "right" })
      doc.text("info@nubras.com", { align: "right" })
      doc.text("+971 4 123 4567", { align: "right" })

      // Add a line
      doc.moveDown(2)
      doc
        .lineCap("butt")
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke()
      doc.moveDown(1)

      // Customer and invoice details
      doc.fontSize(12).font("Helvetica-Bold").text("Bill To:", { continued: false })
      doc.fontSize(12).font("Helvetica-Bold").text(invoice.customer)
      if (invoice.customerEmail) {
        doc.fontSize(10).font("Helvetica").text(invoice.customerEmail)
      }
      if (invoice.customerAddress) {
        doc.fontSize(10).font("Helvetica").text(invoice.customerAddress)
      }

      // Invoice details on the right
      const detailsX = 350
      const detailsY = doc.y - (invoice.customerAddress ? 60 : 40)

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Invoice Number:", detailsX, detailsY)
        .text(invoice.invoiceNumber, detailsX + 100, detailsY, { align: "right" })

      doc
        .text("Issue Date:", detailsX, detailsY + 15)
        .text(new Date(invoice.issueDate).toLocaleDateString(), detailsX + 100, detailsY + 15, { align: "right" })

      doc
        .text("Due Date:", detailsX, detailsY + 30)
        .text(new Date(invoice.dueDate).toLocaleDateString(), detailsX + 100, detailsY + 30, { align: "right" })

      doc
        .text("Status:", detailsX, detailsY + 45)
        .text(invoice.status, detailsX + 100, detailsY + 45, { align: "right" })

      // Move down to make space for the table
      doc.moveDown(4)

      // Invoice items table
      const tableTop = doc.y
      const tableHeaders = ["Description", "Quantity", "Unit Price", "Amount"]
      const tableWidths = [250, 70, 100, 80]
      const tableX = [50, 300, 370, 470]

      // Draw table headers
      doc.fontSize(10).font("Helvetica-Bold")
      doc.rect(50, tableTop - 5, doc.page.width - 100, 20).fill("#f3f4f6")

      tableHeaders.forEach((header, i) => {
        const align = i === 0 ? "left" : "right"
        doc.text(header, tableX[i], tableTop, { width: tableWidths[i], align })
      })

      // Draw table rows
      let tableY = tableTop + 20

      invoice.items.forEach((item, index) => {
        const rowHeight = 20
        const isEvenRow = index % 2 === 0

        if (isEvenRow) {
          doc.rect(50, tableY - 5, doc.page.width - 100, rowHeight).fill("#ffffff")
        } else {
          doc.rect(50, tableY - 5, doc.page.width - 100, rowHeight).fill("#f9fafb")
        }

        doc.fontSize(10).font("Helvetica")
        doc.text(item.description, tableX[0], tableY, { width: tableWidths[0], align: "left" })
        doc.text(item.quantity.toString(), tableX[1], tableY, { width: tableWidths[1], align: "right" })
        doc.text(formatCurrency(item.price).replace("AED ", ""), tableX[2], tableY, {
          width: tableWidths[2],
          align: "right",
        })
        doc.text(formatCurrency(item.quantity * item.price).replace("AED ", ""), tableX[3], tableY, {
          width: tableWidths[3],
          align: "right",
        })

        tableY += rowHeight
      })

      // Add a line after the table
      doc
        .lineCap("butt")
        .moveTo(50, tableY + 10)
        .lineTo(doc.page.width - 50, tableY + 10)
        .stroke()

      // Summary section
      const summaryX = 350
      let summaryY = tableY + 20

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Subtotal:", summaryX, summaryY)
        .text(formatCurrency(invoice.subtotal).replace("AED ", ""), summaryX + 100, summaryY, { align: "right" })

      // Add taxes if available
      if (invoice.taxes && Array.isArray(invoice.taxes)) {
        invoice.taxes
          .filter((tax) => tax.enabled)
          .forEach((tax, index) => {
            summaryY += 15
            const taxAmount = (invoice.subtotal * tax.rate) / 100

            doc
              .text(`${tax.name} (${tax.rate}%):`, summaryX, summaryY)
              .text(formatCurrency(taxAmount).replace("AED ", ""), summaryX + 100, summaryY, { align: "right" })
          })
      } else if (invoice.tax) {
        summaryY += 15
        doc
          .text("Tax:", summaryX, summaryY)
          .text(formatCurrency(invoice.tax).replace("AED ", ""), summaryX + 100, summaryY, { align: "right" })
      }

      // Add a line before total
      doc
        .lineCap("butt")
        .moveTo(summaryX, summaryY + 10)
        .lineTo(doc.page.width - 50, summaryY + 10)
        .stroke()

      // Total
      summaryY += 20
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Total:", summaryX, summaryY)
        .text(formatCurrency(invoice.total).replace("AED ", ""), summaryX + 100, summaryY, { align: "right" })

      // Notes section
      if (invoice.notes) {
        doc.moveDown(2)
        doc.fontSize(10).font("Helvetica-Bold").text("Notes:")
        doc.fontSize(10).font("Helvetica").text(invoice.notes)
      }

      // Terms and conditions
      doc.moveDown(2)
      doc.fontSize(10).font("Helvetica-Bold").text("Terms and Conditions:")
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(invoice.termsAndConditions || "Standard terms and conditions apply.")

      // Footer
      const footerY = doc.page.height - 50
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Thank you for your business!", { align: "center" })
        .moveDown(0.5)
        .fontSize(8)
        .text("Nubras Tailoring LLC • Dubai, UAE • Tax Registration: 12345678", { align: "center" })

      // Finalize the PDF and end the stream
      doc.end()

      stream.on("finish", () => {
        // Get the blob and resolve the promise
        const blob = stream.toBlob("application/pdf")
        resolve(blob)
      })

      stream.on("error", (err) => {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// Function to generate and download PDF
export async function generateAndDownloadInvoice(invoice: Invoice, fileName?: string): Promise<void> {
  try {
    const blob = await generateInvoicePDF(invoice)
    FileSaver.saveAs(blob, fileName || `Invoice-${invoice.invoiceNumber}.pdf`)
    return Promise.resolve()
  } catch (error) {
    console.error("Error generating PDF:", error)
    return Promise.reject(error)
  }
}
