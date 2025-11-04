import { VeteService } from './vete.service';
import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';

@Controller()
export class VeteController {
  constructor(private srv: VeteService) {}

  // Dueños (ruta: /duenos)
  @Get('duenos') listD() { return this.srv.listDuenios(); }
  @Get('duenos/:id') getD(@Param('id', ParseIntPipe) id:number){ return this.srv.getDuenio(id); }
  @Post('duenos') createD(@Body() b:any){ return this.srv.createDuenio(b); }
  @Put('duenos/:id') putD(@Param('id', ParseIntPipe) id:number,@Body() b:any){ return this.srv.putDuenio(id,b); }
  @Patch('duenos/:id') patchD(@Param('id', ParseIntPipe) id:number,@Body() b:any){ return this.srv.patchDuenio(id,b); }

  // Mascotas y turnos (igual que antes)
  @Get('mascotas') listM(){ return this.srv.listMascotas(); }
  @Get('mascotas/:id') getM(@Param('id', ParseIntPipe) id:number){ return this.srv.getMascota(id); }
  @Post('mascotas') createM(@Body() b:any){ return this.srv.createMascota(b); }
  @Put('mascotas/:id') putM(@Param('id', ParseIntPipe) id:number,@Body() b:any){ return this.srv.putMascota(id,b); }
  @Patch('mascotas/:id') patchM(@Param('id', ParseIntPipe) id:number,@Body() b:any){ return this.srv.patchMascota(id,b); }

  @Get('turnos') listT(){ return this.srv.listTurnos(); }
  @Post('turnos') createT(@Body() b:any){ return this.srv.createTurno(b); }

  // Tratamientos
@Get('tratamientos') listTrat(){ return this.srv.listTratamientos(); }
@Get('tratamientos/:id') getTrat(@Param('id', ParseIntPipe) id:number){ return this.srv.getTratamiento(id); }
@Post('tratamientos') createTrat(@Body() b:any){ return this.srv.createTratamiento(b); }
@Put('tratamientos/:id') putTrat(@Param('id', ParseIntPipe) id:number,@Body() b:any){ return this.srv.putTratamiento(id,b); }
@Delete('tratamientos/:id') deleteTrat(@Param('id', ParseIntPipe) id:number){ return this.srv.deleteTratamiento(id); }

// Historial de mascota
@Get('mascotas/:id/historial') getHist(@Param('id', ParseIntPipe) id:number){ return this.srv.historialMascota(id); }

// Clientes que necesitan chequeo anual
@Get('clientes/chequeo-anual') clientesChequeo(){ return this.srv.clientesChequeoAnual(); }

// Clientes con vacuna próxima — opcional query ?dias=30
@Get('clientes/vacuna-proxima') clientesVacuna(@Query('dias') dias?: string){
  const d = dias ? parseInt(dias,10) : 30;
  return this.srv.clientesVacunaProxima(d);
}

}
