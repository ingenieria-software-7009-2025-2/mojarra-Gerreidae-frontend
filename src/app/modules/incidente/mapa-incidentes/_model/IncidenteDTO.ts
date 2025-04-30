export interface IncidenteDTO {
    idIncidente: number;
    idUsuario: number;
    descripcion: string;
    tipo: string;
    estado: string;
    longitud: number;
    latitud: number;
    fecha: Date; 
    direccionesFotografias: string[];
    codificacionFotografias: string[];    
}
