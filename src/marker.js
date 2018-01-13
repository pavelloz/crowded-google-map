import OverlappingMarkerSpiderfier from 'overlapping-marker-spiderfier';

const Marker = {
  valid: marker =>
    marker.position && typeof marker.position.lat === 'number' && typeof marker.position.lng === 'number',
  create: marker => new google.maps.Marker(marker),
  infoWindow: opts => new google.maps.InfoWindow(opts),
  createSpiderify: ({ map, spiderifyConfig }) => new OverlappingMarkerSpiderfier(map, spiderifyConfig),
  initializeSpiderify: (oms, googleMarker) => oms.addMarker(googleMarker),
  attachEventHandler: (googleMarker, infoWindow, map) => {
    googleMarker.addListener('click', () => {
      map.activeInfoWindow.close();
      map.activeInfoWindow = infoWindow; // mutating state, kind of bad
      infoWindow.open(map, googleMarker);
    });
  }
};

export default Marker;
