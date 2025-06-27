import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Service, useServiceStore } from "@/store"
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useService } from "@/services";
import { Loader } from "../loader";

interface TableServicesProps {
  services: Service[];
}

export const TableServices = ({ services }: TableServicesProps) => {
  const { serviceStatus } = useServiceStore();
  const navigate = useNavigate()
  const {
    apiToggleMaintenance,
    apiUpdateServiceStatus,
    apiLoadingToggleMaintenance,
    apiLoadingUpdateServiceStatus,
  } = useService()
  
  const handleServiceUpdate = (serviceId: number, serviceStatusId: number) => {
    apiUpdateServiceStatus(serviceId, serviceStatusId)
  };

  const handleToggleMaintenance = (serviceId: number) => {
    apiToggleMaintenance(serviceId)
  }

  if(apiLoadingToggleMaintenance || apiLoadingUpdateServiceStatus) {
    return <Loader loading={true} />
  }

  return (
    <div className="flex-grow relative overflow-auto p-0">
      <div className="h-full overflow-y-auto max-h-[500px] w-full border border-black rounded-md">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead style={{ width: "30%", height: "42px" }}>Service</TableHead>
              <TableHead style={{ width: "30%", height: "42px" }}>Status</TableHead>
              <TableHead style={{ width: "40%", height: "42px" }}>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell style={{ width: "30%" }}>{service.serviceName}</TableCell>
                <TableCell style={{ width: "30%" }}>
                  <Select value={String(service.serviceStatus)} onValueChange={(serviceStatusId: string)=>handleServiceUpdate(service.id, +serviceStatusId)}>
                    <SelectTrigger className="bg-white text-black border-black">
                      <SelectValue>{serviceStatus.find(s => s.id === service.serviceStatus)?.name || "Select a status"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {serviceStatus.map((statusOption) => (
                        <SelectItem key={statusOption.id} value={String(statusOption.id)}>
                          {statusOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell style={{ width: "40%" }} className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate("/dashboard/services/" + service.id)}>
                      Manage
                    </Button>
                    <Button variant="outline" onClick={() => handleToggleMaintenance(service.id)}>
                      {service.maintenance ? "Stop Scheduled Maintenance" : "Start Scheduled Maintenance"}
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}