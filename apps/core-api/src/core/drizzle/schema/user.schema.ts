import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  varchar,
  boolean,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core';

// Roles
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  permissions: jsonb('permissions').notNull().$type<string[]>(),
});

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 14 }),
  email: varchar('email', {length: 32}).notNull().unique(),
  password: text('password').notNull(),
  roleId: serial('role_id').notNull().references(() => roles.id),
  twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
  twoFactorType: varchar('two_factor_type', { length: 20 }), // 'email'|'authenticator'
  twoFactorSecret: text('two_factor_secret'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const otps = pgTable("email_otps", {
  id: serial("otp_id"),
  email: varchar('email', {length: 32}).notNull().references(() => users.email),
  otp: varchar("email_otp_token", { length: 8 }),
  expiresIn: timestamp("email_otp_expires_in").notNull(),
  createdAt: timestamp("email_otp_created_at").defaultNow()
}, (table) => [
  primaryKey({ columns: [table.id, table.otp] })
])

// Refresh Tokens
export const refreshTokens = pgTable('refresh_tokens', {
  id: serial("referesh_token_id").primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  tokenHash: text('token_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
  replacedBy: varchar('replaced_by', { length: 36 }),
  expiresAt: timestamp('expires_at').notNull(),
});
