#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/03b44b586920dbf7209001e8e4f3f77d78e875e3bf39b721b23bf7597ca1beef/contract';
import endContract from '../../snapshots/03b44b586920dbf7209001e8e4f3f77d78e875e3bf39b721b23bf7597ca1beef/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'risk',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('impact', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('likelihood', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('owner', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('rating', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('riskId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('score', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('Open'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'risk',
        constraint: 'risk_riskId_key',
        columns: ['riskId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
