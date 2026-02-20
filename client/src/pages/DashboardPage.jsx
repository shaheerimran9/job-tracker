import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <>
            <h2>Dashboard</h2>
            <p>Welcome, {user.name}</p>
            <button onClick={logout}>Logout</button>
        </>
    );
}

export default DashboardPage;