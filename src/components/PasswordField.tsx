'use client'
import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

import { EyeIcon, EyeClosedIcon } from 'lucide-react'

const PasswordField: TextFieldClientComponent = ({ path, field }) => {
  const [show, setShow] = useState(false)
  const { value, setValue } = useField<string>({ path })

  const label = String(field.label || field.name)

  return (
    <div className="field-type text">
      <label className="field-label" htmlFor={path}>
        {label}
      </label>
      <div
        className="password-field-wrapper"
        style={{
          position: 'relative',
        }}
      >
        <button
          type="button"
          className="password-preview-toggle"
          style={{
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '100%',
            cursor: 'pointer',
          }}
        >
          {show ? (
            <EyeClosedIcon size={16} onClick={() => setShow(false)} />
          ) : (
            <EyeIcon size={16} onClick={() => setShow(true)} />
          )}
        </button>
        <input
          id={path}
          name={path}
          type={show ? 'text' : 'password'}
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  )
}

export default PasswordField
