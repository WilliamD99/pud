import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo'
import type { PayloadRequest } from 'payload'

// Brevo Email API
export async function sendEmail(req: PayloadRequest, to: string, subject: string, html: string) {
  const emailConfig = await req.payload.findGlobal({
    slug: 'emailSettings',
  })
  const apiKey = emailConfig.apiKey
  const sender = emailConfig.sender

  const emailAPI = new TransactionalEmailsApi()
  emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey)

  const sendSmtpEmail = new SendSmtpEmail()
  sendSmtpEmail.subject = subject
  sendSmtpEmail.sender = {
    name: 'Me',
    email: sender ?? '',
  }
  sendSmtpEmail.to = [{ email: to, name: 'Test' }]
  sendSmtpEmail.htmlContent = html
  await emailAPI.sendTransacEmail(sendSmtpEmail).catch((error) => {
    console.error(error.toJSON())
  })
}
