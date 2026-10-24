import { fetchUtils } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
//Agrega el token en el header Authentication a cada petición del backend
const fetchJsonUtil=(url:string, options:fetchUtils.Options={})=>{
    if(!options.headers){
        options.headers= new Headers({Accept: "application/json"});
    }
    options.headers.set("Authentication", sessionStorage.getItem("auth"))
    return fetchUtils.fetchJson(url, options);
};
//Conecta React Admin con nuestro backend
export const dataProvider = jsonServerProvider("https://localhost:3000", fetchJsonUtil);