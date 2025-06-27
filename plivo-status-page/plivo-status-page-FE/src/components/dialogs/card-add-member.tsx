import * as React from "react"
import { useState } from "react"

import { CardWrapper } from "./card-wrapper"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { RoleConfig } from "@/utils"

function CardAddMember({
  className,
  ...props
}: React.ComponentProps<typeof CardWrapper> & {onCancel: () => void, onAdd: (obj: Record<string, string|number>) => void}) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")

  const handleCancel = () => {
    setEmail("")
    setRole("")
    props.onCancel()
  }

  const handleCreate = () => {
    const data = {
      email,
      role: Number(role),
    }
    props.onAdd(data)
  }

  return (
    <CardWrapper className={cn("p-0", className)} {...props}>
      <Card className="bg-white text-black border-none shadow-none">
        <CardHeader>
          <CardTitle>Add Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5 flex-1">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="bg-white text-black border-black">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {RoleConfig.map((role) => (
                    <SelectItem key={role.value} value={role.value.toString()}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button type="submit" onClick={handleCreate} disabled={!email || !role}>Add Member</Button>
        </CardFooter>
      </Card>
    </CardWrapper>
  )
}

export { CardAddMember } 