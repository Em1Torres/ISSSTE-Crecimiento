import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput} from "react-admin";

export const listarMediciones = () =>(
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="matricula" />
            <TextField source="fecha"/>
            <TextField source="peso" />
            <TextField source="talla" />
            <TextField source="talla_blanco_familiar" />
            <TextField source="perimetro_cefalico" />
            <TextField source="edad_meses" />
            <TextField source="infante" />
            <TextField source="nombre_ebdi" label="EBDI" />
            <TextField source="estado"/>
        </Datagrid>
    </List>
);

// export const editarMediciones = () =>(
//     <Edit>
//         <SimpleForm warnWhenUnsavedChanges>
//             <TextInput source="id" disabled/>
//             <TextInput source="matricula" />
//             <TextInput source="nombre" />
//             <TextInput source="paterno" />
//             <TextInput source="materno" />
//             <TextInput source="genero" />
//             <TextInput source="fnac" label="Fecha de nacimiento" />
//         </SimpleForm>
//     </Edit>
//);

// export const crearInfante = ()=>(
//     <Create redirect="list">
//         <SimpleForm>
//             <NumberInput source="matricula" />
//             <TextInput source="curp" />
//             <TextInput source="nombre" />
//             <TextInput source="paterno" />
//             <TextInput source="materno" />
//             <TextInput source="genero" />
//             <DateInput source="fnac" label="Fecha de nacimiento" />
//             <TextInput source="ur" />
//             <TextInput source="ebdi" label="EBDI" />
//             <TextInput source="activo" />
//         </SimpleForm>
//     </Create>
// );