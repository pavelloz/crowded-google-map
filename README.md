# Crowded Google Map - because sometimes it gets crowded

Display a lot of POIs on Google Map without sacrificing UX

![Demo](https://cdn.rawgit.com/pavelloz/crowded-google-map/demo/demo.gif)

## Prerequisites

Before initializing the crowded google map, make sure you have loaded Google Maps API.

Read how to do it at https://developers.google.com/maps/documentation/javascript/tutorial

## Basic usage

```js
new CrowdedGoogleMap({
  container: document.querySelector(".google-map"),
  googleMapsConfig: {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 10
  },
  markersData: [
    {
      first_name: "Michael",
      last_name: "Scott",
      position: { lat: 34.210973, lng: -118.436232 }
    },
    {
      first_name: "Kevin",
      last_name: "Malone",
      position: { lat: -25.363, lng: 131.044 }
    }
  ]
});
```

## Advanced Usage

```js
const defaultClusterStyle = {
  textColor: "white",
  textSize: 12,
  height: 50,
  width: 50
};

new CrowdedGoogleMap({
  container: document.querySelector(".google-map"),
  googleMapsConfig: {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 10,
    mapTypeId: "satellite"
  },
  markersData: fetch("/api/getmarkers.json", {
    credentials: "same-origin"
  }).then(res => resolve(res.json())),
  parseMarkerData: marker => {
    return Object.assign({}, marker, {
      name: `${marker.first_name} ${marker.last_name}`,
      href: `http://google.com/?q=${marker.first_name}+${marker.last_name}`,
      icon: {
        url: `http://my.cdn.com/images/gmap/${marker.type}-icon.svg`,
        size: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 24)
      }
    });
  },
  infoWindowConfig: marker => {
    return {
      content: `<a href="${marker.href}">${marker.name}</a>`,
      maxWidth: 640
    };
  },
  clustererConfig: {
    styles: [
      Object.assign({}, defaultClusterStyle, {
        url: `http://my.cdn.com/images/gmap/small.png`
      }),
      Object.assign({}, defaultClusterStyle, {
        url: `http://my.cdn.com/images/gmap/big.png`
      })
    ]
  }
});
```

## Options

### container

Type: DOM Element

Example:

```js
document.querySelector(".google-map");
```

### googleMapsConfig

Type: Object

Example:

```js
{
  zoom: 6,
  center: { lat: -34.397, lng: 150.644 },
  mapTypeId: "satellite"
}
```

Config that will be passed to Google Maps constructor. You can use everything that Google Maps supports (ie. styling).

Read more about google maps api options at https://developers.google.com/maps/documentation/javascript/3.exp/reference

### clustererConfig

Type: Object

Example:

```js
{
  gridSize: 30,
  maxZoom: 12
}
```

Object that will extend/override default clusterer config that can be found in `src/config`.

Read more about supported options at https://www.npmjs.com/package/node-js-marker-clusterer

### spiderifyConfig

Type: Object

Example:

```js
{
  circleFootSeparation: 30,
  nearbyDistance: 60
}
```

Object that will extend/override default spiderify config that can be found in `src/config`.

Read more about supported options at https://www.npmjs.com/package/overlapping-marker-spiderfier

### markersData

Type: `Array` or `Promise` (resolving to an array)

Example:

```js
[
  {
    first_name: "Michael",
    last_name: "Scott",
    position: { lat: 34.210973, lng: -118.436232 }
  },
  {
    first_name: "Kevin",
    last_name: "Malone",
    position: { lat: -25.363, lng: 131.044 }
  }
];
```

```js
fetch("/api/getmarkers.json", {
  credentials: "same-origin"
}).then(res => resolve(res.json()));
```

Collection of objects that will be used on the map. They will be parsed later on if you pass `parseMarkerData`.

### parseMarkerData

Type: `Function`

Example:

```js
const parseMarkerData = marker => {
  return Object.assign({}, marker, {
    // Take whatever has been passed as marker, extend using object passed below
    name: `${marker.first_name} ${marker.last_name}`,
    href: `https://google.com/?q=${marker.first_name}+${marker.last_name}`,
    icon: {
      url: `https://my.cdn.com/images/gmap/${marker.type}-icon.svg`,
      size: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 24)
    }
  });
};
```

Function that will be run on each marker (using `.map`) object before turning it into google map marker. Make sure this function returns proper objects/structure/data to use in later life cycles (ie. creation of google markers, info windows)

### infoWindowConfig

Type: `Function`

Example:

```js
const infoWindowConfig = marker => {
  return {
    content: `<a href="${marker.href}">${marker.name}</a>`,
    maxWidth: 640
  };
};
```

Configuration of infoWindow based on currently created marker. Content key is required by Google.

[Read more about infoWindows](https://developers.google.com/maps/documentation/javascript/infowindows)

## Dependencies

This script includes two depencenies to handle crowded maps:

* [node-js-marker-clusterer](https://www.npmjs.com/package/node-js-marker-clusterer) - Joins markers that are close by to prevent overlapping
* [overlapping-marker-spiderfier](https://www.npmjs.com/package/overlapping-marker-spiderfier) - Allows user to spread pins that are very close together (after zooming in, where clustering is no longer available) see them better

## Performance tips

If your markers are served by the API (which often is the case), start downloading them as soon as possible.
For example, you might want to use XHR to start downloading them in the `<head>`. The benefits depend on weight/speed of loading other blocking assets, so your milage may vary. In my tests I have observed 2-2.5 seconds boost by starting request as a first request on the site.

```js
window.mapMarkers = new Promise(function(resolve) {
  return fetch("/getMarkers.json", { credentials: "same-origin" }).then(
    function(res) {
      return resolve(res.json());
    }
  );
});
```

Having this set up you can pass `window.mapMarkers` as `markersData` to the map constructor - it will initialize as much as possible without the markers, then continue when they arrive.

## Troubleshooting

### My map isn't showing up at all

Remember to provide some kind of css to make sure the map has height. You can even do that inline.

```html
<div data-crowded-google-map="container" style="height: 700px"></div>
```

### My clusters are missing icons

Make sure you pass styles with proper urls to graphic icons. See Advanced Usage example.
