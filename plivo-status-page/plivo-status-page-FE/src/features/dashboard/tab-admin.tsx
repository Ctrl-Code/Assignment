import { CardAddOrgName, CardAddService, CardAddServiceStatus } from "@/components/dialogs"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useUserDetailsStore } from "@/store"

const Mappings = {
    "org": CardAddOrgName,
    "service": CardAddService,
    "service-status": CardAddServiceStatus,
}

export const TabAdmin = () => {
    const [activeButton, setActiveButton] = useState<string>("")
    const Component = Mappings[activeButton as keyof typeof Mappings]
    const { org } = useUserDetailsStore()

    const isOrgNameEmpty = (org?.orgName ?? "").length === 0
    
    return (
        <>
            <span className="flex w-min gap-4 border-1 border-black p-2 rounded-md">
                {isOrgNameEmpty && <Button className="h-12 w-40 text-4xl font-bold" onClick={() => setActiveButton("org")}>Create Org Name</Button>}
                <Button className="h-12 w-40 text-4xl font-bold" onClick={() => setActiveButton("service")}>Add Service</Button>
                <Button className="h-12 w-40 text-4xl font-bold" onClick={() => setActiveButton("service-status")}>Add Service Status</Button>
            </span>
            {
                Component && <div className="flex justify-start border-1 max-w-[800px] border-black p-2 rounded-md">
                    <Component />
                </div>
            }
        </>
    )
} 