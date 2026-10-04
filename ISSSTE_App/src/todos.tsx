import {List, 
	DataTable, 
	EmailField, 
	SimpleList, 
	ReferenceField, 
	EditButton, 
	Edit, 
	Create,
	ReferenceInput,
	TextInput,
	SimpleForm,
} from "react-admin";
import{ useMediaQuery, Theme } from "@mui/material";

const todosFilters = [
	<TextInput source="completed" label="Completado" />,
];

export const TodosList = () => {
const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
	return (
		<List filters={todosFilters}>
			{isSmall ? (
				<SimpleList
			primaryText={(record) => record.userId}
			secondaryText={(record) => record.title}
			tertiaryText={(record) => record.completed}
		/>
			) : (
				<DataTable>
                    <DataTable.Col source="userId" label="Id Usuario" >
						<ReferenceField source="userId" reference="users" link="show"/>
					</DataTable.Col>
					<DataTable.Col source="id" label="Id" />
					<DataTable.Col source="title" label="Titulo" />
					<DataTable.Col source="completed" label="Completado" />
				</DataTable>
			)}
		</List>
    );
}

export const TodosEdit = () => (
	<Edit>
		<SimpleForm warnWhenUnsavedChanges>
			<TextInput disabled source="id" label="Id" />
			<ReferenceInput source="userId" reference="users" label="Id Usuario" />
			<TextInput required source="title" label="Titulo" />
			<TextInput source="completed" label="Completado" />
		</SimpleForm>
	</Edit>
);


export const TodosCreate = () => (
	<Create>
		<SimpleForm warnWhenUnsavedChanges>
			<ReferenceInput required source="userId" reference="users" label="Id Usuario" />
			<TextInput required source="title" label="Titulo" />
			<TextInput source="completed" label="Completado" />
		</SimpleForm>
	</Create>
);