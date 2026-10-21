import { useGetIdentity,Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput,EditButton } from "react-admin";
import { Box, Typography } from "@mui/material";

export const RegionalInicio = () => {
    
    // if id_regional= 5 le das su region simple 
    // tambien faltaria filtros pero prefiero hacer eso una vez que tengamos todos los endpoints 
    return (
    <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
            Inicio — Coordinador Regional
        </Typography>

        <Typography variant="h6" gutterBottom>
            Mi Región
        </Typography>

        <List
            resource="mi-region-ebdis"> // cambiar 
            <Datagrid>
                <TextField source="region" label="Región" />
                <TextField source="estado" label="Estado" />
                <TextField source="nombre" label="EBDI" />
                <TextField source="tipo" label="Tipo" />
                <TextField source="ur" label="UR" />
                <TextField source="ebdi_num" label="Número de EBDI" />
            </Datagrid>
        </List>
    </Box>
    );
};
