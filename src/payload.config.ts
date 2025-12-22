// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Technicians } from './collections/Technicians'
import { Services } from './collections/Services'
import { Appointments } from './collections/Appointments'
import { Jobs } from './collections/Jobs'
// import { EmailConfig } from './global/email'
import { Customers } from './collections/Customers'
// import { AppointmentsCollectionConfig } from './global/collection'
import { StoreSettings } from './collections/StoreSettings'

import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Technicians, Services, Appointments, Jobs, Customers],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: {
          prefix: `media-${process.env.S3_BUCKET_PREFIX || ''}`,
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        region: process.env.AWS_REGION!,
      },
    }),
    // storage-adapter-placeholder
  ],
  // globals: [EmailConfig, AppointmentsCollectionConfig],
  globals: [StoreSettings],
  csrf: [], // whitelist of domains to allow cookie auth from
  cors: ['http://localhost:3000', 'localhost:3001'],
})
