import { Admin, Resource, ShowGuesser} from "react-admin";
import { dataProvider } from "./dataProvider";
import { UserList, UserEdit, UserCreate, UserGetOne } from "./users";
import { PostEdit, PostsList, PostCreate} from "./posts";
import { CommentsCreate, CommentsEdit, CommentsList } from "./comments";
import { AlbumsList, AlbumsCreate, AlbumsEdit } from "./albums";
import { TodosList, TodosCreate, TodosEdit } from "./todos";
import {authProvider} from "./AuthProvider";
import {Inicio} from "./Dashboard";
import { PhotosList, PhotosCreate, PhotosEdit } from "./photos";
import { i18nProvider } from './i18nProvider';

//hooks 

import MyLoginPage from './login';


import UserIcon from "@mui/icons-material/Group";
import PostIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";
import ToDoIcon from "@mui/icons-material/CheckBox";
import AlbumIcon from "@mui/icons-material/Album";
import PhotoIcon from "@mui/icons-material/Photo";

export const App = () => (
  <Admin 
  dataProvider={dataProvider}
  authProvider={authProvider}
  dashboard={Inicio}
  i18nProvider={i18nProvider}
  loginPage={MyLoginPage}

>
    <Resource name="users" 
    list={UserList} 
    edit={UserEdit}
    create={UserCreate}
    show = {UserGetOne}
    icon={UserIcon}
    options={{ label: "Graficas" }}
    />
    <Resource name="posts" 
    list={PostsList}
    edit={PostEdit}
    create={PostCreate}
    icon={PostIcon}
    options={{ label: "Perfil" }}
    />
    {/* <Resource name="comments" 
    list={CommentsList} 
    edit={CommentsEdit} 
    create={CommentsCreate} 
    icon = {CommentIcon}
    options={{ label: "Comentarios" }}
    />
    {<Resource name="albums" 
    list={AlbumsList}
    edit={AlbumsEdit}
    create={AlbumsCreate} 
    icon={AlbumIcon}
    options={{ label: "Álbumes" }}
    />}
    <Resource name="photos" 
    list={PhotosList}
    edit={PhotosEdit}
    create={PhotosCreate}
    icon={PhotoIcon}
    options={{ label: "Fotos" }}
     />
    <Resource name="todos" 
    list={TodosList}
    edit={TodosEdit}
    create={TodosCreate} 
    icon={ToDoIcon}
    options={{ label: "Tareas" }}
     /> */}
  </Admin>
);