export class RegisterResponse {
    idUsuario: number = -1;
    nombre: string = "";
    apellidoP: string = "";
    apellidoM: string = "";
    correo: string = "";  // Renamed to match backend
    password: string = "";
    token: string = ""; 

    constructor(token: string, nombre: string, apellidoP: string, apellidoM: string, correo: string){
        this.token = token;
        this.nombre = nombre;
        this.apellidoP = apellidoP;
        this.apellidoM = apellidoM;
        this.correo = correo; // Match mail from backend
    }
}
