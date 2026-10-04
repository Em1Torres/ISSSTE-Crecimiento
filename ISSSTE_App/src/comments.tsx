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

export const CommentsList = () => {
const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
	return (
		<List>
			{isSmall ? (
				<SimpleList
			primaryText={(record) => record.id}
			secondaryText={(record) => record.name}
			tertiaryText={(record) => record.body}
		/>
			) : (
				<DataTable rowClick={false}>
					<DataTable.Col source="id" label="Id" />
                    <DataTable.Col source="postId" label="Post Id">
						<ReferenceField source="postId" reference="posts" link="show"/>
					</DataTable.Col>
					<DataTable.Col source="name" label="Nombre" />
                    <DataTable.Col source="email">
                        <EmailField source="email" />
                    </DataTable.Col>
					<DataTable.Col source="body" label="Comentario" />
					<DataTable.Col>
						<EditButton />
					</DataTable.Col>
				</DataTable>
			)}
		</List>
    );
}

export const CommentsEdit = () => (
	<Edit>
		<SimpleForm warnWhenUnsavedChanges>
			<TextInput disabled source="id" label="Id"/>
			<ReferenceInput source="postId" reference="posts" label="Post Id"/>
			<TextInput required source="name" label="Nombre"/>
			<TextInput required source="email" label="Email"/>
			<TextInput source="body" label="Comentario"/>
		</SimpleForm>
	</Edit>
);

export const CommentsCreate = () => (
	<Create>
		<SimpleForm warnWhenUnsavedChanges>
			<TextInput required source="name" label="Nombre"/>
			<TextInput required source="email" label="Email"/>
			<TextInput source="body" label="Comentario"/>
		</SimpleForm>
	</Create>
);