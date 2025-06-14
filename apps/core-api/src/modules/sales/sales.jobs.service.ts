import { Injectable, Logger } from "@nestjs/common";
import {CronExpression, Cron } from "@nestjs/schedule";

@Injectable()
export class SalesCronService { 
 
     private readonly logger = new Logger(SalesCronService.name);

     @Cron(CronExpression.EVERY_DAY_AT_1AM)
     async handleMarkOverdues() {
        
     }

     @Cron(CronExpression.EVERY_DAY_AT_1AM)
     async handleDailySalesReport() {

     }

     @Cron(CronExpression.EVERY_WEEK) 
     async handleWeeklySalesReports() {

     }

     @Cron(CronExpression.EVERY_DAY_AT_1AM)
     async alertOnNearingOrders() {

     }

}