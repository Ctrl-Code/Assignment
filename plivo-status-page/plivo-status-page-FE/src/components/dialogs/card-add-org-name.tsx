import * as React from "react"
import { useState } from "react"

import { CardWrapper } from "./card-wrapper"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useOrgService } from "@/services"
import { Loader } from "../loader"
import { useAuthService } from "@/services"
import { toast } from "react-hot-toast"

function CardAddOrgName({
  className,
  ...props
}: React.ComponentProps<typeof CardWrapper>) {
  const [orgName, setOrgName] = useState("")

  const {apiOrgSetup, apiLoadingOrgSetup} = useOrgService()
  const {apiGetUserDetails,apiLoadingGetUserDetails} = useAuthService()

  const handleCancel = () => {
    setOrgName("")
  }

  const handleCreate = async () => {
    const data = await apiOrgSetup(orgName.trim().split(" ").join("-"))
    if ('error' in data) {
      console.error(data.error)
      toast("Failed to create org name (See console for more details)")
    }
    else {
      apiGetUserDetails()
      handleCancel()
    }
  }

  if (apiLoadingOrgSetup || apiLoadingGetUserDetails) {
    return <Loader loading={true} />
  }

  return (
    <CardWrapper className={cn("p-0", className)} {...props}>
      <Card className="bg-white text-black border-none shadow-none">
        <CardHeader>
          <CardTitle>Create Org</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="org-name">Org Name</Label>
              <Input
                id="org-name"
                placeholder="Enter the Org Name without any spaces but use - instead. Example: My-Org-Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button type="submit" onClick={handleCreate} disabled={!orgName}>Create</Button>
        </CardFooter>
      </Card>
    </CardWrapper>
  )
}

export { CardAddOrgName } 