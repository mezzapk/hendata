//import geojson from '/data/py.geojson';
var mapa = new L.map('map',{
    center: [-24,-57],
    zoom:6
});

var layerOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png');
var layerRelieve = new L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg');

var mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];
var logoContainer = document.getElementById("logoContainer");

mapControlsContainer.appendChild(logoContainer);

// var logo = L.control({position: 'topleft'});
// logo.onAdd = function(map){
//     var div = L.DomUtil.create('div', 'myclass');
//     div.innerHTML= "<img src='img/hendata.png'/>";
//     return div;
// }
// logo.addTo(mapa);


var dptos = L.geoJSON(dptos,{
    style: function(feature){
        return {
            weight: 1.3,
            color: '#000',
            //opacity: .75,
            fillColor: '#00000000',
            fillOpacity: 1.5
        };
    },
    onEachFeature:  function(feature,layer){
        layer.on('mouseover',function(){
            layer.setStyle({fillOpacity: 0.3})
        }),
        layer.on('mouseout',function(){
            layer.setStyle({fillOpacity: 0.3})
        })
    }
});

var dist = L.geoJSON(distritos,{
    style: function(feature){
        return {
            weight: 1.0,
            color: '#FFA500',
            opacity: 1.5,
            fillColor: '#00000000',
            //fillOpacity: 0.75
        }
    },
    onEachFeature:  function(feature,layer){
        layer.on('mouseover',function(){
            layer.setStyle({fillColor: '#FFA500',fillOpacity: 0.3})
        }),
        layer.on('mouseout',function(){
            layer.setStyle({color: '#FFA500',fillOpacity: 0})
        }),
        layer.on('click', function(){
            //mapa.zoomIn();
            //var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
            //mapa.setView(latlng,zoom);
            mapa.setZoom(14);
        }),
        popupOptions = {maxWidth: 200};
        //layer.bindPopup("Distritos: "+feature.properties.nom_dist,popupOptions);
        //layer.zoom;
    }
});

var bahia = L.geoJSON(bahia_negra,{
    style: function(feature){
        return {
            weight: 0.5,
            color: 'blue',
            opacity: 1.5,
            //fillColor: '#00000000',
        }
    },
    onEachFeature:  function(feature,layer){
        layer.on('mouseover',function(){
            layer.setStyle({fillColor: 'red'})
        }),
        layer.on('mouseout',function(){
            layer.setStyle({fillColor: 'blue',opacity: 1.5})
        }),
        layer.on('click', function(){
            //mapa.zoomIn();
            //var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
            //mapa.setView(latlng,zoom);
            mapa.setZoom(14);
        }),
        popupOptions = {maxWidth: 200};
        layer.bindPopup("<strong>Codigo: </strong>" + feature.properties.Codigo+"<br/>"+
                        "<strong>Nombre: </strong>" + feature.properties.Nombre+"<br/>"+
                        "<strong>Cabezas: </strong>"+ feature.properties.Cabezas);
        //layer.zoom;
    }
});

//bahia.addTo(mapa);
layerOSM.addTo(mapa);
//dist.addTo(mapa);


var capasBase = {
    "Relieve": layerRelieve,
    "OSM": layerOSM,
    
};

var overlayMaps={
    "Departamentos": dptos,
    "Distritos": dist,
    "Bahia Negra": bahia,
    //"Parcelario": parce,
};



//mapa.removeLayer();

var selectorCapas = new L.control.layers(capasBase,overlayMaps);
selectorCapas.addTo(mapa);



var controlSearch = new L.Control.Search({
    //position:'topright',		
    layer: L.layerGroup([bahia]),
    //initial: false,
    propertyName: 'Codigo',
    //propertyName: 'Nombre',
    marker: false,
    moveToLocation: function(latlng,title,mapa){
        var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
        mapa.setView(latlng,zoom);
    },
    //collapsed: false,
});

controlSearch.on('search:locationfound',function(e) {
    e.layer.setStyle({fillColor:'red',color:'blue'});//0f0
    if(e.layer._popup)
        e.layer.openPopup();
        //layer.bindPopup("Codigo: "+feature.properties.Codigo,popupOptions),
}).on('search:collapsed',function(e){
    dist.eachLayer(function(layer){
        dist.resetStyle(layer);
    });
});

mapa.addControl(controlSearch);

//parce.bringToFront();