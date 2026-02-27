"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Plus, X, Phone, Mail, User } from "lucide-react"

interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email: string
}

interface EmergencyContactFormProps {
  onContactsSubmit: (contacts: EmergencyContact[]) => void
  initialContacts?: EmergencyContact[]
}

export function EmergencyContactForm({ onContactsSubmit, initialContacts = [] }: EmergencyContactFormProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    initialContacts.length > 0 ? initialContacts : [{ name: "", relationship: "", phone: "", email: "" }]
  )

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: "", relationship: "", phone: "", email: "" }])
    }
  }

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index))
    }
  }

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...contacts]
    updated[index][field] = value
    setContacts(updated)
  }

  const handleSubmit = () => {
    const validContacts = contacts.filter(c => c.name && c.phone)
    if (validContacts.length > 0) {
      onContactsSubmit(validContacts)
    }
  }

  const isValid = contacts.some(c => c.name && c.phone)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Emergency Contacts
        </CardTitle>
        <CardDescription>
          Add trusted contacts who will be notified in case of emergency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Contact {index + 1}</span>
              {contacts.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor={`name-${index}`}>Full Name *</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`name-${index}`}
                    placeholder="John Doe"
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`relationship-${index}`}>Relationship</Label>
                <Input
                  id={`relationship-${index}`}
                  placeholder="Parent, Spouse, Friend"
                  value={contact.relationship}
                  onChange={(e) => updateContact(index, "relationship", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`email-${index}`}>Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="john@example.com"
                    value={contact.email}
                    onChange={(e) => updateContact(index, "email", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {contacts.length < 3 && (
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={addContact}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Contact
          </Button>
        )}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Save Emergency Contacts
        </Button>
      </CardContent>
    </Card>
  )
}
