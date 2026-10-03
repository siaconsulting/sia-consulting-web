import * as migration_20261003_024456_initial_schema from './20261003_024456_initial_schema';
import * as migration_20261003_030000_submission_rate_limits from './20261003_030000_submission_rate_limits';

export const migrations = [
  {
    up: migration_20261003_024456_initial_schema.up,
    down: migration_20261003_024456_initial_schema.down,
    name: '20261003_024456_initial_schema',
  },
  {
    up: migration_20261003_030000_submission_rate_limits.up,
    down: migration_20261003_030000_submission_rate_limits.down,
    name: '20261003_030000_submission_rate_limits'
  },
];
