#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/03beaa8902f55fb8f0a1d1d8439cbf1cf888a4ea2a703e8b6ea25568d09aa223/contract';
import endContract from '../../snapshots/03beaa8902f55fb8f0a1d1d8439cbf1cf888a4ea2a703e8b6ea25568d09aa223/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/3d3c075c3f11564378f69b52478b5e87891eeb7d46513ad361a2f723b0cbca33/contract';
import startContract from '../../snapshots/3d3c075c3f11564378f69b52478b5e87891eeb7d46513ad361a2f723b0cbca33/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'expiredRegistration',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('expiredAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('normalizedEmail', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('registeredAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'pendingRegistration',
        column: col('lastCodeIssuedAt', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'pendingRegistration',
        column: col('lockedUntil', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'pendingRegistration',
        column: col('resendCount', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'pendingRegistration',
        column: col('resendWindowStartedAt', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'expiredRegistration',
        index: 'expiredRegistration_normalizedEmail_idx_8a5fd4dd',
        columns: ['normalizedEmail'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
