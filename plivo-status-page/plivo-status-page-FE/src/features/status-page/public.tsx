import { useEffect } from "react"
import { useParams } from "react-router"
import { usePublicService } from "@/services"
import { Loader } from "@/components/loader"
import { usePublicStore } from "@/store"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate } from "react-router"
import { projectRoutes } from "@/utils/project-routes"

export const PublicStatusPage = () => {
    const {orgName} = useParams()
    const {apiGetPublicPageServices, apiLoadingGetPublicPageServices,
        apiGetPublicPageIncidents, apiLoadingGetPublicPageIncidents
    } = usePublicService()

    const {services, incidents, setIncidents} = usePublicStore()
    const navigate = useNavigate()

    const getIncidents = (serviceId:number) => {
        setIncidents({ open_incidents: [], closed_incidents: [] }) // reset incidents
        apiGetPublicPageIncidents(serviceId)
    }

    useEffect(() => {
        if (orgName) {
            apiGetPublicPageServices(orgName)
        }
    }, [orgName])

    return <div className="flex flex-col h-screen w-full p-1 overflow-hidden">
        <div className="flex flex-row justify-center items-center w-full bg-white rounded-md p-4 mb-4">
            <h1 className="text-2xl font-bold mb-4">{orgName} status page</h1>
        </div>
        <div className="flex flex-col justify-center items-center w-full grow bg-white rounded-md p-4 mb-1 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Services</h1>
            {
                apiLoadingGetPublicPageServices ?
                <Loader loading={true} /> :
                <div className="flex flex-col grow w-full overflow-y-auto bg-white rounded-md border-black border-2 p-1">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full bg-white border border-none"
                        onValueChange={(value) => {
                            if (value) {
                                const serviceId = Number(value)
                                getIncidents(serviceId)
                            }
                        }}
                    >
                    {
                        services.map((service) => (
                            <AccordionItem key={service.id} value={String(service.id)} className="border-b border-gray-200 py-4">
                                <AccordionTrigger className="flex flex-col gap-2 w-full bg-white">
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <span className="text-lg font-semibold">{service.serviceName}</span>
                                        <span className="text-md font-medium text-white">{service.serviceStatus}</span>
                                    </div>
                                    <div className="flex flex-wrap w-full text-base text-white">
                                        <span>Open Incidents: {service.open_incidents}</span>
                                        <span className="mx-2">|</span>
                                        <span>Closed Incidents: {service.closed_incidents}</span>
                                        {service.maintenance && (
                                            <>
                                                <span className="mx-2">|</span>
                                                <span>Under Maintenance</span>
                                            </>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {apiLoadingGetPublicPageIncidents ? (
                                    <Loader loading={true} />
                                  ) : (
                                    <div className="flex flex-col gap-4 p-4">
                                      {incidents.open_incidents.length === 0 && incidents.closed_incidents.length === 0 ? (
                                        <p className="text-black">No incidents to display.</p>
                                      ) : (
                                        <>
                                          {incidents.open_incidents.length > 0 && (
                                            <div className="flex flex-col">
                                              <h2 className="text-lg font-bold mb-2 text-black">Open Incidents</h2>
                                              <div className="grid grid-cols-2 gap-x-4 font-semibold text-black mb-1">
                                                <span>Title</span>
                                                <span>Created At</span>
                                              </div>
                                              <div className="w-full">
                                                {incidents.open_incidents.map((incident) => (
                                                  <div key={incident.id} className="grid grid-cols-2 gap-x-4 items-center p-2 border-b border-gray-200 cursor-pointer text-black"
                                                    onClick={() => navigate(projectRoutes.publicIncidentStatus.replace(":orgName", orgName!).replace(":incidentId", String(incident.id)))}>
                                                    <span>{incident.title}</span>
                                                    <span>{new Date(incident.createdAt).toLocaleString()}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {incidents.closed_incidents.length > 0 && (
                                            <div className="flex flex-col">
                                              <h2 className="text-lg font-bold mb-2 text-black">Closed Incidents</h2>
                                              <div className="grid grid-cols-3 gap-x-4 font-semibold text-black mb-1">
                                                <span>Title</span>
                                                <span>Created At</span>
                                                <span>Resolved At</span>
                                              </div>
                                              <div className="w-full">
                                                {incidents.closed_incidents.map((incident) => (
                                                  <div key={incident.id} className="grid grid-cols-3 gap-x-4 items-center p-2 border-b border-gray-200 cursor-pointer text-black"
                                                    onClick={() => navigate(projectRoutes.publicIncidentStatus.replace(":orgName", orgName!).replace(":incidentId", String(incident.id)))}>
                                                    <span>{incident.title}</span>
                                                    <span>{new Date(incident.createdAt).toLocaleString()}</span>
                                                    {incident.resolvedAt && <span>{new Date(incident.resolvedAt).toLocaleString()}</span>}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                    </Accordion>
                </div>
            }
        </div>
    </div>
}// services = [
// {"closed_incidents":0,"id":3,"maintenance":false,"open_incidents":0,"serviceName":"DB","serviceStatus":string}
// {"closed_incidents":1,"id":5,"maintenance":false,"open_incidents":0,"serviceName":"DB 3","serviceStatus":string}
// {"closed_incidents":0,"id":6,"maintenance":false,"open_incidents":1,"serviceName":"Website 3","serviceStatus":string}
// {"closed_incidents":3,"id":1,"maintenance":true,"open_incidents":0,"serviceName":"Website 1","serviceStatus":string}
// {"closed_incidents":0,"id":2,"maintenance":false,"open_incidents":0,"serviceName":"Website 2","serviceStatus":string}
// {"closed_incidents":0,"id":4,"maintenance":false,"open_incidents":0,"serviceName":"DB 2","serviceStatus":string}
// ]

// incidents = {
// "closed_incidents": [
//             {
//                 "createdAt": 1750921467882,
//                 "description": "Login  API not working.",
//                 "id": 1,
//                 "resolvedAt": 1750931128675,
//                 "title": "Backend API Down"
//             },
//             {
//                 "createdAt": 1750931239287,
//                 "description": null,
//                 "id": 2,
//                 "resolvedAt": 1750931317989,
//                 "title": "Scheduled Maintenance"
//             },
//             {
//                 "createdAt": 1750931325775,
//                 "description": null,
//                 "id": 3,
//                 "resolvedAt": 1750931838998,
//                 "title": "Scheduled Maintenance"
//             }
//         ],
//     "open_incidents": [
//             {
//                 "createdAt": 1750939062465,
//                 "description": "Urls failing",
//                 "id": 5,
//                 "title": "Website 3 Issues"
//             }
//         ]
// }


