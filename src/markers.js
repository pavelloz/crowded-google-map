import MarkerClusterer from 'node-js-marker-clusterer';

import Marker from './marker';

class Markers {
  constructor(opts) {
    if (!opts || !opts.markersData || !opts.map) {
      throw new Error('CrowdedGoogleMap :: Some required options are missing');
      return;
    }

    this.get(opts)
      .then(this.parse)
      .then(this.create)
      .then(this.cluster);
  }

  get(opts) {
    const isPromise = typeof opts.markersData === 'object' && typeof opts.markersData.then === 'function';
    let options;

    if (isPromise) {
      return opts.markersData.then(markers => {
        return (options = Object.assign({}, opts, {
          markersData: markers
        }));
      });
    }

    return opts;
  }

  parse(opts) {
    return Object.assign({}, opts, {
      markersData: opts.markersData.map(opts.parseMarkerData)
    });
  }

  create(opts) {
    const oms = Marker.createSpiderify(opts);
    return Object.assign({}, opts, {
      markersData: opts.markersData.reduce((prev, marker) => {
        if (!Marker.valid(marker)) {
          return false;
        }

        const googleMarker = Marker.create(marker);
        const infoWindow = Marker.infoWindow(opts.infoWindowConfig(marker));

        Marker.attachEventHandler(googleMarker, infoWindow, opts.map);
        Marker.initializeSpiderify(oms, googleMarker);

        return [...prev, googleMarker];
      }, [])
    });
  }

  cluster({ map, markersData, clustererConfig }) {
    return new MarkerClusterer(map, markersData, clustererConfig);
  }
}

export default Markers;
