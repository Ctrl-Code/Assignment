import { create } from 'zustand'

type Org = {
    orgId: number;
    orgName: string;
    role: string;
};

type User = {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    picture: string;
};

export type UseUserDetailsStoreState = {
    org: Org | null;
    user: User | null;
};

type UseUserDetailsStoreActions = {
    setOrg: (org: Org) => void;
    setUser: (user: User) => void;
    setAll: (details: UseUserDetailsStoreState) => void;
    resetUserDetails: () => void;
};

export type UseUserDetailsStore = UseUserDetailsStoreState & UseUserDetailsStoreActions;

const DefaultUserDetailsState: UseUserDetailsStoreState = {
    org: null,
    user: null,
};

export const useUserDetailsStore = create<UseUserDetailsStore>((set) => ({
    ...DefaultUserDetailsState,
    setOrg: (org: Org) =>
        set(() => ({
            org
        })),
    setUser: (user: User) =>
        set(() => ({
            user
        })),
    setAll: (details: UseUserDetailsStoreState) =>
        set(() => ({
            ...details
        })),
    resetUserDetails: () =>
        set(() => ({
            ...DefaultUserDetailsState
        })),
}));
