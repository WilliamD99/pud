import encryptionHooks from '@/hooks/encryptionHooks'
import { GlobalConfig } from 'payload'

export const EmailConfig: GlobalConfig = {
  slug: 'emailSettings',
  access: {
    read: ({ req }) => !!req.user && req.user?.role === 'admin',
    update: ({ req }) => !!req.user && req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      options: [
        {
          label: 'Brevo',
          value: 'brevo',
        },
      ],
    },
    {
      name: 'apiKey',
      type: 'text',
      required: true,
      admin: {
        components: {
          Field: '@/components/admin/PasswordField',
        },
      },
      hooks: encryptionHooks,
    },
    {
      name: 'brevoSenderList',
      label: 'Brevo Sender List',
      type: 'text',
      // options: [],
      admin: {
        components: {
          Field: '@/components/admin/BrevoSenderListSelect/server',
        },
        condition: (data) => data?.apiKey,
      },
    },
  ],
}
