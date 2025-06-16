import fs from 'node:fs/promises'
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
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USER: 'root',
    },

    /**
     * Default loaded environment variable entries
     */
    entries: ['local', 'vault', 'remote'],

    /**
     * Inject after reading environment variables
     */
    after: {
      DATABASE_URL: '$DB_TYPE://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME',
    },
  },
  /**
   * LNV scripts configuration
   */
  scripts: {
    // pnpm run lnv deploy
    deploy: {
      message: 'Deploy the application',
      prompts: [
        {
          key: 'network',
          message: 'Select Your Network',
          options: [
            { value: 'moonchain', label: 'Moonchain' },
            { value: 'moonchainGeneva', label: 'Moonchain Geneva' },
          ],
        },
        {
          key: 'modulePath',
          message: 'Select the module you want to deploy',
          options: async () => {
            const files = await fs.readdir('./ignition/modules')
            return files.map(file => ({
              value: `./ignition/modules/${file}`,
              label: file.replace('.ts', ''),
            }))
          },
        },
      ],
      command: 'hardhat --build-profile production ignition deploy $modulePath --network $network',
    },
    // pnpm run lnv dev
    dev: {
      message: 'Run the development server',
      command: {
        message: 'Select the project you want to run',
        options: [
          {
            value: 'cd packages/project-1 && npm run dev',
            label: 'project-1',
          },
          {
            value: 'cd packages/project-2 && npm run dev',
            label: 'project-2',
          },
        ],
      }
    },
  },
})

export default config
