// import axios from "axios";

const formEl = document.querySelector("form")! as HTMLFormElement;
// const addressEl = document.querySelector("#address")! as HTMLInputElement;

declare var ol: any;

const formHandler = (event: Event) => {
  event.preventDefault();
  //   const address = addressEl.value;

  const coordinates = { lat: 40.41, lng: -73.99 }; // Can't fetch coordinates from Google API, use dummy ones

  document.getElementById("map")!.innerHTML = ""; // clear <p> from <div id="map">
  new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
      zoom: 16,
    }),
  });
};

formEl.addEventListener("submit", formHandler);
