import type { Payload } from 'payload'
import React from 'react'
import BrevoSenderListSelectClient from './client'

// Fetch Brevo Sender List
const getSender = async (key: string) => {
  const res = await fetch('https://api.brevo.com/v3/senders', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'api-key': key,
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    return { senders: [] }
  }
  const data = await res.json()
  return data
}

const BrevoSenderListSelect = async ({ payload }: { payload: Payload }) => {
  const emailConfig = await payload.findGlobal({
    slug: 'emailSettings',
  })
  const brevoApi = emailConfig.apiKey
  const senderList = await getSender(brevoApi)
  return <BrevoSenderListSelectClient senderList={senderList.senders} />
}

export default BrevoSenderListSelect
