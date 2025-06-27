import * as React from "react"
import { useState, useEffect } from "react"

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
import { useServiceStore } from "@/store/use-service"
import { useService } from "@/services"
import { Loader } from "@/components/loader"

function CardAddService({
  className,
  ...props
}: React.ComponentProps<typeof CardWrapper>) {
  const [serviceName, setServiceName] = useState("")
  const [serviceStatus, setServiceStatus] = useState("")

  const { serviceStatus: availableServiceStatuses = [] } = useServiceStore();
  const { apiGetAllServiceStatus, apiLoadingGetAllServiceStatus, apiAddService, apiLoadingService } = useService()

  const handleCancel = () => {
    setServiceName("")
    setServiceStatus("")
  }

  const handleCreate = async () => {
    const data = {
      serviceName,
      serviceStatusId: Number(serviceStatus),
    }
    await apiAddService(data)
    handleCancel()
  }

  useEffect(()=>{
    apiGetAllServiceStatus()
  }, [])

  if (apiLoadingGetAllServiceStatus || apiLoadingService) {
    return <Loader loading={true} />
  }

  return (
    <CardWrapper className={cn("p-0", className)} {...props}>
      <Card className="bg-white text-black border-none shadow-none">
        <CardHeader>
          <CardTitle>Add Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                placeholder="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={serviceStatus} onValueChange={setServiceStatus}>
                <SelectTrigger id="status" className="bg-white text-black border-black">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {availableServiceStatuses.map((statusItem) => (
                    <SelectItem key={statusItem.id} value={String(statusItem.id)}>
                      {statusItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Reset</Button>
          <Button type="submit" onClick={handleCreate} disabled={!serviceName || !serviceStatus}>Add Service</Button>
        </CardFooter>
      </Card>
    </CardWrapper>
  )
}

export { CardAddService } 