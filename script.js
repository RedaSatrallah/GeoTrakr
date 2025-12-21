class Session {
  constructor(coords, distance, duree) {
    this.id = (Date.now() + "").slice(-10);
    this.date = new Date();
    this.coords = coords;
    this.distance = +distance; // in km
    this.duree = +duree; // in min
  }
  setDescription() { }
}

class runSession extends Session {
  constructor(coords, distance, duree, cadence) {
    super(coords, distance, duree);
    this.type = "run";
    this.cadence = +cadence;
    this.calcPace();
    this.setDescription();
  }
  calcPace() {
    this.pace = this.duree / this.distance;
    return this.pace;
  }
  setDescription() {
    this.description = `Course • ${this.distance
      } km • ${this.date.toLocaleDateString()}`;
  }
}
class bikeSession extends Session {
  constructor(coords, distance, duree, elevationGain) {
    super(coords, distance, duree);
    this.type = "bike";
    this.elevationGain = +elevationGain;
    this.calcSpeed();
    this.setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duree / 60);
    return this.speed;
  }
  setDescription() {
    this.description = `Vélo • ${this.distance
      } km • ${this.date.toLocaleDateString()}`;
  }
}
class ActivityManager {
  constructor() {
    this.inputType = document.getElementById("type");
    this.cadenceInput = document.getElementById("cadence");
    this.cadenceLabel = document.getElementById("cadenceLabel");
    this.elevationGainInput = document.getElementById("elevationGain");
    this.elevationGainLabel = document.getElementById("elevationGainLabel");
    this.inputDistance = document.getElementById("distance");
    this.form = document.getElementById("form");
    this.historique = document.getElementById("historique");

    this.dureeInput = document.getElementById("duree");
    this.cancelBtn = document.getElementById("cancel");
    this.sessions = [];
    this.map;
    this.mapEvent;
    this.mapMarkers = {};
    this._loadMap();
    this._loadLocalStorage();
    this._attachEventHandler();
  }
  _toggleFields() {
    if (this.inputType.value === "run") {
      this.cadenceInput.classList.remove("hidden");
      this.cadenceLabel.classList.remove("hidden");
      this.elevationGainInput.classList.add("hidden");
      this.elevationGainLabel.classList.add("hidden");
    } else if (this.inputType.value === "bike") {
      this.elevationGainInput.classList.remove("hidden");
      this.elevationGainLabel.classList.remove("hidden");
      this.cadenceInput.classList.add("hidden");
      this.cadenceLabel.classList.add("hidden");
    } else {
      this.cadenceInput.classList.add("hidden");
      this.cadenceLabel.classList.add("hidden");
      this.elevationGainInput.classList.add("hidden");
      this.elevationGainLabel.classList.add("hidden");
    }
  }

  _attachEventHandler() {
    this.inputType.addEventListener("change", this._toggleFields.bind(this));
    this.form.addEventListener("submit", this._newSession.bind(this));
    this.cancelBtn.addEventListener('click', () => this._hideForm());
  }


  _newSession(e) {
    if (!this.mapEvent) return;
    e.preventDefault();
    this.type = this.inputType.value;
    this.duree = +this.dureeInput.value;
    this.distance = +this.inputDistance.value;
    this.cadence = +this.cadenceInput.value;
    this.elevationGain = +this.elevationGainInput.value;
    const { lat, lng } = this.mapEvent.latlng;
    if (this.type === 'run') {
      const session = new runSession([lat, lng], this.distance, this.duree, this.cadence);
      this.sessions.push(session);
      this._renderSession(session);

    } else {
      const session = new bikeSession([lat, lng], this.distance, this.duree, this.elevationGain);
      this.sessions.push(session);
      this._renderSession(session);
    }
    this._saveLocalStorage();
    this._hideForm();
  }
  _hideForm() {
    this.form.style.display = 'none';
    this.form.reset();
    this.inputType.value = '';
    this._toggleFields();
  }
  _loadMap() {
    const Url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    this.map = L.map("map").setView([34.020882, -6.84165], 13);
    L.tileLayer(Url, {
      maxZoom: 19,
      attribution: '&copy; CartoDB'
    }).addTo(this.map);
    this.map.on('click', this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.mapEvent = mapE;
    this.form.style.display = 'flex';
    this._toggleFields();
    this.inputDistance.focus();
  }
  _saveLocalStorage() {
    localStorage.setItem('geotrakr_sessions', JSON.stringify(this.sessions));
  }
  _loadLocalStorage() {
    const data = JSON.parse(localStorage.getItem('geotrakr_sessions'));
    if (!data) return;
    this.sessions = data.map(obj => {
      if (obj.type === 'run') {
        const r = new runSession(obj.coords, obj.distance, obj.duree, obj.cadence);
        r.id = obj.id;
        r.date = new Date(obj.date);
        r.pace = obj.pace;
        r.description = obj.description;
        return r;
      } else {
        const b = new bikeSession(obj.coords, obj.distance, obj.duree, obj.elevationGain);
        b.id = obj.id;
        b.date = new Date(obj.date);
        b.speed = obj.speed;
        b.description = obj.description;
        return b;
      }

    })
    this.sessions.forEach(session => this._renderSession(session));
  }
  _renderSession(session) {
    this._renderSessionMarker(session);
    this._renderSessionItem(session);
  }
  _renderSessionMarker(session) {
    const emoji = session.type === 'run' ? '🏃' : '🚴';
    const marker = L.marker(session.coords)
      .addTo(this.map)
      .bindPopup(`${emoji} ${session.description}<br>Dist: ${session.distance} km • Durée: ${session.duree} min `, { autoClose: false });
    this.mapMarkers[session.id] = marker;
  }
  _renderSessionItem(session) {
    const icon = session.type === 'run' ? '🏃‍♀️' : '🚴‍♂️';
    let extraHtml = '';
    if (session.type === 'run') {
      extraHtml = `<small>Cadence: ${session.cadence} rpm • Pace: ${session.pace ? session.pace.toFixed(2) : '-'} min/km</small>`;
    } else {
      extraHtml = `<small>Elevation: ${session.elevationGain} m • Vitesse: ${session.speed ? session.speed.toFixed(1) : '-'} km/h</small>`;

    }
    const html = `
          <li class="activity clickable" data-id="${session.id}"> 
            <div class="left">
              <div class="badge">${icon}</div>
              <div class="meta">
                <div>${session.description}</div>
                ${extraHtml}
              </div>
            </div>
            <div style="font-size:.8rem;color:var(--muted)">${new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </li>
        `;
    this.historique.insertAdjacentHTML('afterbegin', html);
  }
}
const app = new ActivityManager();
window.app = app;