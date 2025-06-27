import { useState } from "react"
import { Api } from "./api"
import { Endpoints } from "./endpoints"
import { toast } from "react-hot-toast"
import { usePublicStore } from "@/store"

export const usePublicService = () => {
    const [apiLoadingGetPublicPageServices, setApiLoadingGetPublicPageServices] = useState(false)
    const [apiLoadingGetPublicPageIncidents, setApiLoadingGetPublicPageIncidents] = useState(false)
    const [apiLoadingGetPublicPageIncidentUpdates, setApiLoadingGetPublicPageIncidentUpdates] = useState(false)

    const {setServices, setIncidents} = usePublicStore()
    
    const apiGetPublicPageServices = async (orgName:string) => {
        setApiLoadingGetPublicPageServices(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.getPublicPageServices, data: { orgName }, jwt: false })
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetPublicPageServices (See console for more details)")
        }
        else {
            setApiLoadingGetPublicPageServices(false)
            setServices(data.data)
        }
    }

    const apiGetPublicPageIncidents = async (serviceId:number) => {
        setApiLoadingGetPublicPageIncidents(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.getPublicPageIncidents, data: { serviceId }, jwt: false })
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetPublicPageIncidents (See console for more details)")
        }
        else {
            setApiLoadingGetPublicPageIncidents(false)
            setIncidents(data.data)
        }
    }

    const apiGetPublicPageIncidentUpdates = async (incidentId:number) => {
        setApiLoadingGetPublicPageIncidentUpdates(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.getPublicPageIncidentUpdates, data: { incidentId }, jwt: false })
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetPublicPageIncidentUpdates (See console for more details)")
        }   
        else {
            setApiLoadingGetPublicPageIncidentUpdates(false)
        }
        return data.data
    }

    return {
        apiGetPublicPageServices,
        apiLoadingGetPublicPageServices,
        apiGetPublicPageIncidents,
        apiLoadingGetPublicPageIncidents,
        apiGetPublicPageIncidentUpdates,
        apiLoadingGetPublicPageIncidentUpdates,
    }
}