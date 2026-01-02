'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'
import { Select } from '@payloadcms/ui'
import { ShieldAlertIcon } from 'lucide-react'
export default function BrevoSenderListSelectClient({
  senderList,
}: {
  senderList: {
    id: number
    name: string
    email: string
    active: boolean
    ips: []
  }[]
}) {
  const { value, setValue } = useField<string>({ path: 'brevoSenderList' })
  return (
    <div className="field-type">
      <label className="field-label" htmlFor="senderList">
        Brevo Sender List{' '}
        {senderList.length === 0 && (
          <ShieldAlertIcon size={16} style={{ marginLeft: '6px', color: 'red' }} />
        )}
      </label>
      {senderList.length === 0 && (
        <p
          className="field-description"
          style={{ color: 'red', marginBottom: '10px', fontSize: '10px', fontStyle: 'italic' }}
        >
          API key is invalid, please check your API key. After checking, please save and refresh the
          page.
        </p>
      )}
      <div className="field-type__wrap">
        <div className="relationship__wrap">
          <div className="react-select-container">
            <div className="react-select"></div>
          </div>
        </div>
      </div>
      <Select
        id="senderList"
        onChange={(e: any) => setValue(e.value)}
        value={value ? { label: value, value: value } : undefined}
        placeholder="Select a sender list"
        options={senderList.map((sender) => ({
          label: sender.email,
          value: sender.email,
        }))}
      />
      <input type="hidden" name="brevoSenderList" value={value ?? ''} />
    </div>
  )
}
