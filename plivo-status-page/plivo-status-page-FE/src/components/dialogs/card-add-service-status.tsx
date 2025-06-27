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
import { cn } from "@/lib/utils"
import { useService } from "@/services"

function CardAddServiceStatus({
  className,
  ...props
}: React.ComponentProps<typeof CardWrapper>) {
  const { apiAddServiceStatus, apiLoadingServiceStatus } = useService()
  const [serviceStatusName, setServiceStatusName] = useState("")

  const handleCancel = () => {
    setServiceStatusName("")
  }

  const handleCreate = async () => {
    if(serviceStatusName.length){
      await apiAddServiceStatus(serviceStatusName)
      handleCancel()
    }
  }

  return (
    <CardWrapper className={cn("p-0", className)} {...props}>
      <Card className="bg-white text-black border-none shadow-none">
        <CardHeader>
          <CardTitle>Add Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="service-status-name">Service Status Name</Label>
              <Input
                id="service-status-name"
                placeholder="Service Status Name"
                value={serviceStatusName}
                onChange={(e) => setServiceStatusName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Reset</Button>
          <Button type="submit" onClick={handleCreate} disabled={!serviceStatusName || apiLoadingServiceStatus}>Add Service Status</Button>
        </CardFooter>
      </Card>
    </CardWrapper>
  )
}

export { CardAddServiceStatus }