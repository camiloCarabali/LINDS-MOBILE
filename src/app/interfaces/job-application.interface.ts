// Interfaces para el sistema de aplicaciones a envíos (JobApplications)
export enum EstadoAplicacion {
  PENDIENTE = 'pendiente',
  ACEPTADA = 'aceptada',
  RECHAZADA = 'rechazada',
  CANCELADA = 'cancelada'
}

export interface EnvioApplication {
  id: number;
  envio_id: number;
  conductor_id: string;
  estado: EstadoAplicacion;
  mensaje?: string;
  created_at: string;
  updated_at: string;
}

export interface EnvioApplicationCreate {
  envio_id: number;
  mensaje?: string;
}

export interface EnvioApplicationWithDetails extends EnvioApplication {
  // Detalles del conductor
  conductor_nombre?: string;
  conductor_email?: string;
  conductor_telefono?: string;
  conductor_vehiculo?: string;
  conductor_rating?: number;
  
  // Detalles del envío
  envio_origen?: string;
  envio_destino?: string;
  envio_fecha?: string;
}

export interface Envio {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  vehiculo?: string;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  tipo_carga: string;
  valor: number;
  seguro: boolean;
  descripcion?: string;
  contacto_alt?: string;
  ayuda_carga: boolean;
  observaciones?: string;
  estado: string;
  valor_pagado: number;
  usuario_id: string;
  conductor_id?: string;
  created_at: string;
  updated_at: string;
  fecha_asignacion?: string;
  fecha_inicio?: string;
  fecha_completado?: string;
}
