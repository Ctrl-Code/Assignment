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
import { Loader } from "../loader"
import { useParams } from "react-router"

function CardAddIncident({
  className,
  ...props
}: React.ComponentProps<typeof CardWrapper>) {
  const { apiAddIncident, apiLoadingIncident } = useService()
  const [incidentName, setIncidentName] = useState("")
  const [incidentDescription, setIncidentDescription] = useState("")
  const {serviceId} = useParams()

  const handleCancel = () => {
    setIncidentName("")
    setIncidentDescription("")
  }

  const handleCreate = async () => {
    if (!serviceId) return
    if (serviceId){
      await apiAddIncident({incidentName, incidentDescription, serviceId: +serviceId})
      handleCancel()
    }
  }

  if(apiLoadingIncident) return <Loader loading={true} />

  return (
    <CardWrapper className={cn("p-0", className)} {...props}>
      <Card className="bg-white text-black border-none shadow-none">
        <CardHeader>
          <CardTitle>Add Incident</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="incident-name">Incident Name</Label>
              <Input
                id="incident-name"
                placeholder="Incident Name"
                value={incidentName}
                onChange={(e) => setIncidentName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="incident-description">Incident Description</Label>
              <Input
                id="incident-description"
                placeholder="Incident Description"
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Reset</Button>
          <Button type="submit" onClick={handleCreate} disabled={!incidentName || apiLoadingIncident}>Add Incident</Button>
        </CardFooter>
      </Card>
    </CardWrapper>
  )
}

export { CardAddIncident }