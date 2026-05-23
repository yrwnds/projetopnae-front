import {Tipoalimenticio} from './tipoalimenticio';
import {Usuario} from './usuario';

export interface Cronograma{
  id: number;
  observacao?: string;
  qtd: number;
  tipound: string;
  previsaoentrega: Date;
  tipo: Tipoalimenticio;
  usuario: Usuario;
}
