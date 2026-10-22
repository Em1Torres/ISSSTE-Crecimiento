
import { usePermissions } from "react-admin";
import { Box, CircularProgress, Alert } from "@mui/material";

import { AdminInicio } from "./Admin_inicio";
import { RegionalInicio } from "./Regional_inicio";
import { EstanciaInicio } from "./EBDI_inicio";
import { PadreInicio } from "./Padre_inicio";

export const Inicio = () => {
    const { permissions, isPending, error } = usePermissions();

    if (isPending) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                No se pudo verificar el rol.
            </Alert>
        );
    }

    switch (String(permissions ?? "").toLowerCase()) {
        case "admin":
            return <AdminInicio />;

        case "regional":
            return <RegionalInicio />;

        case "estancia":
            return <EstanciaInicio />;

        case "padre":
            return <PadreInicio />;

        default:
            return (
                <Alert severity="warning">
                    No hay una pantalla configurada para este perfil.
                </Alert>
            );
    }
};
