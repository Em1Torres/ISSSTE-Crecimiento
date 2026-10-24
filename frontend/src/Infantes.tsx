import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput, SelectInput} from "react-admin";

// // Obtiene los nombres de las EBDI desde la API para utilizarlos en listar,editar y crear 
let res = await fetch("https://localhost:3000/ebdis");
let ebdis_names = await res.json();
let ebdis_names2 =[];
for(let i=0;i<ebdis_names.length;i++){
    ebdis_names2.push(ebdis_names[i].nombre);
} 
//Lista de los infnates con sus datos 
export const listarInfantes = () =>(
    <List>
        <Datagrid>
            <TextField source="id" label="Id"/>
            <TextField source="matricula" label="Matrícula"/>    
            <TextField source="nombre" label="Nombre"/>
            <TextField source="paterno" label="Apellido Paterno"/>
            <TextField source="materno" label="Apellido Materno"/>
            <TextField source="genero" label="Género"/>
            <TextField source="fnac" label="Fecha de nacimiento" />
            <TextField source="ebdi" label="EBDI" />
        </Datagrid>
    </List>
);
// Formulario para editar a un infante
export const editarInfantes = () =>(
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="id" label="Id" disabled/>
            <TextInput source="matricula" label="Matrícula"/>
            <TextInput source="nombre" label="Nombre"/>
            <TextInput source="paterno" label="Apellido Paterno"/>
            <TextInput source="materno" label="Apellido Materno"/>
            <TextInput source="genero" label="Género"/>
            <TextInput source="fnac" label="Fecha de nacimiento" />
            <SelectInput source="ebdi" label="EBDI" choices={ebdis_names2} />
         
        </SimpleForm>
    </Edit>
);

//Formulario para crear a un infante
export const crearInfante = ()=>(
    <Create redirect="list">
        <SimpleForm>
            <NumberInput source="matricula" label="Matrícula"/>
            <TextInput source="nombre" label="Nombre"/>
            <TextInput source="paterno" label="Apellido Paterno"/>
            <TextInput source="materno" label="Apellido Materno"/>
            <TextInput source="genero" label="Género"/>
            <DateInput source="fnac" label="Fecha de nacimiento" />
            <SelectInput source="ebdi" label="EBDI" choices={ebdis_names2} />
          
        </SimpleForm>
    </Create>
);
