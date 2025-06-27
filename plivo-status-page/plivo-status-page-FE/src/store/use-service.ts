import { create } from 'zustand'

export type Service = {
    id: number;
    serviceName: string;
    serviceStatus: number;
    maintenance: boolean;
    open_incidents: number;
    closed_incidents: number;
};

export type ServiceStatus = {
    id: number;
    name: string;
};

export type Incident = {
    createdAt: number;
    description: string | null;
    id: number;
    serviceId?: number;
    title: string;
    resolvedAt?: number;
};

export type IncidentUpdate = {
    createdAt: number;
    id: number;
    type: number;
    update: string;
}

export interface IncidentsResponse {
    open_incidents: Incident[];
    closed_incidents: Incident[];
}

type UseServiceStoreState = {
    services: Service[];
    serviceStatus: ServiceStatus[];
    openIncidents: Incident[];
};

type UseServiceStoreActions = {
    addService: (service: Service) => void;
    updateService: (id: number, updated: Partial<Omit<Service, "id">>) => void;
    deleteService: (id: number) => void;
    setServices: (services: Service[]) => void;
    setServiceStatus: (serviceStatus: ServiceStatus[]) => void;
    setOpenIncidents: (openIncidents: Incident[]) => void;
    resetServices: () => void;
};

export type UseServiceStore = UseServiceStoreState & UseServiceStoreActions;

const DefaultServiceState: UseServiceStoreState = {
    services: [],
    serviceStatus: [],
    openIncidents: [],
};

export const useServiceStore = create<UseServiceStore>((set) => ({
    ...DefaultServiceState,
    addService: (service) =>
        set((state) => ({
            services: [
                ...state.services,
                service
            ]
        })),
    updateService: (id, updated) =>
        set((state) => ({
            services: state.services.map((s) =>
                s.id === id ? { ...s, ...updated } : s
            )
        })),
    deleteService: (id) =>
        set((state) => ({
            services: state.services.filter((s) => s.id !== id)
        })),
    setServices: (services) =>
        set(() => ({
            services
        })),
    setServiceStatus: (serviceStatus: ServiceStatus[]) => set(() => ({
        serviceStatus
    })),
    setOpenIncidents: (openIncidents: Incident[]) => set(() => ({
        openIncidents
    })),
    resetServices: () =>
        set(() => ({
            ...DefaultServiceState
        })),
}));
