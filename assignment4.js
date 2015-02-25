
"use strict"

var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


