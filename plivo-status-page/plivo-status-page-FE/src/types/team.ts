export type TeamMemberType = {
    id: number
    email: string
    role: number
    fullName?: string
}

export type TeamType = TeamMemberType[]
