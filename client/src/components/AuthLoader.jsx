import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../../api/axios.api.js";

export const AuthLoader = () => {

    const {
        setUser,
        setLoading
    } = useContext(AuthContext);

    useEffect(() => {

        const checkAuth = async () => {

            try {

                const res = await api.get(
                    "/auth/me",
                    {
                        withCredentials: true
                    }
                );

                setUser(res.data.user);

            } catch (error) {

                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        checkAuth();

    }, []);

    return null;
};