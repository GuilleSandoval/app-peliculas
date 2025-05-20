import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeliculaDetalle, RespuestaCredits, RespuestaMDB } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url;
const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private popularesPges = 0;
  private generos: any[] = [];

  private ejecutarQuery<T>(query: string){
    query = URL + query;
    query += `&api_key=${apiKey}&language=es&include_image_language=es`;
    return this.http.get<T>( query );
  }
  constructor( private http: HttpClient) { }

  getPopulares(){

    this.popularesPges++;
    const query = `/discover/movie?sort_by=popularity.desc&page=${ this.popularesPges}`;
    return this.ejecutarQuery<RespuestaMDB>(query);
  }

  getFeature(): Observable<RespuestaMDB>{

    const hoy = new Date();
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0 ).getDate();
    const mes = hoy.getMonth() + 1;

    let mesString;

    if (mes < 10){
      mesString = '0' + mes;
    } else{
      mesString = mes;
    }

    const inicio = `${hoy.getFullYear()}-${ mesString}-01`;
    const fin = `${hoy.getFullYear()}-${ mesString}-${ultimoDia}`;
    return this.ejecutarQuery<RespuestaMDB>(`/discover/movie?primary_release_date.gte=${inicio}&primary_release_date.lte=${fin}`);
  }
  
  getPeliculasDetalle(id: string){
    return this.ejecutarQuery<PeliculaDetalle>(`/movie/${id}?a=1`);
  }

  getActoresPelicula(id: string){
    return this.ejecutarQuery<RespuestaCredits>(`/movie/${id}/credits?a=1`);
  }

  buscarPeliculas(texto: string){
    return this.ejecutarQuery(`/search/movie?query=${texto}`);
  }

  cargarGeneros(): Promise<any[]>{

    return new Promise(resolve => {
      this.ejecutarQuery(`/genre/movie/list?a=1`)
      .subscribe((resp: any) => {
        this.generos = resp['genres'];
        resolve(this.generos);
      });
    });
  }
}
