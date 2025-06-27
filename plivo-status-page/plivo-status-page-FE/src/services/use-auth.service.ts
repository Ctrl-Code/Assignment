import { Api } from "./api"
import { Endpoints } from "./endpoints"
// import { showToast } from "~/components/common/toast"
// import { ProjectRoutes } from "~/utils/project-routes"
// import { useNavigate } from "react-router"
import { useState } from "react"
import { ServicesTypes } from "@/types"
import { useLoginStore } from "@/store"
import { useUserDetailsStore, type UseUserDetailsStoreState } from "@/store"
import { toast } from "react-hot-toast"
import { TeamTypes } from "@/types"

export const useAuthService = () => {
    const { setUserLogin, setUserId, setAllUsers } = useLoginStore()
    const { setAll } = useUserDetailsStore()

    const [apiLoadingLogin, setApiLoadingLogin] = useState(false)
    const [apiLoadingGetUserDetails, setApiLoadingGetUserDetails] = useState(false)
    const [apiLoadingGetTeamMembers, setApiLoadingGetTeamMembers] = useState(false)
    const [apiLoadingAddUser, setApiLoadingAddUser] = useState(false)
    const [apiLoadingUpdateTeamMember, setApiLoadingUpdateTeamMember] = useState(false)

    // const navigate = useNavigate()

    const apiLogin = async (loginData: ServicesTypes.LoginType) => {
        setApiLoadingLogin(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.login, data: {
            email: loginData.email,
            verified: loginData.verified,
            picture: loginData.picture,
            external_id: loginData.externalId,
            first_name: loginData.firstName,
            last_name: loginData.lastName,
        }, jwt: false })
        setApiLoadingLogin(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiLogin (See console for more details)")
        }
        else{
            const {id, login} = data
            setUserId(id)
            setUserLogin(login)
            toast.success("Login successful")
        }
        if(data?.token?.length){
            localStorage.setItem('token', data.token)
        }
        return data
    }

    const apiGetUserDetails = async () => {
        const currentUserId = useLoginStore.getState().userId
        setApiLoadingGetUserDetails(true)
        const data = await Api({
            method: 'POST',
            endpoint: Endpoints.getUserDetails,
            data: { userId: currentUserId },
            jwt: true
        })
        setApiLoadingGetUserDetails(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetUserDetails (See console for more details)")
        }
        else{
            setAll(data.data as UseUserDetailsStoreState)
        }
        return data
    }

    const apiGetTeamMembers = async () => {
        setApiLoadingGetTeamMembers(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.getTeamMembers, jwt: true })
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiGetTeamMembers (See console for more details)")
        }
        else{
            if ('data' in data) {
                setAllUsers(data.data as TeamTypes.TeamType)
            }
        }
        setApiLoadingGetTeamMembers(false)
        return data
    }

    const apiAddUser = async ({email, role}: {email: string, role: number}) => {
        setApiLoadingAddUser(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.addTeamMember, data: { email, role }, jwt: true })
        setApiLoadingAddUser(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiAddUser (See console for more details)")
        }
        else{
            apiGetTeamMembers()
            toast.success("User added successfully")
        }
        return data
    }

    const apiUpdateTeamMember = async ({id, role}: {id: number, role: number}) => {
        setApiLoadingUpdateTeamMember(true)
        const data = await Api({ method: 'POST', endpoint: Endpoints.updateTeamMember, data: { memberId: id, role }, jwt: true })
        setApiLoadingUpdateTeamMember(false)
        if ('error' in data) {
            console.error(data.error)
            toast.error("Error: apiUpdateTeamMember (See console for more details)")
        }
        else{
            apiGetTeamMembers()
            toast.success("User updated successfully")
        }
        return data
    }

    return { apiLogin, apiLoadingLogin, 
        apiGetUserDetails, apiLoadingGetUserDetails,
        apiGetTeamMembers, apiLoadingGetTeamMembers,
        apiAddUser, apiLoadingAddUser,
        apiUpdateTeamMember, apiLoadingUpdateTeamMember }
}