class Session {
  constructor(coords, distance, duration) {
    this.id = (Date.now() + "").slice(-10);
    this.date = new Date();
    this.coords = +coords;
    this.distance = +distance; // in km
    this.duration = +duration; // in min
  }
  setDescription() {}
}
class runSession extends Session {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.type = "run";
    this.cadence = +cadence;
    this.calcPace();
    this.setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
  setDescription() {
    this.description = `Course • ${
      this.distance
    } km • ${this.date.toLocaleDateString()}`;
  }
}
class runSession extends Session {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.type = "run";
    this.cadence = +cadence;
    this.calcPace();
    this.setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
  setDescription() {
    this.description = `Course • ${
      this.distance
    } km • ${this.date.toLocaleDateString()}`;
  }
}
class bikeSession extends Session {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.type = "bike";
    this.elevationGain = +elevationGain;
    this.calcSpeed();
    this.setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
  setDescription() {
    this.description = `Vélo • ${
      this.distance
    } km • ${this.date.toLocaleDateString()}`;
  }
}
class ActivityManager {
                    constructor() {
                          this.inputType = document.getElementById("type");
                          this.cadenceInput = document.getElementById("cadence");
                          this.cadenceLabel = document.getElementById("cadenceLabel");
                          this.deniveleInput = document.getElementById("denivele");
                          this.deniveleLabel = document.getElementById("deniveleLabel");
                          this.inputDistance =document.getElementById("distance");
                          this.form = document.getElementById("form");
                          this.historique = document.getElementById("historique");
                          this.typeInput = document.getElementById("type");
                          this.dureeInput = document.getElementById("duree");
                          this.cancelBtn = document.getElementById("cancel");
                          this.sessions =[];
                          this.map;
                          this.mapEvent;
                          this._loadMap();
                          this._loadLocalStorage();
                          this._attachEventHandler();
                    }
  _toggleFields() {
  if (inputType.value === "course") {
    cadenceInput.classList.remove("hidden");
    cadenceLabel.classList.remove("hidden");
    deniveleInput.classList.add("hidden");
    deniveleLabel.classList.add("hidden");
  } else if (inputType.value === "velo") {
    deniveleInput.classList.remove("hidden");
    deniveleLabel.classList.remove("hidden");
    cadenceInput.classList.add("hidden");
    cadenceLabel.classList.add("hidden");
  } else {
    cadenceInput.classList.add("hidden");
    cadenceLabel.classList.add("hidden");
    deniveleInput.classList.add("hidden");
    deniveleLabel.classList.add("hidden");
  }
}

_attachEventHandler(){
  this.inputType.addEventListener("change", this._toggleFields.bind(this));
  this. form.addEventListener("submit", this._newSession.bind(this));
  this.cancelBtn.addEventListener('click', ()=> this._hideForm());
}


_newSession(e){
  e.preventDefault();
  this.type = typeInput.value;
  this.duree = dureeInput.value;
  this.distance =inputDistance.value;
  this.cadence = cadenceInput.value;
  this.denivele = deniveleInput.value;
  const {lat , lng} = this.mapEvent.latlng;
  if (type === 'run'){
    const session = new runSession([lat,lng],distance,duree,cadence);
    this.sessions.push(session);
    this._renderSession(session);
    
  }else{
    const session = new bikeSession([lat,lng],distance,duree,denivele);
    this.sessions.push(session);
    this._renderSession(session); 
  }
  this._saveLocalStorage();
  this._hideForm();
}
_hideForm(){
  this.form.style.display = 'none';
  this.form.reset();
  this.inputType.value = 'run';
  this._toggleFields();
}
_loadMap(){
  const Url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  this.map = L.map("map").setView([34.020882, -6.84165], 13);
  L.tileLayer(Url, {
  attribution: "&copy; OpenStreetMap & CARTO",
}).addTo(map);
this.map.on('click',this._showForm.bind(this));
}
_showForm(mapE){
  this.mapEvent = mapE;
  this.form.style.display = 'flex';
  this._toggleFields();
  this.inputDistance.focus();
}
_saveLocalStorage(){
  localStorage.setItem('geotrakr_sessions', JSON.stringfy(this.sessions));
}
_loadLocalStorage(){
  const data = JSON.parse(localStorage.getItem('geotrakr_sessions'));
  if(!data) return;
  this.sessions = data.map(obj =>{
    if(obj.type === 'run'){
      const r = new runSession(obj.coords,obj.distance,obj.duree,obj.cadence);
      r.id = obj.id;
      r.date = new Date(obj.date);
      r.pace = obj.pace;
      r.description =obj.description;
      return r;
    }else{
      const b = new bikeSession(obj.coords,obj.distance,obj.duree,obj.cadence);
      b.id = obj.id;
      b.date = new Date(obj.date);
      b.pace = obj.pace;
      b.description =obj.description;
      return b;
    }
  })
}
_renderSession(session){
this._renderSessionMarker(session);
this._renderSessionItem(session);
}
_renderSessionMarker(session){
  const emoji = session.type === 'run' ? '🏃' : '🚴';
  const marker = L.marker(session.coords)
  .addTo(this.map)
  .bindPopUp(`${emoji} ${session.description}<br>Dist: ${session.distance} km • Durée: ${session.duration} min `,{autoClose: false});
}
}
const app = new ActivityManager();
window.app = app;