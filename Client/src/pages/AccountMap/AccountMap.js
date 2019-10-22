import React from 'react';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";


let ajax = require('superagent');


const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";




class AccountMap extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            accounts: [],
            currentMarkers: []
        };
	}

    componentWillMount() {
        let fetchAccountsURL = '/fetch/accounts/';
        ajax.get(fetchAccountsURL)
        	.end((error, response) => {
          		if(!error && response) {
                    console.log(JSON.parse(response.text));

                    let accs = JSON.parse(response.text);
                    let markersToAdd = [];
                    accs.map((dat, index) => {
                        console.log(dat.shippinglongitude);
                        markersToAdd.push({
                            name: dat.name,
                            coordinates: [dat.billinglongitude, dat.billinglatitude],
                            markerOffset: -10
                        });
                        return dat;
                    });
                    console.log(markersToAdd);

	              	this.setState({
	                	accounts: accs,
                        currentMarkers: markersToAdd
	            	});
          		} else {
              		console.log(`Error fetching data`, error);
          		}
        	});
  	}

	render() {



		return (
			<div>
				<div class="row">
	                <div class="text-center">
	                    <h1>Account Map</h1>
	                </div>
		    	</div>
                <div class="row">
                    <ComposableMap
                      projection="geoAzimuthalEqualArea"
                      projectionConfig={{
                        rotate: [58.0, 20.0],
                        scale: 400
                      }}
                    >
                        <ZoomableGroup center={[-60, -25]}>
                          <Geographies geography="/static/s-america.json">
                            {({ geographies }) =>
                              geographies
                                .filter(d => d.properties.SUBREGION === "South America")
                                .map(geo => (
                                  <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#EAEAEC"
                                    stroke="#D6D6DA"
                                  />
                                ))
                            }
                          </Geographies>
                          {this.state.currentMarkers.map(({ name, coordinates, markerOffset }) => (
                            <Marker key={name} coordinates={coordinates}>
                              <g
                                fill="none"
                                stroke="#FF5533"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                transform="translate(-12, -24)"
                                id="gout"
                              >
                                <circle cx="12" cy="10" r="3" />
                                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                                <text
                                  textAnchor="middle"
                                  y={markerOffset}
                                  style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
                                >
                                  {name}
                                </text>
                              </g>


                            </Marker>
                          ))}
                          </ZoomableGroup>
                    </ComposableMap>
                </div>
            </div>
		);
	}
}

export default AccountMap;
