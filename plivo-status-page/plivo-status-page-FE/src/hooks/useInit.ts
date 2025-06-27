import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { projectRoutes } from "@/utils/project-routes"
import { useAuthService } from "@/services/use-auth.service"
import { useAuth0 } from "@auth0/auth0-react"
import { getUserInfo } from "@/utils"

export const useInit = () => {
    const [isLoadingInit, setIsLoadingInit] = useState(true)

    const navigate = useNavigate()
    const {apiLogin, apiGetUserDetails } = useAuthService()
    const {user, isAuthenticated, isLoading} = useAuth0()

    useEffect(()=>{
        if(isLoadingInit && isAuthenticated && !isLoading){
            const initialize = async () => {
                const userInfo: ReturnType<typeof getUserInfo> = getUserInfo(user);
                const loginData = await apiLogin(userInfo)
                if ('error' in loginData)
                    navigate(projectRoutes.home)
                const userData = await apiGetUserDetails()
                if ('error' in userData)
                    navigate(projectRoutes.home)
                setIsLoadingInit(false)
            }
            initialize()
        }
        else if (!isAuthenticated && !isLoading)
            navigate(projectRoutes.home)
    },[isAuthenticated, isLoading])

    return { isLoading: isLoadingInit }
}