import {Tipoalimenticio} from './tipoalimenticio';

export interface Cronograma{
  id: number;
  observacao?: string;
  qtd: number;
  tipound: string;
  previsaoentrega: Date;
  tipo: Tipoalimenticio;
}
