// In your ReportsService (e.g., reports.service.ts)

import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import {
  salesOrder,
  salesOrderItem,
  productCatalog,
  salesTransactions,
} from 'src/core/drizzle/schema';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  /**
   * Fetches a combined daily report for:
   *  • Kandora (with payment breakdowns)
   *  • Gents‐Items
   *  • Junior‐Kid
   *  • Gents‐Jacket
   *  • Footwear
   *
   * Each “section” (except Kandora) includes:
   *   – orders (for today) where at least one item’s categoryName matches section
   *   – daily product‐level totals
   *   – daily overall totals (sum of qty & sum of item_total)
   *   – monthly product‐level totals
   *   – monthly overall totals
   *
   * Kandora section is as before, with all payment CTES included.
   */
  async getMultiSectionDailyReport() {
    const rawSql = sql`
WITH

 global_order_basis AS (
    SELECT
      so.id                  AS order_id,
      ROUND(SUM(soi.base_price * soi.qty) * 1.05, 2) AS expected_total
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi ON soi."orderId" = so.id
    GROUP BY so.id
  ),

 order_payments AS (
  SELECT
    st.order_id AS order_id,
    COALESCE(SUM(CASE WHEN st.payment_method = 'visa' THEN st.amount ELSE 0 END), 0) AS visa_amount,
    COALESCE(SUM(CASE WHEN st.payment_method = 'bank_transfer' THEN st.amount ELSE 0 END), 0) AS bank_amount,
    COALESCE(SUM(CASE WHEN st.payment_method = 'cash' THEN st.amount ELSE 0 END), 0) AS cash_amount
  FROM ${salesTransactions} st
  GROUP BY st.order_id
),

  -- ========================
  -- 1) Kandora Section CTEs
  -- ========================
   -- Pivot each order’s payment methods once per section
    kandora_line_items AS (
    SELECT
      so.id                   AS invoice_id,
      so."created_at"::date      AS sales_date,
      pc.name                 AS product_name,
      soi.qty,
      soi.base_price               AS unit_price,
      CASE
         WHEN so."taxAmount" = 0
      THEN soi."item_total"
        ELSE
         ROUND(soi."unit_price" * soi.qty * 1.05, 2)
      END AS total,
      op.visa_amount,
      op.bank_amount,
      op.cash_amount,
      so.amount_paid           AS paid_amount,
      so."totalAmount"          AS total_amount,
      so."taxAmount"            AS tax_amount,
      so."discountAmount"       AS disc_amount,
      so.amount_pending        AS balance_amount,
      so.sales_person_name      AS sales_person,
      so.delivery_date::date   AS delivery_date,
      so.status               AS order_status,
      so.payment_status        AS order_payment_status
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi ON soi."orderId" = so.id
    JOIN ${productCatalog} pc  ON pc.id       = soi.catelog_id
    LEFT JOIN global_order_basis gob ON gob.order_id = so.id
    LEFT JOIN order_payments      op  ON op.order_id  = so.id
    WHERE pc.category_name = 'kandora'
      AND so."created_at"::date = CURRENT_DATE
  ),


  daily_product_totals_kandora AS (
    SELECT
      ${productCatalog.name}              AS product_name,
      SUM(${salesOrderItem.qty})          AS total_daily_qty,
      SUM(${salesOrderItem.total})        AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
    GROUP BY ${productCatalog.name}
  ),

  daily_overall_kandora AS (
    SELECT
      SUM(${salesOrderItem.qty})          AS total_daily_qty,
      SUM(${salesOrderItem.total})        AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
  ),

  monthly_product_totals_kandora AS (
    SELECT
      ${productCatalog.name}              AS product_name,
      SUM(${salesOrderItem.qty})          AS total_monthly_qty,
      SUM(${salesOrderItem.total})        AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY ${productCatalog.name}
  ),

  monthly_overall_kandora AS (
    SELECT
      SUM(${salesOrderItem.qty})          AS total_monthly_qty,
      SUM(${salesOrderItem.total})        AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
  ),

  daily_payment_methods_kandora AS (
    SELECT
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'visa'
             THEN ${salesTransactions.amount} ELSE 0 END
      ) AS visa_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'bank_transfer'
             THEN ${salesTransactions.amount} ELSE 0 END
      ) AS bank_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'cash'
             THEN ${salesTransactions.amount} ELSE 0 END
      ) AS cash_amount,
      SUM(${salesTransactions.amount})          AS total_paid
    FROM ${salesOrder}
    JOIN ${salesTransactions} ON ${salesTransactions.orderId} = ${salesOrder.id}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
  ),

  monthly_payment_methods_kandora AS (
    SELECT
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'visa'
             THEN ${salesTransactions.amount} ELSE 0 END
      ) AS visa_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'bank_transfer'
             THEN ${salesTransactions.amount} ELSE 0 END
      ) AS bank_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'cash'
             THEN ${salesTransactions.amount} ELSE 0 END
      ) AS cash_amount,
      SUM(${salesTransactions.amount})          AS total_paid
    FROM ${salesOrder}
    JOIN ${salesTransactions} ON ${salesTransactions.orderId} = ${salesOrder.id}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
  ),

  old_payments_kandora AS (
    SELECT
      (${salesTransactions.createdAt}::date)     AS paid_date,
      ${salesTransactions.orderId}               AS paid_invoice_id,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'visa'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS visa_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'bank_transfer'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS bank_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'cash'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS cash_amount,
      SUM(${salesTransactions.amount})           AS total_amount
    FROM ${salesTransactions}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesTransactions.orderId}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND (${salesTransactions.createdAt}::date) < CURRENT_DATE
    GROUP BY
      ${salesTransactions.createdAt}::date,
      ${salesTransactions.orderId}
  ),

  old_payments_summary_kandora AS (
    SELECT
      SUM(visa_amount)                         AS visa_amount,
      SUM(bank_amount)                         AS bank_amount,
      SUM(cash_amount)                         AS cash_amount,
      SUM(total_amount)                        AS total_amount
    FROM old_payments_kandora
  ),

  last_month_payments_kandora AS (
    SELECT
      TO_CHAR(${salesTransactions.createdAt}, 'YYYY-MM')     AS month_year,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'visa'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS visa_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'bank_transfer'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS bank_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'cash'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS cash_amount,
      SUM(${salesTransactions.amount})              AS total_amount
    FROM ${salesTransactions}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesTransactions.orderId}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND ${salesTransactions.createdAt} >= (
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      )
      AND ${salesTransactions.createdAt} < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY TO_CHAR(${salesTransactions.createdAt}, 'YYYY-MM')
  ),

  last_month_pending_kandora AS (
    SELECT
      SUM(${salesOrder.amountPending})         AS last_month_pending
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
        = (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month')
  ),

  last_month_pending_breakdown_kandora AS (
    SELECT
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'visa'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS visa_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'bank_transfer'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS bank_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'cash'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                          AS cash_amount
    FROM ${salesOrder}
    JOIN ${salesTransactions} ON ${salesTransactions.orderId} = ${salesOrder.id}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
        = (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month')
  ),

  current_month_payments_kandora AS (
    SELECT
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'visa'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                              AS visa_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'bank_transfer'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                              AS bank_amount,
      SUM(
        CASE WHEN ${salesTransactions.paymentMethod} = 'cash'
             THEN ${salesTransactions.amount} ELSE 0 END
      )                                              AS cash_amount,
      SUM(${salesTransactions.amount})                AS total_paid_this_month
    FROM ${salesTransactions}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesTransactions.orderId}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'kandora'
      AND DATE_TRUNC('month', ${salesTransactions.createdAt})
        = DATE_TRUNC('month', CURRENT_DATE)
  ),


  -- ===================================
  -- 2) Gents‐Items Section (orders now include payment fields)
  -- ===================================
    gents_items_line_items AS (
    SELECT
      so.id                   AS invoice_id,
      so."created_at"::date      AS sales_date,
      pc.name                 AS product_name,
      soi.qty,
      soi.base_price               AS unit_price,
      CASE
         WHEN so."taxAmount" = 0
      THEN soi."item_total"
        ELSE
         ROUND(soi."unit_price" * soi.qty * 1.05, 2)
      END AS total,
      op.visa_amount,
      op.bank_amount,
      op.cash_amount,
      so.amount_paid           AS paid_amount,
      so."totalAmount"          AS total_amount,
      so."taxAmount"            AS tax_amount,
      so."discountAmount"       AS disc_amount,
      so.amount_pending        AS balance_amount,
      so.sales_person_name      AS sales_person,
      so.delivery_date::date   AS delivery_date,
      so.status               AS order_status,
      so.payment_status        AS order_payment_status
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi ON soi."orderId" = so.id
    JOIN ${productCatalog} pc  ON pc.id       = soi.catelog_id
    LEFT JOIN global_order_basis gob ON gob.order_id = so.id
    LEFT JOIN order_payments      op  ON op.order_id  = so.id
    WHERE pc.category_name = 'gents-items'
      AND so."created_at"::date = CURRENT_DATE
  ),

  daily_product_totals_gents_items AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      COUNT(*)                             AS total_daily_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_daily_qty_sold,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-items'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
    GROUP BY ${productCatalog.name}
  ),

  daily_overall_gents_items AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-items'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
  ),

  monthly_product_totals_gents_items AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      COUNT(*)                             AS total_monthly_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_monthly_qty_sold,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-items'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY ${productCatalog.name}
  ),

  monthly_overall_gents_items AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-items'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
  ),


  -- ===================================
  -- 3) Junior‐Kid Section (orders include payment fields)
  -- ===================================
   junior_kid_line_items AS (
    SELECT
      so.id                   AS invoice_id,
      so."created_at"::date      AS sales_date,
      pc.name                 AS product_name,
      soi.qty,
      soi.base_price               AS unit_price,
      CASE
         WHEN so."taxAmount" = 0
      THEN soi."item_total"
        ELSE
         ROUND(soi."unit_price" * soi.qty * 1.05, 2)
      END AS total,
      op.visa_amount,
      op.bank_amount,
      op.cash_amount,
      so.amount_paid           AS paid_amount,
      so."totalAmount"          AS total_amount,
      so."taxAmount"            AS tax_amount,
      so."discountAmount"       AS disc_amount,
      so.amount_pending        AS balance_amount,
      so.sales_person_name      AS sales_person,
      so.delivery_date::date   AS delivery_date,
      so.status               AS order_status,
      so.payment_status        AS order_payment_status
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi ON soi."orderId" = so.id
    JOIN ${productCatalog} pc  ON pc.id       = soi.catelog_id
    LEFT JOIN global_order_basis gob ON gob.order_id = so.id
    LEFT JOIN order_payments      op  ON op.order_id  = so.id
    WHERE pc.category_name = 'junior-kid'
      AND so."created_at"::date = CURRENT_DATE
  ),


  daily_product_totals_junior_kid AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      COUNT(*)                             AS total_daily_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_daily_qty_sold,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'junior-kid'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
    GROUP BY ${productCatalog.name}
  ),

  daily_overall_junior_kid AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'junior-kid'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
  ),

  monthly_product_totals_junior_kid AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      COUNT(*)                             AS total_monthly_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_monthly_qty_sold,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'junior-kid'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY ${productCatalog.name}
  ),

  monthly_overall_junior_kid AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'junior-kid'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
  ),


  -- ===================================
  -- 4) Gents‐Jacket Section (orders include payment fields)
  -- ===================================
     gents_jacket_line_items AS (
    SELECT
      so.id                   AS invoice_id,
      so."created_at"::date      AS sales_date,
      pc.name                 AS product_name,
      soi.qty,
      soi.base_price               AS unit_price,
      CASE
         WHEN so."taxAmount" = 0
      THEN soi."item_total"
        ELSE
         ROUND(soi."unit_price" * soi.qty * 1.05, 2)
      END AS total,
      op.visa_amount,
      op.bank_amount,
      op.cash_amount,
      so.amount_paid           AS paid_amount,
      so."totalAmount"          AS total_amount,
      so."taxAmount"            AS tax_amount,
      so."discountAmount"       AS disc_amount,
      so.amount_pending        AS balance_amount,
      so.sales_person_name      AS sales_person,
      so.delivery_date::date   AS delivery_date,
      so.status               AS order_status,
      so.payment_status        AS order_payment_status
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi ON soi."orderId" = so.id
    JOIN ${productCatalog} pc  ON pc.id       = soi.catelog_id
    LEFT JOIN global_order_basis gob ON gob.order_id = so.id
    LEFT JOIN order_payments      op  ON op.order_id  = so.id
    WHERE pc.category_name = 'gents-jacket'
      AND so."created_at"::date = CURRENT_DATE
  ),

  daily_product_totals_gents_jacket AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      COUNT(*)                             AS total_daily_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_daily_qty_sold,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-jacket'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
    GROUP BY ${productCatalog.name}
  ),

  daily_overall_gents_jacket AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-jacket'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
  ),

  monthly_product_totals_gents_jacket AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      COUNT(*)                             AS total_monthly_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_monthly_qty_sold,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-jacket'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY ${productCatalog.name}
  ),

  monthly_overall_gents_jacket AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'gents-jacket'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
  ),


  -- ===================================
  -- 5) Footwear Section (orders include payment fields)
  -- ===================================
  footwear_line_items AS (
    SELECT
      so.id                   AS invoice_id,
      so."created_at"::date      AS sales_date,
      pc.name                 AS product_name,
      soi.qty,
      soi.base_price               AS unit_price,
      CASE
         WHEN so."taxAmount" = 0
      THEN soi."item_total"
        ELSE
         ROUND(soi."unit_price" * soi.qty * 1.05, 2)
      END AS total,
      op.visa_amount,
      op.bank_amount,
      op.cash_amount,
      so.amount_paid           AS paid_amount,
      so."totalAmount"          AS total_amount,
      so."taxAmount"            AS tax_amount,
      so."discountAmount"       AS disc_amount,
      so.amount_pending        AS balance_amount,
      so.sales_person_name      AS sales_person,
      so.delivery_date::date   AS delivery_date,
      so.status               AS order_status,
      so.payment_status        AS order_payment_status
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi ON soi."orderId" = so.id
    JOIN ${productCatalog} pc  ON pc.id       = soi.catelog_id
    LEFT JOIN global_order_basis gob ON gob.order_id = so.id
    LEFT JOIN order_payments      op  ON op.order_id  = so.id
    WHERE pc.category_name = 'footwear'
      AND so."created_at"::date = CURRENT_DATE
  ),

  daily_product_totals_footwear AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      COUNT(*)                             AS total_daily_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_daily_qty_sold,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'footwear'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
    GROUP BY ${productCatalog.name}
  ),

  daily_overall_footwear AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_daily_qty,
      SUM(${salesOrderItem.total})         AS total_daily_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'footwear'
      AND (${salesOrder.createdAt}::date) = CURRENT_DATE
  ),

  monthly_product_totals_footwear AS (
    SELECT
      ${productCatalog.name}               AS product_name,
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      COUNT(*)                             AS total_monthly_sales_count,
      AVG(${salesOrderItem.qty})           AS avg_monthly_qty_sold,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'footwear'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY ${productCatalog.name}
  ),

  daily_section_summary AS (
    SELECT
      pc.category_name        AS section,
      COALESCE(SUM(CASE WHEN st.payment_method='visa'         THEN st.amount ELSE 0 END),0) AS visa_amount,
      COALESCE(SUM(CASE WHEN st.payment_method='bank_transfer' THEN st.amount ELSE 0 END),0) AS bank_amount,
      COALESCE(SUM(CASE WHEN st.payment_method='cash'         THEN st.amount ELSE 0 END),0) AS cash_amount,
      COALESCE(SUM(so.amount_paid),0)               AS paid_amount,
      COALESCE(SUM(so."totalAmount"),0)              AS total_amount,
      COALESCE(SUM(so."taxAmount"),0)                AS tax_amount,
      COALESCE(SUM(so.amount_pending),0)            AS balance_amount
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi   ON soi."orderId" = so.id
    JOIN ${productCatalog} pc   ON pc.id         = soi.catelog_id
    LEFT JOIN ${salesTransactions} st ON st.order_id = so.id
    WHERE so."created_at"::date = CURRENT_DATE
    GROUP BY pc.category_name
),

  -- 7) Overall by section for **this month**
 monthly_section_summary AS (
    SELECT
      pc.category_name        AS section,
      COALESCE(SUM(CASE WHEN st.payment_method='visa'         THEN st.amount ELSE 0 END),0) AS visa_amount,
      COALESCE(SUM(CASE WHEN st.payment_method='bank_transfer' THEN st.amount ELSE 0 END),0) AS bank_amount,
      COALESCE(SUM(CASE WHEN st.payment_method='cash'         THEN st.amount ELSE 0 END),0) AS cash_amount,
      COALESCE(SUM(so.amount_paid),0)               AS paid_amount,
      COALESCE(SUM(so."totalAmount"),0)              AS total_amount,
      COALESCE(SUM(so."taxAmount"),0)                AS tax_amount,
      COALESCE(SUM(so.amount_pending),0)            AS balance_amount
    FROM ${salesOrder} so
    JOIN ${salesOrderItem} soi   ON soi."orderId" = so.id
    JOIN ${productCatalog} pc   ON pc.id         = soi.catelog_id
    LEFT JOIN ${salesTransactions} st ON st.order_id = so.id
    WHERE DATE_TRUNC('month', so."created_at") = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY pc.category_name
),

  monthly_overall_footwear AS (
    SELECT
      SUM(${salesOrderItem.qty})           AS total_monthly_qty,
      SUM(${salesOrderItem.total})         AS total_monthly_amount
    FROM ${salesOrder}
    JOIN ${salesOrderItem} ON ${salesOrderItem.orderId} = ${salesOrder.id}
    JOIN ${productCatalog} ON ${productCatalog.id} = ${salesOrderItem.catelogId}
    WHERE ${productCatalog.categoryName} = 'footwear'
      AND DATE_TRUNC('month', ${salesOrder.createdAt})
          = DATE_TRUNC('month', CURRENT_DATE)
  ),

  overall_last_month_pending AS (
        SELECT
          SUM(so.amount_pending)::numeric(12,2) AS last_month_pending
        FROM ${salesOrder} so
        WHERE DATE_TRUNC('month', so."created_at")
          = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      ),

      -- 2) of that last-month balance, how much got paid **this** month
      overall_old_balance_received AS (
        SELECT
          SUM(CASE WHEN st.payment_method = 'visa'         THEN st.amount ELSE 0 END)::numeric(12,2) AS visa_amount,
          SUM(CASE WHEN st.payment_method = 'bank_transfer' THEN st.amount ELSE 0 END)::numeric(12,2) AS bank_amount,
          SUM(CASE WHEN st.payment_method = 'cash'         THEN st.amount ELSE 0 END)::numeric(12,2) AS cash_amount,
          SUM(st.amount)::numeric(12,2) AS total_old_received
        FROM ${salesTransactions} st
        JOIN ${salesOrder} so
          ON so.id = st.order_id
        WHERE
          -- only payments **this** month
          DATE_TRUNC('month', st.created_at) = DATE_TRUNC('month', CURRENT_DATE)
          -- but applied to orders created **last** month
          AND DATE_TRUNC('month', so."created_at")
            = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      ),

      -- 3) all payments (new + old) **this** month, across every order
      overall_current_month_payments AS (
        SELECT
          SUM(CASE WHEN st.payment_method = 'visa'         THEN st.amount ELSE 0 END)::numeric(12,2) AS visa_amount,
          SUM(CASE WHEN st.payment_method = 'bank_transfer' THEN st.amount ELSE 0 END)::numeric(12,2) AS bank_amount,
          SUM(CASE WHEN st.payment_method = 'cash'         THEN st.amount ELSE 0 END)::numeric(12,2) AS cash_amount,
          SUM(st.amount)::numeric(12,2) AS total_current_paid
        FROM ${salesTransactions} st
        WHERE DATE_TRUNC('month', st.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      )

SELECT
  (SELECT json_agg(kli) FROM kandora_line_items      kli) AS kandora_orders,
  (SELECT json_agg(dp)  FROM daily_product_totals_kandora dp)  AS kandora_daily_products,
  (SELECT row_to_json(do_) FROM daily_overall_kandora do_)     AS kandora_daily_overall,
  (SELECT json_agg(mp)  FROM monthly_product_totals_kandora mp) AS kandora_monthly_products,
  (SELECT row_to_json(mo_) FROM monthly_overall_kandora mo_)   AS kandora_monthly_overall,
  (SELECT row_to_json(dpm) FROM daily_payment_methods_kandora dpm) AS kandora_payment_today,
  (SELECT row_to_json(mpm) FROM monthly_payment_methods_kandora mpm) AS kandora_payment_month,
  (SELECT json_agg(op_) FROM old_payments_kandora op_)        AS kandora_old_payments,
  (SELECT row_to_json(ops) FROM old_payments_summary_kandora ops) AS kandora_old_payments_summary,
  (SELECT row_to_json(lm_) FROM last_month_payments_kandora lm_) AS kandora_last_month_payments,
  (SELECT row_to_json(lmp) FROM last_month_pending_kandora lmp)   AS kandora_last_month_pending,
  (SELECT row_to_json(lmb) FROM last_month_pending_breakdown_kandora lmb) AS kandora_last_month_pending_breakdown,
  (SELECT row_to_json(cmp) FROM current_month_payments_kandora cmp)    AS kandora_current_month_payments,

  (SELECT json_agg(gili) FROM gents_items_line_items       gili) AS gentsItems_orders,
  (SELECT json_agg(dpgi) FROM daily_product_totals_gents_items dpgi) AS gentsItems_daily_products,
  (SELECT row_to_json(dogi) FROM daily_overall_gents_items dogi)     AS gentsItems_daily_overall,
  (SELECT json_agg(mpgi) FROM monthly_product_totals_gents_items mpgi) AS gentsItems_monthly_products,
  (SELECT row_to_json(mogi) FROM monthly_overall_gents_items mogi)     AS gentsItems_monthly_overall,

  (SELECT json_agg(jkli) FROM junior_kid_line_items      jkli)   AS juniorKid_orders,
  (SELECT json_agg(dpjk) FROM daily_product_totals_junior_kid dpjk) AS juniorKid_daily_products,
  (SELECT row_to_json(dojk) FROM daily_overall_junior_kid dojk)     AS juniorKid_daily_overall,
  (SELECT json_agg(mpjk) FROM monthly_product_totals_junior_kid mpjk) AS juniorKid_monthly_products,
  (SELECT row_to_json(mojk) FROM monthly_overall_junior_kid mojk)     AS juniorKid_monthly_overall,

  (SELECT json_agg(gjli) FROM gents_jacket_line_items    gjli)  AS "gentsJacket_orders",
  (SELECT json_agg(dpgj) FROM daily_product_totals_gents_jacket dpgj) AS "gentsJacket_daily_products",
  (SELECT row_to_json(dogj) FROM daily_overall_gents_jacket dogj)     AS "gentsJacket_daily_overall",
  (SELECT json_agg(mpgj) FROM monthly_product_totals_gents_jacket mpgj) AS "gentsJacket_monthly_products",
  (SELECT row_to_json(mogj) FROM monthly_overall_gents_jacket mogj)     AS "gentsJacket_monthly_overall",

  (SELECT json_agg(fli) FROM footwear_line_items         fli)   AS footwear_orders,
  (SELECT json_agg(dpf) FROM daily_product_totals_footwear dpf)   AS footwear_daily_products,
  (SELECT row_to_json(dof) FROM daily_overall_footwear   dof)     AS footwear_daily_overall,
  (SELECT json_agg(mpf) FROM monthly_product_totals_footwear mpf)   AS footwear_monthly_products,
  (SELECT row_to_json(mof) FROM monthly_overall_footwear mof)     AS footwear_monthly_overall,

  (SELECT json_agg(dss) FROM daily_section_summary    dss) AS daily_section_summary,
  (SELECT json_agg(mss) FROM monthly_section_summary mss) AS monthly_section_summary,
    ( SELECT json_build_object(
          'last_month_pending',    olmp.last_month_pending,
          'old_received',          oor.total_old_received,
          'breakdown',             json_build_object(
                                      'visa', oor.visa_amount,
                                      'bank', oor.bank_amount,
                                      'cash', oor.cash_amount,
                                      'total', oor.total_old_received
                                    )
        )
        FROM overall_last_month_pending olmp
        CROSS JOIN overall_old_balance_received oor
      ) AS overall_last_month_summary,

      -- B) total received (old-balance + **all** current payments)
      ( SELECT json_build_object(
          'old_balance_paid',      oor.total_old_received,
          'current_paid',          ocmp.total_current_paid,
          'total_received',        (oor.total_old_received + ocmp.total_current_paid)
        )
        FROM overall_old_balance_received oor
        CROSS JOIN overall_current_month_payments ocmp
      ) AS overall_received_summary,

      -- C) overall sales vs pending **this** month
      ( SELECT json_build_object(
          'total_sales',   SUM(soi.item_total)::numeric(12,2),
          'total_pending', SUM(so.amount_pending)::numeric(12,2)
        )
        FROM ${salesOrder} so
        JOIN ${salesOrderItem} soi
          ON soi."orderId" = so.id
        WHERE DATE_TRUNC('month', so."created_at") = DATE_TRUNC('month', CURRENT_DATE)
      ) AS overall_month_summary
    
;`;

    // ───────────────────────────────────────────────────────────────────────
    // 3) Execute the single‐string query; parse each JSON blob or return []/{}.
    // ───────────────────────────────────────────────────────────────────────
    const result = await this.db.execute<{
      kandora_orders: string | null;
      kandora_daily_products: string | null;
      kandora_daily_overall: string | null;
      kandora_monthly_products: string | null;
      kandora_monthly_overall: string | null;
      kandora_payment_today: string | null;
      kandora_payment_month: string | null;
      kandora_old_payments: string | null;
      kandora_old_payments_summary: string | null;
      kandora_last_month_payments: string | null;
      kandora_last_month_pending: string | null;
      kandora_last_month_pending_breakdown: string | null;
      kandora_current_month_payments: string | null;

      gentsitems_orders: string | null;
      gentsitems_daily_products: string | null;
      gentsitems_daily_overall: string | null;
      gentsitems_monthly_products: string | null;
      gentsitems_monthly_overall: string | null;

      juniorkid_orders: string | null;
      juniorkid_daily_products: string | null;
      juniorkid_daily_overall: string | null;
      juniorkid_monthly_products: string | null;
      juniorkid_monthly_overall: string | null;

      gentsJacket_orders: string | null;
      gentsJacket_daily_products: string | null;
      gentsJacket_daily_overall: string | null;
      gentsJacket_monthly_products: string | null;
      gentsJacket_monthly_overall: string | null;

      footwear_orders: string | null;
      footwear_daily_products: string | null;
      footwear_daily_overall: string | null;
      footwear_monthly_products: string | null;
      footwear_monthly_overall: string | null;

      daily_section_summary: string | null;
      monthly_section_summary: string | null;
      overall_last_month_summary: string | null;
      overall_received_summary: string | null;
      overall_month_summary: string | null;
    }>(rawSql);

    const row = result.rows[0];

    console.log(row);
    return {
      kandora: {
        orders:
          typeof row.kandora_orders === 'string'
            ? JSON.parse(row.kandora_orders)
            : row.kandora_orders || [],
        dailyProducts:
          typeof row.kandora_daily_products === 'string'
            ? JSON.parse(row.kandora_daily_products)
            : row.kandora_daily_products || [],
        dailyOverall:
          typeof row.kandora_daily_overall === 'string'
            ? JSON.parse(row.kandora_daily_overall)
            : row.kandora_daily_overall || {},
        monthlyProducts:
          typeof row.kandora_monthly_products === 'string'
            ? JSON.parse(row.kandora_monthly_products)
            : row.kandora_monthly_products || [],
        monthlyOverall:
          typeof row.kandora_monthly_overall === 'string'
            ? JSON.parse(row.kandora_monthly_overall)
            : row.kandora_monthly_overall || {},
        paymentToday:
          typeof row.kandora_payment_today === 'string'
            ? JSON.parse(row.kandora_payment_today)
            : row.kandora_payment_today || {},
        paymentMonth:
          typeof row.kandora_payment_month === 'string'
            ? JSON.parse(row.kandora_payment_month)
            : row.kandora_payment_month || {},
        oldPayments:
          typeof row.kandora_old_payments === 'string'
            ? JSON.parse(row.kandora_old_payments)
            : row.kandora_old_payments || [],
        oldPaymentsSum:
          typeof row.kandora_old_payments_summary === 'string'
            ? JSON.parse(row.kandora_old_payments_summary)
            : row.kandora_old_payments_summary || {},
        lastMonthPayments:
          typeof row.kandora_last_month_payments === 'string'
            ? JSON.parse(row.kandora_last_month_payments)
            : row.kandora_last_month_payments || {},
        lastMonthPending:
          typeof row.kandora_last_month_pending === 'string'
            ? JSON.parse(row.kandora_last_month_pending)
            : row.kandora_last_month_pending || {},
        lastMonthPendBreakdown:
          typeof row.kandora_last_month_pending_breakdown === 'string'
            ? JSON.parse(row.kandora_last_month_pending_breakdown)
            : row.kandora_last_month_pending_breakdown || {},
        currentMonthPayments:
          typeof row.kandora_current_month_payments === 'string'
            ? JSON.parse(row.kandora_current_month_payments)
            : row.kandora_current_month_payments || {},
      },

      gentsItems: {
        orders:
          typeof row.gentsitems_orders === 'string'
            ? JSON.parse(row.gentsitems_orders)
            : row.gentsitems_orders || [],
        dailyProducts:
          typeof row.gentsitems_daily_products === 'string'
            ? JSON.parse(row.gentsitems_daily_products)
            : row.gentsitems_daily_products || [],
        dailyOverall:
          typeof row.gentsitems_daily_overall === 'string'
            ? JSON.parse(row.gentsitems_daily_overall)
            : row.gentsitems_daily_overall || {},
        monthlyProducts:
          typeof row.gentsitems_monthly_products === 'string'
            ? JSON.parse(row.gentsitems_monthly_products)
            : row.gentsitems_monthly_products || [],
        monthlyOverall:
          typeof row.gentsitems_monthly_overall === 'string'
            ? JSON.parse(row.gentsitems_monthly_overall)
            : row.gentsitems_monthly_overall || {},
      },

      juniorKid: {
        orders:
          typeof row.juniorkid_orders === 'string'
            ? JSON.parse(row.juniorkid_orders)
            : row.juniorkid_orders || [],
        dailyProducts:
          typeof row.juniorkid_daily_products === 'string'
            ? JSON.parse(row.juniorkid_daily_products)
            : row.juniorkid_daily_products || [],
        dailyOverall:
          typeof row.juniorkid_daily_overall === 'string'
            ? JSON.parse(row.juniorkid_daily_overall)
            : row.juniorkid_daily_overall || {},
        monthlyProducts:
          typeof row.juniorkid_monthly_products === 'string'
            ? JSON.parse(row.juniorkid_monthly_products)
            : row.juniorkid_monthly_products || [],
        monthlyOverall:
          typeof row.juniorkid_monthly_overall === 'string'
            ? JSON.parse(row.juniorkid_monthly_overall)
            : row.juniorkid_monthly_overall || {},
      },

      gentsJacket: {
        orders:
          typeof row.gentsJacket_orders === 'string'
            ? JSON.parse(row.gentsJacket_orders)
            : row.gentsJacket_orders || [],
        dailyProducts:
          typeof row.gentsJacket_daily_products === 'string'
            ? JSON.parse(row.gentsJacket_daily_products)
            : row.gentsJacket_daily_products || [],
        dailyOverall:
          typeof row.gentsJacket_daily_overall === 'string'
            ? JSON.parse(row.gentsJacket_daily_overall)
            : row.gentsJacket_daily_overall || {},
        monthlyProducts:
          typeof row.gentsJacket_monthly_products === 'string'
            ? JSON.parse(row.gentsJacket_monthly_products)
            : row.gentsJacket_monthly_products || [],
        monthlyOverall:
          typeof row.gentsJacket_monthly_overall === 'string'
            ? JSON.parse(row.gentsJacket_monthly_overall)
            : row.gentsJacket_monthly_overall || {},
      },

      footwear: {
        orders:
          typeof row.footwear_orders === 'string'
            ? JSON.parse(row.footwear_orders)
            : row.footwear_orders || [],
        dailyProducts:
          typeof row.footwear_daily_products === 'string'
            ? JSON.parse(row.footwear_daily_products)
            : row.footwear_daily_products || [],
        dailyOverall:
          typeof row.footwear_daily_overall === 'string'
            ? JSON.parse(row.footwear_daily_overall)
            : row.footwear_daily_overall || {},
        monthlyProducts:
          typeof row.footwear_monthly_products === 'string'
            ? JSON.parse(row.footwear_monthly_products)
            : row.footwear_monthly_products || [],
        monthlyOverall:
          typeof row.footwear_monthly_overall === 'string'
            ? JSON.parse(row.footwear_monthly_overall)
            : row.footwear_monthly_overall || {},
      },

      dailySectionSummary:
        typeof row.daily_section_summary === 'string'
          ? JSON.parse(row.daily_section_summary)
          : [],
      monthlySectionSummary:
        typeof row.monthly_section_summary === 'string'
          ? JSON.parse(row.monthly_section_summary)
          : [],
      overallLastMonth: row.overall_last_month_summary || {},

      // 3) total received (old + all current)
      overallReceived: row.overall_received_summary || {},

      // 4) overall monthly sales vs pending
      overallMonth: row.overall_month_summary || {},
    };
  }
}
