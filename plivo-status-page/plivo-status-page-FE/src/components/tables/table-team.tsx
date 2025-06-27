import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleConfig } from "@/utils/config";

interface TeamMember {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface TableTeamProps {
  members: TeamMember[];
  onRoleChange: (id: number, newRole: string) => void;
  // onDeleteMember?: (email: string) => void;
}

export const TableTeam = ({ members, onRoleChange }: TableTeamProps) => {
  return (
    <div className="flex-grow relative overflow-auto p-0">
      <div className="h-full overflow-y-auto max-h-[400px] w-full border border-black rounded-md">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead style={{ width: "30%", height: "42px" }}>Email</TableHead>
              <TableHead style={{ width: "30%", height: "42px" }}>Full Name</TableHead>
              <TableHead style={{ width: "25%", height: "42px" }}>Role</TableHead>
              {/* <TableHead style={{ width: "15%", height: "42px" }}>Remove</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell style={{ width: "30%" }}>{member.email}</TableCell>
                <TableCell style={{ width: "30%" }}>{member.fullName}</TableCell>
                <TableCell style={{ width: "25%" }}>
                  <Select value={member.role} onValueChange={(value) => onRoleChange(member.id, value)}>
                    <SelectTrigger className="bg-white text-black border-black">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {RoleConfig.map((role) => (
                        <SelectItem key={role.value} value={role.value.toString()}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                {/* <TableCell style={{ width: "15%" }}>
                  <Button variant="destructive" onClick={() => onDeleteMember(member.email)}>Delete</Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}