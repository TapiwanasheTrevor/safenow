"use client"

import { Phone, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Contact {
  id: string
  name: string
  phone: string
  relationship: string
  preferredMethod: "sms" | "whatsapp"
}

interface ContactsListProps {
  contacts: Contact[]
  showActions?: boolean
  onDelete?: (id: string) => void
}

export function ContactsList({ contacts, showActions = true, onDelete }: ContactsListProps) {
  if (contacts.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No emergency contacts added yet</p>
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex-1">
            <p className="font-semibold text-sm">{contact.name}</p>
            <p className="text-xs text-muted-foreground">{contact.phone}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-muted px-2 py-0.5 rounded">{contact.relationship}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {contact.preferredMethod === "whatsapp" ? (
                  <>
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                  </>
                ) : (
                  <>
                    <Phone className="w-3 h-3" />
                    SMS
                  </>
                )}
              </span>
            </div>
          </div>
          {showActions && onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(contact.id)} className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
