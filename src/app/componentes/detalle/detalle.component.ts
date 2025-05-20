import { Component, Input, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Cast, PeliculaDetalle } from 'src/app/interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  standalone: false,
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent  implements OnInit {

  @Input() id: any;
  sliderOpts = {
    slidesPerView: 3.3,
    freeMode: true,
    spacebetween: -5
    };

  pelicula: PeliculaDetalle = {};
  oculto = 150;
  actores: Cast[] = [];
  estrella = 'star-outline';

  constructor(private MoviesService: MoviesService, private modalCtrl: ModalController, private dataLocal: DataLocalService, ) {}

  ngOnInit() {
    this.dataLocal.existePelicula(this.id).then(existe => this.estrella = ( existe )? 'star': 'star-outline');

    this.MoviesService.getPeliculasDetalle(this.id).subscribe( resp => {
      console.log(resp);
      this.pelicula = resp;
    })

    this.MoviesService.getActoresPelicula(this.id).subscribe( resp => {
      console.log(resp);
      this.actores = resp.cast;
    })
  }

  regresar(){
    this.modalCtrl.dismiss();
  }
  async favoritos(){
    const existe = this.dataLocal.guardarPelicula(this.pelicula);
    this.estrella = await ( existe )? 'star': 'star-outline';
  }
}
