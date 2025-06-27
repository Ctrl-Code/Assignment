import { Route, Routes } from "react-router";
import { DashboardLayout, MainLayout } from "./components/layouts";
import { Dashboard, ManageServices } from "./features/dashboard";
import { AdminSetup, HomeScreen, Logout, VerifyEmail } from "./features/login";
import Test from "./features/test";
import { projectRoutes } from "./utils/project-routes";
import { PublicIncidentStatus, PublicStatusPage } from "./features/status-page";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path={projectRoutes.publicStatus} element={<PublicStatusPage />} />
                <Route path={projectRoutes.publicIncidentStatus} element={<PublicIncidentStatus />} />
                <Route path={projectRoutes.home} element={<HomeScreen />} />        
                <Route path={projectRoutes.test} element={<Test />} />
                <Route path={projectRoutes.verifyEmail} element={<VerifyEmail />} />
                <Route path={projectRoutes.adminSetup} element={<AdminSetup />} />
                <Route element={<DashboardLayout />}>
                    <Route path={projectRoutes.services} element={<Dashboard active="services"/>} />
                    <Route path={projectRoutes.team} element={<Dashboard active="team"/>} />
                    <Route path={projectRoutes.admin} element={<Dashboard active="admin"/>} />
                    <Route path={projectRoutes.manageServices} element={<ManageServices />} />
                </Route>
                <Route path={projectRoutes.logout} element={<Logout />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;