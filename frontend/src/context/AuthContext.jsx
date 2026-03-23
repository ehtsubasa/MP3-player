import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};

export const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // on every load, ask the backend if the cookie is still valid
    useEffect(() => {
        const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me', {
            credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setAuthUser(data);
            } else {
                setAuthUser(null);
            }
        } catch {
            setAuthUser(null);
        } finally {
            setCheckingAuth(false);
        }
    };

    checkAuth();
  }, []);

    return (
        <AuthContext.Provider value={{authUser, setAuthUser, checkingAuth}}>
            {children}
        </AuthContext.Provider>
    )
}
