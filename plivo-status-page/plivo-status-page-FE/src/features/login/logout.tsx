import { useLoginStore } from "@/store"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import toast from "react-hot-toast"

export const Logout = () => {
    const { logout } = useAuth0()
    const { resetLogin } = useLoginStore()
    useEffect(() => {
        logout({ logoutParams: { returnTo: window.location.origin } })
        resetLogin()
        toast.success("Logged out successfully")
    }, [])
    return <div>Logging out... Redirecting to home page</div>
}