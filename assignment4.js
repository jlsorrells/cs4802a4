
"use strict"

var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//var seq1 = "GAATTCAGTTA";
//var seq2 = "GGATCGA";
var seq1 = "MSTKVTVELQRLPHAEGLPLPAYQTAEAAGLDLMAAVPEDAPLTLASGRYALVPTGLAIALPPGHEAQVRPRSGLAAKHGVTVLNSPGTIDADYRGEIKVILINHGAAAFVIKRGERIAQMVIAPVVQAALVPVATLSATDRGAGGFGSTGR";
//var seq2 = "MIKIKLTHPDCMPKIGSEDAAGMDLRAFFGTNPAADLRAIAPGKSLMIDTGVAVEIPRGWFGLVVPRSSLGKRHLMIANTAGVIDSDYRGTIKMNLYNYGSEMQTLENFERLCQLVVLPHYSTHNFKIVDELEETIRGEGGFGSSGSK";
var seq2 = "MTSEDQSLKKQKLESTQSLKVYLRSPKGKVPTKGSALAAGYDLYSAEAATIPAHGQGLVSTDISIIVPIGTYGRVAPRSGLAVKHGISTGAGVIDADYRGEVKVVLFNHSEKDFEIKEGDRIAQLVLEQIVNADIKEISLEELDNTERGEGGFGSTGKN";


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
        var match = -Infinity, 
            gap1 = -Infinity,
            gap2 = -Infinity;
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
        
        if (i == 0 && j == 0) {
            match = 0;
        }
        
        var best = Math.max(match, gap1, gap2);
        column.push(best);
        
        // update the path that we have taken
        if (best == match && i > 0 && j > 0) {
            pathColumn.push([1,1]);
        } else if (best == gap2 && j > 0) {
            pathColumn.push([0,1]);
        } else if (i > 0) {
            pathColumn.push([1,0]);
        } else {
            pathColumn.push([0,0]);
        }
    }
}

var out1 = "";
var out2 = "";
var outMiddle = "";

// backtrack to find sequence
var i = seq1.length;
var j = seq2.length;
console.log("score = " + scoreMatrix[i][j]);
while (i != 0 || j != 0) {
    var direction = pathMatrix[i][j];
    out1 = (direction[0] ? seq1[i-1] : gapChar) + out1;
    out2 = (direction[1] ? seq2[j-1] : gapChar) + out2;
    outMiddle = (direction[0] && direction[1] && seq1[i-1] == seq2[j-1] ? matchChar : " ") + outMiddle;
    i -= direction[0];
    j -= direction[1];
    if (direction[0] == 0 && direction[1] == 0) {
        console.log("something went wrong");
        break;
    }
}

var output = "\n" + out1 + "\n" + outMiddle + "\n" + out2;

svg.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("font-size", "15px")
    .attr("font-family", "monospace")
    .text(out1);
    
svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("font-size", "15px")
    .attr("font-family", "monospace")
    .attr("xml:space", "preserve")
    .text(outMiddle);
    
svg.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("font-size", "15px")
    .attr("font-family", "monospace")
    .text(out2);




