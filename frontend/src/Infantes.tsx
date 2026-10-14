import {Datagrid, List, TextField,} from "react-admin";

export const listarInfantes = () =>(
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="matricula" />
            <TextField source="nombre" />
            <TextField source="paterno" />
            <TextField source="materno" />
            <TextField source="genero" />
            <TextField source="fnac" label="Fecha de nacimiento" />
            <TextField source="ebdi" label="EBDI" />
        </Datagrid>
    </List>
);
