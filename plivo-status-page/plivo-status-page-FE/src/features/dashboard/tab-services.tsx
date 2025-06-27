import { Loader } from "@/components/loader"
import { TableServices } from "@/components/tables"
import { useService } from "@/services"
import { useServiceStore } from "@/store"
import { useEffect } from "react"

export const TabServices = () => {
    const { apiGetAllServices, apiLoadingGetAllServices, apiGetAllServiceStatus, apiLoadingGetAllServiceStatus } = useService()
    const { services } = useServiceStore()

    useEffect(()=>{
        apiGetAllServices()
        apiGetAllServiceStatus()
    }, [])

    if (apiLoadingGetAllServices || apiLoadingGetAllServiceStatus) {
        return <Loader loading={true} />
    }

    return (
        <TableServices services={services} />
    )
} 