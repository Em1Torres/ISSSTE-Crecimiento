import { fetchUtils } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const fetchJsonUtil=(url:string, options:fetchUtils.Options={})=>{
    if(!options.headers){
        options.headers= new Headers({Accept: "application/json"});
    }
    const token=sessionStorage.getItem("auth");
    if(token){
        (options.headers as Headers).set("Authorization", "Bearer " + token);
    }
    return fetchUtils.fetchJson(url, options);
};

export const dataProvider = jsonServerProvider("http://localhost:3000", fetchJsonUtil);