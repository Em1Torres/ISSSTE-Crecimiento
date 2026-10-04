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
	SimpleForm} from "react-admin";
import{ useMediaQuery, Theme } from "@mui/material";


export const PostsList = () => {
const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
	return (
		<List>
			{isSmall ? (
				<SimpleList
			primaryText={(record) => record.userId}
			secondaryText={(record) => record.title}
			tertiaryText={(record) => record.body}
		/>
			) : (
				<DataTable rowClick={false}>
					<DataTable.Col source="id" label="Id" />
                    <DataTable.Col source="userId" label="Id Usuario">
						<ReferenceField source="userId" reference="users" link="show"/>
					</DataTable.Col>
					<DataTable.Col source="title" label="Titulo" />
					<DataTable.Col source="body" label="Contenido" />
					<DataTable.Col>
						<EditButton />
					</DataTable.Col>
				</DataTable>
			)}
		</List>
    );
}

export const PostEdit = () => (
	<Edit>
		<SimpleForm warnWhenUnsavedChanges>
			<TextInput disabled source="id" label="Id" />
			<ReferenceInput source="userId" reference="users" label="Id Usuario" />
			<TextInput required source="title" label="Titulo" />
			<TextInput source="body" label="Contenido" />
		</SimpleForm>
	</Edit>
);


export const PostCreate = () => (
	<Create>
		<SimpleForm warnWhenUnsavedChanges>
			<ReferenceInput required source="userId" reference="users" label="Id Usuario" />
			<TextInput required source="title" label="Titulo" />
			<TextInput source="body" label="Contenido" multiline rows={5} />
		</SimpleForm>
	</Create>
);