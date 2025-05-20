import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { PeliculaDetalle } from '../interfaces/interfaces'; // ajusta la ruta si es diferente
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  private _storage: Storage | null = null;
  public peliculas: PeliculaDetalle[] = [];

  constructor(private storage: Storage, private toastCtrl: ToastController) {
    this.init(); // <--- inicializamos el storage al crear el servicio
    this.cargarFavoritos(); 
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async guardarPelicula(pelicula: PeliculaDetalle) {

     let existe = false;
     let mensaje = '';

    for(const peli of this.peliculas){
      if(peli.id === pelicula.id){
        existe = true;
        break;
      }
    }

    if (existe){
      this.peliculas = this.peliculas.filter(peli => peli.id !== pelicula.id);
      mensaje = 'Removido de favoritos';
    }else{
      this.peliculas.push(pelicula);
      mensaje = 'Agregado a favoritos';
    }
    this.presentToast(mensaje);
    await this._storage?.set('peliculas', this.peliculas);

    return !existe;
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();

  }

  async cargarFavoritos(){
    const peliculas = await this.storage.get('peliculas');
    this.peliculas = peliculas || [];
    return this.peliculas;
  }

  async existePelicula(id: any){
    id = Number(id);
    await this.cargarFavoritos();
    const existe = this.peliculas.find(peli => peli.id === id);
    return (existe)? true: false;
  }
}
