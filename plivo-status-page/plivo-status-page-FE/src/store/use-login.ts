import { create } from 'zustand'
import { TeamTypes } from '@/types'

type UseLoginStoreState = {
    userId: number | null
    userVerified: boolean
    userLogin: boolean,
    allUsers: TeamTypes.TeamType
}

type UseLoginStoreActions = {
    setUserId: (userId: UseLoginStoreState['userId']) => void;
    setUserVerified: (userVerified: UseLoginStoreState['userVerified']) => void;
    setUserLogin: (userLogin: UseLoginStoreState['userLogin']) => void;
    setAllUsers: (allUsers: UseLoginStoreState['allUsers']) => void;
    resetLogin: () => void
}

export type UseLoginStore = UseLoginStoreState & UseLoginStoreActions

const DefaultState: UseLoginStoreState = {
    userId: null,
    userVerified: false,
    userLogin: true, // true => logging in, false => sign up
    allUsers: [],
}

const useLoginStore = create<UseLoginStore>((set) => ({
    ...DefaultState,
    setUserId: (userId: UseLoginStoreState['userId']) => set({ userId }),
    setUserVerified: (userVerified: UseLoginStoreState['userVerified']) => set({ userVerified }),
    setUserLogin: (userLogin: UseLoginStoreState['userLogin']) => set({ userLogin }),
    setAllUsers: (allUsers: UseLoginStoreState['allUsers']) => set({ allUsers }),
    resetLogin: () => set(DefaultState),
}))

export { useLoginStore }