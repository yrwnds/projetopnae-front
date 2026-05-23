import {Usuario} from './usuario';

export interface Agricultor{
  id: number;
  nome: string;
  contato: string;
  usuario: Usuario;
}
