import { Outlet } from "react-router";
import { DarkThemedWrapper } from "./common";

export const MainLayout = () => {
    return (
        <DarkThemedWrapper>
            <Outlet />
        </DarkThemedWrapper>
    )
}
