export class UpdateResponse{
    idUsuario: number = -1;
    nombre: string = "";
    apellidoP: string = "";
    apellidoM: string = "";
    correo: string = "";
    password: string = "";
    token: string = ""; 
    rol: number = -1;

    constructor(token: string, rol: number, nombre: string, apellidoP: string, apellidoM: string, idUsuario: number){
        this.idUsuario = idUsuario;
        this.token = token;
        this.rol = rol;
        this.nombre = nombre;
        this.apellidoP = apellidoP;
        this.apellidoM = apellidoM;
    }
}