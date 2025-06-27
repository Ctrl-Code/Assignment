import { Api } from "./api"
import { Endpoints } from "./endpoints"
// import { showToast } from "~/components/common/toast"
// import { ProjectRoutes } from "~/utils/project-routes"
// import { useNavigate } from "react-router"
import { useState } from "react"
// import { ServicesTypes } from "@/types"
import { useLoginStore, useServiceStore } from "@/store"
import toast from "react-hot-toast"
// import { projectRoutes } from "@/utils/project-routes"
// import { useNavigate } from "react-router"

export const useService = () => {
    const { userId } = useLoginStore()
    const { setServiceStatus, setServices, setOpenIncidents } = useServiceStore()

    const [apiLoadingServiceStatus, setApiLoadingServiceStatus] = useState(false)
    const [apiLoadingGetAllServices, setApiLoadingGetAllServices] = useState(false)
    const [apiLoadingGetAllServiceStatus, setApiLoadingGetAllServiceStatus] = useState(false)
    const [apiLoadingService, setApiLoadingService] = useState(false)
    const [apiLoadingIncident, setApiLoadingIncident] = useState(false)
    const [apiLoadingToggleMaintenance, setApiLoadingToggleMaintenance] = useState(false)
    const [apiLoadingUpdateServiceStatus, setApiLoadingUpdateServiceStatus] = useState(false)
    const [apiLoadingGetOpenIncidents, setApiLoadingGetOpenIncidents] = useState(false)
    const [apiLoadingUpdateIncident, setApiLoadingUpdateIncident] = useState(false)
    const [apiLoadingResolveIncident, setApiLoadingResolveIncident] = useState(false)
    // const navigate = useNavigate()

    const apiAddServiceStatus = async (serviceStatusName: string) => {
        if(!userId || !serviceStatusName) return
        setApiLoadingServiceStatus(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.addServiceStatus, data: {
            serviceStatusName,
        }, jwt: true })
        setApiLoadingServiceStatus(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiAddServiceStatus (See console for more details)")
        }
        else {
            // get all service status to update the store
            apiGetAllServiceStatus()
            toast.success("Service status added successfully")
        }
        return data
    }

    const apiGetAllServices = async () => {
        if(!userId) return
        setApiLoadingGetAllServices(true)
        const data = await Api({
            method: 'POST',
            endpoint: Endpoints.getAllServices,
            jwt: true })
        // store it in the store useServiceStore
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetAllServices (See console for more details)")
        }
        else {
            setServices(data.data)
        }
        setApiLoadingGetAllServices(false)
        return data
    }

    const apiGetAllServiceStatus = async () => {
        if(!userId) return
        setApiLoadingGetAllServiceStatus(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.getAllServiceStatus, jwt: true })
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetAllServiceStatus (See console for more details)")
        }
        else {
            setServiceStatus(data.data)
        }
        setApiLoadingGetAllServiceStatus(false)
        return data
    }

    const apiAddService = async ({serviceName, serviceStatusId}: {serviceName: string, serviceStatusId: number}) => {
        if(!userId || !serviceName || !serviceStatusId) return
        setApiLoadingService(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.addService, data: {
            serviceName,
            serviceStatusId,
        }, jwt: true })
        setApiLoadingService(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiAddService (See console for more details)")
        }
        else {
            // get all services to update the store
            apiGetAllServices()
            toast.success("Service added successfully")
        }
        return data
    }

    const apiAddIncident = async ({incidentName, incidentDescription, serviceId}: {incidentName: string, incidentDescription: string, serviceId: number}) => {
        if(!userId || !incidentName || !incidentDescription) return
        setApiLoadingIncident(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.addIncident, data: {
            title: incidentName,
            description: incidentDescription,
            serviceId,
        }, jwt: true })
        setApiLoadingIncident(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiAddIncident (See console for more details)")
        }
        else {
            toast.success("Incident added successfully")
        }
        return data
    }

    const apiUpdateServiceStatus = async (serviceId: number, serviceStatusId: number) => {
        if(!userId || !serviceId || !serviceStatusId) return
        setApiLoadingUpdateServiceStatus(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.updateServiceStatus, data: {
            serviceId,
            serviceStatusId,
        }, jwt: true })
        setApiLoadingUpdateServiceStatus(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiUpdateServiceStatus (See console for more details)")
        }
        else {
            // get all services to update the store
            apiGetAllServices()
            toast.success("Service status updated successfully")
        }
        return data
    }

    const apiToggleMaintenance = async (serviceId: number) => {
        if(!userId || !serviceId) return
        setApiLoadingToggleMaintenance(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.toggleMaintenance, data: {
            serviceId,
        }, jwt: true })
        setApiLoadingToggleMaintenance(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiToggleMaintenance (See console for more details)")
        }
        else {
            // get all services to update the store
            apiGetAllServices()
            toast.success("Maintenance toggled successfully")
        }
        return data
    }
    
    const apiGetOpenIncidents = async (serviceId: number) => {
        if(!userId) return
        setApiLoadingGetOpenIncidents(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.getOpenIncidents, jwt: true, data: { serviceId } })
        setApiLoadingGetOpenIncidents(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetOpenIncidents (See console for more details)")
        }
        else {
            setOpenIncidents(data.data)
        }
        return data
    }

    const apiUpdateIncident = async ({incidentId, incidentDescription, serviceId}: {incidentId: number, incidentDescription: string, serviceId: number}) => {
        if(!userId || !incidentId || !incidentDescription) return
        setApiLoadingUpdateIncident(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.updateIncident, data: {
            incidentId,
            incidentDescription,
        }, jwt: true })
        setApiLoadingUpdateIncident(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiUpdateIncident (See console for more details)")
        }
        else {
            apiGetOpenIncidents(serviceId)
            toast.success("Incident updated successfully")
        }
        return data
    }

    const apiResolveIncident = async ({incidentId, serviceId}: {incidentId: number, serviceId: number}) => {
        if(!userId || !incidentId) return
        setApiLoadingResolveIncident(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.resolveIncident, data: {
            incidentId,
        }, jwt: true })
        setApiLoadingResolveIncident(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiResolveIncident (See console for more details)")
        }
        else {
            apiGetOpenIncidents(serviceId)
            toast.success("Incident resolved successfully")
        }
        return data
    }   

    return { apiAddServiceStatus,
        apiLoadingServiceStatus,
        apiGetAllServices,
        apiLoadingGetAllServices,
        apiGetAllServiceStatus,
        apiLoadingGetAllServiceStatus,
        apiAddService,
        apiLoadingService,
        apiAddIncident,
        apiLoadingIncident,
        apiToggleMaintenance,
        apiLoadingToggleMaintenance,
        apiGetOpenIncidents,
        apiLoadingGetOpenIncidents,
        apiUpdateServiceStatus,
        apiLoadingUpdateServiceStatus,
        apiUpdateIncident,
        apiLoadingUpdateIncident,
        apiResolveIncident,
        apiLoadingResolveIncident,
    }
}