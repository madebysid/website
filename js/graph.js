var obj = {},
    happening = 0,
    fromYear = 99999,
    toYear = 0,
    graphFromYear = 0,
    graphToYear = 0,
    pauseYear=0,
    yearIndex = 0,
    total;

function populateYear() {
    //Populating the year dropdowns
    var pushYear1,
        pushYear2;
    for(var i = fromYear; i<=toYear; i++) {
        pushYear1 = document.createElement("option");
        pushYear1.value = i;
        pushYear1.text = i;
        pushYear2 = document.createElement("option");
        pushYear2.value = i;
        pushYear2.text = i;
        document.getElementById('dd_from').add(pushYear1);
        document.getElementById('dd_to').add(pushYear2);
    }
}

function calculateYear() {
    //Finding the from and to Year in the given DATA
    for (var dist in obj ) {
        for (var bloc in obj[dist]) {
            var tempData = obj[dist][bloc][0];
            for (var str in tempData) {
                var yr = parseInt(str.substring(str.length-4,str.length),10);
                if(!isNaN(yr)) {
                    if(yr < fromYear)
                        fromYear = yr;
                    if (yr > toYear)
                        toYear = yr;
                }
            }
            break;
        }
        break;
    }
    populateYear();
}

function populateDistrict(district) {
    var dist_ele = document.createElement("option");
    dist_ele.value = district;
    dist_ele.text = district;
    document.getElementById('dd_district').add(dist_ele);
}

function populateBlock() {
    var district = document.getElementById('dd_district').value;
    document.getElementById("dd_block").innerHTML = "";
    for (var block in obj[district]) {
        var blk_ele = document.createElement("option");
        blk_ele.value = block;
        blk_ele.text = block;
        document.getElementById("dd_block").add(blk_ele);
    }
}

function upload(path) {
    d3.csv(path, function (data) {
        data.forEach(function (v) {
            var group = v.DISTRICT,
                block = v.BLOCK,
                villageObj = {};
            if (!obj.hasOwnProperty(group)) {
                obj[group] = {};
                populateDistrict(group);
            }
            if (!obj[group].hasOwnProperty(block)) {
                obj[group][block] = [];
            }
            villageObj = v;
            delete(villageObj.DISTRICT);
            delete(villageObj.BLOCK);
            obj[group][block].push(villageObj);
        });
    });
}

//DATA READY

function makeGraph(district, block, from, to, dataType) {
    var numVillages = 0;
    var parsingData = obj[district][block];
    var parsingObj = [];
    parsingData.forEach(function (v) {
        var group = v.VILLAGE,
            villageObj = {};
        if (!parsingObj.hasOwnProperty(group)) {
            parsingObj[group] = [];
            parsingObj[group].PRE = [];
            parsingObj[group].POST = [];
            numVillages += 1;
        }
        villageObj = v;
        for (var i = from; i <= to; i++) {
            var preval = "JUNE_" + i,
                postval = "OCT_" + i;
            parsingObj[group].PRE[i - from] = v[preval];
            parsingObj[group].POST[i - from] = v[postval];
        }
    });

    var cnvWidth = document.innerWidth;
    var cnvHeight = document.innerHeight;

    //GRAPH GENERATION

    var heightScale = 300/26;
    var widthScale = (500 / numVillages) * 1.5; //General width of the graph is controlled by this.
    var offset = 40; //Distance from left, where graph starts.

    //GENERATE DATA

    var data = [];

    total = to - from + 1;
    //yearIndex = (yearIndex + 1) % total;
 
    if (dataType === "PRE") {
        for (var village in parsingObj)
        if (village !== "") data.push(parsingObj[village].PRE[yearIndex]);
    } else {
        for (var village in parsingObj)
        if (village !== "") data.push(parsingObj[village].POST[yearIndex]);
    }

    //MAKE CANVAS AND ADD AXIS

    d3.selectAll("svg").remove();

    var canvas = d3.select("body")
        .append("svg")
        .attr("width", 500)
        .attr("height", 600)
        .attr("transform", "translate(50,20)");

    var villageNames = [];

    for(village in parsingObj)
        villageNames.push(village);

    var villageTicks = function(d) {
        return villageNames[d%numVillages];
    }
        
    var xAxisScale = d3.scale.linear()
                        .domain([0,numVillages])
                        .range([0,(widthScale*numVillages)/2]);

    var xAxis = d3.svg.axis()
                .scale(xAxisScale)
                .orient("bottom")
                .ticks(numVillages)
                .tickFormat(villageTicks);

    canvas.append("g")
        .attr("class","x axis")
        .call(xAxis)
        .attr("transform","translate(0,300)");
    
    canvas.selectAll("text")
            .attr("y","40")
            .attr("style","text-anchor:end; font-size: 14px")
            .attr("text-align","right")
            .attr("transform","rotate(-65)");

    var depthNames = [];

    for(i=0;i<=14;i++)
        depthNames.push( parseInt (300/15 * i,10));

    var depthTicks = function(d) {
        return (depthNames[d/10]/10);
    }

    var yAxisScale = d3.scale.linear()
        .domain([130, 0])
        .range([300, 0]);

    var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("right")
        .ticks(15)
        .tickFormat(depthTicks); 

    canvas.append("svg:g")
        .attr("class","y axis")
        .call(yAxis);

    //DRAW LINE GRAPH   

    canvas.select("lineg").remove();

    var graph = canvas.selectAll("lineg")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
        return (widthScale * i / 2 + offset);
    })
        .attr("y1", function (d, i) {
        return heightScale * (data[i]);
    })
        .attr("x2", function (d, i) {
        return (widthScale * (i + 1) / 2 + offset);
    })
        .attr("y2", function (d, i) {
        if (!isNaN(data[i+1]) && data[i + 1] !== undefined) return heightScale * (data[i + 1]);
        else return 0;
    })
        .attr("stroke", "#90c6ee")
        .attr("stroke-width" ,"3")
        .attr("id", "lineg");

    //DISPLAY DISTRICT,BLOCK

    document.getElementById("l_district").innerHTML = ('DISTRICT: ' + document.getElementById("dd_district").value.toUpperCase());
    document.getElementById("l_block").innerHTML = ('BLOCK: ' + document.getElementById("dd_block").value.toUpperCase());
    document.getElementById("text_year").innerHTML = ('YEAR: ' + (from + yearIndex));

    //ANIMATION FUNCTION

    var animFunc = function () {
        yearIndex = (yearIndex + 1) % total;
        var temp = 0;

        document.getElementById("text_year").innerHTML = ('YEAR: ' + (from + yearIndex));

        if (dataType === "PRE") {
            for (var village in parsingObj) {
                if (village !== "") {
                    if (!isNaN(parsingObj[village].PRE[yearIndex]) && parsingObj[village].PRE[yearIndex] !== undefined)
                        data[temp++] = parsingObj[village].PRE[yearIndex];
                    else
                        data[temp++] = 0;
                }
            }
        } else {
            for (var village in parsingObj) {
                if (village !== "") {
                    if (!isNaN(parsingObj[village].POST[yearIndex]) && parsingObj[village].POST[yearIndex] !== undefined)
                        data[temp++] = parsingObj[village].POST[yearIndex];
                    else
                        data[temp++] = 0;
                }
            }
        }

        graph.transition()
            .attr("y1", function (d, i) {
            return heightScale * (data[i]);
        })
            .attr("y2", function (d, i) {
            if (!isNaN(data[i+1]) && data[i + 1] !== undefined) return heightScale * (data[i + 1]);
            else return 0;
        })
            .attr("stroke", "#90c6ee")
            .attr("stroke-width", 3);

        dataPoints.transition()
            .attr("cy", function (d, i) {
            return heightScale * (data[i]);
        });

        vert_guides.transition()
            .attr("y2", function (d, i) {
            return heightScale * (data[i]);
        });
    };

    var heightScaleFunction = function (i) {
        return (300 / 13 * i );
    };

    //GENERATE GUIDES

    for (i = 0; i < 14; i++)
    canvas.append("line")
        .attr("x1", 30)
        .attr("y1", heightScaleFunction(i))
        .attr("x2", 1000)
        .attr("y2", heightScaleFunction(i))
        .attr("stroke", "#d1d1d1")
        .attr("stroke-width", 1);

    var vert_guides = canvas.selectAll("vert_guides")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
        return (widthScale * i / 2 + offset);
    })
        .attr("y1", 300)
        .attr("x2", function (d, i) {
        return (widthScale * i / 2 + offset);
    })
        .attr("y2", function (d, i) {
        return heightScale * (data[i]);
    })
        .attr("stroke", "#e1e1e1")
        .attr("stroke-width", 1)
        .attr("id", "vert_guides");

    //GENERATE DATA POINT INDICATORS    

    var dataPoints = canvas.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
        return (widthScale * i / 2 + offset);
    })
        .attr("cy", function (d, i) {
        return heightScale * (data[i]);
    })
        .attr("r", 5)
        .attr("fill", "#ff0000");
    happening = setInterval(animFunc, 1000);
}

function setGraphYear(fromVal, toVal) {
    graphFromYear = fromVal;
    graphToYear = toVal;
}

function resetYearIndex() {
    yearIndex = 0;
}

function callAnimation(temp) {
    if (temp === false)
        clearInterval(happening);
    else
        makeGraph(district, block, graphFromYear, graphToYear, dataType);
}