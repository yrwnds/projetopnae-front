import {Usuario} from './usuario';

export interface Edital{
  id: number;
  nome: string;
  observacao: string;
  usuario: Usuario;
}
