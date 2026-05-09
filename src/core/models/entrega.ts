import {Usuario} from './usuario';
import {Edital} from './edital';

export interface Entrega{
    id: number;
    dataentrega: Date;
    edital: Edital;
    usuario: Usuario;
}
