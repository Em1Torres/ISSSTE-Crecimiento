// chat me ayudo a debug, la tabla y el create 
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import {BooleanField,Datagrid,EditButton,ListBase,TextField,} from "react-admin";
import { Link } from "react-router-dom"; // chat 

export const AdminInicio = () => (
    <Card>
        <CardHeader
            title="Bienvenido, administrador"
            subheader='En esta sección puedes consultar todos los perfiles de la plataforma. En "Infantes" puedes ver, crear, editar y eliminar los registros de los niños. En "Gráficas" puedes consultar su crecimiento y desarrollo.'
            action={
                <Button
                    component={Link}
                    to="/registrarse"
                    variant="contained"
                >
                    Crear perfil
                </Button>
            }
        />

        <CardContent>
            <ListBase
                resource="usuarios"
                sort={{ field: "id", order: "ASC" }}
            >
                <Datagrid
                    bulkActionButtons={false}
                    rowClick="edit"
                >
                    <TextField source="id" label="ID" />
                    <TextField source="usuario" label="Usuario" />
                    <TextField source="rol" label="Rol" />
                    <TextField source="region" label="Región" />
                    <TextField source="ebdi" label="EBDI" />
                    <TextField source="activo" label="Activo" />
                    <EditButton />
                </Datagrid>
            </ListBase>
        </CardContent>
    </Card>
);
