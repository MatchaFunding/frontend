export interface SelectProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  fondoTitle?: string;
  instrumentoId?: number;
  onPostulacionCreated?: () => void; 
  mode?: 'create' | 'unlink'; 
  onPostulacionDeleted?: () => void; 
}

export interface Proyecto {
  ID: number;
  Titulo: string;
  Descripcion: string;
  estado?: string; 
  fondo_seleccionado?: string; 
}
