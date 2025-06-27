import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "./ui/select"
import { Button } from "./ui/button";

type ServiceCardProps = {
    serviceName?: string;
}

export const ServiceCard = ({ serviceName="" }: ServiceCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{serviceName}</CardTitle>
            </CardHeader>
        </Card>
    )
}

const SERVICE_STATUS_LIST = [{
    id: 1,
    name: "Operational"
}, {
    id: 2,
    name: "Degraded Performance"
}, {
    id: 3,
    name: "Partial Outage"
}, {
    id: 4,
    name: "Major Outage"
}]

export const AddServiceCard = () => {
    const [serviceName, setServiceName] = useState("");
    const [serviceStatus, setServiceStatus] = useState(SERVICE_STATUS_LIST[0].id);

    const handleAddService = () => {
        alert(`Add Service ${serviceName} with status ${serviceStatus}`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Service</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <div className="flex flex-col gap-2 shrink-0 grow">
                    <Label htmlFor="add-service-name" className="w-full">Service Name</Label>
                    <Input
                        placeholder="Service Name"
                        id="add-service-name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}/>
                </div>
                <div className="flex flex-col gap-2 shrink-0 grow">
                    <Label htmlFor="add-service-status" className="w-full">Service Status</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Service Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {SERVICE_STATUS_LIST.map((status) => (
                                    <SelectItem key={status.id} value={status.id.toString()}>{status.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleAddService} disabled={!serviceName || !serviceStatus}>Add Service</Button>
            </CardFooter>
        </Card>
    )
}