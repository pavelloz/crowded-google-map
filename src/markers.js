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
      // .then(this.waitForMap)
      .then(this.create)
      .then(this.cluster);
  }

  get(opts) {
    return opts.markersData.then(markers => {
      return Object.assign({}, opts, {
        markersData: markers
      });
    });
  }

  parse(opts) {
    return Object.assign({}, opts, {
      markersData: opts.markersData.map(opts.parseMarkerData)
    });
  }

  // waitForMap(opts) {
  // const isInitialized = opts => typeof opts.map.getProjection() === 'object';

  // return new Promise(resolve => {
  // const resolveIfReady = () => {
  //   if (isInitialized(opts)) {
  //     resolve(opts);
  //   } else {
  //     requestAnimationFrame(resolveIfReady);
  //   }
  // };

  // requestAnimationFrame(resolveIfReady);
  // });
  // }

  create(opts) {
    const oms = Marker.createSpiderify(opts);

    return Object.assign({}, opts, {
      markersData: opts.markersData.filter(Marker.valid).reduce((prev, marker) => {
        const googleMarker = Marker.create(marker);
        const infoWindowConfig = opts.infoWindowConfig(marker);
        const infoWindow = Marker.infoWindow(infoWindowConfig);

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
