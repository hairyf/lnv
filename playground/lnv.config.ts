import { defineConfig } from '@hairy/lnv'

const config = defineConfig({
  /**
   * Environment variable injection, applied to all LNV scripts
   */
  injects: {
    /**
     * Inject before reading environment variables
     */
    before: {
      DB_TYPE: 'mysql',
      DB_USER: 'root',
      DB_HOST: 'localhost',
      DB_PORT: '3306',
    },

    /**
     * Default loaded environment variable entries
     */
    entries: ['local', 'vault', 'env'],

    /**
     * Inject after reading environment variables
     */
    after: {
      DATABASE_URL: '$DB_TYPE://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME',
    },
  },
  scripts: {
    'prisma': {
      message: 'Running Prisma command',
      options: [
        { value: '', label: 'Validate schema (prisma validate)' },
        { value: '', label: 'Generate Prisma client (prisma generate)' },
        { value: '', label: 'Run migrations (prisma migrate dev)' },
        { value: '', label: 'Format schema (prisma format)' },
        { value: '', label: 'Open Prisma Studio (prisma studio)' },
        { value: '', label: 'Push schema to database (prisma db push)' },
        { value: '', label: 'Pull schema from database (prisma db pull)' },
      ],
      depth: true,
    },
    'prisma:validate': 'prisma validate',
    'prisma:generate': 'prisma generate',
    'prisma:migrate': 'prisma migrate dev',
    'prisma:format': 'prisma format',
    'prisma:studio': 'prisma studio',
    'prisma:db:push': 'prisma db push',
    'prisma:db:pull': 'prisma db pull',
  },
})

export default config
