Jon Sorrells, assignment 4, cs4802

To view the output, go to http://jlsorrells.github.io/cs4802a4/  

This program compares 3 protein sequences.  The sequences are of DUT_BRAJA, DUT_BPT5, and DUT_CANAL, from http://web.cs.wpi.edu/~matt/courses/bcb4002/datasets.html.  
The first sequence is shown again at the bottom to make it easy to visually compare any two of the three sequences.  
The program should work on longer sequences as well, however it runs in n^3 time, so it may take a while.  

The output of the program will show the text of the sequences, with vertical lines inbetween to indicate matches, and dashes in the sequences to indicate gaps.  
If the sequences are too long, they will get cut off and not be entirely shown.  To allow viewing of longer sequences, there are colored rectangles that extend the length of the svg.  The rectangles will resize based on how long the sequences are, so if there are more letters in the sequence than pixels in the svg, the rectangles will blend together.  Blue indicates a good match, and red is not matching.  

Technical Additions:
The program compares 3 sequences at a time.  It does this by extending the algorithm for comparing two sequences into three dimensions.  

Biological Additions:
The colored rectangles at the bottom will extend for the length of the svg regardless of how long the sequences are.  This is useful for biology, because lots of protein sequences are longer that the ones used as examples in this program.  With long sequences, it will no longer be possible to see each individual rectangle, but the average color of an area will be an indication of how well the three sequences fit together at that location.  

