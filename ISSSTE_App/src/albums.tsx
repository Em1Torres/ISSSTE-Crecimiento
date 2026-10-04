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
import { useMediaQuery, Theme } from "@mui/material";

export const AlbumsList = () => {
	const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
	return (
		<List>
			{isSmall ? (
				<SimpleList
			primaryText={(record) => record.userid}
			secondaryText={(record) => record.id}
			tertiaryText={(record) => record.title}
		/>
			) : (
				<DataTable rowClick={false}>
					<DataTable.Col source="id" label="Id" />
					<DataTable.Col source="userId" label="Id Usuario">
						<ReferenceField source="userId" reference="users" link="show"/>
					</DataTable.Col>
					<DataTable.Col source="title" label="Titulo" />
					<DataTable.Col>
						<EditButton />
					</DataTable.Col>
				</DataTable>
			)}
		</List>
	);
}

export const AlbumsEdit = () => (
	<Edit>
		<SimpleForm warnWhenUnsavedChanges>
			<TextInput disabled source="id" label="Id" />
			<ReferenceInput source="userId" reference="users" label="Id Usuario" />
			<TextInput required source="title" label="Titulo" />
		</SimpleForm>
	</Edit>
);


export const AlbumsCreate = () => (
	<Create>
		<SimpleForm warnWhenUnsavedChanges>
			<ReferenceInput required source="userId" reference="users" label="Id Usuario" />
			<TextInput required source="title" label="Titulo" />
		</SimpleForm>
	</Create>
);