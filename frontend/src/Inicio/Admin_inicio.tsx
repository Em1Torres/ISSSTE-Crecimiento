import { Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput,ReferenceInput, BooleanInput,SelectInput,PasswordInput, EditButton,CreateButton} from "react-admin";
import { Box, Typography } from "@mui/material";

export const AdminInicio = () => (


    <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Inicio — Administrador</Typography>
         

        <Typography variant="h6" gutterBottom>Directorio de EBDI's</Typography>
        <CreateButton resource="ebdi" label="Crear EBDI" />
        <Datagrid 
        resource="ebdis" // falta endpoints 
        >
            <TextField source="region" label="Región" />
            <TextField source="estado" label="Estado" />
            <TextField source="ebdi" label="EBDI" />
            <TextField source="tipo" label="Tipo" />
            <TextField source="ur" label="UR" />
            <TextField source="ebdi_num" label="Numero de EBDI" />
            <EditButton />
        </Datagrid>


        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Todos los perfiles </Typography>
        <CreateButton resource="perfiles" label="Crear perfil" />
        <Datagrid 
        resource="usuarios">
            <TextField source="id" label="ID usuario" />
            <TextField source="usuario" label="Usuario" />
            <TextField source="rol" label="Rol" />
            <TextField source="region" label="Región" />
            <TextField source="ebdi" label="EBDI" />
            <TextField source="estado" label="Estado" />
            <EditButton />
        </Datagrid>
    </Box>
);

export const editarEBDI = () => (
    <Edit redirect='/'>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="id_ebdi" label="ID EBDI" disabled />
            <TextInput source="nombre" label="Nombre EBDI" />
            <ReferenceInput source="id_estado" reference="estados" label="Estado" />
            <SelectInput
                source="tipo"
                label="Tipo de EBDI"
                choices={[
                    { id: "PROPIA", name: "Propia" },
                    { id: "CONTRATADA", name: "Contratada" },
                    { id: "OSC", name: "OSC" },
                ]}
            />
            <TextInput source="ur" label="UR" />
            <NumberInput source="ebdi_num" label="Número EBDI" />
        </SimpleForm>
    </Edit>
);


export const editarPerfiles = () => (
    <Edit redirect='/'>
        
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="id_usuario" label="ID Usuario" disabled />
            <TextInput source="usuario" label="Nombre de usuario" />
            <SelectInput
                source="rol"
                label="Rol"
                choices={[
                    { id: "admin", name: "Administrador" },
                    { id: "regional", name: "Coordinador Regional" },
                    { id: "estancia", name: "Estancia" },
                    { id: "padre", name: "Padre/Madre" },
                ]}
            />
            <ReferenceInput source="id_region" reference="regiones" label="Región" />
            <ReferenceInput source="id_ebdi" reference="ebdis" label="EBDI" />
            <BooleanInput source="activo" label="Usuario activo" />
        </SimpleForm>
    </Edit>
);

export const crearEBDI = () => (
    <Create redirect="/">
        <SimpleForm>
            <TextInput source="nombre" label="Nombre EBDI" required />
            <ReferenceInput source="id_estado" reference="estados" label="Estado" />
            <SelectInput
                source="tipo"
                label="Tipo de EBDI"
                choices={[
                    { id: "PROPIA", name: "Propia" },
                    { id: "CONTRATADA", name: "Contratada" },
                    { id: "OSC", name: "OSC" },
                ]}
            />
            <TextInput source="ur" label="UR" required />
            <NumberInput source="ebdi_num" label="Número EBDI" required />
        </SimpleForm>
    </Create>
);

export const crearPerfil = () => (
    <Create redirect="/">
        <SimpleForm>
            <TextInput source="usuario" label="Nombre de usuario" required />
            <PasswordInput source="password" label="Contraseña" required />
            <SelectInput
                source="rol"
                label="Rol"
                choices={[
                    { id: "admin", name: "Administrador" },
                    { id: "regional", name: "Coordinador Regional" },
                    { id: "estancia", name: "Estancia" },
                    { id: "padre", name: "Padre/Madre" },
                ]}
            />
            <ReferenceInput source="id_region" reference="regiones" label="Región" />
            <ReferenceInput source="id_ebdi" reference="ebdis" label="EBDI" />
            <BooleanInput source="activo" label="Usuario activo" defaultValue />
        </SimpleForm>
    </Create>
);