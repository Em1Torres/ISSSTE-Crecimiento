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
	useGetOne
	} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";


/*
export const UserList = () => (
	<List>
		<DataTable>
			<DataTable.Col source="id" />
			<DataTable.Col source="name" />
			<DataTable.Col source="username" />
			<DataTable.Col source="email">
				<EmailField source="email" />
			</DataTable.Col>
			<DataTable.Col source="phone" />
			<DataTable.Col source="website" />
		</DataTable>
	</List>
);
*/

/*
export const UserList = () => (
	<List>
		<SimpleList
			primaryText={(record) => record.name}
			secondaryText={(record) => record.username}
			tertiaryText={(record) => record.email}
		/>
	</List>
);
*/

export const UserList = () => {
	const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
	return (
		<List>
			{isSmall ? (
				<SimpleList
			primaryText={(record) => record.name}
			secondaryText={(record) => record.username}
			tertiaryText={(record) => record.email}
		/>
			) : (
				<DataTable>
					<DataTable.Col source="id" label="Id" />
					<DataTable.Col source="name" label="Nombre" />
					<DataTable.Col source="username" label="Nombre de Usuario" />
					<DataTable.Col source="email" label="Email">
						<EmailField source="email" />
					</DataTable.Col>
					<DataTable.Col source="phone" label="Teléfono" />
					<DataTable.Col source="website" label="Sitio Web" />
					<DataTable.Col>
						<EditButton />
					</DataTable.Col>
				</DataTable>
			)}
		</List>
	);
}

export const UserEdit = () => (
	<Edit>
		<SimpleForm warnWhenUnsavedChanges>
			<TextInput disabled source="id" label="Id" />
			<TextInput required source="name" label="Nombre" />
			<TextInput required source="username" label="Nombre de Usuario" />
			<TextInput required source="email" label="Email"/>
			<TextInput source="phone" label="Teléfono" />
			<TextInput source="website" label="Sitio Web" />
		</SimpleForm>
	</Edit>
);

export const UserCreate = () => (
	<Create>
		<SimpleForm warnWhenUnsavedChanges>
			<TextInput required source="name" label="Nombre" />
			<TextInput required source="username" label="Nombre de Usuario" />
			<TextInput required source="email" label="Email"/>
			<TextInput source="phone" label="Teléfono" />
			<TextInput source="website" label="Sitio Web" />
		</SimpleForm>
	</Create>
)

export const UserGetOne = () => {
    const { data, isPending, error } = useGetOne(
        "users",
        { id: 33 }
    );

    if (isPending) {
        return <p>Cargando usuario...</p>;
    }

    if (error) {
        return <p>Error al cargar el usuario</p>;
    }

    return (
        <div>
            <h2>Usuario encontrado</h2>

            <p>
                <strong>ID:</strong> {data.id}
            </p>

            <p>
                <strong>Nombre:</strong> {data.name}
            </p>

            <p>
                <strong>Username:</strong> {data.username}
            </p>

            <p>
                <strong>Email:</strong> {data.email}
            </p>

            <p>
                <strong>Teléfono:</strong> {data.phone}
            </p>

            <p>
                <strong>Sitio Web:</strong> {data.website}
            </p>
        </div>
    );
};