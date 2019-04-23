	$(document).ready(function() {

		$('#map').css('height', $(window).height());
		$('#map').css('width', $(window).width());
		$(window).on('resize', function() {
			$('#map').css('height', $(window).height());
			$('#map').css('width', $(window).width());
		});

		$("#allcrimeDialog").dialog({
			//autoOpen: false, 
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
        
        var allCrimes = ["Alcohol Incidents", "Arson Incidents", "Homicides", "Burglaries", "Fed. Offenses", "Gambling", "Grand Theft Auto", "Homicides", "Mentally Ill", "Misc. Felonies", "Narcotics", "Robberies", "Sex Offenses", "Suicides", "Vagrancy Incidents", "Vandalism Incidents", "Vehicle Laws", "Weapon Laws", "Total Crimes"];
        var allYears = ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"];
        var firstExpressed = allCrimes[0],
            secondExpressed = allCrimes[1],
            width = (window.innerWidth * .77),
            height = (window.innerHeight * .77),
            firstBubble = allYears[0];
        //var secondExpressed = allCrimes[17];

        //functions
        createBubbleDropdown(width, height);
        loadBubble(width, height, firstBubble);
        lineGraph(firstExpressed, width, height);
        createLineDropdown(width, height);
        
        function createBubbleDropdown(width, height){
            //add select element
            var dropdown = d3.select("#menuHolder")
                .append("select")
                .attr("class", "dropdown")
                .on("change", function(){
                    loadBubble(width, height, this.value)
                });

            //add initial option
            var titleOption = dropdown.append("option")
                .attr("class", "titleOption")
                .attr("disabled", "true")
                .text("Select Year");

            //add attribute name options
            var attrOptions = dropdown.selectAll("attrOptions")
                .data(allYears)
                .enter()
                .append("option")
                .attr("value", function(d){ return d })
                .text(function(d){ return d });
        };
    
        function loadBubble(width, height, attribute){
            d3.select(".bubbleChart")
                .remove();
            
            var svg = d3.select("#bubbleHolder").append("svg")
                .attr("class", "bubbleChart")
                .attr("width", width)
                .attr("height", height);

            // Define the div for the tooltip
            var div = d3.select("#bubbleHolder").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);

            var pack = d3.pack()
                .size([width-150, height])
                .padding(1.5);

            d3.csv("data/data2.csv", function(d) {
              d.value = +d[attribute]; //so if you're able to make this be an attribute fed into the function, such as expresssed selected from dropdown, this should be able to update dynamically
              d.Crime = d["Crime"] 

                return d;
            }, function(error, data) {
              if (error) throw error;


                //set color of bubble chart
              var myColor = d3.scaleOrdinal()
                .domain(data.map(function(d){ return d.Crime;}))
                .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410"]);

              var root = d3.hierarchy({children: data})
                  .sum(function(d) { return d.value; })
                    .sort(function(a, b) {
                        return -(a.value - b.value); //this organizes the chart so larges is in center. Removing sort function makes it sort randomly
                    });

              var node = svg.selectAll(".node")
                    .data(pack(root).leaves())
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


              node.append("circle")
                    .attr("id", function(d) { return d.id; })
                    .attr("r", function(d) { return d.r; })
                    .style("fill", function(d) { return myColor(d.data.Crime); })
                    .on("mouseover", function(d) {		
                        div.transition()		
                        .duration(200)		
                        .style("opacity", .8);	

                        var duration = 300;
                        data.forEach(function(d, i) {
                            //console.log(d.value);
                            node.transition().duration(duration).delay(i * duration)
                            .attr("r", d.value);
                        });

                        div.html(d.data.Crime + ": " + numberWithCommas(d.data.value)  )	//this line originall div.html(d.data.Crime + ": <br>"+d.data.value  )
                        .style("left", (d3.event.pageX - 150) + "px")		
                        .style("top", (d3.event.pageY - 70) + "px");	
                    })					
                    .on("mouseout", function(d) {		
                        div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                    });

                node.append("text")
                    .style("text-anchor", "middle")
                    .text(function(d) {
                        //if you don't want some of the circles populated with text, specify constraints below
                        if (d.data.value > 748|| d.data.Crime == "Other" || d.data.Crime == "Fire"){
                        return d.data.Crime;
                        }
                        return "";})
                    .attr("font-size", function(d){
                        return d.r/6;
                    })
                    .attr("fill", "white");
            });
        };//end loadBubble
        
        
        function createLineDropdown(width, height){
            //add select element
            var dropdown = d3.select("#linebuttonHolder")
                .append("select")
                .attr("class", "dropdown")
                .on("change", function(){
                    updateLine(this.value, width, height)
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
        
        function updateLine(attribute, width, height){
            d3.select(".lineChart")
                .remove();
            var attr = attribute;           
            lineGraph(attr, width, height);
        } //close updateLine
    
        //lineGraph function does not work with callback. If you use callback, you can only run the function once, any subsequent runs do not work
        function lineGraph(attribute, width, height){
             var expressed = attribute;
             var myColor = d3.scaleOrdinal()
                      .domain(allCrimes)
                      .range(["#ff8880", "#a62c23", "#8c251D", "#661b15", "#4d1410"]);

            var margin = { top: 100, right: 120, bottom: 100, left: 50 },
            width = width - margin.left - margin.right,
            height = height - margin.top - margin.bottom,
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

            d3.csv("data/data.csv", function(error, data) {
                if (error) throw error;
            
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
                .transition() //note, does this even work?
                .duration(1000)
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
                .attr("class", "tooltip-name")
                .attr("x", 18)
                .attr("y", 18)
                .text(expressed + ":");

            focus.append("text")
                .attr("class", "tooltip-crime")
                .attr("x", 150)
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
                })
        }; // lineGraph close
        
        
}); //all wrapper function close
