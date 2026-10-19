import { useGetIdentity,Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput,EditButton } from "react-admin";
import { Box, Typography } from "@mui/material";

export const EstanciaInicio = () => {
    
    //Aqui poner como checar la identity del wey de la EBDI, 
    // checka la identity the wey de la EBDI, sino despliega todos los infantes, arreglar esto 
    // if identity is 1 = edbi_id = 2 and hace el return 

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Inicio — Estancia</Typography>

            <Typography variant="h6" gutterBottom>
                Infantes registrados en mi EBDI 
            </Typography>

                <List             
                resource="infantes">

                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="matricula" />    
                        <TextField source="nombre" />
                        <TextField source="paterno" />
                        <TextField source="materno" />
                        <TextField source="genero" />
                        <TextField source="fnac" label="Fecha de nacimiento" />
                        <TextField source="ebdi" label="EBDI" />
                        <EditButton />
                    </Datagrid>
                </List>
            
        </Box>
    );
};



