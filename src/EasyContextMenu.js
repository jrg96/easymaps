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
 
 function EasyContextMenu(config){
    this.className = ((config.className != null) ? config.className : 'visibility: hidden; background: #ffffff; border: 1px solid #8888FF; z-index: 10; position: relative; width: 100px; height: 100px; padding: 5px;');
    this.innerHTML = ((config.innerHTML != null) ? config.innerHTML : '');
    this.map = config.map;
    this.menuDiv;
    this.setMap(this.map);
}

EasyContextMenu.prototype = new google.maps.OverlayView();
EasyContextMenu.prototype.draw = function(){};
EasyContextMenu.prototype.onAdd = function(){
    var parent = this;
    this.menuDiv = document.createElement('div');
    this.menuDiv.setAttribute('style', this.className);
    this.menuDiv.innerHTML = this.innerHTML;
    this.getPanes().floatPane.appendChild(this.menuDiv);
    
    google.maps.event.addListener(this.map, 'click', function(mouseEvent){
        parent.hide();
    });
};

EasyContextMenu.prototype.onRemove = function(){
    this.menuDiv.parentNode.removeChild(this.menuDiv);
};

EasyContextMenu.prototype.show = function(coord){
    var proj = this.getProjection();
    var mouseCoords = proj.fromLatLngToDivPixel(coord);
    var left = Math.floor(mouseCoords.x);
    var top = Math.floor(mouseCoords.y);
    this.menuDiv.style.display = 'block';
    this.menuDiv.style.left = left + 'px';
    this.menuDiv.style.top = top + 'px';
    this.menuDiv.style.visibility = 'visible';
};

EasyContextMenu.prototype.hide = function(){
    this.menuDiv.style.visibility = 'hidden';
};

EasyContextMenu.prototype.setClass = function(className){
    this.className = className;
};

EasyContextMenu.prototype.setHTML = function(innerHTML){
    this.innerHTML = innerHTML;
};

EasyContextMenu.prototype.getClass = function(className){
    return this.className;
};

EasyContextMenu.prototype.getHTML = function(innerHTML){
    return this.innerHTML;
};