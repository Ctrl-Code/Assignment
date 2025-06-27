import { useParams } from "react-router"

import { usePublicService } from "@/services"
import { useEffect, useState } from "react"
import { Loader } from "@/components/loader"
import { type Incident, type IncidentUpdate } from "@/store/use-service"

export const PublicIncidentStatus = () => {
    const {incidentId} = useParams()
    const {apiGetPublicPageIncidentUpdates, apiLoadingGetPublicPageIncidentUpdates} = usePublicService()
    const [incidentUpdates, setIncidentUpdates] = useState<IncidentUpdate[]>([])

    useEffect(() => {
        const getIncidentUpdates = async () => {
            const data = await apiGetPublicPageIncidentUpdates(Number(incidentId))
            if (typeof data === 'object' && data?.length > 0) {
                setIncidentUpdates(data)
            }
        }
        getIncidentUpdates()
    }, [incidentId])

    return (
        <div className="flex flex-col h-screen w-full p-1 overflow-auto">
            <div className="flex flex-row justify-center items-center w-full bg-white rounded-md p-4 mb-4">
                <h1 className="text-2xl font-bold mb-4">Public Incident Statusd</h1>
            </div>
            <div className="flex flex-col grow w-full bg-white rounded-md border-black border-2 p-4 mb-1">
                <h2 className="text-lg font-bold mb-2 text-black">Incident Updates</h2>
                <div className="w-full">
                    {apiLoadingGetPublicPageIncidentUpdates ? (
                        <Loader loading={true} />
                    ) : (
                        incidentUpdates.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2 gap-x-4 font-semibold text-black mb-1">
                                    <span>Update</span>
                                    <span>Created At</span>
                                </div>
                                {incidentUpdates.map((update, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-x-4 items-center p-2 border-b border-gray-200 text-black">
                                        <span>{update.update}</span>
                                        <span>{new Date(update.createdAt).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-black">No updates for this incident.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}