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
        
        window.onload = setCharts();
        var allCrimes = ["Alcohol Related Incidents", "Arson Incidents", "Homicides", "Burglaries", "Fed. Offenses", "Gambling", "Grand Theft Auto", "Homicides", "Mentally Ill", "Misc. Felonies", "Narcotics", "Robberies", "Sex Offenses", "Suicides", "Vagrancy Incidents", "Vandalism Incidents", "Vehicle Laws", "Weapon Laws", "Total Crimes"];
        
        var firstExpressed = allCrimes[18];
        console.log("here");
        console.log(firstExpressed);
        
        function setCharts(){
            d3.queue()
            .defer(d3.csv, "data/data.csv")
            .await(callback);
            
            function callback(error, csvData){
                lineGraph(csvData, firstExpressed);
                createLineDropdown(csvData);
            }
        }
        
    var allArray = [crime14, crime15, crime16],
    attrArray = ["2016", "2015", "2014"],
        lineArray = ["Alcohol Related", "Homicides"];
        
       
    setBubble(crime16);
    createDropdown(allArray);

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
    
    function createLineDropdown(csvData){
        //add select element
        var dropdown = d3.select("#linebuttonHolder")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                updateLine(csvData, this.value)
            });

        //add initial option
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Select Crime");

        //add attribute name options
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(allCrimes)
            .enter()
            .append("option")
            .attr("value", function(d){ return d })
            .text(function(d){ return d });
    };
        
    function updateLine(data, attribute){
        
        
        d3.select(".lineChart")
            .remove();
        
        lineGraph(data, attribute);
    }
    
    function lineGraph(data, attribute){
         
         var expressed = attribute;
        console.log("here2")
        console.log(expressed);
        
         
         var myColor = d3.scaleOrdinal()
                  .domain(allCrimes)
                  .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410"]);
        
        var margin = { top: 30, right: 120, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        tooltip = { width: 100, height: 100, x: 10, y: -30 };

        var parseDate = d3.timeParse("%m/%e/%Y"),
            bisectDate = d3.bisector(function(d) { return d.date; }).left,
            formatValue = d3.format(","),
            dateFormatter = d3.timeFormat("%Y");

        var x = d3.scaleTime()
                .range([0, width]);

        var y = d3.scaleLinear()
                .range([height, 0]);

        var svg = d3.select("#lineHolder").append("svg")
            .attr("class", "lineChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d[expressed]); });


        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d[expressed] = +d[expressed];
        });

        data.sort(function(a, b) {
            return a.date - b.date;
        });

        x.domain([data[0].date, data[data.length - 1].date]);
        y.domain(d3.extent(data, function(d) { return d[expressed]; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
              .tickFormat(dateFormatter));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Number of" + expressed);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", function(d){ return myColor("Total Crimes") });

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 5);

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 200)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 18)
            .attr("y", -2);

        focus.append("text")
            .attr("x", 18)
            .attr("y", 18)
            .text(expressed + ":");

        focus.append("text")
            .attr("class", "tooltip-crime")
            .attr("x", 105)
            .attr("y", 18);

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.date) + "," + y(d[expressed]) + ")");

                focus.select(".tooltip-date").text(dateFormatter(d.date));
                focus.select(".tooltip-crime").text(formatValue(d[expressed]))
            }; //mousemove close           
    
    }; // lineGraph close
        
        
}); //all wrapper function close

