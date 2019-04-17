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
            height: (window.innerHeight *.5) //changed
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
        var crime16 = {
                "children": [{"Crime":"Narcotics","Year":"2016","Count":16345},
                    {"Crime":"Homicides","Year":"2016","Count":193},
                    {"Crime":"Assault","Year":"2016","Count":22234},
                    {"Crime":"All Crimes","Year":"2016","Count":301413}]
            };
    
        var crime15 = {
                "children": [{"Crime":"Narcotics","Year":"2015","Count":14644},
                    {"Crime":"Homicides","Year":"2015","Count":178},
                    {"Crime":"Assault","Year":"2015","Count":20990},
                    {"Crime":"All Crimes","Year":"2015","Count":288279}]
            };
        
    var allArray = [crime15, crime16];
        
    attrArray = ["2016", "2015"]
        
       
    setBubble(crime16);
    createDropdown(allArray);
    linegraph();
//    crimeDropdown();
        

    function setBubble(dataset){
            var diameter = (window.innerWidth * .25);

            var color = d3.scaleOrdinal()
                .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410", "#330"]);

            var bubble = d3.pack(dataset)
                .size([diameter, diameter])
                .padding(1.5);

            var svg = d3.select("#allcrimeDialog")
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
                .style("fill", function(d,i) {
                    return color(i);
                });

            node.append("text")
                .attr("dy", ".2em")
                .style("text-anchor", "middle")
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
                .text(function(d) {
                    return d.data.Count;
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
                    console.log(this.value);
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
        d3.select("svg").remove();
        
        console.log(dataset.children[0].Year);
            var diameter = (window.innerWidth * .25);

            var color = d3.scaleOrdinal()
                .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410", "#330"]);

            var bubble = d3.pack(dataset)
                .size([diameter, diameter])
                .padding(1.5);

            var svg = d3.select("#allcrimeDialog")
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
                .style("fill", function(d,i) {
                    return color(i);
                });

            node.append("text")
                .attr("dy", ".2em")
                .style("text-anchor", "middle")
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
                .text(function(d) {
                    return d.data.Count;
                })
                .attr("font-family",  "Gill Sans", "Gill Sans MT")
                .attr("font-size", function(d){
                    return d.r/5;
                })
                .attr("fill", "white");

            d3.select(self.frameElement)
                .style("height", diameter + "px");
    };
        

    var allGroup = ["NARCOTICS", "BURGLARY", "HOMICIDE"]
        
        
    function linegraph () {    
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
    

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        var valueline = d3.line()
            .x(function(d) { return x(d.YEAR); })
            .y(function(d) { return y(d.HOMICIDE); });
        // define the line
        var valueline2 = d3.line()
            .x(function(d) { return x(d.YEAR); })
            .y(function(d) { return y(d.BURGLARY); });
        // define the line
        var valueline3 = d3.line()
            .x(function(d) { return x(d.YEAR); })
            .y(function(d) { return y(d.NARCOTICS); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#allcrimeDialog")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // Get the data
        d3.csv("data/data.csv", function(error, data) {
          if (error) throw error;

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return d.YEAR; }));
          y.domain([0, d3.max(data, function(d) {
	       return Math.max(d.HOMICIDE, d.BURGLARY, d.NARCOTICS); })]);


          // Add the valueline path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .attr("d", valueline);

          // Add the valueline2 path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .style("stroke", "red")
              .attr("d", valueline2);
            
        // Add the valueline2 path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .style("stroke", "green")
              .attr("d", valueline3);

          // Add the X Axis
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x).tickFormat(d3.format("d")));

          // Add the Y Axis
          svg.append("g")
              .call(d3.axisLeft(y));

        });
        
            // From https://bl.ocks.org/mbostock/5649592
    function transition(path) {
            path.transition()
                .duration(2000)
                .attrTween("stroke-dasharray", tweenDash);
        }
        function tweenDash() {
            var l = this.getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
            return function (t) { return i(t); };
        }

    };
        
//    function crimeDropdown(){
//        
//           // List of groups (here I have one group per column)
//        
//
//        // add the options to the button
//        d3.select("#selectButton")
//          .selectAll('myOptions')
//          .data(allGroup)
//          .enter()
//          .append('option')
//          .text(function (d) { return d; }) // text showed in the menu
//          .attr("Crime", function (d) { return d; }) // corresponding value returned by the button
//        
//    };

});


    
    
    
    
    

