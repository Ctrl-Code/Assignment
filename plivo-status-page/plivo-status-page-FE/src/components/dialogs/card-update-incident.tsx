import * as React from "react"
import { useEffect, useState } from "react"

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
import { useService } from "@/services"
import { Loader } from "../loader"
import { useServiceStore } from "@/store"
import { useParams } from "react-router"

function CardUpdateIncident({
  className,
  ...props
}: React.ComponentProps<typeof CardWrapper>) {
  const { apiGetOpenIncidents,
      apiLoadingGetOpenIncidents,
      apiResolveIncident,
      apiLoadingResolveIncident,
      apiUpdateIncident,
      apiLoadingUpdateIncident } = useService()
  const [incidentDescription, setIncidentDescription] = useState("")
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("")
  const {openIncidents} = useServiceStore()

  const { serviceId } = useParams()

  const handleCancel = () => {
    setIncidentDescription("")
    setSelectedIncidentId("")
  }

  const handleCreate = async () => {
    if (!serviceId) return
    apiUpdateIncident({incidentId: +selectedIncidentId, incidentDescription, serviceId: +serviceId})
    handleCancel()
  }

  const handleResolve = async () => {
    if (!serviceId) return
    apiResolveIncident({incidentId: +selectedIncidentId, serviceId: +serviceId})
    handleCancel()
  }


  useEffect(() => {
    if (!serviceId) return
    apiGetOpenIncidents(+serviceId)
  }, [])

  if(apiLoadingGetOpenIncidents || apiLoadingResolveIncident || apiLoadingUpdateIncident) return <Loader loading={true} />

  return (
    <CardWrapper className={cn("p-0", className)} {...props}>
      <Card className="bg-white text-black border-none shadow-none">
        <CardHeader>
          <CardTitle>Update Incident</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="choose-incident">Choose Incident Title</Label>
              <Select value={selectedIncidentId} onValueChange={(value) => setSelectedIncidentId(value)}>
                <SelectTrigger id="choose-incident" className="bg-white text-black border-black">
                  <SelectValue placeholder="Select an incident" />
                </SelectTrigger>
                <SelectContent>
                  {openIncidents
                    .filter(incident => incident.title !== "Scheduled Maintenance")
                    .map((incident) => (
                      <SelectItem key={incident.id} value={String(incident.id)}>
                        {incident.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="incident-description">Update Description</Label>
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
          <Button variant="outline" onClick={handleResolve} disabled={!selectedIncidentId}>Mark Resolved</Button>
          <Button variant="outline" onClick={handleCancel}>Reset</Button>
          <Button type="submit" onClick={handleCreate} disabled={!incidentDescription || !selectedIncidentId}>Update Incident</Button>
        </CardFooter>
      </Card>
    </CardWrapper>
  )
}

export { CardUpdateIncident }