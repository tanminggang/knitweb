var rect, startX, startY, endX, endY;
var startPixelX, startPixelY, endPixelX, endPixelY, pixelWidth, pixelHeight, prevPixelX, prevPixelY;
var temp, testX, testY;
var imgAvgData = [];

//getting canvas position for select tool
layoutCanvas.onmousedown = function (e) {
    var mousemove = false;
    var count = 0;
    list = [];
    rect = pixelCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    layoutCtx.clearRect(0, 0, 1000, 1000);

    prevPixelX = Math.floor(startX / 10) * 10;
    prevPixelY = Math.floor(startY / 10) * 10;

    //handling mouse dragging event for drawing tool
    document.onmousemove = function (e) {
        mousemove = true;
        endX = e.clientX - rect.left;
        endY = e.clientY - rect.top;
        startPixelX = Math.floor(startX / 10) * 10;
        startPixelY = Math.floor(startY / 10) * 10;
        endPixelX = Math.floor(endX / 10) * 10;
        endPixelY = Math.floor(endY / 10) * 10;

        pixelWidth = startPixelX - endPixelX;
        pixelHeight = startPixelY - endPixelY;

        if (pixelHeight < 0)pixelHeight = -pixelHeight;
        if (pixelWidth < 0)pixelWidth = -pixelWidth;

        //using of free hand tool
        if (!isFreeHand) {
            layoutCtx.clearRect(0, 0, 1000, 1000);
            layoutCtx.strokeStyle = "rgba(255,0,0,255)";
            layoutCtx.lineWidth = 1;
            layoutCtx.strokeRect(startPixelX, startPixelY, pixelWidth, pixelHeight);
        }

        //start from here

        if (isFreeHand) {
            layoutCtx.beginPath();

            if (temp != (prevPixelX + "," + prevPixelY)) {
                temp = prevPixelX + "," + prevPixelY;
            }
            layoutCtx.moveTo(prevPixelX, prevPixelY);
            layoutCtx.lineTo(prevPixelX, prevPixelY);

            imageDataArr[prevPixelX / 10][prevPixelY / 10] = true;

            if (prevPixelX != endPixelX && prevPixelY != endPixelY) {

                if (temp != (endPixelX + "," + prevPixelY)) {
                    list[count++] = temp;
                    temp = endPixelX + "," + prevPixelY;

                }
                layoutCtx.lineTo(endPixelX, prevPixelY);
                imageDataArr[endPixelX / 10][prevPixelY / 10] = true;
            }


            if (temp != (endPixelX + "," + endPixelY)) {
                list[count++] = temp;
                temp = endPixelX + "," + endPixelY;
            }
            layoutCtx.lineTo(endPixelX, endPixelY);
            imageDataArr[endPixelX / 10][endPixelY / 10] = true;

            layoutCtx.strokeStyle = "rgba(255,0,0,255)";
            layoutCtx.stroke();

            prevPixelX = endPixelX;
            prevPixelY = endPixelY;
        }

    };

    document.onmouseup = function () {
        document.onmousemove = null;
        startPixelX = Math.floor(startX / 10) * 10;
        startPixelY = Math.floor(startY / 10) * 10;
        endPixelX = Math.floor(endX / 10) * 10;
        endPixelY = Math.floor(endY / 10) * 10;

        pixelWidth = startPixelX - endPixelX;
        pixelHeight = startPixelY - endPixelY;

        if (pixelHeight < 0)pixelHeight = -pixelHeight;
        if (pixelWidth < 0)pixelWidth = -pixelWidth;

        if (mousemove && !isFreeHand) {
            layoutCtx.strokeStyle = "rgba(255,0,0,255)";
            layoutCtx.lineWidth = 1;
            testX = startPixelX;
            testY = startPixelY;
            layoutCtx.strokeRect(startPixelX, startPixelY, pixelWidth, pixelHeight);
        }
        //     pixelCtx.clearRect(startPixelX,startPixelY,pixelWidth,pixelHeight);
    }
};

function colourChange() {
    var style = document.getElementsByClassName('colpick_new_color')[0].style.backgroundColor;

//    getColorBounds();

    if (isFreeHand) {
        pixelCtx.beginPath();
        for (var i = 0; i < list.length; i++) {
            var tempArr = [];
            tempArr = list[i].split(",");
            if (i == 0) {
                pixelCtx.moveTo(tempArr[0], tempArr[1]);
            }
            pixelCtx.lineTo(tempArr[0], tempArr[1]);
        }
        pixelCtx.closePath();
        pixelCtx.fillStyle = style;
        pixelCtx.fill();

        for (var i = 0; i < 1000; i += 10) {
            for (var j = 0; j < 1000; j += 10) {
                pixelCtx.strokeStyle = "0,0,0,255";
                pixelCtx.lineWidth = 0.01;
                pixelCtx.strokeRect(i, j, 10, 10);
            }
        }

    }

    else if (!isFreeHand) {
        for (var i = startPixelX; i < startPixelX + pixelWidth; i += 10) {
            for (var j = startPixelY; j < startPixelY + pixelHeight; j += 10) {
                pixelCtx.clearRect(i, j, 10, 10);
                pixelCtx.fillStyle = style;
                pixelCtx.lineWidth = 0.2;
                pixelCtx.strokeRect(i, j, 10, 10);
                pixelCtx.fillRect(i, j, 10, 10);
            }
        }
    }

    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            if (imageArr[i][j]) {
                pixelCtx.clearRect(i * 10, j * 10, 10, 10);
                pixelCtx.fillStyle = style;
                pixelCtx.lineWidth = 0.2;
                pixelCtx.strokeRect(i * 10, j * 10, 10, 10);
                pixelCtx.fillRect(i * 10, j * 10, 10, 10);
            }
        }
    }
}

var data;
function getColorBounds() {

    var height = pixelCanvas.height;
    var width = pixelCanvas.width;

    var count = 0;
    var imgData = pixelCtx.getImageData(0, 0, pixelCanvas.width, pixelCanvas.height);
    data = imgData.data;
    console.log("height: " + height + " width: " + width + " " + data.length);
    var check = 0;

    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            var pos = 4000 * 10 * i + (4000 * 4) + 4 * 4 + 10 * j * 4;
            //      console.log(pos);
            //      console.log(data[pos]+" , "+data[pos+1]+" , "+data[pos+2]+" , "+data[pos+3]);
            imgAvgData[100 * i + j] = (data[pos] +","+ data[pos + 1] +","+ data[pos + 2]) ;
            //pixelCtx.fillStyle = 'rgba(' +
            //    data[pos] + ',' + data[pos+1] + ',' +
            //    data[pos+2] + ',255' +
            //    ')';
        }
    }

}
var marker = [];

function checkBounds() {
    getColorBounds();

    var collection = [];
    var colourList = [];
    var startGridPosX = startPixelX / 10;
    var startGridPosY = startPixelY / 10;
    var endGridPosX = (startPixelX + pixelWidth) / 10;
    var endGridPosY = (startPixelY + pixelHeight) / 10;

    //traverse grid through selected region
    for (var i = startGridPosY; i < endGridPosY; i++) {
        for (var j = startGridPosX; j < endGridPosX; j++) {

            var tempVal = imgAvgData[100*i+j];
            var check = $.inArray(tempVal, colourList);

            if(check!== -1){
                colourList.push(tempVal);
            }

            var innerCheck=-1;
            var kVal=-1, pos=-1;
            for(var k=0;k < collection.length; k++){
                var tempArray = collection[k];
                innerCheck = $.inArray(100*i+j, tempArray);
                if(innerCheck>-1){
                    kVal = k;
                    pos = innerCheck;
                    break;
                }
            }

            if(innerCheck == -1){
                var newArr = [];
                newArr[0] = tempVal;
                newArr.push(100*i+j);
                collection.push(newArr);
                kVal = collection.length-1;
                pos = 0;
            }

            //setting homogeneous neighbouring colour grid positions
            var arr = collection[kVal];
            if((j-1)>=startGridPosX && imgAvgData[100*i+j-1]===tempVal){
                arr.push(100*i+j-1);
            }
            if((j+1)<endGridPosX && imgAvgData[100*i+j+1]===tempVal){
                arr.push(100*i+j+1);
            }
            if((j-1)>=startGridPosX && (i-1)>=startGridPosY && imgAvgData[100*(i-1)+j-1]===tempVal){
                arr.push(100*(i-1)+j-1);
            }
            if((i-1)>=startGridPosY && imgAvgData[100*(i-1)+j]===tempVal){
                arr.push(100*(i-1)+j);
            }
            if((i-1)>=startGridPosY && (j+1)<endGridPosX && imgAvgData[100*(i-1)+j+1]===tempVal){
                arr.push(100*(i-1)+j+1);
            }
            if((j-1)>=startGridPosX && (i+1)<endGridPosY && imgAvgData[100*(i+1)+j-1]===tempVal){
                arr.push(100*(i+1)+j-1);
            }
            if((i+1)<endGridPosY && imgAvgData[100*(i+1)+j]===tempVal){
                arr.push(100*(i+1)+j);
            }
            if((i+1)<endGridPosY && (j+1)<endGridPosX && imgAvgData[100*(i+1)+j+1]===tempVal){
                arr.push(100*(i+1)+j+1);
            }

        }
    }

    for (var i = 0; i < collection.length; i++) {
        var tempArray = collection[i].sort();
        var resultString="colour value:"+tempArray[0]+" :";
        for(var j = 1; j < tempArray.length;j++){
            resultString+=","+tempArray[j];
        }
        console.log(resultString);
    }
}

function undo() {
    var pixelCount = 0;
    var pixelDistX = 10;
    var pixelDistY = 10;

    //clearing the canvas before draw
    pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    console.log(rdArr.length + " " + pixelCanvas.width);

    //redrawing the image data in the canvas to get pixelated pattern
    for (var i = 0; i < pixelCanvas.width; i += pixelDistX) {
        for (var j = 0; j < pixelCanvas.height; j += pixelDistY) {
            pixelCtx.fillStyle = 'rgba(' +
                rdArr[pixelCount] + ',' + gArr[pixelCount] + ',' +
                bArr[pixelCount] + ',255' +
                ')';

            pixelCtx.lineWidth = 0.01;
            pixelCtx.strokeRect(i, j, pixelDistX, pixelDistY);
            pixelCtx.fillRect(i, j, pixelDistX, pixelDistY);
            pixelCount++;
        }
    }
}