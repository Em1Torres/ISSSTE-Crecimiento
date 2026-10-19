import { useGetIdentity,Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput,EditButton } from "react-admin";
import { Box, Typography } from "@mui/material";

export const PadreInicio = () => {
    
    // if padre_id = 5 return con data del hijo o hijos 
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Inicio — Padre de familia </Typography>

            <Typography variant="h6" gutterBottom>
                Mis hijos o hijas  
            </Typography>

                <List             
                resource="sus infantes " >  // cambiar esto 
                    
                <Datagrid>
                    <TextField source="matricula" label="Matrícula" />
                    <TextField source="nombre" label="Nombre" />
                    <TextField source="paterno" label="Apellido paterno" />
                    <TextField source="materno" label="Apellido materno" />
                    <TextField source="genero" label="Género" />
                    <TextField source="fnac" label="Fecha de nacimiento" />
                    <TextField source="ebdi" label="Número de EBDI" />
            </Datagrid>
                </List>
            
        </Box>
    );
};

