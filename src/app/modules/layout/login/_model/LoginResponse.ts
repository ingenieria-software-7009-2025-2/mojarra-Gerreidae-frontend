export class LoginResponse{  
    nombre: string = "";
    apellidoP: string = "";
    apellidoM: string = "";
    correo: string = "";
    contrasenia: string = "";
    token: string = ""; 
    rol: number = -1;

    constructor(token: string, rol: number, nombre: string, apellidoP: string, apellidoM: string){
        this.token = token;
        this.rol = rol;
        this.nombre = nombre;
        this.apellidoP = apellidoP;
        this.apellidoM = apellidoM;
    }
}