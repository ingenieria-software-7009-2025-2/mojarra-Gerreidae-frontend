export class LoginResponse{
    nombre: string = "";
    apellidoP: string = "";
    apellidoM: string = "";
    correo: string = "";
    password: string = "";
    token: string = "";
    esAdministrador: number = -1;

    constructor(token: string, esAdministrador: number, nombre: string, apellidoP: string, apellidoM: string){
        this.token = token;
        this.esAdministrador = esAdministrador;
        this.nombre = nombre;
        this.apellidoP = apellidoP;
        this.apellidoM = apellidoM;
    }
}
