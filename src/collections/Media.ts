import type { CollectionConfig } from 'payload'

// The files currently being saved to local system.
// This works good for demo site, but for real production, suggesting to use cloud provider
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}
