import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserInfo } from "@/utils";
import { projectRoutes } from "@/utils/project-routes";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";

export const HomeScreen = () => {
  const navigate = useNavigate()
  const { user, loginWithRedirect, isAuthenticated, /*logout*/ } = useAuth0();
  const userInfo: ReturnType<typeof getUserInfo> = getUserInfo(user);

  // add a useEffect to check if the user is authenticated and if the user type is not set, set it to the user type in the userInfo
  useEffect(()=>{
    if(isAuthenticated && userInfo.email.length > 0){
      if(!userInfo.verified)
        navigate(projectRoutes.verifyEmail)
      else
        navigate(projectRoutes.services)
    }
  },[isAuthenticated]);

  const handleLogin = (userType: "admin" | "member") => {
    sessionStorage.setItem("userType", userType)
    loginWithRedirect();
  }

  const [inputOrgName, setInputOrgName] = useState("")

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center justify-center p-8 bg-white border border-black rounded-md shadow-lg">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-row items-center gap-4">
                    <span className="text-black">TAKE ME TO STATUS PAGE OF ORG</span>
                    <Input
                        id="org-name-input"
                        type="text"
                        placeholder="Org Name"
                        className="text-black border-black"
                        value={inputOrgName}
                        onChange={(e) => setInputOrgName(e.target.value)}
                    />
                </div>
                <Button variant="outline" onClick={() => navigate(`/status-page/${inputOrgName}`)} className="text-white bg-black hover:bg-gray-800">
                    Go to Status Page
                </Button>
            </div>

            <div className="flex flex-row gap-4 w-full">
                <Button variant="outline" onClick={() => handleLogin("admin")} className="flex-1">Admin Login/Signup</Button>
                <Button variant="outline" onClick={() => handleLogin("member")} className="flex-1">Member Login/Signup</Button>
            </div>
        </div>
    </div>
  );
}