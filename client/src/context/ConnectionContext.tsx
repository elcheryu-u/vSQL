import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface ConnectionData {
    host: string;
    user: string;
    password: string;
    }

interface ConnectionContextProps {
    connected: boolean;
    connectionData: ConnectionData | null;
    sessionId: string;
    connect: (data: ConnectionData) => Promise<boolean>;
    disconnect: () => Promise<void>;
    loading: boolean;
}

const ConnectionContext = createContext<ConnectionContextProps | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [connected, setConnected] = useState(false);
    const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);
    const [sessionId] = useState(uuidv4());

    const connect = async (data: ConnectionData) => {
        try {
            const response = await axios.post('http://localhost:5000/connect', {
                ...data,
                sessionId
            });

            if (response.data.success) {
                setConnected(true);
                setConnectionData(data);
                // Guardar en sessionStorage
                sessionStorage.setItem("connectionData", JSON.stringify({ ...data }));

                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        }
    };

    const disconnect = async () => {
        try {
            await axios.post('http://localhost:5000/disconnect', { sessionId });
            sessionStorage.removeItem("connectionData");
        } catch (error) {
            console.error(error);
        } finally {
            setConnected(false);
            setConnectionData(null);
        }
    };

    React.useEffect(() => {
        const tryReconnect = async () => {
            const saved = sessionStorage.getItem('connectionData');
            if (saved) {
                const data: ConnectionData = JSON.parse(saved);
                await connect(data);
            }
        };

        tryReconnect();
    }, []);

    return (
        <ConnectionContext.Provider
            value={{
                connected,
                connectionData,
                sessionId,
                connect,
                disconnect,
                loading
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConnection = () => {
    const context = useContext(ConnectionContext);
    if (!context) throw new Error('useConnection must be used within a ConnectionProvider');
    return context;
};