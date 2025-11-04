import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { readJSON, writeJSON } from '../common/file-db';

type Duenio = { id:number; nombre:string; telefono:string };
type Mascota = { id:number; nombre:string; especie:string; duenioId:number };
type Turno = { id:number; mascotaId:number; fecha:string; motivo?:string };
type Tratamiento = { id:number; mascotaId:number; tipo:string; fecha:string; descripcion?:string; proximaFecha?:string };

const P = {
  duenios: 'data/duenos.json',
  mascotas: 'data/mascotas.json',
  turnos: 'data/turnos.json',
  tratamientos: 'data/tratamientos.json',
};

@Injectable()
export class VeteService {
  private nextId(list: {id:number}[]) { return list.length ? Math.max(...list.map(x=>x.id))+1 : 1; }

  // dueños
  listDuenios(): Duenio[] { return readJSON<Duenio[]>(P.duenios, []); }

  getDuenio(id:number): Duenio {
    const d = this.listDuenios().find(x=>x.id===id);
    if(!d) throw new NotFoundException('Dueño no encontrado');
    return d;
  }

  createDuenio(data: Omit<Duenio,'id'>): Duenio {
    if(!data?.nombre) throw new BadRequestException('nombre requerido');
    const list = this.listDuenios();
    const nuevo = { id:this.nextId(list), ...data };
    writeJSON(P.duenios, [...list, nuevo]);
    return nuevo;
  }

  putDuenio(id:number, data: Omit<Duenio,'id'>): Duenio {
    const list = this.listDuenios();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Dueño no encontrado');
    list[i] = { id, ...data };
    writeJSON(P.duenios, list);
    return list[i];
  }

  patchDuenio(id:number, data: Partial<Omit<Duenio,'id'>>): Duenio {
    const list = this.listDuenios();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Dueño no encontrado');
    list[i] = { ...list[i], ...data };
    writeJSON(P.duenios, list);
    return list[i];
  }

  deleteDuenio(id:number) {
    const list = this.listDuenios();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Dueño no encontrado');
    // eliminar dueño
    const nuevo = [...list.slice(0,i), ...list.slice(i+1)];
    writeJSON(P.duenios, nuevo);
    // borrar mascotas del dueño y sus turnos en cascada
    const mascotas = this.listMascotas().filter(m => m.duenioId !== id);
    writeJSON(P.mascotas, mascotas);
    const turnos = this.listTurnos().filter(t => mascotas.some(m => m.id === t.mascotaId));
    writeJSON(P.turnos, turnos);
    return { eliminado: true };
  }

  // mascotas
  listMascotas(): Mascota[] { return readJSON<Mascota[]>(P.mascotas, []); }

  getMascota(id:number): Mascota {
    const m = this.listMascotas().find(x=>x.id===id);
    if(!m) throw new NotFoundException('Mascota no encontrada');
    return m;
  }

  createMascota(data: Omit<Mascota,'id'>): Mascota {
    if(!data?.duenioId) throw new BadRequestException('duenioId requerido');
    this.getDuenio(data.duenioId); // valida existencia del dueño
    const list = this.listMascotas();
    const nuevo = { id:this.nextId(list), ...data };
    writeJSON(P.mascotas, [...list, nuevo]);
    return nuevo;
  }

  putMascota(id:number, data: Omit<Mascota,'id'>): Mascota {
    const list = this.listMascotas();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Mascota no encontrada');
    list[i] = { id, ...data };
    writeJSON(P.mascotas, list);
    return list[i];
  }

  patchMascota(id:number, data: Partial<Omit<Mascota,'id'>>): Mascota {
    const list = this.listMascotas();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Mascota no encontrada');
    list[i] = { ...list[i], ...data };
    writeJSON(P.mascotas, list);
    return list[i];
  }

  deleteMascota(id:number) {
    const list = this.listMascotas();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Mascota no encontrada');
    const nuevo = [...list.slice(0,i), ...list.slice(i+1)];
    writeJSON(P.mascotas, nuevo);
    // eliminar turnos asociados
    const turnos = this.listTurnos().filter(t => t.mascotaId !== id);
    writeJSON(P.turnos, turnos);
    return { eliminado: true };
  }

  // turnos
  listTurnos(): Turno[] { return readJSON<Turno[]>(P.turnos, []); }

  createTurno(data: Omit<Turno,'id'>): Turno {
    if(!data?.mascotaId) throw new BadRequestException('mascotaId requerido');
    this.getMascota(data.mascotaId);
    if(!data?.fecha) throw new BadRequestException('fecha requerida');
    const fecha = new Date(data.fecha);
    if(isNaN(+fecha) || fecha < new Date()) throw new BadRequestException('fecha inválida o pasada');
    const list = this.listTurnos();
    const nuevo = { id:this.nextId(list), ...data };
    writeJSON(P.turnos, [...list, nuevo]);
    return nuevo;
  }

  deleteTurno(id:number) {
    const list = this.listTurnos();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Turno no encontrado');
    const nuevo = [...list.slice(0,i), ...list.slice(i+1)];
    writeJSON(P.turnos, nuevo);
    return { eliminado: true };
  }

  // TRATAMIENTOS
  listTratamientos(): Tratamiento[] { return readJSON<Tratamiento[]>(P.tratamientos, []); }

  getTratamiento(id:number): Tratamiento {
    const t = this.listTratamientos().find(x=>x.id===id);
    if(!t) throw new NotFoundException('Tratamiento no encontrado');
    return t;
  }

  createTratamiento(data: Omit<Tratamiento,'id'>): Tratamiento {
    if(!data?.mascotaId) throw new BadRequestException('mascotaId requerido');
    this.getMascota(data.mascotaId);
    if(!data?.fecha) throw new BadRequestException('fecha requerida');
    const fecha = new Date(data.fecha);
    if(isNaN(+fecha)) throw new BadRequestException('fecha inválida');
    const list = this.listTratamientos();
    const nuevo = { id:this.nextId(list), ...data };
    writeJSON(P.tratamientos, [...list, nuevo]);
    return nuevo;
  }

  putTratamiento(id:number, data: Omit<Tratamiento,'id'>): Tratamiento {
    const list = this.listTratamientos();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Tratamiento no encontrado');
    list[i] = { id, ...data };
    writeJSON(P.tratamientos, list);
    return list[i];
  }

  deleteTratamiento(id:number) {
    const list = this.listTratamientos();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) throw new NotFoundException('Tratamiento no encontrado');
    const nuevo = [...list.slice(0,i), ...list.slice(i+1)];
    writeJSON(P.tratamientos, nuevo);
    return { eliminado: true };
  }

  // Historial
  historialMascota(mascotaId:number) {
    const mascota = this.getMascota(mascotaId);
    const duenio = this.getDuenio(mascota.duenioId);
    const turnos = this.listTurnos().filter(t => t.mascotaId === mascotaId)
      .map(t => ({ tipo: 'turno', fecha: t.fecha, detalle: t.motivo, id: t.id }));
    const tratamientos = this.listTratamientos().filter(t => t.mascotaId === mascotaId)
      .map(t => ({ tipo: 'tratamiento', fecha: t.fecha, detalle: `${t.tipo}: ${t.descripcion || ''}`, id: t.id, proximaFecha: t.proximaFecha }));
    const combinado = [...turnos, ...tratamientos].sort((a,b) => +new Date(b.fecha) - +new Date(a.fecha));
    return { mascota, duenio, historial: combinado };
  }

  
  clientesChequeoAnual() {
    const mascotas = this.listMascotas();
    const turnos = this.listTurnos();
    const tratamientos = this.listTratamientos();
    const hoy = new Date();
    const resultadosDuenios = new Map<number, {duenio:any, ultimaVisita: Date | null}>();

    for(const m of mascotas){
      const fechas: Date[] = [];
      turnos.filter(t => t.mascotaId === m.id).forEach(t => { const d=new Date(t.fecha); if(!isNaN(+d)) fechas.push(d); });
      tratamientos.filter(t => t.mascotaId === m.id).forEach(t => { const d=new Date(t.fecha); if(!isNaN(+d)) fechas.push(d); });
      const ultima = fechas.length ? new Date(Math.max(...fechas.map(d=>+d))) : null;
      const existing = resultadosDuenios.get(m.duenioId) || { duenio: this.getDuenio(m.duenioId), ultimaVisita: null };
      if(!existing.ultimaVisita || (ultima && ultima > existing.ultimaVisita)) existing.ultimaVisita = ultima;
      resultadosDuenios.set(m.duenioId, existing);
    }

    const umbral = 1000 * 60 * 60 * 24 * 365;
    const lista: any[] = [];
    for(const [id, info] of resultadosDuenios){
      const ultima = info.ultimaVisita;
      if(!ultima || (hoy.getTime() - ultima.getTime()) > umbral){
        lista.push({ duenio: info.duenio, ultimaVisita: ultima ? ultima.toISOString() : null });
      }
    }
    return lista;
  }

  clientesVacunaProxima(dias:number = 30) {
    const tratamientos = this.listTratamientos();
    const hoy = new Date();
    const limite = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000);
    const candidatos = tratamientos.filter(t => t.tipo === 'vacuna' && t.proximaFecha)
      .filter(t => {
        const p = new Date(t.proximaFecha as string);
        return !isNaN(+p) && p >= hoy && p <= limite;
      });
    const dueniosSet = new Map<number, any>();
    for(const t of candidatos){
      try {
        const mascota = this.getMascota(t.mascotaId);
        const duenio = this.getDuenio(mascota.duenioId);
        dueniosSet.set(duenio.id, { duenio, mascota, proximaFecha: t.proximaFecha });
      } catch {
        // ignorar si mascota/dueño no existen
      }
    }
    return Array.from(dueniosSet.values());
  }
}
