d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",function(response){
  
  data = response.monthlyVariance;
  baseTemp = response.baseTemperature;
    
  var h = 650,
      w = 1050;

  var padding = {
    top: 75,
    bottom: 70,
    left: 100,
    right: 30  
  };
  
  var monthNames = ["offset","January","Februray","March","April","May","June","July","August","September","October","November","December"];
   
   tempRange = data.map(function(d){ return  Math.round((d.variance + baseTemp) *1000)/1000 ;});
  
  //console.log(d3.extent(tempRange));
  
   colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
  
  var numOfYears = data.length / 12;
  var barWidth = (w - padding.left - padding.right)/numOfYears;

  tempMin = d3.min(tempRange);
  tempMax = d3.max(tempRange);
  
  colorScale = d3.scaleQuantile()
    .domain([tempMin,tempMax])
    .range(colors);

  var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .html(function(d,i) {
      var str = '<span class="date">' + monthNames[d.month] +"-" + d.year + '</span></br><span>Temp: </span><span class="highlight">'+ tempRange[i] + '&deg;C</span></br><span>Variance: '+ d.variance + '&deg;C </span>';
      return str; 
    })
    .direction('n')
    .offset([-40,0]);
  
  var xscale = d3.scaleTime()
  .domain(d3.extent(data,function(d){ 
    return d3.timeParse("%Y")(d.year); 
  }));
  xscale.range([0,w-padding.left-padding.right]);

  var yscale = d3.scaleBand()
    .domain(monthNames.slice(1,13))
    .rangeRound([0,h-padding.top-padding.bottom]);

  var xAxis = d3.axisTop()
    .scale(xscale)
    .tickFormat(d3.timeFormat("%Y"));
  
  var yAxis = d3.axisLeft()
    .scale(yscale);
  
  var svg = d3.select("svg")
    .attr("height",h)
    .attr("width",w)
    .append("g").attr("class","svgContainer")
    .attr("transform","translate("+ padding.left +"," + padding.top+")");

  svg.call(tip);
  
  //x Axis
  svg.append("g").attr("class","x axis")
    .call(xAxis)
    .append("text")
    .attr("class","label")
    .text("Years")
    .attr("x","500")
    .attr("dy","-45");
  
  //y Axis
  svg.append("g").attr("class","y axis")
    .call(yAxis)
    .append("text")
    .attr("class","label")
    .text("Months")
    .attr("transform","rotate(-90)")
    .attr("dx","-180")
    .attr("dy","-70");
  
  //Bar 
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class","bar")
    .attr("height",yscale.bandwidth())
    .attr("width",barWidth)
   // .attr("x",function(i){ return (Math.floor(i/12)*barWidth);})
    .attr("x",function(d){ return xscale( d3.timeParse("%Y")(d.year) ); })
    .attr("y",function(d){ return yscale(monthNames[d.month]);})
    .attr("fill",function(d){ return colorScale(baseTemp + d.variance)})
    .on("mouseover",tip.show)
    .on("mouseout",tip.hide)
    
 // Legend
 var legendBarHeight = 15;
 var legendBarWidth = 63;
 var legendBarSpacing = 5;
  
 var legendbars = d3.select("svg")
  .append("g")
  .attr("transform","translate(100,"+ (h - 45)+")")
  .selectAll(".legend-rects")
  .data(colors)
  .enter()
 
  legendbars.append("rect")
  .attr("x",function(d,i){ return (i*(legendBarWidth + legendBarSpacing)) ;})
  .attr("height",legendBarHeight)
  .attr("width",legendBarWidth)
  .attr("fill",function(d,i){ return d});
  
  legendbars.append("text")
  .attr("x",function(d,i){ return (i* (legendBarWidth + legendBarSpacing)); })
  .attr("dx","5")
  .attr("y","30")
  .attr("class","legendText")
  .text(function(d,i){
    var q = colorScale.quantiles();
    if( i === 0)
      return "< " + Number(q[0]).toFixed(1);
    else if( i === colors.length-1)
      return "> " + Number(q[i-1]).toFixed(1) ;
    else{         
      var textStr = Number(q[i-1]).toFixed(1) + " - " + Number(q[i]).toFixed(1);
      return textStr;
    }
  });
    
});