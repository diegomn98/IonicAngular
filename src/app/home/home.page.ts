import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  map: any;
  coordsForm: FormGroup;
  marker: any;
  contador = 0;
  arrayLocations = [];
  locations:{
    location:{
      id: number,
      lat:number,
      lng:number
    };
  }

  arrayWayPoints = [];
  waypoints:{
    location:{
      id: number,
      lat:number,
      lng:number
    };
  stopover: boolean;
  };

  private buildForm(){
    this.coordsForm = new FormGroup({
      latitud: new FormControl('', [Validators.required,Validators.maxLength(10)]),
      longitud: new FormControl('', [Validators.required,Validators.maxLength(10)])
    })
  };

  constructor() {
    this.buildForm();
  }

  ngOnInit(){
    //this.initMap();
  }

  directionService = new google.maps.DirectionsService();
  directionDisplay = new google.maps.DirectionsRenderer();

  initMap(){
    //console.log(this.arrayLocations);
    if(this.arrayLocations.length == 1){
    const options = {
      center: {
        lat: this.arrayLocations[0].location['lat'], 
        lng: this.arrayLocations[0].location['lng']
      },
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, options);
    this.directionDisplay.setMap(this.map);

    this.marker = new google.maps.Marker({
      position:{
        lat: this.arrayLocations[0].location['lat'], 
        lng: this.arrayLocations[0].location['lng']
      },
      map: this.map
    }); 
    
  }
    if(this.arrayLocations.length > 1){
      this.calculateRoute();
    }
  }
  
  calculateRoute(){
    this.directionService.route({
      origin: {
        lat: this.arrayLocations[0].location['lat'], 
        lng: this.arrayLocations[0].location['lng']
      },
      destination: {
        lat: this.arrayLocations[this.arrayLocations.length-1].location['lat'], 
        lng: this.arrayLocations[this.arrayLocations.length-1].location['lng']
      },
      waypoints: this.arrayWayPoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.WALKING,
    }, (response, status) => {
      if(status === google.maps.DirectionsStatus.OK){
        this.directionDisplay.setDirections(response);
      }else{
        alert("Could not display directions due to: "+status);
      }
    });
  }

  addLocation(){
    this.locations = { 
      location: { 
        id: this.contador,
        lat: parseFloat(this.coordsForm.get('latitud').value),  
        lng: parseFloat(this.coordsForm.get('longitud').value)
      } 
    }
    this.arrayLocations.push(this.locations);
    this.contador = this.contador+1;
    if(this.arrayLocations.length > 2){
      for(let i = 1; i<this.arrayLocations.length-1; i++){
          this.waypoints = {
            location:{
              id: this.arrayLocations[i].location['id'],
              lat: this.arrayLocations[i].location['lat'],
              lng:this.arrayLocations[i].location['lng']
            },
            stopover:true
          };
        }
        this.arrayWayPoints.push(this.waypoints);   
      
    }
    this.initMap();
  }

  borrar(item, indice){
      console.log(this.arrayLocations);
      console.log(this.arrayWayPoints);
      let idBorrado;
      let x;
      for(let i = 0; i<this.arrayLocations.length; i++){
        if(i == indice){
          x = this.arrayLocations.indexOf(this.arrayLocations[i]);
          idBorrado = this.arrayLocations[i].location['id'];
          this.arrayLocations.splice(x, 1);
        }
      }
      this.arrayWayPoints = [];
      if(this.arrayLocations.length > 2){
        for(let i = 1; i<this.arrayLocations.length-1; i++){
          this.waypoints = {
            location:{
              id: this.arrayLocations[i].location['id'],
              lat: this.arrayLocations[i].location['lat'],
              lng:this.arrayLocations[i].location['lng']
            },
            stopover:true
          };
        }
        this.arrayWayPoints.push(this.waypoints);
      }

      if(this.arrayLocations.length == 0){
        this.arrayLocations = [];
        this.arrayWayPoints = [];
        document.getElementById("map").innerHTML="";
        if(this.directionDisplay != null) {
          this.directionDisplay.setMap(null);
          this.directionDisplay = null;
          this.marker.setMap(null); 
        }
        this.directionDisplay = new google.maps.DirectionsRenderer();
        this.directionDisplay.setMap(this.map);
        this.directionDisplay.setPanel(document.getElementById("map"));
      }else{
        if(this.directionDisplay != null) {
          this.directionDisplay.setMap(null);
          this.directionDisplay = null;
          this.marker.setMap(null); 
        }
        this.directionDisplay = new google.maps.DirectionsRenderer();
        this.directionDisplay.setMap(this.map);
        this.directionDisplay.setPanel(document.getElementById("map"));
        this.initMap();
      }
  }

  borrarTodo(){
    this.contador = 0;
    this.arrayLocations = [];
    this.arrayWayPoints = [];
    document.getElementById("map").innerHTML="";
    if(this.directionDisplay != null) {
      this.directionDisplay.setMap(null);
      this.directionDisplay = null;
      this.marker.setMap(null); 
    }
    this.directionDisplay = new google.maps.DirectionsRenderer();
    this.directionDisplay.setMap(this.map);
    this.directionDisplay.setPanel(document.getElementById("map"));
    console.log(this.arrayWayPoints);
    console.log(this.arrayLocations);
  }

}
