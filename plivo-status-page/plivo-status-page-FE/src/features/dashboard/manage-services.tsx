import { CardAddIncident, CardUpdateIncident } from "@/components/dialogs"
import { Button } from "@/components/ui/button"
import { projectRoutes } from "@/utils/project-routes"
import { useState } from "react"
import { useNavigate } from "react-router"

const Options = ["Add Incident", "Update Incident"]

export const ManageServices = () => {
    const navigate = useNavigate()
    const [active, setActive] = useState<string>(Options[0])
    return (
        <div className="flex flex-col h-screen w-full p-2">
            <div className="flex flex-col w-full">
                <div className="flex flex-row justify-between items-center w-full bg-white rounded-md p-4 mb-4">
                    <Button variant="outline" onClick={() => navigate(projectRoutes.services)}>
                        Back
                    </Button>
                    <Button onClick={() => navigate(projectRoutes.logout)} className="px-4 py-2 bg-red-500 text-white rounded-md">
                        Logout
                    </Button>
                </div>
            </div>
            <div className="flex flex-grow flex-col h-screen w-full">
                <div className="bg-white flex-grow rounded-md p-4 flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Manage Services</h1>
                    <div className="overflow-auto flex flex-col gap-4">
                        {/* Add buttons with label "Add Incident", */}
                        <div className="p-0.5 flex gap-2 rounded-md">
                            {Options.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => setActive(item)}
                                    className={`border border-black rounded-md px-2 py-1 cursor-pointer ${
                                        active === item
                                            ? "bg-black text-white"
                                            : "bg-white text-black"
                                    }`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    {active === Options[0] && <div className="flex justify-start border-1 max-w-[800px] border-black p-2 rounded-md">
                        <CardAddIncident />
                    </div>}
                    {active === Options[1] && <div className="flex justify-start border-1 max-w-[800px] border-black p-2 rounded-md">
                        <CardUpdateIncident />
                    </div>}
                </div>
            </div>
        </div>
    )
}