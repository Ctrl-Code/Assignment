import { Loader } from "@/components/loader";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect();
    }

    if (isLoading) {
        return <Loader loading={true} />
    }

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
            </button>
            {isAuthenticated && <p>User: {JSON.stringify(user)}</p>}
        </div>
    )
}