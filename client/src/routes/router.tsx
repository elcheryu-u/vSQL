import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import { useConnection } from "../context/ConnectionContext";
import ConnectForm from "../components/ConnectForm";
import Layout from "../pages/Layout";
import DB from "../pages/dashboard/DB";
import Loading from "../pages/Loading";

// eslint-disable-next-line react-refresh/only-export-components
const RequireConnection = ({ children }: { children: React.JSX.Element }) => {
    const { connected, loading } = useConnection();

    if (loading) {
        return <Loading />;
    }

    if (!connected) {
        return <Navigate to="/" replace />;
    }

    return children;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <ConnectForm />
            },
            {
                path: '/dashboard',
                element: (
                    <RequireConnection><Layout /></RequireConnection>
                ),
                children: [
                    {
                        index: true,
                        element: <div>Dashboard Home</div>
                    },
                    {
                        path: 'db/:database',
                        element: <DB />
                    }
                ]
            }
        ]
    }
])

export default router;