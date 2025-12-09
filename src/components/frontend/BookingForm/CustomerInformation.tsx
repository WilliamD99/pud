import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

export default function CustomerInformation() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            4
          </span>
          <CardTitle className="text-lg">Your Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Jane"
              // value={formData.firstName}
              // onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              // value={formData.lastName}
              // onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              // value={formData.email}
              // onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              // value={formData.phone}
              // onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any allergies, preferences, or special requests..."
              // value={formData.notes}
              // onChange={handleInputChange}
              className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
