/* @license
 *
 * Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyContextMenu(config) {
    this.className = config.className != null ? config.className : "visibility: hidden; background: #ffffff; border: 1px solid #8888FF; z-index: 10; position: relative; width: 100px; height: 100px; padding: 5px;";
    this.innerHTML = config.innerHTML != null ? config.innerHTML : "";
    this.map = config.map;
    this.menuDiv;
    this.setMap(this.map);
}

EasyContextMenu.prototype = new google.maps.OverlayView();

EasyContextMenu.prototype.draw = function() {};

EasyContextMenu.prototype.onAdd = function() {
    var parent = this;
    this.menuDiv = document.createElement("div");
    this.menuDiv.setAttribute("style", this.className);
    this.menuDiv.innerHTML = this.innerHTML;
    this.getPanes().floatPane.appendChild(this.menuDiv);
    google.maps.event.addListener(this.map, "click", function(mouseEvent) {
        parent.hide();
    });
};

EasyContextMenu.prototype.onRemove = function() {
    this.menuDiv.parentNode.removeChild(this.menuDiv);
};

EasyContextMenu.prototype.show = function(coord) {
    var proj = this.getProjection();
    var mouseCoords = proj.fromLatLngToDivPixel(coord);
    var left = Math.floor(mouseCoords.x);
    var top = Math.floor(mouseCoords.y);
    this.menuDiv.style.display = "block";
    this.menuDiv.style.left = left + "px";
    this.menuDiv.style.top = top + "px";
    this.menuDiv.style.visibility = "visible";
};

EasyContextMenu.prototype.hide = function() {
    this.menuDiv.style.visibility = "hidden";
};

EasyContextMenu.prototype.setClass = function(className) {
    this.className = className;
};

EasyContextMenu.prototype.setHTML = function(innerHTML) {
    this.innerHTML = innerHTML;
};

EasyContextMenu.prototype.getClass = function(className) {
    return this.className;
};

EasyContextMenu.prototype.getHTML = function(innerHTML) {
    return this.innerHTML;
};

/* @license * * Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com> * * This program is free software: you can redistribute it and/or modify * it under the terms of the GNU General Public License as published by * the Free Software Foundation, either version 3 of the License, or * (at your option) any later version. * * This program is distributed in the hope that it will be useful, * but WITHOUT ANY WARRANTY; without even the implied warranty of * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the * GNU General Public License for more details. * * You should have received a copy of the GNU General Public License * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyGeoCoder(config) {
    this.map = config.map;
    this.geocoder = config.geocoder;
}

EasyGeoCoder.prototype = {
    constructor: EasyGeoCoder,
    reverseGeoCode: function(lat_lng, call) {
        var point = new google.maps.LatLng(lat_lng[0], lat_lng[1]);
        var callback = call;
        var parent = this;
        this.geocoder.geocode({
            latLng: point
        }, function(results, status) {
            var wrapped_data = parent.makeGeoCoderData(results);
            callback(wrapped_data);
        });
    },
    makeGeoCoderData: function(raw) {
        var data = new EasyGeoCoderData(raw);
        return data;
    }
};

/* @license * * Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com> * * This program is free software: you can redistribute it and/or modify * it under the terms of the GNU General Public License as published by * the Free Software Foundation, either version 3 of the License, or * (at your option) any later version. * * This program is distributed in the hope that it will be useful, * but WITHOUT ANY WARRANTY; without even the implied warranty of * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the * GNU General Public License for more details. * * You should have received a copy of the GNU General Public License * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyGeoCoderData(raw) {
    this.raw_data = raw;
}

EasyGeoCoderData.prototype = {
    constructor: EasyGeoCoderData,
    getCountry: function() {
        var country = this._parseAddressComp("country", true);
        return country;
    },
    getCity: function() {
        var city = this._parseAddressComp("locality", true);
        return city;
    },
    _parseAddressComp: function(name, lng) {
        var data = null;
        for (var i = 0; i < this.raw_data[0].address_components.length; i++) {
            if (this.raw_data[0].address_components[i].types[0] == name) {
                if (lng) {
                    data = this.raw_data[0].address_components[i].long_name;
                } else {
                    data = this.raw_data[0].address_components[i].short_name;
                }
                break;
            }
        }
        return data;
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyGeoJSON(config) {
    this.map = config.map;
    this.featureArr;
}

EasyGeoJSON.prototype = {
    constructor: EasyGeoJSON,
    loadGeoJSON: function(url) {
        this.map.data.loadGeoJson(url);
    },
    addGeoJSON: function(data) {
        this.featureArr = this.map.data.addGeoJson(data);
    },
    changeStyleByProperty: function(property, value, style) {
        var matches = this.searchMatchFeatures(property, value);
        for (var i = 0; i < matches.length; i++) {
            this.map.data.overrideStyle(matches[i], style);
        }
    },
    searchMatchFeatures: function(property, value) {
        var matches = [];
        for (var i = 0; i < this.featureArr.length; i++) {
            var feature = this.featureArr[i];
            if (feature.getProperty(property) == value) {
                matches.push(feature);
            }
        }
        return matches;
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyLine(config, map) {
    this.strokeColor = config.stroke;
    this.strokeOpacity = config.opacity;
    this.strokeWeight = config.weight;
    this.map = map.map_obj;
    this.route = new google.maps.MVCArray();
    this.polyline = new google.maps.Polyline({
        path: this.route,
        strokeColor: this.strokeColor,
        strokeWeight: this.strokeWeight,
        strokeOpacity: this.strokeOpacity
    });
    this.setMap(this.map);
}

EasyLine.prototype = {
    constructor: EasyLine,
    setMap: function(map) {
        this.map = map;
        this.polyline.setMap(this.map);
    },
    addPoint: function(latitude, longitude) {
        this.route.push(new google.maps.LatLng(latitude, longitude));
    },
    show: function() {
        this.visibility(true);
    },
    hide: function() {
        this.visibility(false);
    },
    visibility: function(bool) {
        this.polyline.setVisible(bool);
    },
    remove: function() {
        this.setMap(null);
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyLineProperties(config) {
    this.strokeColor = config.stroke != null ? config.stroke : "#FF0000";
    this.strokeOpacity = config.opacity != null ? config.opacity : 1;
    this.strokeWeight = config.weight != null ? config.weight : 5;
}

EasyLineProperties.prototype = {
    constructor: EasyLineProperties,
    setDefaultStroke: function(stroke) {
        this.strokeColor = stroke;
    },
    getDefaultStroke: function() {
        return this.strokeColor;
    },
    setDefaultOpacity: function(opacity) {
        this.strokeOpacity = opacity;
    },
    getDefaultOpacity: function() {
        return this.strokeOpacity;
    },
    setDefaultWeight: function(weight) {
        this.strokeWeight = weight;
    },
    getDefaultWeight: function() {
        return this.strokeWeight;
    },
    makeConfig: function() {
        return {
            stroke: this.strokeColor,
            opacity: this.strokeOpacity,
            weight: this.strokeWeight
        };
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyMap(config) {
    this.map_el = document.getElementById(config.container);
    this.map_obj = null;
    this.info_window_system = config.infoWindowSystem != null ? config.infoWindowSystem : EasyMap.InfoWindowSystem.ONE_WINDOW;
    this.map_markers = [];
    this.master_markers = [];
    this.map_lines = [];
    this.map_shapes = [];
    this.marker_res = {};
    this.synced_maps = [];
    this.cluster_by_marker = config.clusterMarkers != null ? config.clusterMarkers : false;
    this.logo_div;
    this.logo_img;
    this.coordinates_div = document.createElement("div");
    this.coordinates_div.setAttribute("style", "width: 200px; height: 20px; background-color: #FFFFFF; border-style: solid; border-width: 1px; padding: 2px 5px;");
    this.coordinates_div.innerHTML = "Lat/Lng: 0.00 / 0.00";
    this.coordinates_shown = false;
    this.default_line_props = new EasyLineProperties({});
    this.current_maptypeid = config.mapTypeId != null ? config.mapTypeId : google.maps.MapTypeId.ROADMAP;
    this.infoWindow = null;
    this.marker_callback = null;
    this.map_options = {
        center: new google.maps.LatLng(config.latitude, config.longitude),
        zoom: config.zoom != null ? config.zoom : 15,
        mapTypeId: this.current_maptypeid
    };
    this.map_obj = new google.maps.Map(this.map_el, this.map_options);
    this.map_clusterer = null;
    if (typeof MarkerClusterer == "function") {
        this.map_clusterer = new MarkerClusterer(this.map_obj);
    }
    this.map_style_manager = new EasyMapStyleManager({
        map: this.map_obj
    });
    this.map_ext_src = new EasyExternalResource({
        map: this.map_obj
    });
    this.map_geojson = new EasyGeoJSON({
        map: this.map_obj
    });
    this.map_context = new EasyContextMenu({
        map: this.map_obj
    });
    this.map_geocoder = new EasyGeoCoder({
        map: this.map_obj,
        geocoder: new google.maps.Geocoder()
    });
    this.allowed_map_bounds;
    this.max_zoom_level;
    this.min_zoom_level;
    this._attachMapEvents();
    this.initInfoWindowSystem();
    this.dragend_callback;
}

EasyMap.prototype = {
    constructor: EasyMap,
    initInfoWindowSystem: function() {
        if (this.info_window_system == EasyMap.InfoWindowSystem.ONE_WINDOW) {
            this.infoWindow = new google.maps.InfoWindow({
                content: "placeholder"
            });
        }
    },
    getCenter: function() {
        return this.map_obj.getCenter();
    },
    setCenter: function(lat, lng) {
        this.map_obj.setCenter(new google.maps.LatLng(lat, lng));
    },
    getZoom: function() {
        return this.map_obj.getZoom();
    },
    setZoom: function(zoom) {
        this.map_obj.setZoom(zoom);
    },
    getBounds: function() {
        return this.map_obj.getBounds();
    },
    changeToRoadmap: function() {
        this.map_obj.setMapTypeId(google.maps.MapTypeId.google.maps.MapTypeId.ROADMAP);
        this.current_maptypeid = google.maps.MapTypeId.google.maps.MapTypeId.ROADMAP;
    },
    changeToSatellite: function() {
        this.map_obj.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        this.current_maptypeid = google.maps.MapTypeId.SATELLITE;
    },
    addMarker: function(config) {
        var parent = this;
        var marker = new EasyMarker(config, this);
        google.maps.event.addListener(marker.marker, "click", function() {
            parent.marker_callback(marker);
        });
        marker.setMetadata(config.metadata);
        var infoWindow = this.infoWindow;
        if (this.info_window_system == EasyMap.InfoWindowSystem.MULTIPLE_WINDOW) {
            infoWindow = new google.maps.InfoWindow({
                content: "placeholder"
            });
        }
        marker.setInfoWindow(infoWindow);
        if (this.cluster_by_marker) {
            var clustered = false;
            for (var i = 0; i < this.master_markers.length; i++) {
                if (this.master_markers[i].contains(marker)) {
                    this.master_markers[i].addChildMarker(marker);
                    clustered = true;
                    break;
                }
            }
            if (!clustered) {
                var k = 1e-4;
                var sw = new google.maps.LatLng(marker.latitude - k, marker.longitude - k);
                var ne = new google.maps.LatLng(marker.latitude + k, marker.longitude + k);
                var bounds = new google.maps.LatLngBounds(sw, ne);
                var matches = [];
                for (var i = 0; i < this.map_markers.length; i++) {
                    if (bounds.contains(this.map_markers[i].marker.getPosition())) {
                        matches.push(this.map_markers[i]);
                    }
                }
                if (matches.length > 0) {
                    var master_marker = new EasyMarkerCluster({
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }, this);
                    master_marker.addChildMarker(marker);
                    for (var i = 0; i < matches.length; i++) {
                        master_marker.addChildMarker(matches[i]);
                        var i = this.map_markers.indexOf(matches[i]);
                        this.map_markers.splice(i, 1);
                    }
                } else {
                    this.map_markers.push(marker);
                }
            }
        } else {
            this.map_markers.push(marker);
        }
        return marker;
    },
    clearAllMarkers: function() {
        for (var i = 0; i < this.map_markers.length; i++) {
            this.map_markers[i].destroy();
        }
        this.map_markers = [];
    },
    addMarkerRes: function(key, value) {
        this.marker_res[key] = value;
    },
    setMarkerRes: function(dictionary) {
        this.marker_res = dictionary;
    },
    setMarkersCallbackFunc: function(func) {
        this.marker_callback = func;
    },
    getMarkersCallbackFunc: function() {
        return this.marker_callback;
    },
    cluster: function() {
        var markers = [];
        for (var i = 0; i < this.map_markers.length; i++) {
            markers.push(this.map_markers[i].marker);
        }
        this.map_clusterer.addMarkers(markers);
    },
    decluster: function() {
        var markers = this.map_clusterer.getMarkers();
        this.map_clusterer.clearMarkers();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(this.map_obj);
        }
    },
    newLine: function() {
        this.map_lines.push(new EasyLine(this.default_line_props.makeConfig(), this));
    },
    getCurrentLine: function() {
        return this.map_lines[this.map_lines.length - 1];
    },
    newPolygon: function(pts) {
        this.map_shapes.push(new EasyShape({
            points: pts
        }, this));
    },
    getStyleManager: function() {
        return this.map_style_manager;
    },
    getExtResourceManager: function() {
        return this.map_ext_src;
    },
    loadGeoJSON: function(url, callback) {
        var parent = this;
        $.getJSON(url, function(data) {
            parent.map_geojson.addGeoJSON(data);
            callback();
        });
    },
    addSyncMap: function(map) {
        this.synced_maps.push(map);
    },
    removeSyncMap: function(map) {
        var index = this.synced_maps.indexOf(map);
        if (index != -1) {
            this.synced_maps.splice(index, 1);
        }
    },
    setBounds: function(config) {
        if (!config.enable) {
            this.allowed_map_bounds = null;
            this.max_zoom_level = 20;
        } else {
            this.max_zoom_level = config.maxZoom != null ? config.maxZoom : 20;
            this.min_zoom_level = config.minZoom != null ? config.minZoom : 0;
            if (config.bounds != null) {
                this.allowed_map_bounds = new google.maps.LatLngBounds(new google.maps.LatLng(config.bounds[0][0], config.bounds[0][1]), new google.maps.LatLng(config.bounds[1][0], config.bounds[1][1]));
            }
        }
    },
    setLogo: function(path) {
        this.removeLogo();
        this.logo_div = document.createElement("div");
        this.logo_img = document.createElement("img");
        this.logo_img.src = path;
        this.logo_img.id = "CompanyLogo";
        this.logo_div.appendChild(this.logo_img);
        this.map_obj.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(this.logo_div);
    },
    removeLogo: function() {
        if (this.logo_div != null) {
            this.map_obj.controls[google.maps.ControlPosition.LEFT_BOTTOM].pop();
        }
    },
    showCoordinates: function() {
        if (!this.coordinates_shown) {
            this.coordinates_shown = true;
            this.map_obj.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.coordinates_div);
        }
    },
    hideCoordinates: function() {
        if (this.coordinates_shown) {
            this.coordinates_shown = false;
            this.map_obj.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop();
        }
    },
    setOnUserPosition: function(z, call) {
        var parent = this;
        var zoom = z != null ? z : 15;
        var callback = call;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var devCenter = new google.maps.LatLng(lat, lng);
                parent.map_obj.setCenter(devCenter);
                parent.map_obj.setZoom(zoom);
                if (callback != null) {
                    callback(devCenter);
                }
            });
        }
    },
    reverseGeoCode: function(lat_lng, call) {
        this.map_geocoder.reverseGeoCode(lat_lng, call);
    },
    onDragEnd: function(callback) {
        this.dragend_callback = callback;
    },
    _attachMapEvents: function() {
        var parent = this;
        google.maps.event.addListener(this.map_obj, "drag", function() {
            parent._mapDrag();
        });
        google.maps.event.addListener(this.map_obj, "zoom_changed", function() {
            parent._mapZoom();
        });
        google.maps.event.addListener(this.map_obj, "click", function(e) {});
        google.maps.event.addListener(this.map_obj, "rightclick", function(e) {
            parent._mapRightClick(e);
        });
        google.maps.event.addListener(this.map_obj, "mousemove", function(e) {
            parent._mapMouseMove(e);
        });
        google.maps.event.addListener(this.map_obj, "dragend", function(e) {
            parent._mapDragEnd(e);
        });
    },
    _mapDragEnd: function(e) {
        if (this.dragend_callback != null) {
            this.dragend_callback(e);
        }
    },
    _mapRightClick: function(e) {
        if (this.map_context.getClass() != null && this.map_context.getHTML() != null) {
            this.map_context.show(e.latLng);
        }
    },
    _mapDrag: function() {
        this._checkBounds();
        for (var i = 0; i < this.synced_maps.length; i++) {
            this.synced_maps[i].setCenter(this.map_obj.getCenter());
        }
    },
    _mapZoom: function() {
        this._checkBounds();
        for (var i = 0; i < this.synced_maps.length; i++) {
            this.synced_maps[i].setZoom(this.map_obj.getZoom());
        }
    },
    _mapMouseMove: function(e) {
        if (this.coordinates_shown) {
            var coordinateText = "Lat/Lng: " + e.latLng.lat().toFixed(6) + " / " + e.latLng.lng().toFixed(6);
            this.coordinates_div.innerHTML = coordinateText;
        }
        for (var i = 0; i < this.synced_maps.length; i++) {
            this.synced_maps[i]._mapMouseMove(e);
        }
    },
    _checkBounds: function() {
        if (this.map_obj.getZoom() > this.max_zoom_level) {
            this.map_obj.setZoom(this.max_zoom_level);
        } else if (this.map_obj.getZoom() < this.min_zoom_level) {
            this.map_obj.setZoom(this.min_zoom_level);
        }
        if (this.allowed_map_bounds != null) {
            if (!this.allowed_map_bounds.contains(this.map_obj.getCenter())) {
                var C = this.map_obj.getCenter();
                var X = C.lng();
                var Y = C.lat();
                var AmaxX = this.allowed_map_bounds.getNorthEast().lng();
                var AmaxY = this.allowed_map_bounds.getNorthEast().lat();
                var AminX = this.allowed_map_bounds.getSouthWest().lng();
                var AminY = this.allowed_map_bounds.getSouthWest().lat();
                if (X < AminX) {
                    X = AminX;
                }
                if (X > AmaxX) {
                    X = AmaxX;
                }
                if (Y < AminY) {
                    Y = AminY;
                }
                if (Y > AmaxY) {
                    Y = AmaxY;
                }
                this.map_obj.setCenter(new google.maps.LatLng(Y, X));
            }
        }
    }
};

EasyMap.InfoWindowSystem = {
    NONE_WINDOW: 0,
    ONE_WINDOW: 1,
    MULTIPLE_WINDOW: 2
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyExternalResource(config) {
    this.resources = {};
    this.map = config.map;
}

EasyExternalResource.prototype = {
    constructor: EasyExternalResource,
    addSource: function(config) {
        this.resources[config.name] = new google.maps.KmlLayer(config.url);
    },
    setSource: function(name) {
        var KML = this.resources[name];
        KML.setMap(this.map);
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyMapStyleManager(config) {
    this.styledMaps = {};
    this.map = config.map;
}

EasyMapStyleManager.prototype = {
    constructor: EasyMapStyleManager,
    addStyleMap: function(config) {
        var styledMap = new google.maps.StyledMapType(config.style);
        this.styledMaps[config.name] = styledMap;
        this.updateMapTypeIds();
    },
    addImageMap: function(config) {
        var tile = null;
        if (config.tileSize != null) {
            tile = new google.maps.Size(config.tileSize[0], config.tileSize[1]);
        } else {
            tile = new google.maps.Size(256, 256);
        }
        var imgMap = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                return config.callback(coord, zoom);
            },
            tileSize: tile,
            name: config.title != null ? config.title : "",
            maxZoom: config.maxZoom != null ? config.maxZoom : 18,
            opacity: config.opacity != null ? config.opacity : 1
        });
        this.styledMaps[config.name] = imgMap;
        this.updateMapTypeIds();
    },
    updateMapTypeIds: function() {
        var arrMapTypeIds = this.makeMapTypeIds();
        this.map.setOptions({
            mapTypeControlOptions: {
                mapTypeIds: arrMapTypeIds
            }
        });
        for (var i = 1; i < arrMapTypeIds.length; i++) {
            var key = arrMapTypeIds[i];
            var value = this.styledMaps[key];
            this.map.mapTypes.set(key, value);
        }
    },
    makeMapTypeIds: function() {
        var array = [];
        array.push(this.map.current_maptypeid);
        for (var key in this.styledMaps) {
            if (this.styledMaps.hasOwnProperty(key)) {
                array.push(key);
            }
        }
        return array;
    },
    setOverlay: function(i, name) {
        this.map.overlayMapTypes.insertAt(i, this.styledMaps[name]);
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyMarker(config, map) {
    this.latitude = config.latitude;
    this.longitude = config.longitude;
    this.real_latitude = config.latitude;
    this.real_longitude = config.longitude;
    this.title = config.title != null ? config.title : "";
    this.map = map.map_obj;
    this.icon = config.icon != null ? map.marker_res[config.icon] : "";
    this.marker = null;
    this.metadata = null;
    this.content = null;
    this.infoWindow = null;
    this.initMarker();
}

EasyMarker.prototype = {
    constructor: EasyMarker,
    initMarker: function() {
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.latitude, this.longitude),
            map: this.map,
            title: this.title,
            icon: this.icon
        });
    },
    setMetadata: function(metadata) {
        this.metadata = metadata;
    },
    getMetadata: function() {
        return this.metadata;
    },
    setInfoContent: function(content) {
        this.content = content;
    },
    getInfoContent: function() {
        return this.content;
    },
    setInfoWindow: function(window) {
        this.infoWindow = window;
    },
    showInfoWindow: function(value) {
        if (value != null) {
            this.content = value;
        }
        this.infoWindow.setContent(this.getInfoContent());
        this.infoWindow.open(this.map, this.marker);
    },
    latLng: function() {
        var json = {
            lat: this.real_latitude,
            lng: this.real_longitude
        };
    },
    updateChildPos: function() {
        this.marker.setPosition(new google.maps.LatLng(this.latitude, this.longitude));
    },
    show: function() {
        this.marker.setMap(this.map);
    },
    hide: function() {
        this.marker.setMap(null);
    },
    destroy: function() {
        this.hide();
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyMarkerCluster(config, map) {
    this.latitude = config.latitude;
    this.longitude = config.longitude;
    this.easy_markers = [];
    this.easy_lines = [];
    this.map = map;
    this.icon = config.icon != null ? map.marker_res[config.icon] : "";
    this.initMarker();
    this.bounds = {
        lat: 1e-4,
        lng: 1e-4
    };
    this.k = 1e-4;
    this.markers_hide = true;
    var sw = new google.maps.LatLng(this.latitude - this.k, this.longitude - this.k);
    var ne = new google.maps.LatLng(this.latitude + this.k, this.longitude + this.k);
    this.bounds = new google.maps.LatLngBounds(sw, ne);
}

EasyMarkerCluster.prototype = {
    constructor: EasyMarkerCluster,
    initMarker: function() {
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.latitude, this.longitude),
            map: this.map.map_obj,
            icon: this.icon
        });
        var parent = this;
        google.maps.event.addListener(this.marker, "click", function() {
            if (parent.markers_hide) {
                parent.showLines();
                parent.showMarkers();
            } else {
                parent.hideLines();
                parent.hideMarkers();
            }
            parent.markers_hide = !parent.markers_hide;
        });
        this.map.master_markers.push(this);
    },
    addChildMarker: function(marker) {
        this.easy_markers.push(marker);
        this.removeLines();
        var degrees = 360 / this.easy_markers.length;
        var current_degrees = degrees;
        for (var i = 0; i < this.easy_markers.length; i++) {
            var rads = current_degrees * (Math.PI / 180);
            var y = .004 * Math.sin(rads);
            var x = .004 * Math.cos(rads);
            this.easy_markers[i].latitude = this.latitude + y;
            this.easy_markers[i].longitude = this.longitude + x;
            this.easy_markers[i].updateChildPos();
            this.easy_markers[i].hide();
            var line = new EasyLine({
                stroke: "#000000",
                opacity: 1,
                weight: 2
            }, this.map);
            line.addPoint(this.latitude, this.longitude);
            line.addPoint(this.latitude + y, this.longitude + x);
            this.easy_lines.push(line);
            line.hide();
            current_degrees += degrees;
        }
    },
    showLines: function() {
        for (var i = 0; i < this.easy_lines.length; i++) {
            this.easy_lines[i].show();
        }
    },
    removeLines: function() {
        for (var i = 0; i < this.easy_lines.length; i++) {
            this.easy_lines[i].remove();
        }
        this.easy_lines = [];
    },
    hideLines: function() {
        for (var i = 0; i < this.easy_lines.length; i++) {
            this.easy_lines[i].hide();
        }
    },
    contains: function(marker) {
        if (this.bounds.contains(marker.marker.getPosition())) {
            return true;
        }
        return false;
    },
    showMarkers: function() {
        for (var i = 0; i < this.easy_markers.length; i++) {
            this.easy_markers[i].show();
        }
    },
    hideMarkers: function() {
        for (var i = 0; i < this.easy_markers.length; i++) {
            this.easy_markers[i].hide();
        }
    },
    hide: function() {
        this.marker.setMap(null);
    },
    destroy: function() {
        this.hide();
    }
};

/* @license
 *
 * Copyright (c) 2014 Jorge Alberto G�mez L�pez <gomezlopez.jorge96@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.*/
function EasyShape(config, map) {
    this.map = map.map_obj;
    this.points = config.points;
    this.polygon = new google.maps.Polygon({
        paths: this.points
    });
    this.setMap(this.map);
}

EasyShape.prototype = {
    constructor: EasyShape,
    setMap: function(map) {
        this.map = map;
        this.polygon.setMap(this.map);
    }
};