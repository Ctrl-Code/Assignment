import { create } from "zustand"
import {type Incident, type Service, type IncidentsResponse} from "./use-service"

// public store state. Stores services for public page.
export type PublicStoreState = {
    services: Service[]
    incidents: IncidentsResponse
}

export type PublicStoreActions = {
    setServices: (services: Service[]) => void
    setIncidents: (incidents: IncidentsResponse) => void
}

export const usePublicStore = create<PublicStoreState & PublicStoreActions>((set) => ({
    services: [],
    incidents: {open_incidents: [], closed_incidents: []},
    setServices: (services: Service[]) => set({ services }),
    setIncidents: (incidents: IncidentsResponse) => set({ incidents }),
}))