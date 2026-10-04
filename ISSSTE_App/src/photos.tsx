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
	ImageField} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const PhotosList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
                <SimpleList
            primaryText={(record) => record.id}
            secondaryText={(record) => record.title}
            tertiaryText={(record) => record.url}
        />
            ) : (
                <DataTable>
                    <DataTable.Col source="albumId" label="Id Album" >
						<ReferenceField source="albumId" reference="albums" link="show"/>
					</DataTable.Col>
                    <DataTable.Col source="id" label="Id" />
                    <DataTable.Col source="title" label="Titulo" />
                    <DataTable.Col source="url" label="Url" />
                    <DataTable.Col source="thumbnailUrl" label="Miniatura" >
						<ImageField source="thumbnailUrl" />
					</DataTable.Col>
                    <DataTable.Col>
                        <EditButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
}

export const PhotosEdit = () => (
	<Edit>
		<SimpleForm warnWhenUnsavedChanges>
			<ReferenceInput source="albumId" reference="albums" label="Id Album"/>
			<TextInput disabled source="id" label="Id"/>
			<TextInput required source="title" label="Titulo"/>
			<TextInput required source="url" label="Url"/>
			<TextInput source="thumbnailUrl" label="Miniatura" />
		</SimpleForm>
	</Edit>
);

export const PhotosCreate = () => (
	<Create>
		<SimpleForm warnWhenUnsavedChanges>
            <ReferenceInput required source="albumId" reference="albums" label="Id Album"/>
			<TextInput required source="title" label="Titulo"/>
			<TextInput required source="url" label="Url"/>
			<TextInput source="thumbnailUrl" label="Miniatura" />
		</SimpleForm>
	</Create>
);