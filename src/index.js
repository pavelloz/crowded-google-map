import assignDeep from 'object-assign-deep';

import GoogleMapsDefaults from './config/google-maps';
import omsDefaults from './config/overlapping-marker-spiderifier';
import MarkerClustererDefaults from './config/marker-clusterer';

import Markers from './Markers';

const DEFAULTS = {
  googleMapsConfig: GoogleMapsDefaults,
  clustererConfig: MarkerClustererDefaults,
  spiderifyConfig: omsDefaults,
  activeInfoWindow: {
    close: () => {}
  },
  markersData: [],
  infoWindowConfig: m => m,
  parseMarkerData: m => m
};

class CrowdedGoogleMap {
  constructor(config) {
    const opts = assignDeep({}, DEFAULTS, config);
    const options = Object.assign({}, opts, {
      map: this.initialize(config.container, opts),
      markersData: config.markersData
    });

    new Markers(options);
  }

  initialize(container, { googleMapsConfig, activeInfoWindow }) {
    return new google.maps.Map(container, {
      center: googleMapsConfig.center,
      zoom: googleMapsConfig.zoom,
      activeInfoWindow: activeInfoWindow
    });
  }
}

export default CrowdedGoogleMap;
