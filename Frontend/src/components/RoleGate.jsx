import {useAuth} from "../features/auth/hooks/useAuth";

export const RoleGate = ({allowedRoles, children}) => {
    const {user} = useAuth();

    const userRole = user?.role || "VIEWER";

    if (!allowedRoles.includes(userRole)) {
        return null;
    }

    return <>{children}</>;
};
