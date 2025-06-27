import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"   

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useOrgService } from "@/services/use-org.service"

export const AdminSetup = () => {
    const [orgName, setOrgName] = useState("")
    const { apiOrgSetup, apiLoadingOrgSetup } = useOrgService()

    const handleSubmit = async () => await apiOrgSetup(orgName)
    
    return (
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Final Step</CardTitle>
            <CardDescription>Enter Org Name for your organisation's status page.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-2">
                <Label htmlFor="org-name">Enter your organisation name</Label>
                <Input
                    id="org-name"
                    type="text"
                    placeholder="Enter your organisation name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                />
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={handleSubmit}>
                Submit and Take me to Dashboard
            </Button>
        </CardFooter>
        </Card>
    )
}
