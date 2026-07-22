export interface MensajesResponse {
  ok:         boolean;
  Mensaje: Mensajes[];
  msg:        string;
}
export interface getMensajesResponse {
  ok:         boolean;
  Mensaje: Mensajes;
  msg:        string;
}
export interface Mensajes {
  mensaje_id: number;
  mensajeResp_id: number;
  UsuarioSend: string;
  UsuarioRecep: string;
  msgDate: Date;
  msgDateCita: Date;
  asunto_id: number;
  msgMensaje: string;
  msgMensajeRespuesta: string;
  msgUsuarioRecepOk: boolean;
  msgEliminado: boolean;
  IdMensajeOriginal: number;
  categoria_id: number;
  participantes: string;
  participantesCia: string;
  tipoMensaje: string;
  status: string;
  Asunto: string;
  Categoria: string;
  Foto: any;
  titulo: string;
  fechaCita:string;
  Name:string

}




export interface ReportesResponse {
  ok:         boolean;
  Reportes: Reportes[];
  msg:        string;
}

export interface getReportesResponse {
ok:         boolean;
Reporte: Reportes;
msg:        string;
}

export interface Reportes {
CEDJURIDICA: string;
REPORTE_DSC: string;
LINK: string;

}

export type MensajeStatus =
| 'canceled'
| 'complete'
| 'pending'
| 'rejected'
| 'PENDIENTE'| 'ACEPTADA' | 'ACORDADA' | 'RECHAZADA' | 'ENVIADO' | 'RECIBIDO' ;