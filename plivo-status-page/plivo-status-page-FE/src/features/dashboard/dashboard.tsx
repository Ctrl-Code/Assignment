import { TabServices } from "./tab-services";
import { TabTeam } from "./tab-team";
import { TabAdmin } from "./tab-admin";
import { projectRoutes } from "@/utils/project-routes";
import { useNavigate } from "react-router";
import { useUserDetailsStore } from "@/store";
import { Button } from "@/components/ui/button";


type MappingEntry = [React.FC, string];

const MappingsAndRoutes: Record<"admin" | "team" | "services", MappingEntry> = {
    admin: [TabAdmin, projectRoutes.admin], // visible to admin only
    team: [TabTeam, projectRoutes.team], // visible to admin only
    services: [TabServices, projectRoutes.services] // visible to admin and member
}

type DashboardProps = {
    active: "admin" | "team" | "services"
}

const AdminTabs = ["services", "team", "admin"]
const MemberTabs = ["services"]

export const Dashboard: React.FC<DashboardProps> = ({active}) => {
    const sessionUserType = sessionStorage.getItem("userType")

    const {org = null} = useUserDetailsStore()
    const [Component, _] = MappingsAndRoutes[active]
    const navigate = useNavigate()

    const Tabs = String(org?.role) === '1' ? MemberTabs : AdminTabs

    if (sessionUserType === "member" && org === null) {
        return <div className="flex flex-col h-screen w-full p-2">
            <div className="flex flex-row justify-between items-center w-full bg-white rounded-md p-4 mb-4">
                <h1 className="text-2xl font-bold mb-4">Please ask admin to set your organization name</h1>
            </div>
            <Button onClick={() => navigate(projectRoutes.logout)}>Logout</Button>
        </div>
    }

    return (
        <div className="flex flex-col h-screen w-full p-2">
            <div className="flex flex-row justify-between items-center w-full bg-white rounded-md p-4 mb-4">
                <div className="p-0.5 flex gap-2 rounded-md">
                    {Tabs.map((item) => (
                        <div
                            key={item}
                            onClick={() => navigate(MappingsAndRoutes[item as keyof typeof MappingsAndRoutes][1])}
                            className={`border border-black rounded-md px-2 py-1 cursor-pointer ${
                                active === item
                                    ? "bg-black text-white"
                                    : "bg-white text-black"
                            }`}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate(projectRoutes.logout)} className="px-4 py-2 bg-red-500 text-white rounded-md">
                    Logout
                </button>
            </div>
            <div className="bg-white flex-grow rounded-md p-4">
                <h1 className="text-2xl font-bold mb-4">{active.toUpperCase()}</h1>
                <div className="overflow-auto flex flex-col gap-4">
                    <Component />
                </div>
            </div>
        </div>
    )
}