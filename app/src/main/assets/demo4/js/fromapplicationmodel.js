// implementation of AR-Experience (aka "World")
console.log('start');
var World = {
	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	/*
		Have a look at the native code to get a better understanding of how data can be injected to JavaScript.
		Besides loading data from assets it is also possible to load data from a database, or to create it in native code. Use the platform common way to create JSON Objects of your data and use native 'architectView.callJavaScript()' to pass them to the ARchitect World's JavaScript.
		'World.loadPoisFromJsonData' is called directly in native code to pass over the poiData JSON, which then creates the AR experience.
	*/
	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

		// empty list of visible markers
		World.markerList = [];
		console.log(typeof poiData);
		console.log('inside1'+poiData);
		console.log('inside2'+poiData[0].Latitude);
		console.log('inside3'+poiData[5].Latitude);
		console.log('inside4'+poiData.length);
		// start loading marker assets
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
		var singlePoi ;
		if(currentPlaceNr%2==0)
		{
			 singlePoi = {

				"id":currentPlaceNr+1, //poiData[currentPlaceNr].id,

				"latitude": parseFloat(poiData[currentPlaceNr].Latitude),
				"longitude":parseFloat(poiData[currentPlaceNr].Longitude),
				"altitude": 0, //parseFloat(poiData[currentPlaceNr].altitude),
				"title": "val"+currentPlaceNr,//poiData[currentPlaceNr].name,
				"description":"this is"+currentPlaceNr// poiData[currentPlaceNr].description
			};
		}
		else
		{
		singlePoi = {

        				"id":currentPlaceNr+1, //poiData[currentPlaceNr].id,

        				"latitude": parseFloat(poiData[currentPlaceNr].Latitude),
        				"longitude":parseFloat(poiData[currentPlaceNr].Longitude),
        				"altitude": 0, //parseFloat(poiData[currentPlaceNr].altitude),
        				"title": "val"+currentPlaceNr,//poiData[currentPlaceNr].name,
        				"description":"this is"+currentPlaceNr// poiData[currentPlaceNr].description
        			};
		}
console.log(currentPlaceNr);
			World.markerList.push(new Marker(singlePoi));
		}

		World.updateStatusMessage(currentPlaceNr + ' places loaded');
	},

	// updates status message shown in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {
		/* 
			No action required in JS, in this sample places are injected via native code. 
			Although it is recommended to inject any geo-content >after< first location update was fired.
		*/
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {

		// deselect previous marker
		if (World.currentMarker) {
			if (World.currentMarker.poiData.id == marker.poiData.id) {
				return;
			}
			World.currentMarker.setDeselected(World.currentMarker);
		}

		// highlight current one
		marker.setSelected(marker);
		World.currentMarker = marker;
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	}

};
console.log('end');
/* forward locationChanges to custom function */
AR.context.onLocationChanged = World.locationChanged;

/* forward clicks in empty area to World */
AR.context.onScreenClick = World.onScreenClick;