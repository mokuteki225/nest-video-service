import { Inject } from '@nestjs/common';

import { setDatabaseFeatureToken } from '../providers/database.provider';

export const InjectRepository = (table: string) => {
  return Inject(setDatabaseFeatureToken(table));
};
