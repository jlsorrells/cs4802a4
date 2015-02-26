
"use strict"

var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var seq1 = "GAATTCAGTTA";
var seq2 = "GGATCGA";
var gapChar = "-";
var matchChar = "|";

var scoreMatrix = [];
var pathMatrix = [];
var matchScore = 2;
var mismatchScore = -1;
var gapScore = -2;

// calculate the score matrix
for (var i = 0; i <= seq1.length; i++) {
    var column = [];
    var pathColumn = [];
    scoreMatrix.push(column);
    pathMatrix.push(pathColumn);
    for (var j = 0; j <= seq2.length; j++) {
        var match = 0, 
            gap1 = 0,
            gap2 = 0;
        // match/mismatch scores
        if (i > 0 && j > 0) {
            match = scoreMatrix[i-1][j-1] + (seq1[i-1] == seq2[j-1] ? matchScore : mismatchScore);
        }
        // gap scores
        if (i > 0) {
            gap1 = scoreMatrix[i-1][j] + gapScore;
        }
        if (j > 0) {
            gap2 = scoreMatrix[i][j-1] + gapScore;
        }
        var best = Math.max(match, gap1, gap2);
        column.push(best);
        
        // update the path that we have taken
        if (best == match) {
            pathColumn.push([1,1]);
        } else if (best == gap1) {
            pathColumn.push([1,0]);
        } else {
            pathColumn.push([0,1]);
        }
    }
}

var out1 = "";
var out2 = "";
var outMiddle = "";

// backtrack to find sequence
var i = seq1.length;
var j = seq2.length;
while (i != 0 || j != 0) {
    var direction = pathMatrix[i][j];
    out1 = (direction[0] ? seq1[i-1] : gapChar) + out1;
    out2 = (direction[1] ? seq2[j-1] : gapChar) + out2;
    outMiddle = (direction[0] && direction[1] && seq1[i-1] == seq2[j-1] ? matchChar : " ") + outMiddle;
    i -= direction[0];
    j -= direction[1];
}

var output = "\n" + out1 + "\n" + outMiddle + "\n" + out2;






