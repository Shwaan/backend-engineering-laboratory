#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/03beaa8902f55fb8f0a1d1d8439cbf1cf888a4ea2a703e8b6ea25568d09aa223/contract';
import startContract from '../../snapshots/03beaa8902f55fb8f0a1d1d8439cbf1cf888a4ea2a703e8b6ea25568d09aa223/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/41808d16904bc7163f55ba48a0487e44948289421cfd599b103d4c1ad85ceeff/contract';
import endContract from '../../snapshots/41808d16904bc7163f55ba48a0487e44948289421cfd599b103d4c1ad85ceeff/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
