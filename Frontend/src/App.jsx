import {useEffect} from "react";
import {RouterProvider} from "react-router";
import {useAuth} from "./features/auth/hooks/useAuth";
import {router} from "./routes/AppRouter";
import {Toaster} from "sonner";
import {ThemeProvider} from "./components/ThemeProvider";

export default function App() {
    const {checkAuth} = useAuth();

    useEffect(() => {
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <ThemeProvider defaultTheme="light" storageKey="loop-theme">
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors closeButton duration={3000} />
        </ThemeProvider>
    );
}
