function http() {
    var xhr = false;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest;
    }
    else {
        // For old versions Internet explorers
        try {
            if (window.ActiveXObject) {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
        }
        catch (e) {
        }
    }
    return xhr;
}

function readFile(file) {
    return new Promise(function (resolve, reject) {
        var fileHttpRequest = http();
        if (fileHttpRequest) {
            fileHttpRequest.onreadystatechange = function () {
                if (fileHttpRequest.readyState === 4) {
                    if (fileHttpRequest.status === 200 || fileHttpRequest.status === 0) {
                        resolve(fileHttpRequest.responseText.split('\n'));
                    }
                    else {
                        reject(Error("It broke"));
                    }
                }
            };
            fileHttpRequest.open("GET", file, "true");
            fileHttpRequest.send(null);
        }
    });
}

function isATriangle(sides) {
    /* Using the theorem; a + b > c; a + c > b; b + c > a */
    sides = sides.map(Number);
    var a = sides[0], b = sides[1], c = sides[2];
    // Check if it has 3 sides and proves the theorem a + b > c; a + c > b; b + c > a
    return (sides.length === 3) && (a + b) > c && (a + c) > b && (b + c) > a;
}

function isASquare(sides) {
    // Check if it has 4 sides and all sides are equal
    return (sides.length === 4) && sides.reduce(function (a, b) {
        return (a === b) ? a : false;
    });
}

function isARectangle(sides) {
    sides = sides.map(Number);
    var a = sides[0], b = sides[1], c = sides[2], d = sides[3];

    // Set initial values for the distinct sides that is length & breath
    var distinct_side_a = a;
    var distinct_side_b = 0;

    // loop through to get the other unique side
    sides.forEach(function (side) {
        if (side !== a) {
            distinct_side_b = side;
        }
    });

    // return true if it has 4 sides and a pair of the distinct side
    return (sides.length === 4) && sides.filter(function (side) {
        return side === distinct_side_a;
    }).length === 2 && sides.filter(function (side) {
        return side === distinct_side_b;
    }).length === 2;
}

readFile("polygon.txt").then(function (response) {
    var triangles = [], squares = [], rectangles = [], everythingElse = [];
    response.forEach(function (polygon) {
        var sides = polygon.split(",");
        // Ensure that the count of sides is equals to or greater than 3 to be regarded as a polygon
        if (sides.length >= 3) {
            if (sides.length === 3) {
                if (isATriangle(sides)) {
                    triangles.push.apply(triangles, sides);
                }
            }
            else if (sides.length === 4) {
                // Check if it is a square
                if (isASquare(sides)) {
                    squares.push.apply(squares, sides);
                }
                // Check if it is a rectangle
                else if (isARectangle(sides)) {
                    rectangles.push.apply(rectangles, sides);
                    // Everything else
                } else {
                    everythingElse.push.apply(everythingElse, sides);
                }
            }
            else {
                everythingElse.push.apply(everythingElse, sides);
            }
        }
        else {
            console.error("Invalid Number of side to be regarded as a polygon");
        }
    });
    document.writeln("Triangles: " + JSON.stringify(triangles));
    document.writeln("<br>");
    document.writeln("Squares: " + JSON.stringify(squares));
    document.writeln("<br>");
    document.writeln("Rectangles: " + JSON.stringify(rectangles));
    document.writeln("<br>");
    document.writeln("Everything Else: " + JSON.stringify(everythingElse));
    document.writeln("<br><br>");

    // The union of all four subsets
    var union = [];

    // Push all mutually exclusive subsets into the union
    union.push(triangles);
    union.push(rectangles);
    union.push(squares);
    union.push(everythingElse);
    document.writeln("Union of all: " + JSON.stringify(union));

}, function (error) {
    console.error(error);
});
