	$(document).ready(function() {

		$('#map').css('height', $(window).height());
		$('#map').css('width', $(window).width());
		$(window).on('resize', function() {
			$('#map').css('height', $(window).height());
			$('#map').css('width', $(window).width());
		});

		$("#allcrimeDialog").dialog({
			autoOpen: false,
            width: (window.innerWidth * .8), //changed
            height: (window.innerHeight *.8) //changed
		});
		$("#burgDialog").dialog({
			autoOpen: false
		});
		$("#homDialog").dialog({
			autoOpen: false
		});

		$('.allcrimeInfo').click(function() {
			$('#allcrimeDialog').dialog('open');
		})
		$('.burgInfo').click(function() {
			$('#burgDialog').dialog('open');
		})
		$('.homInfo').click(function() {
			$('#homDialog').dialog('open');
		})
		proj4.defs("EPSG:2229",
			"+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs"
		);

		var narcotics;
		var coords = [34.0522, -118.2437, 10];
		var map = L.map('map', {
			center: [coords[0], coords[1]],
			zoom: coords[2],
			minZoom: 1,
			zoomControl: false
		});

		var basemap = L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 19
			}).addTo(map);

		var heat = [];


		$.getJSON('data/narc.json')
			.done(function(data) {
				create(data);
				zoomButtons();
			})
			.fail(function() {
				alert('There has been a problem loading the data.')
			});

		function create(data) {
			narcotics = L.Proj.geoJson(data, {
				pointToLayer: function(feature, latlng) {
					//			console.log(feature);
					return L.circleMarker(latlng, {
						fillColor: '#B84E14',
						color: '#341809',
						weight: 1,
						fillOpacity: 0.6
					});
				}
			})
			narcotics.eachLayer(function(layer) {
				heat.push(layer._latlng);
			});
			var heatmap = L.heatLayer(heat, {
				gradient: {
					0.4: '#3490DC',
					0.65: '#FFED4A',
					1: '#F66D9B'
				}
			}).addTo(map);
		}

		function zoomButtons() {
			var zoom = L.control({
				position: 'topright'
			});

			zoom.onAdd = function(map) {
				var buttons = L.DomUtil.create('div', 'zoomButtons');
				var content = '<ul class="buttons">';
				content += '<li class="zoomIn"><i class="fas fa-plus"></i></li>';
				content += '<li class="home"><i class="fas fa-home"></i></li>';
				content += '<li class="zoomOut"><i class="fas fa-minus"></i></li>';
				content += '</ul>';
				$(buttons).append(content);
				return buttons;
			}
			zoom.addTo(map);
			$(".zoomIn").click(function() {
				map.zoomIn();
			});
			$(".home").click(function() {
				map.flyTo([coords[0], coords[1]], coords[2]);
			});
			$(".zoomOut").click(function() {
				map.zoomOut();
			});
		}
        
        //chart code added onto Douglas' base map
        //objects inside array inside object?
        
        function numberWithCommas(x) {
           return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
        var crime16 = {
                "children": [{"Crime":"Narcotics","Year":"2016","Count":16345}, {"Crime":"Homicides","Year":"2016","Count":193},{"Crime":"Assault","Year":"2016","Count":22234},{"Crime":"Burglary","Year":"2016","Count":13048},{"Crime":"Arson","Year":"2016","Count":536},{"Crime":"Alcohol Related","Year":"2016","Count":4126},
                {"Crime":"Federal Offense","Year":"2016","Count":676},
                {"Crime":"Misc. Felonies","Year":"2016","Count":3171},
                {"Crime":"Sex Offense","Year":"2016","Count":2662}, {"Crime":"Gambling","Year":"2016","Count":27},
                {"Crime":"Grand Theft Auto","Year":"2016","Count":12885},
                {"Crime":"Mentally Ill","Year":"2016","Count":3770}, {"Crime":"Robbery","Year":"2016","Count":40539}, {"Crime":"Suicide","Year":"2016","Count":1025}, {"Crime":"Vagrancy","Year":"2016","Count":384}, {"Crime":"Vandalism","Year":"2016","Count":12597},
                {"Crime":"Vehicle Laws","Year":"2016","Count":21693},
                {"Crime":"Weapon Laws","Year":"2016","Count":3685}]
            };
    
        var crime15 = {
                "children": [{"Crime":"Narcotics","Year":"2015","Count":14644}, {"Crime":"Homicides","Year":"2015","Count":178},{"Crime":"Assault","Year":"2015","Count":20990},{"Crime":"Burglary","Year":"2015","Count":12971},{"Crime":"Arson","Year":"2015","Count":477},{"Crime":"Alcohol Related","Year":"2015","Count":4001},
                {"Crime":"Federal Offense","Year":"2015","Count":493},
                {"Crime":"Misc. Felonies","Year":"2015","Count":3369},
                {"Crime":"Sex Offense","Year":"2015","Count":2183}, {"Crime":"Gambling","Year":"2015","Count":15},
                {"Crime":"Grand Theft Auto","Year":"2015","Count":12221},
                {"Crime":"Mentally Ill","Year":"2015","Count":3754}, {"Crime":"Robbery","Year":"2015","Count":37720}, {"Crime":"Suicide","Year":"2015","Count":1041}, {"Crime":"Vagrancy","Year":"2015","Count":429}, {"Crime":"Vandalism","Year":"2015","Count":11686},
                {"Crime":"Vehicle Laws","Year":"2015","Count":21875},
                {"Crime":"Weapon Laws","Year":"2015","Count":3380}]
            };
        
        var crime14 = {
                "children": [{"Crime":"Narcotics","Year":"2014","Count":14644}, {"Crime":"Homicides","Year":"2014","Count":178},{"Crime":"Assault","Year":"2014","Count":20990},{"Crime":"Burglary","Year":"2014","Count":12971},{"Crime":"Arson","Year":"2014","Count":477},{"Crime":"Alcohol Related","Year":"2014","Count":4001},
                {"Crime":"Federal Offense","Year":"2014","Count":493},
                {"Crime":"Misc. Felonies","Year":"2014","Count":3369},
                {"Crime":"Sex Offense","Year":"2014","Count":2183}, {"Crime":"Gambling","Year":"2014","Count":15},
                {"Crime":"Grand Theft Auto","Year":"2014","Count":12221},
                {"Crime":"Mentally Ill","Year":"2014","Count":3754}, {"Crime":"Robbery","Year":"2014","Count":37720}, {"Crime":"Suicide","Year":"2014","Count":1041}, {"Crime":"Vagrancy","Year":"2014","Count":429}, {"Crime":"Vandalism","Year":"2014","Count":11686},
                {"Crime":"Vehicle Laws","Year":"2014","Count":21875},
                {"Crime":"Weapon Laws","Year":"2014","Count":3380}]
            };
        
    var allArray = [crime14, crime15, crime16],
    attrArray = ["2016", "2015", "2014"];
        
       
    setBubble(crime16);
    createDropdown(allArray);
    linegraph();
//    crimeDropdown();
        

    function setBubble(dataset){
            var diameter = (window.innerWidth * .5);

            var color = d3.scaleOrdinal()
                .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410", "#451410"]);

            var bubble = d3.pack(dataset)
                .size([diameter, diameter])
                .padding(1.5);

            var svg = d3.select("#bubbleHolder")
                .append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble");
            
            var bubbleTitle = svg.append("text")
                .attr("x", 10)
                .attr("y", 20)
                .attr("class", "bubbleTitle");
        
            var bubbleTitle = d3.select(".bubbleTitle")
                .text(dataset.children[0].Year)

            var nodes = d3.hierarchy(dataset)
                .sum(function(d) { return d.Count; });

            var node = svg.selectAll(".node")
                .data(bubble(nodes).descendants())
                .enter()
                .filter(function(d){
                    return  !d.children
                })
                .append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
        console.log(node);

            node.append("title")
                .text(function(d) {
                    return d.Crime + ": " + d.Count;
                });

            node.append("circle")
                .attr("r", function(d) {
                    return d.r;
                })
                .style("fill", function(d,i) {
                    return color(i);
                });

            node.append("text")
                .attr("dy", ".2em")
                .style("text-anchor", "middle")
                .text(function(d) {
                    return d.data.Crime.substring(0, d.r / 1.5);
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", function(d){
                    return d.r/5;
                })
                .attr("fill", "white");

            node.append("text")
                .attr("dy", "1.3em")
                .style("text-anchor", "middle")
                .text(function(d) {
                    return numberWithCommas(d.data.Count);
                })
                .attr("font-family",  "Gill Sans", "Gill Sans MT")
                .attr("font-size", function(d){
                    return d.r/5;
                })
                .attr("fill", "white");

            d3.select(self.frameElement)
                .style("height", diameter + "px");
    }
        

        function createDropdown(allArray){
            //add select element
            var dropdown = d3.select("#menuHolder")
                .append("select")
                .attr("class", "dropdown")
                .on("change", function(){
                    //console.log(this.value);
                    getValue(this.value, allArray)
                });

            //add initial option
            var titleOption = dropdown.append("option")
                .attr("class", "titleOption")
                .attr("disabled", "true")
                .text("Select Year");

            //add attribute name options
            var attrOptions = dropdown.selectAll("attrOptions")
                .data(attrArray)
                .enter()
                .append("option")
                .attr("value", function(d){ return d })
                .text(function(d){ return d });
        };
        
        function getValue (year, allArray){
        for (var i=0; i<allArray.length; i++){
            var crimeArray = allArray[i]; //holds value of individual crime arrays
            var testYear = crimeArray.children[0].Year; //holds value of year associated with the crime array
            if (testYear == year){ //if year of array is equal to year from dropdown, run update function on that array
                updateBubble(crimeArray);
            };
        };
    };
    
        
    function updateBubble (dataset){
              // transition
      var t = d3.transition()
          .duration(750);

        
        d3.select(".bubble")
            .remove();
        
        //console.log(dataset.children[0].Year);
            var diameter = (window.innerWidth * .5);

            var color = d3.scaleOrdinal()
                .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410"]);

            var bubble = d3.pack(dataset)
                .size([diameter, diameter])
                .padding(1.5);

            var svg = d3.select("#bubbleHolder")
                .append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble");
            
            var bubbleTitle = svg.append("text")
                .attr("x", 10)
                .attr("y", 20)
                .attr("class", "bubbleTitle");
        
            var bubbleTitle = d3.select(".bubbleTitle")
                .text(dataset.children[0].Year)

            var nodes = d3.hierarchy(dataset)
                .sum(function(d) { return d.Count; });

            var node = svg.selectAll(".node")
                .data(bubble(nodes).descendants())
                .enter()
                .filter(function(d){
                    return  !d.children
                })
                .append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            node.append("title")
                .text(function(d) {
                    return d.Crime + ": " + d.Count;
                });

            node.append("circle")
                .attr("r", function(d) {
                    return d.r;
                })
                .transition(t)
                .style("fill", function(d,i) {
                    return color(i);
                });

            node.append("text")
                .attr("dy", ".2em")
                .style("text-anchor", "middle")
                .transition(t)
                .text(function(d) {
                    return d.data.Crime.substring(0, d.r / 3);
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", function(d){
                    return d.r/5;
                })
                .attr("fill", "white");

            node.append("text")
                .attr("dy", "1.3em")
                .style("text-anchor", "middle")
                .transition(t)
                .text(function(d) {
                    return numberWithCommas(d.data.Count);
                })
                .attr("font-family",  "Gill Sans", "Gill Sans MT")
                .attr("font-size", function(d){
                    return d.r/5;
                })
                .attr("fill", "white");

            d3.select(self.frameElement)
                .style("height", diameter + "px");
    };
        

//    var allGroup = ["HOMICIDE", "BURGLARY", "NARCOTICS"]
        
        
    function linegraph () {    
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            //width = 960 - margin.left - margin.right,
            //height = 500 - margin.top - margin.bottom,
            width = window.innerWidth * .5,
            height = window.innerHeight * .5;
      
        var svg = d3.select("#chartHolder")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    

            //Read the data
            d3.csv("data/data.csv", function(data) {

                // List of groups (here I have one group per column)
                var allGroup = ["HOMICIDE", "BURGLARY", "NARCOTICS", "ASSAULT", "ALCOHOL_RELATED", "FEDERAL_OFFENSE", "FELONIES_MISC", "SEX_OFFENSE", "GAMBLING", "GRAND_THEFT_AUTO", "MENTALLY_ILL", "ROBBERY", "SUICIDE", "VAGRANCY", "VANDALISM", "VEHICLE_BOAT_LAWS", "WEAPONS_LAWS", "ALL_CRIMES"]
                
                // add the options to the button
                d3.select("#selectButton")
                  .selectAll('myOptions')
                  .data(allGroup)
                  .enter()
                  .append('option')
                  .text(function (d) { return d; }) // text showed in the menu
                  .attr("value", function (d) { return d; }) // corresponding value returned by the button
                
//                
                
                // A color scale: one color for each group
                var myColor = d3.scaleOrdinal()
                  .domain(allGroup)
                  .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410"]);
                
                

                // Add X axis --> it is a date format
                var x = d3.scaleLinear()
                  .domain([2005,2016])
                  .range([ 0, width ]);
                svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x).tickFormat(d3.format("d")));
                
                // Add Y axis
                var y = d3.scaleLinear()
                  .domain( [0,350])
                  .range([ height, 0 ]);
                svg.append("g")
                  .call(d3.axisLeft(y));

                // Initialize line with group a
                var line = svg
                  .append('g')
                  .append("path")
                    .datum(data)
                    .attr("d", d3.line()
                      .x(function(d) { return x(+d.YEAR) })
                      .y(function(d) { return y(+d.HOMICIDE) })
                    )
                    .attr("stroke", function(d){ return myColor("HOMICIDE") })
                    .style("stroke-width", 4)
                    .style("fill", "none")

                // A function that update the chart
                function update(selectedGroup) {
                    
                    var expressed = selectedGroup;
                   
                    var max = d3.max(data, function(d){
                        return + parseFloat(d[expressed])
                    });
                
                        
                  // Create new data with the selection?
                  var dataFilter = data.map(function(d){return {YEAR: d.YEAR, value:d[selectedGroup]} })
                  
                  
                  //remove current axis tick marks                  
                  d3.selectAll(".tick")
                    .remove();
                    
                    // Add X axis --> it is a date format
                    var x = d3.scaleLinear()
                      .domain([2005,2016])
                      .range([ 0, width ]);
                    svg.append("g")
                      .attr("transform", "translate(0," + height + ")")
                      .call(d3.axisBottom(x).tickFormat(d3.format("d")));
                    
                    // Update Y axis
                    y = d3.scaleLinear()
                      .domain( [0,max])
                      .range([ height, 0 ]);
                    svg.append("g")
                      .call(d3.axisLeft(y));

                    
                  // Give these new data to update line
                  line
                      .datum(dataFilter)
                      .transition()
                      .duration(1000)
                      .attr("d", d3.line()
                        .x(function(d) { return x(+d.YEAR) })
                        .y(function(d) { return y(+d.value) })
                      )
                      .attr("stroke", function(d){ return myColor(selectedGroup) })
                }

                // When the button is changed, run the updateChart function
                d3.select("#selectButton").on("change", function(d) {
                    // recover the option that has been chosen
                    var selectedOption = d3.select(this).property("value")
                    // run the updateChart function with this selected option
                    update(selectedOption)
                });

        });
    }
});