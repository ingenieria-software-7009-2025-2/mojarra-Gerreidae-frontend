export interface Incidente {
    id_incidente?: number; // <- opcional
    id_usuario: number;
    descripcion: string;
    tipo: string;
    estado: string;
    longitud: number;
    latitud: number;
    fecha: Date;
  }
  