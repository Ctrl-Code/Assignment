import { Outlet } from "react-router";
import { useInit } from "@/hooks";
import { Loader } from "@/components/loader"

export const DashboardLayout = () => {
    const { isLoading } = useInit()

    return isLoading ? <Loader loading={true} /> : <Outlet />
}
