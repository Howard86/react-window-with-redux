const path = require('path');

module.exports = {
  '**/*.{json,md}': ['prettier --write'],
  '**/*.{ts,tsx}': (filenames) =>
    `next lint --fix --file ${filenames
      .map((file) => path.relative(process.cwd(), file))
      .join(' --file ')}`,
};
