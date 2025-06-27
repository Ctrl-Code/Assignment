import { TableTeam } from "@/components/tables"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CardAddMember } from "@/components/dialogs"
import { useAuthService } from "@/services/use-auth.service"
import { Loader } from "@/components/loader"
import { useEffect } from "react"
import { useLoginStore } from "@/store"

export const TabTeam = () => {
    const { apiGetTeamMembers, apiLoadingGetTeamMembers,
        apiUpdateTeamMember, apiLoadingUpdateTeamMember,
        apiAddUser, apiLoadingAddUser
    } = useAuthService()
    
    const { allUsers = [] } = useLoginStore()

    useEffect(() => {
        apiGetTeamMembers()
    }, [])

    const handleRoleChange = (id: number, newRole: string) => {
        apiUpdateTeamMember({id, role: +newRole})
    }

    // const handleDeleteMember = (email: string) => {
    //     alert(`Deleting member with email: ${email}`)
    //     // In a real application, you'd perform actual deletion here
    // }

    const handleAddMember = (obj: Record<string, string|number>) => {
        apiAddUser({email: obj.email as string, role: +obj.role})
    }

    const [showAddMember, setShowAddMember] = useState(false)

    if (apiLoadingGetTeamMembers || apiLoadingUpdateTeamMember || apiLoadingAddUser) return <Loader loading={true} />

    return (
        <>
            <Button
                onClick={() => setShowAddMember(!showAddMember)}
                className="w-min mb-2"
                disabled={showAddMember}
            >
                Add Member
            </Button>
            {showAddMember && <div className="flex justify-start border-1 max-w-[800px] border-black p-2 rounded-md">
                <CardAddMember onCancel={() => setShowAddMember(false)} onAdd={handleAddMember} />
            </div>}
            <TableTeam
                members={allUsers.map(user => ({
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName || "",
                    role: user.role.toString() // for compatibility with the table as already has role as string. Can be changed
                }))}
                onRoleChange={handleRoleChange}
                // onDeleteMember={handleDeleteMember}
            />
        </>
    )
} 