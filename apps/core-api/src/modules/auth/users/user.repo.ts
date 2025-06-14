import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, sql, lt, desc } from 'drizzle-orm';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { otps, refreshTokens, roles, users } from 'src/core/drizzle/schema/user.schema';

// Roles Repository
@Injectable()
export class RolesRepo {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async findOne(id: number): Promise<typeof roles.$inferSelect | null> {
    const result = await this.db.select().from(roles).where(eq(roles.id, id));
    return result[0] || null;
  }

  async findMany(): Promise<(typeof roles.$inferSelect)[]> {
    return await this.db.select().from(roles);
  }

  async create(
    data: Omit<typeof roles.$inferSelect, 'id'>,
  ): Promise<typeof roles.$inferSelect> {
    const result = await this.db.insert(roles).values(data).returning();
    return result[0];
  }

  async updateOne(
    id: number,
    data: Partial<typeof roles.$inferSelect>,
  ): Promise<typeof roles.$inferSelect> {
    const result = await this.db
      .update(roles)
      .set(data)
      .where(eq(roles.id, id))
      .returning();
    return result[0];
  }

  async deleteOne(id: number): Promise<void> {
    await this.db.delete(roles).where(eq(roles.id, id));
  }
}

// Users Repository
@Injectable()
export class UsersRepo {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async findUserWithRoles(email: string) {
    const result = await this.db
      .select()
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email));

    return result[0] || null;
  }

  async findOne(id: number): Promise<typeof users.$inferSelect | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  async findMany(): Promise<(typeof users.$inferSelect)[]> {
    return await this.db.select().from(users);
  }

  async create(
    data: Omit<typeof users.$inferSelect, 'id'>,
  ): Promise<typeof users.$inferSelect> {
    const result = await this.db.insert(users).values(data).returning();
    return result[0];
  }

  async updateOne(
    id: number,
    data: Partial<typeof users.$inferSelect>,
  ): Promise<typeof users.$inferSelect> {
    const result = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async enableAndStoreTotpSecret(email: string, token: string) {
    await this.db
      .update(users)
      .set({
        twoFactorEnabled: true,
        twoFactorType: 'authenticator',
        twoFactorSecret: token,
      })
      .where(eq(users.email, email));
  }

  async deleteOne(id: number): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async findByEmail(email: string): Promise<(typeof users.$inferSelect)[]> {
    return await this.db.select().from(users).where(eq(users.email, email));
  }
}

// OTPs Repository
@Injectable()
export class OtpsRepo {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async CheckIfOtpExists(
    email: string,
    otp: string,
  ): Promise<(typeof otps.$inferSelect)[]> {
    return await this.db
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), eq(otps.otp, otp)))
      .orderBy(desc(otps.createdAt))
      .limit(1);
  }

  async create(email: string, otp: string): Promise<typeof otps.$inferSelect> {
    const expiresIn = sql`NOW() + INTERVAL '10 minutes'`;
    const result = await this.db
      .insert(otps)
      .values({
        email,
        otp,
        expiresIn,
      })
      .returning();
    return result[0];
  }

  async deleteAfterSuccess(id: number) {
    await this.db.delete(otps).where(eq(otps.id, id));
  }

  async deleteExpiredOTPs(): Promise<void> {
    await this.db.delete(otps).where(eq(otps.expiresIn, null));
  }
}

// Refresh Tokens Repository
@Injectable()
export class RefreshTokensRepo {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async StoreRefreshToken(tokenHash: string, userId: number) {
    const expiresAt = sql`NOW() + INTERVAL '7 days'`;
    await this.db
      .insert(refreshTokens)
      .values({ userId, tokenHash, expiresAt });
  }

  async revokeToken(id: number): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: sql`NOW()` })
      .where(eq(refreshTokens.id, id));
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.db
      .delete(refreshTokens)
      .where(
        and(
          eq(refreshTokens.revokedAt, null),
          lt(refreshTokens.expiresAt, new Date()),
        ),
      );
  }
}
