
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
var seq2 = "MIKIKLTHPDCMPKIGSEDAAGMDLRAFFGTNPAADLRAIAPGKSLMIDTGVAVEIPRGWFGLVVPRSSLGKRHLMIANTAGVIDSDYRGTIKMNLYNYGSEMQTLENFERLCQLVVLPHYSTHNFKIVDELEETIRGEGGFGSSGSK";
var seq3 = "MTSEDQSLKKQKLESTQSLKVYLRSPKGKVPTKGSALAAGYDLYSAEAATIPAHGQGLVSTDISIIVPIGTYGRVAPRSGLAVKHGISTGAGVIDADYRGEVKVVLFNHSEKDFEIKEGDRIAQLVLEQIVNADIKEISLEELDNTERGEGGFGSTGKN";


var gapChar = "-";
var matchChar = "|";

var scoreMatrix = [];
var pathMatrix = [];
var matchScore = 2;
var mismatchScore = -1;
var gapScore = -2;

// calculate the score matrix
for (var i = 0; i <= seq1.length; i++) {
    var row = [];
    var pathRow = [];
    scoreMatrix.push(row);
    pathMatrix.push(pathRow);
    for (var j = 0; j <= seq2.length; j++) {
        var column = [];
        var pathColumn = [];
        row.push(column);
        pathRow.push(pathColumn);
        for (var k = 0; k <= seq3.length; k++) {
            var m123 = -Infinity,
                m12g3 = -Infinity,
                m13g2 = -Infinity,
                m23g1 = -Infinity,
                m1g23 = -Infinity,
                m2g13 = -Infinity,
                m3g12 = -Infinity;
            // calculate scores
            // all match
            if (i > 0 && j > 0 && k > 0) {
                m123 = scoreMatrix[i-1][j-1][k-1] + (seq1[i-1] == seq2[j-1] ? matchScore : mismatchScore) + 
                    (seq1[i-1] == seq3[k-1] ? matchScore : mismatchScore) + 
                    (seq2[j-1] == seq3[k-1] ? matchScore : mismatchScore);
            }
            // two match, one gap
            if (i > 0 && j > 0) {
                m12g3 = scoreMatrix[i-1][j-1][k] + (seq1[i-1] == seq2[j-1] ? matchScore : mismatchScore) + gapScore;
            }
            if (i > 0 && k > 0) {
                m13g2 = scoreMatrix[i-1][j][k-1] + (seq1[i-1] == seq3[k-1] ? matchScore : mismatchScore) + gapScore;
            }
            if (j > 0 && k > 0) {
                m23g1 = scoreMatrix[i][j-1][k-1] + (seq2[j-1] == seq3[k-1] ? matchScore : mismatchScore) + gapScore;
            }
            // two gaps
            if (i > 0) {
                m1g23 = scoreMatrix[i-1][j][k] + gapScore * 2;
            }
            if (j > 0) {
                m2g13 = scoreMatrix[i][j-1][k] + gapScore * 2;
            }
            if (k > 0) {
                m3g12 = scoreMatrix[i][j][k-1] + gapScore * 2;
            }
            
            // starting cell
            if (i == 0 && j == 0 && k == 0) {
                m123 = 0;
            }
            
            var best = Math.max(m123,m12g3,m13g2,m23g1,m1g23,m2g13,m3g12);
            column.push(best);
            
            // update the path that we have taken
            if (best == m123) {
                pathColumn.push([1,1,1]);
            } else if (best == m12g3) {
                pathColumn.push([1,1,0]);
            } else if (best == m13g2) {
                pathColumn.push([1,0,1]);
            } else if (best == m23g1) {
                pathColumn.push([0,1,1]);
            } else if (best == m1g23) {
                pathColumn.push([1,0,0]);
            } else if (best == m2g13) {
                pathColumn.push([0,1,0]);
            } else if (best == m3g12) {
                pathColumn.push([0,0,1]);
            } else {
                pathColumn.push([0,0,0]);
                console.log("??? " + i + " " + j);
            }
        }
    }
}

var out1 = "";
var out2 = "";
var out3 = "";
var outMiddle12 = "";
var outMiddle23 = "";
var outMiddle31 = "";

// backtrack to find sequence
var i = seq1.length;
var j = seq2.length;
var k = seq3.length;
console.log("score = " + scoreMatrix[i][j][k]);
while (i != 0 || j != 0 || k != 0) {
    var direction = pathMatrix[i][j][k];
    out1 = (direction[0] ? seq1[i-1] : gapChar) + out1;
    out2 = (direction[1] ? seq2[j-1] : gapChar) + out2;
    out3 = (direction[2] ? seq3[k-1] : gapChar) + out3;
    outMiddle12 = (direction[0] && direction[1] && seq1[i-1] == seq2[j-1] ? matchChar : " ") + outMiddle12;
    outMiddle23 = (direction[1] && direction[2] && seq2[j-1] == seq3[k-1] ? matchChar : " ") + outMiddle23;
    outMiddle31 = (direction[2] && direction[0] && seq3[k-1] == seq1[i-1] ? matchChar : " ") + outMiddle31;
    i -= direction[0];
    j -= direction[1];
    k -= direction[2];
    if (direction[0] == 0 && direction[1] == 0 && direction[2] == 0) {
        console.log("something went wrong");
        break;
    }
}

var output = "\n" + out1 + "\n" + outMiddle12 + "\n" + out2 + "\n" + outMiddle23 + "\n" + 
    out3 + "\n" + outMiddle31 + "\n" + out1;
    
svg.selectAll(".text")
    .data([out1, outMiddle12, out2, outMiddle23, out3, outMiddle31, out1])
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", function (d, i) { return i * 25; })
    .attr("font-size", "15px")
    .attr("font-family", "monospace")
    .attr("xml:space", "preserve")
    .text(function (d) { return d; });

var split1 = outMiddle12.split("");
var split2 = outMiddle23.split("");
var split3 = outMiddle31.split("");
var rectSize = width / split1.length;
svg.selectAll(".rect")
    .data(outMiddle12.split(""))
    .enter()
    .append("rect")
    .attr("x", function (d, i) { return i * rectSize; })
    .attr("y", 180)
    .attr("width", rectSize)
    .attr("height", 50)
    .attr("fill", function (d, i) {
        var x = (split1[i] == matchChar) + (split2[i] == matchChar) + (split3[i] == matchChar);
        if (x == 3) {
            return "#00FF00";
        } else if (x == 1) {
            return "#0000FF";
        } else {
            return "#FF0000";
        }
    });



    
    
    
    
    
    
    
    
    
    
    
    