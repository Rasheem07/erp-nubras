import { Module, DynamicModule, Global, Provider, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

export const DRIZZLE_OPTIONS = 'DRIZZLE_OPTIONS';
export const DRIZZLE_CLIENT = 'DRIZZLE_CLIENT';

export interface DrizzleModuleOptions<Sch extends Record<string, unknown>> {
  connectionString: string;
  schema: Sch;
}

export interface DrizzleModuleAsyncOptions<Sch extends Record<string, unknown>> {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<DrizzleModuleOptions<Sch>> | DrizzleModuleOptions<Sch>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

@Global()
@Module({})
export class DrizzleModule {
  static forRoot<Sch extends Record<string, unknown>>(opts: DrizzleModuleOptions<Sch>): DynamicModule {
    const optsProv: Provider = { provide: DRIZZLE_OPTIONS, useValue: opts };

    const cliProv: Provider = {
      provide: DRIZZLE_CLIENT,
      useFactory: async () => {
        const logger = new Logger(DrizzleModule.name);
        let lastError: any;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            logger.log(`Attempt ${attempt} to connect to Postgres`);
            const pgClient = new Client({ connectionString: opts.connectionString });
            await pgClient.connect();
            logger.log('Connected to Postgres successfully');
            return drizzle(pgClient, { schema: opts.schema });
          } catch (err: any) {
            lastError = err;
            logger.error(`Connection attempt ${attempt} failed: ${err.message}`);
            if (attempt < MAX_RETRIES) {
              await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            }
          }
        }

        logger.error(
          `All ${MAX_RETRIES} connection attempts failed. Shutting down application.`
        );
        // Graceful shutdown
        process.exit(1);
      },
    };

    return {
      module: DrizzleModule,
      providers: [optsProv, cliProv],
      exports: [cliProv],
    };
  }

  static forRootAsync<Sch extends Record<string, unknown>>(opts: DrizzleModuleAsyncOptions<Sch>): DynamicModule {
    const optsProv: Provider = {
      provide: DRIZZLE_OPTIONS,
      useFactory: opts.useFactory,
      inject: opts.inject || [],
    };

    const cliProv: Provider = {
      provide: DRIZZLE_CLIENT,
      useFactory: async (o: DrizzleModuleOptions<Sch>) => {
        const logger = new Logger(DrizzleModule.name);
        let lastError: any;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            logger.log(`Attempt ${attempt} to connect to Postgres`);
            const pgClient = new Client({ connectionString: o.connectionString });
            await pgClient.connect();
            logger.log('Connected to Postgres successfully');
            return drizzle(pgClient, { schema: o.schema });
          } catch (err: any) {
            lastError = err;
            logger.error(`Connection attempt ${attempt} failed: ${err.message}`);
            if (attempt < MAX_RETRIES) {
              await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            }
          }
        }

        logger.error(
          `All ${MAX_RETRIES} connection attempts failed. Shutting down application.`
        );
        process.exit(1);
      },
      inject: [DRIZZLE_OPTIONS],
    };

    return {
      module: DrizzleModule,
      imports: opts.imports || [],
      providers: [optsProv, cliProv],
      exports: [cliProv],
    };
  }
}
