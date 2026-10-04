import { TranslationMessages } from 'ra-core';

const spanishMessages: TranslationMessages = {
    ra: {
        action: {
            add_filter: 'Añadir Filtro',
            add: 'Añadir',
            back: 'Regresar',
            bulk_actions: '1 objeto seleccionado |||| %{smart_count} objetos seleccionados',
            cancel: 'Cancelar',
            clear_array_input: 'Vaciar lista',
            clear_input_value: 'Vaciar valor',
            clone: 'Clonar',
            confirm: 'Confirmar',
            create: 'Crear',
            create_item: 'Crear %{item}',
            delete: 'Eliminar',
            edit: 'Editar',
            export: 'Exportar',
            list: 'Lista',
            refresh: 'Actualizar',
            remove_filter: 'Quitar este filtro',
            remove_all_filters: 'Quitar todos los filtros',
            remove: 'Remover',
            reset: 'Reiniciar',
            save: 'Guardar',
            search: 'Buscar',
            search_columns: 'Buscar columnas',
            select_all: 'Seleccionar todo',
            select_all_button: 'Seleccionar todo',
            select_row: 'Seleccionar esta fila',
            show: 'Mostrar',
            sort: 'Ordenar',
            undo: 'Deshacer',
            unselect: 'Deseleccionar',
            expand: 'Expandir',
            close: 'Cerrar',
            open_menu: 'Abrir menú',
            close_menu: 'Cerrar menú',
            update: 'Actualizar',
            move_up: 'Mover arriba',
            move_down: 'Mover abajo',
            open: 'Abrir',
            toggle_theme: 'Activar modo oscuro/claro',
            select_columns: 'Seleccionar Columnas',
            update_application: 'Actualizar Aplicación',
        },
        boolean: {
            true: 'verdadero',
            false: 'falso',
            null: ' ',
        },
        page: {
            create: 'Crear %{name}',
            dashboard: 'Inicio',
            edit: '%{name} %{recordRepresentation}',
            error: 'Algo salió mal',
            list: '%{name}',
            loading: 'Cargando',
            not_found: 'No encontrado',
            show: '%{name} %{recordRepresentation}',
            empty: 'No %{name} yet.',
            invite: '¿Quieres agregar uno?',
            access_denied: 'Acceso denegado',
            authentication_error: 'Error de autenticación',
        },
        input: {
            file: {
                upload_several:
                    'Suelta algunos archivos para subir, o haz clic para seleccionar uno.',
                upload_single: 'Suelta un archivo para subir, o haz clic para seleccionarlo.',
            },
            image: {
                upload_several:
                    'Suelta algunas imágenes para subir, o haz clic para seleccionar una.',
                upload_single:
                    'Suelta una imagen para subir, o haz clic para seleccionarla.',
            },
            references: {
                all_missing: 'No se pueden encontrar los datos referenciados.',
                many_missing:
                    'Al menos una de las referencias asociadas ya no esta disponible.',
                single_missing:
                    'La referencia asociada ya no está disponible.',
            },
            password: {
                toggle_visible: 'Ocultar contraseña',
                toggle_hidden: 'Mostrar contraseña',
            },
        },
        message: {
            about: 'Acerca de',
            access_denied:
                "No tienes los permisos necesarios para acceder a esta página",
            are_you_sure: '¿Estás seguro?',
            authentication_error:
                'El servidor de autenticación devolvió un error y no se pudieron verificar tus credenciales.',
            auth_error:
                'Ocurrió un error mientras se validaba el token de autenticación.',
            bulk_delete_content:
                '¿Estás seguro de que quieres eliminar este %{name}? |||| ¿Estás seguro de que quieres eliminar estos %{smart_count} elementos?',
            bulk_delete_title:
                'Borrar %{name} |||| Borrar %{smart_count} %{name}',
            bulk_update_content:
                '¿Estás seguro de que quieres actualizar este %{name} %{recordRepresentation}? |||| ¿Estás seguro de que quieres actualizar estos %{smart_count} elementos?',
            bulk_update_title:
                'Actualizar %{name} %{recordRepresentation} |||| Actualizar %{smart_count} %{name}',
            clear_array_input: '¿Estás seguro de que quieres borrar toda la lista?',
            delete_content: '¿Estás seguro de que quieres eliminar este %{name}?',
            delete_title: 'Eliminar %{name} %{recordRepresentation}',
            details: 'Detalles',
            error: "Ocurrio un error en el cliente y su solicitud no pudo ser completada.",
            invalid_form: 'El formato del formulario no es válido. Por favor, verifique los errores.',
            loading: 'Por favor espere mientras se cargan los datos',
            no: 'No',
            not_found:
                'O escribio un URL incorrecto o siguió un enlace incorrecto.',
            select_all_limit_reached:
                'Hay demasiados elementos no se puede seleccionar todos. Solo los primeros %{max} elementos fueron seleccionados.',
            unsaved_changes:
                "Hay cambios sin guardar. Seguro que quiere ignorarlos?",
            yes: 'Sí',
            placeholder_data_warning: 'Error de red, los datos no se pudieron cargar.',
        },
        navigation: {
            clear_filters: 'Limpiar filtros',
            no_filtered_results: 'Ningun %{name} se encontró con los filtros actuales.',
            no_results: 'Ningun %{name} se encontró',
            no_more_results:
                'El numero de pagina %{page} esta fuera de los limites. Intente con la pagina anterior.',
            page_out_of_boundaries: 'Numero de pagina %{page} fuera de los limites',
            page_out_from_end: 'No se puede ir mas allá de la ultima pagina',
            page_out_from_begin: 'No se puede ir antes de la primera pagina',
            page_range_info: '%{offsetBegin}-%{offsetEnd} del %{total}',
            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} mayor que %{offsetEnd}',
            current_page: 'Pagina %{page}',
            page: 'Ir a la pagina %{page}',
            first: 'Ir a la primera pagina',
            last: 'Ir a la ultima pagina',
            next: 'Ir a la pagina siguiente',
            previous: 'Ir a la pagina anterior',
            page_rows_per_page: 'Filas por pagina:',
            skip_nav: 'Saltar al contenido',
        },
        sort: {
            sort_by: 'Ordenar por %{field_lower_first} %{order}',
            ASC: 'Ascendiente',
            DESC: 'Descendiente',
        },
        auth: {
            auth_check_error: 'Por favor inicie sesión para continuar',
            user_menu: 'Perfil',
            username: 'Nombre de usuario',
            password: 'Contraseña',
            email: 'Correo electrónico',
            sign_in: 'Iniciar sesión',
            sign_in_error: 'Error de autenticación, por favor intente de nuevo',
            logout: 'Cerrar sesión',
        },
        notification: {
            updated: 'Elemento actualizado |||| %{smart_count} elementos actualizados',
            created: 'Elemento creado',
            deleted: 'Elemento eliminado |||| %{smart_count} elementos eliminados',
            bad_item: 'Elemento incorrecto',
            item_doesnt_exist: 'l elemento no existe',
            http_error: 'Error de comunicación con el servidor',
            data_provider_error:
                'Error del proveedor de datos, revise la consola para más detalles.',
            i18n_error:
                'No se pueden cargar las traducciones para el idioma especificado',
            canceled: 'Acción cancelada',
            logged_out: 'Su sesión ha finalizado, por favor reconéctese.',
            not_authorized: "No está autorizado para acceder a este recurso.",
            application_update_available: 'Hay una nueva version disponible.',
            offline: 'No hay conexion no se puede acceder a los datos.',
        },
        validation: {
            required: 'Requerido',
            minLength: 'Debe tener al menos %{min} caracteres',
            maxLength: 'Debe tener %{max} caracteres o menos',
            minValue: 'Debe ser al menos %{min}',
            maxValue: 'Debe ser %{max} o menos',
            number: 'Debe ser un número',
            email: 'Debe ser un correo electrónico válido',
            oneOf: 'Debe ser uno de: %{options}',
            regex: 'Debe coincidir con un formato específico (regexp): %{pattern}',
            unique: 'Debe ser único',
        },
        saved_queries: {
            label: 'Consultas guardadas',
            query_name: 'Nombre de la consulta',
            new_label: 'Guardar consulta actual...',
            new_dialog_title: 'Guardar consulta actual como',
            remove_label: 'Borrar consulta guardada',
            remove_label_with_name: 'Borrar consulta "%{name}"',
            remove_dialog_title: 'Borrar consulta guardada?',
            remove_message:
                '¿Está seguro de que quiere eliminar ese elemento de su lista de consultas guardadas?',
            help: 'Filtrar la lista y guardar la consulta para usarla más tarde',
        },
        guesser: {
            empty: {
                title: 'No hay datos que mostrar',
                message: 'Por favor revise su proveedor de datos y asegúrese de que tiene datos para mostrar.',
            },
        },
        configurable: {
            customize: 'Personalizar',
            configureMode: 'Configurar esta pagina',
            inspector: {
                title: 'Inspector',
                content: 'Seleccione un elemento para inspeccionarlo',
                reset: 'Reiniciar Configuración',
                hideAll: 'Ocultar Todo',
                showAll: 'Mostrar Todo',
            },
            Datagrid: {
                title: 'Datagrid',
                unlabeled: 'Columna sin nombre #%{column}',
            },
            SimpleForm: {
                title: 'Formulario Simple',
                unlabeled: 'Input sin nombre #%{input}',
            },
            SimpleList: {
                title: 'Lista',
                primaryText: 'Texto principal',
                secondaryText: 'Texto secundario',
                tertiaryText: 'Texto terciario',
            },
        },
    },
};

export default spanishMessages;