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
import { EmailConfig } from './global/email'

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
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
        region: process.env.AWS_REGION || 'us-east-1',
      },
    }),
    // storage-adapter-placeholder
  ],
  globals: [StoreSettings, EmailConfig],
  csrf: process.env.CSRF_WHITELIST ? process.env.CSRF_WHITELIST.split(',') : [],
  cors: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'],
})
