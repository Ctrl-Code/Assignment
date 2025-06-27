import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthService } from "@/services/use-auth.service"
import { useOrgService } from "@/services/use-org.service";
import { useLoginStore, useServiceStore } from "@/store";
import { getUserInfo } from "@/utils";
import { useState, useEffect } from "react";
import { CardAddServiceStatus, CardAddMember, CardAddOrgName, CardAddService } from "@/components/dialogs";
import { TableTeam } from "@/components/tables";
import { TableServices } from "@/components/tables";

export default function Test() {
    const [services, setServices] = useState([
        { id: 1, name: "Service A", status: "Operational" },
        { id: 2, name: "Service B", status: "Degraded Performance" },
        { id: 3, name: "Service C", status: "Under Maintenance" },
    ]);

    return (
        <div className="flex flex-col w-screen h-screen gap-8 p-8 bg-white">
            <h2>Services Table Test</h2>
            <TableServices 
                services={services}
            />
            {/* Force re-render */}
            <TestApi />
            <TestStoreUseService />
        </div>
    );
}

const TestStoreUseService = () => {
    const {
        services,
        addService,
        updateService,
        deleteService,
        setServices,
        resetServices,
        setServiceStatus
    } = useServiceStore();

    useEffect(() => {
        // Set initial service status for testing
        setServiceStatus([
            { id: 1, name: "Operational" },
            { id: 2, name: "Degraded Performance" },
            { id: 3, name: "Partial Outage" },
            { id: 4, name: "Major Outage" },
        ]);
    }, []);

    // For demonstration, we'll use hardcoded sample data
    const sampleService = { id: 1, name: "Sample Service", status: 1 };
    const anotherService = { id: 2, name: "Another Service", status: 2 };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded w-full max-w-lg bg-neutral-900 text-white">
            <div className="font-bold text-lg">Test useServiceStore</div>
            <div className="flex gap-2 flex-wrap">
                <Button
                    onClick={() => addService(sampleService)}
                    variant="secondary"
                >
                    Add Sample Service
                </Button>
                <Button
                    onClick={() => addService(anotherService)}
                    variant="secondary"
                >
                    Add Another Service
                </Button>
                <Button
                    onClick={() => updateService(1, { name: "Updated Service", status: 3 })}
                    variant="secondary"
                >
                    Update Service 1
                </Button>
                <Button
                    onClick={() => deleteService(1)}
                    variant="secondary"
                >
                    Delete Service 1
                </Button>
                <Button
                    onClick={() => setServices([sampleService, anotherService])}
                    variant="secondary"
                >
                    Set Services (2)
                </Button>
                <Button
                    onClick={() => resetServices()}
                    variant="destructive"
                >
                    Reset Services
                </Button>
            </div>
            <div className="mt-4">
                <div className="font-semibold">Current Services State:</div>
                <Textarea
                    value={JSON.stringify(services, null, 2)}
                    readOnly
                    className="h-40 text-white bg-neutral-800"
                />
            </div>
        </div>
    );
};

const loginDataGoogle = getUserInfo({
    "email": "chebomsta@gmail.com",
    "email_verified": true,
    "family_name": "Thakur",
    "given_name": "Vipul Singh",
    "name": "Vipul Singh Thakur",
    "nickname": "chebomsta",
    "picture": "https://lh3.googleusercontent.com/a/ACg8ocL0qwArvnxY6ArP4REMvRZFSMODhE_ra9by-9bPH36x9Hl1uPWDsw=s96-c",
    "sub": "google-oauth2|115971198498294644166",
    "updated_at": "2025-06-23T09:25:43.082Z"
})

const orgSetupData = {
    orgName: "Test Org",
    userId: 4,
}

const TestApi = () => {
    const [apiResponse, setApiResponse] = useState("")
    const { setUserId } = useLoginStore()
    const { apiLogin, apiLoadingLogin, apiGetUserDetails } = useAuthService()
    const { apiOrgSetup, apiLoadingOrgSetup } = useOrgService()

    const handleLogin = async () => {
        await apiLogin(loginDataGoogle as Parameters<typeof apiLogin>[0]).then(response=>{
            console.log("response", response)
            setApiResponse(JSON.stringify(response, null, 2))
        })
    }

    const handleGetUserDetails = async () => {
        setUserId(orgSetupData.userId)
        await apiGetUserDetails().then(response=>{
            console.log("response", response)
            setApiResponse(JSON.stringify(response, null, 2))
        })
    }

    const handleOrgSetup = async () => {
        setUserId(orgSetupData.userId)
        await apiOrgSetup(orgSetupData.orgName).then(response=>{
            console.log("response", response)
            setApiResponse(JSON.stringify(response, null, 2))
        })
    }
        
    const handleClick = handleGetUserDetails

    return <div className="flex gap-10 h-[500px] w-inherit items-center justify-center mx-10">
        <Textarea placeholder="api response"
            value={apiResponse}
            onChange={()=>null}
            className="flex-basis-4/6 h-full overflow-y-auto text-white"/>
        <Button onClick={handleClick} className="flex-basis-2/6">API RUN</Button>    
    </div>
}