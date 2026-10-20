import { AuthProvider } from "react-admin";

const authProvider:AuthProvider={  // Basicamente moví que agregara el rol además de mandar el token para verificar con el backend 
    login: async({username, password})=>{
        const request=new Request("http://localhost:3000/login", {
            method:"POST",
            body:JSON.stringify({"username":username, "password":password}),
            headers: new Headers({"Content-Type":"application/json"})
        });
        try{
            const res=await fetch(request);
            if(res.status<200 || res.status>=300){
                throw new Error(res.statusText);
            }
            const auth=await res.json();
            sessionStorage.setItem("auth", auth.token);
            sessionStorage.setItem("rol", auth.rol);
            sessionStorage.setItem("identity", JSON.stringify({"id": auth.id}));
            return Promise.resolve();
        }catch{
            throw new Error("Error en usuario o password");
        }
    },
    logout: ()=>{
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("rol");
        sessionStorage.removeItem("identity");
        return Promise.resolve();
    },
    checkAuth:  ()=>{return sessionStorage.getItem("auth")?Promise.resolve():Promise.reject()},
    checkError: (error)=>{
        const status=error.status;
        if(status==401 || status==403){
            sessionStorage.removeItem("auth");
            sessionStorage.removeItem("rol");
            sessionStorage.removeItem("identity");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: ()=>Promise.resolve(sessionStorage.getItem("rol"))
};

export default authProvider;