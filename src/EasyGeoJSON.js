/* Copyright (c) 2014 Jorge Alberto Gómez López <gomezlopez.jorge96@gmail.com>
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
 
 function EasyGeoJSON(config){
    this.map = config.map;
    this.featureArr;
 }
 
 EasyGeoJSON.prototype = {
    constructor: EasyGeoJSON,
    loadGeoJSON: function(url){
        this.map.data.loadGeoJson(url);
    },
    addGeoJSON: function(data){
        this.featureArr = this.map.data.addGeoJson(data);
    },
    changeStyleByProperty: function(property, value, style){
        var matches = this.searchMatchFeatures(property, value);
        
        for (var i=0; i<matches.length; i++){
            this.map.data.overrideStyle(matches[i], style);
        }
    },
    searchMatchFeatures: function(property, value){
        var matches = [];
        
        for (var i=0; i<this.featureArr.length; i++){
            var feature = this.featureArr[i];
            
            if (feature.getProperty(property) == value){
                matches.push(feature);
            }
        }
        
        return matches;
    }
 }