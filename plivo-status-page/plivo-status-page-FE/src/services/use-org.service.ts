import { Api } from "./api"
import { Endpoints } from "./endpoints"
// import { showToast } from "~/components/common/toast"
// import { ProjectRoutes } from "~/utils/project-routes"
// import { useNavigate } from "react-router"
import { useState } from "react"
import { ServicesTypes } from "@/types"
import { useLoginStore } from "@/store"
import { projectRoutes } from "@/utils/project-routes"
import { useNavigate } from "react-router"

export const useOrgService = () => {
    const { userId } = useLoginStore()

    const [apiLoadingOrgSetup, setApiLoadingOrgSetup] = useState(false)

    const navigate = useNavigate()

    const apiOrgSetup = async (orgName: string) => {
        if(!userId || !orgName) return
        setApiLoadingOrgSetup(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.setOrg, data: {
            orgName,
            userId,
        }, jwt: true })
        setApiLoadingOrgSetup(false)
        if ('error' in data) {
            console.error(data.error)
        }
        else{
            navigate(projectRoutes.services)
        }
        return data
    }

    return { apiOrgSetup, apiLoadingOrgSetup }
}