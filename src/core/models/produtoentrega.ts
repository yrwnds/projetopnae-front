import {Tipoalimenticio} from './tipoalimenticio';
import {Agricultor} from './agricultor';
import {Entrega} from './entrega';

export interface Produtoentrega{
    id: number;
    qtd: number;
    tipound: string;
    observacao: string;
    tipo: Tipoalimenticio;
    agricultor: Agricultor;
    entrega: Entrega;
}
