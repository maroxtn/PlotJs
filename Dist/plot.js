/*
 *  PlotJs
 *  Abdessalem Boukil 2016
 *  GNU liscence V3
 *  http://abdesaslem.github.io/PlotJs/
 *
 */
 
(function() {

	MATH_EXTENDED={};  //Math function extended
    MATH_EXTENDED.sin  =  Math.sin;
    MATH_EXTENDED.cos  =  Math.cos;
    MATH_EXTENDED.tan  =  Math.tan;
    MATH_EXTENDED.asin =  Math.asin;
    MATH_EXTENDED.acos =  Math.acos;
    MATH_EXTENDED.atan =  Math.atan;
    MATH_EXTENDED.abs  =  Math.abs;
    MATH_EXTENDED.floor=  Math.floor;
    MATH_EXTENDED.ceil =  Math.ceil;
    MATH_EXTENDED.exp  =  Math.exp;
    MATH_EXTENDED.sqrt =  Math.sqrt;
    MATH_EXTENDED.max  =  Math.max;
    MATH_EXTENDED.min  =  Math.min;
    MATH_EXTENDED.sec   = function(x) { return 1/Math.cos(x); }
    MATH_EXTENDED.csc   = function(x) { return 1/Math.sin(x); }
    MATH_EXTENDED.cot   = function(x) { return 1/Math.tan(x); }
    MATH_EXTENDED.asec  = function(x) { return Math.acos(1/x); }
    MATH_EXTENDED.acsc  = function(x) { return Math.asin(1/x); }
    MATH_EXTENDED.acot  = function(x) { return Math.atan(1/x); }
    MATH_EXTENDED.ln    = function(x) { return Math.log(x); }
    MATH_EXTENDED.log   = function(x) { return Math.log(x)/Math.log(10); }
    MATH_EXTENDED.sinh  = function(x) { return (Math.exp(x)-Math.exp(-x))/2; }
    MATH_EXTENDED.cosh  = function(x) { return (Math.exp(x)+Math.exp(-x))/2; }
    MATH_EXTENDED.tanh  = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)); }
    MATH_EXTENDED.asinh = function(x) { return Math.log(x+Math.sqrt(x*x+1)); }
    MATH_EXTENDED.acosh = function(x) { return Math.log(x+Math.sqrt(x*x-1)); }
    MATH_EXTENDED.atanh = function(x) { return 0.5*Math.log((1+x)/(1-x)); }
    MATH_EXTENDED.sech  = function(x) { return 2/(Math.exp(x)+Math.exp(-x)); }
    MATH_EXTENDED.csch  = function(x) { return 2/(Math.exp(x)-Math.exp(-x)); }
    MATH_EXTENDED.coth  = function(x) { return (Math.exp(x)+Math.exp(-x))/(Math.exp(x)-Math.exp(-x)); }
    MATH_EXTENDED.asech = function(x) { return Math.log(1/x+Math.sqrt(1/x/x-1)); }
    MATH_EXTENDED.acsch = function(x) { return Math.log(1/x+Math.sqrt(1/x/x+1)); }
    MATH_EXTENDED.acoth = function(x) { return 0.5*Math.log((1+x)/(1-x)); }

    Number.prototype.round = function(places) {
  		return +(Math.round(this + "e+" + places)  + "e-" + places);
	}

    // Define our constructor
    Plot = function() {

    	var options = [],
    		O = {},
    		rangeX,
    		rangeY,
    		Unit,
    		iteration,
    		functions = [], //The array which containes the function
    		keyUnit;   //The variable which will hold the unit of keyboard navigation

        // Define option defaults
        var defaults = {

            container: '', //Required
            max: 30,    //Integer
            min: -30,	 //Integer
            minWidth: 280, //Integer
            lineUnit: 2, //Integer         
            lines1: true,  //Boolean
            lines2: true,  //Boolean
            strokeThickness: 3, //Integer 
            strokeColor: 'black',  //String
            lineColor1: "#AAAAAA", //String             Thick guidelines 
            lineColor2: "#DDDDDD",  //String             Secondary guidelines
            backgroundColor: 'white', //String
            zoom: true, //Boolean
            navigation: true, //Boolean
            fullScreen: true,  //Boolean
            height: '400px', //String
            width: '400px',  //String
            errorReporting: true, //Boolean
            foregroundColor: '#EEEEEE', //String
            guidelines: true,
            tickThickness: 2, //Integer
            tickColor: 'black', //String
            tickHeight: 16,  //Integer
            keyNavSpeed: 1, //Integer
            fontSize: 10, //Integer (in px)
            dispCallback: function(disp){	return true;	},  //Function, A callback function after a mouse displacement had occured
            zommCallback: function(){	return true;	}  //Function, A callback function after zoom

        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            options = extendDefaults(defaults, arguments[0]);

            if(typeof options.container == 'undefined' || options.container === null ||
               options.container.constructor.toString().indexOf('Div') == -1)  //If this element is instance of canvas html object
            	if(options.errorReporting)	
            		throw new Error("The container is not valid, the container should be an empty div");
            

        }

        var container = options.container;
        container.style.height = parseInt(options.height,10) + 'px';
        container.style.width = parseInt(options.width,10) + 'px';

        if(window.getComputedStyle(container).position != 'absolute')  //If the position is absolute does not change the position to relative
        	container.style.position = 'relative';

        var canvasContainer = document.createElement('div');  //The container of the canvas
        canvasContainer.style.position = 'relative';
        canvasContainer.style.height = '100%';
        canvasContainer.style.width = '100%';
        container.appendChild(canvasContainer);

        var canvas = document.createElement('canvas');  //Create canvas element inside Container Div 
        canvas.setAttribute('height',parseInt(options.height,10) + 'px');  //Set Height and Width
        canvas.setAttribute('width',parseInt(options.width,10) + 'px');
        canvasContainer.appendChild(canvas);  //Append it to the Container of the canvas


        var point = document.createElement('canvas');  //The canvas which will contain the point of the graphical representation of the function
 		point.setAttribute('height',canvas.height);  
 		point.setAttribute('width',canvas.width);   
 		point.style.position = 'absolute';
 		point.style.top = '0px';
 		point.style.left = '0px';
		canvasContainer.appendChild(point);

		var ctxPoint = point.getContext("2d");   //Get the context of it


		var valCont = document.createElement('div');
		valCont.style.height = (parseInt(options.height,10) / 25) + 'px';
		valCont.style.width = (parseInt(options.width,10) / 5) + 'px';
		valCont.style.position = 'absolute';
		valCont.style.bottom = '0px';
		valCont.style.right = '0px';
		valCont.style.border = '1px solid black';
		valCont.style.backgroundColor = 'white';
		container.appendChild(valCont);
		var rand = Math.random(0,999);
		valCont.innerHTML = '<span id="plotjs-valuesX'+ rand +'" style="line-height:'+ (parseInt(options.height,10) / 25) + 'px;position:absolute;left:0;width:50%;height:100%;text-align:center;font-size:12px;">X:&nbsp;&nbsp;</span><span id="plotjs-valuesY'+ rand +'" style="line-height:'+ (parseInt(options.height,10) / 25) + 'px;position:absolute;right:0;width:50%;height:100%; text-align:center;font-size:12px;">Y:&nbsp;&nbsp;</span>';
		var valContX = document.getElementById('plotjs-valuesX' + rand),
			valContY = document.getElementById('plotjs-valuesY' + rand);

        if(options.border)	container.style.border = "2px solid black";   //Add border to the container
        container.style.overflow = "hidden";   //Set the overflow to hidden     
        container.style.backgroundColor = options.foregroundColor;
        contCords = container.getBoundingClientRect();

        // Create global element references
		ctx = canvas.getContext("2d");

		width = canvas.width;
		height = canvas.height;	

		maxX = options.max;
		minX = options.min;
		rangeX = maxX - minX;

		maxY = (height/2/(width/(rangeX)));  //Calculate the maxY and minY according to our maxX and minX and height
		minY = (height/2/(width/(rangeX)))*- 1; 
		rangeY = maxY - minY;

		strokeColor = options.strokeColor;
		lineUnit = options.lineUnit;
		tickHeight = 15;

		calculateVariable();

		thickLinePer = 8;  //Feel free to change it

		//Please do not change this variables
		var start = {},
			clicked = false,  //Keep track if the user had clicked or not
			scale = 1,
			scaleSize = 0.2;

		init(); //Initialize the plane
		canvasContainer.style.cursor = 'grab';

		canvasContainer.addEventListener("mousedown",function(e){

			if(e.which == 1){  //If the left pointer of the mouse is clicked

				canvasContainer.style.cursor = "grabbing";
				start.x = e.screenX;  //Update the start position to the user mouse coordinates
				start.y = e.screenY;
				clicked = true;  

			}

		});

		canvasContainer.addEventListener("mouseup",function(e){

			if(clicked){

				canvasContainer.style.cursor = "grab";   //Change the cursor of the canvas to the initial cursor (grab)
				
				var disp = {};
				disp.x = e.screenX - start.x;
				disp.y = e.screenY - start.y;
				clicked = false;   //Change this variable to false so the mousemove event does not run

				updateTransform(disp,'transform');

			}

		});

		canvasContainer.addEventListener('mousemove',function(e){	

			if(clicked){  //If the user had clicked the mouse
				var disp = {};  
				disp.x = e.screenX - start.x;  //The mouse displacement
				disp.y = e.screenY - start.y;  
				if(!e.ctrlKey)  //If the ctrKey is pressed does not change the top position
					canvasContainer.style.top = disp.y + 'px';  //Add the last position to the displacement
				if(!e.shiftKey)	//If the altKey is pressed does not change the top position
					canvasContainer.style.left = disp.x + 'px';
			}else{

				var cords = normalizeCords({x: e.clientX, y:e.clientY});
				ctxPoint.clearRect(0,0,canvas.width,canvas.height);;

				ctxPoint.save();
				ctxPoint.translate(O.x,O.y);

				for(var i=0;i<functions.length;i++){ 

					fx = functions[i].fn(cords.x);

					ctxPoint.beginPath();
					ctxPoint.fillStyle = functions[Math.abs(functions.length- i) - 1].settings.borderColor;  //Just randomize the color to create some contrast
					ctxPoint.arc(cords.x * Unit, fx*Unit * -1,5,0,Math.PI*2);
					ctxPoint.fill();

					valContX.innerHTML = 'X: ' + (cords.x).toFixed(2);
					valContY.innerHTML = 'Y: ' + fx.toFixed(2);

				}

				ctxPoint.restore();

			}

		});



		canvasContainer.addEventListener("wheel",function(e){  //When the user scroll the mouse wheel

			deltaY = e.deltaY;  //e.deltaY is representing the value of scroll if deltaY is positive this 
			//means that wheel is going down if deltaY is negative the wheel is rolling up . Read more https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY 

			e.preventDefault();  //Prevent the page from scrolling

			scrollTime = 400;  //Time of the zoom animation in milliseconds

			if(Math.abs(deltaY) == deltaY){ //If deltaY is positive or 0  (scroll down) 
				scale = parseFloat(scale) - scaleSize; //Update the scale

				canvasContainer.style.OTransition = '-o-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.webkitTransition = '-webkit-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.MozTransition = '-moz-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.msTransition = '-webkit-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.transition = 'transform '+ (scrollTime/1000) +'s ease';

		        canvasContainer.style.webkitTransform = 'scale('+ (1 - scaleSize) +')';
		        canvasContainer.style.msTransform = 'scale('+ (1 - scaleSize) +')';
		        canvasContainer.style.MozTransform = 'scale('+ (1 - scaleSize) +')';
		        canvasContainer.style.OTransform = 'scale('+ (1 - scaleSize) +')';
		        canvasContainer.style.transform = 'scale('+ (1 - scaleSize)+')';
		        canvasContainer.style.transform = 'scale('+ (1 - scaleSize) +')';

		        setTimeout(function(){  //Remove the transition property after the animation is done

		        	canvasContainer.style.OTransition = '';
		        	canvasContainer.style.webkitTransition = '';
		       		canvasContainer.style.MozTransition = '';
		        	canvasContainer.style.msTransition = '';
		        	canvasContainer.style.transition = '';

		        	var coordinates = {x: e.screenX, y: e.screenY};
					updateTransform(coordinates,'zoom','out');  //Update the transform

		        },scrollTime);

			}else{  //Scroll up

				scale = parseFloat(scale) + scaleSize; //Update the scale

				canvasContainer.style.OTransition = '-o-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.webkitTransition = '-webkit-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.MozTransition = '-moz-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.msTransition = '-webkit-transform '+ (scrollTime/1000) +'s ease';
		        canvasContainer.style.transition = 'transform '+ (scrollTime/1000) +'s ease';

		        canvasContainer.style.transform = 'scale('+ (1 + scaleSize) +')';
		        canvasContainer.style.webkitTransform = 'scale('+ (1 + scaleSize) +')';
		        canvasContainer.style.msTransform = 'scale('+ (1 + scaleSize) +')';
		        canvasContainer.style.MozTransform = 'scale('+ (1 + scaleSize) +')';
		        canvasContainer.style.OTransform = 'scale('+ (1 + scaleSize) +')';
		        canvasContainer.style.transform = 'scale('+ (1 + scaleSize) +')';

		        setTimeout(function(){  //Remove the transition property after the animation is done

		        	canvasContainer.style.OTransition = '';
		        	canvasContainer.style.webkitTransition = '';
		       		canvasContainer.style.MozTransition = '';
		        	canvasContainer.style.msTransition = '';
		        	canvasContainer.style.transition = '';
		
		       		var coordinates = {x: e.screenX, y: e.screenY};
					updateTransform(coordinates,'zoom','in');  //Update the transform


		        },scrollTime);

			}

		});

		document.body.addEventListener("keydown",function(e){

			var key = e.which,disp;

			if(key == 38 || key == 39 || key == 37 || key == 40){

				switch(key){

					case 38:

						e.preventDefault();
						disp = {x:0,y:keyUnit};
						updateTransform(disp,'transform');

					break;

					case 39:

						e.preventDefault();
						disp = {x:keyUnit*-1,y:0};
						updateTransform(disp,'transform');

					break;

					case 37:

						e.preventDefault();
						disp = {x:keyUnit,y:0};
						updateTransform(disp,'transform');

					break;

					case 40:

						e.preventDefault();
						disp = {x:0,y:keyUnit * -1};
						updateTransform(disp,'transform');

					break;0
				
				}

			}

		});

		function init(){  //Initialize the plane (Private)
			
			ctx.clearRect(0,0,canvas.width,canvas.height); //Clear the canvas
			ctx.beginPath();
			ctx.fillStyle = options.backgroundColor;  //Fill it with the color given by user
			ctx.fillRect(0,0,canvas.width,canvas.height);

			ctx.beginPath();      //Draw the Y axes
			ctx.moveTo(O.x,0);
			ctx.lineTo(O.x,height);
			ctx.lineWidth = options.strokeThickness;
			ctx.stroke();

			ctx.beginPath();      //Draw the X axes
			ctx.moveTo(0,O.y); 
			ctx.lineTo(width,O.y); 
			ctx.lineWidth = options.strokeThickness;
			ctx.stroke();

			ctx.save();  //Save the the transformation of the plane
			ctx.translate(O.x,O.y);  //Before translating it to the center

			tickHeight = options.tickHeight;
			tickFontSize = options.fontSize;

			var step = rangeX/20,
				tenFactor = getTenFactor(step);  

			step = Math.round(step * tenFactor)/tenFactor; 
			keyUnit = step*Unit*options.keyNavSpeed;

			for(var i=step * -1;i>minX && options.guidelines;i -= step){   //Draw the negative side ticks and guide lines
 						      //^ Only draw them when options.guidelines is true 

				tickPos = i*Unit;  //Calculate the position of the 

				if(i%thickLinePer == 0 && options.lines2){   //This line draw a thicker line every `thickLinePer`(integer)
					ctx.beginPath();     
					ctx.moveTo(tickPos,O.y * -1);  //Move to the top of the plane
					ctx.lineTo(tickPos,height - O.y);  //Draw line to the bottom
					ctx.lineWidth = options.strokeThickness;
					ctx.strokeStyle = options.lineColor1;
					ctx.stroke();
				}
				else if(options.lines2){  //Draw a lighter line as a secondary guideline less visible
					ctx.beginPath();     
					ctx.moveTo(tickPos,O.y * -1);
					ctx.lineTo(tickPos,height - O.y);
					ctx.lineWidth = 1;
					ctx.strokeStyle = options.lineColor2;
					ctx.stroke();
				}

				ctx.beginPath();  //Draw the tick
				ctx.moveTo(tickPos,tickHeight/2 * -1);
				ctx.lineTo(tickPos,tickHeight/2);
				ctx.lineWidth = options.tickThickness;
				ctx.strokeStyle = options.tickColor;
				ctx.stroke();

				var text = Math.round(i*tenFactor)/tenFactor;
				ctx.font = 	tickFontSize + "px Lucida Sans Unicode";  //Draw the text
				ctx.fillStyle = "black";
				ctx.fillText(text,tickPos-tickFontSize/2,-10);   //Shif the X position of the text by the half of the font size so it's mor readable

			}

			for(var i=step;i<rangeX+minX && options.guidelines;i += step){   //Redraw it again for the positif side

				tickPos = i*Unit;

				if(i%thickLinePer == 0){
					ctx.beginPath();     
					ctx.moveTo(tickPos,O.y * -1);
					ctx.lineTo(tickPos,height - O.y);
					ctx.lineWidth = options.strokeThickness;
					ctx.strokeStyle = options.lineColor1;
					ctx.stroke();
				}
				else{
					ctx.beginPath();     
					ctx.moveTo(tickPos,O.y * -1);
					ctx.lineTo(tickPos,height - O.y);
					ctx.lineWidth = 1;
					ctx.strokeStyle = options.lineColor2;
					ctx.stroke();
				}


				ctx.beginPath();
				ctx.moveTo(tickPos,tickHeight/2 * -1);
				ctx.lineTo(tickPos,tickHeight/2);
				ctx.lineWidth = options.tickThickness;
				ctx.strokeStyle = options.tickColor;
				ctx.stroke();

				var text = Math.round(i*tenFactor)/tenFactor;
				ctx.font = 	tickFontSize + "px Lucida Sans Unicode";
				ctx.fillStyle = "black";
				ctx.fillText(text,tickPos-tickFontSize/2,-10);

			}


			for(var i=step * -1;i>minY && options.guidelines;i -= step){  

				tickPos = i*Unit; 

				if(i%thickLinePer == 0 && options.lines2){   
					ctx.beginPath();     
					ctx.moveTo(O.x * -1,tickPos); 
					ctx.lineTo(width - O.x,tickPos);  
					ctx.lineWidth = options.strokeThickness;
					ctx.strokeStyle = options.lineColor1;
					ctx.stroke();
				}
				else if(options.lines2){
					ctx.beginPath();     
					ctx.moveTo(O.x * -1,tickPos);  
					ctx.lineTo(width - O.x,tickPos);  
					ctx.lineWidth = 1;
					ctx.strokeStyle = options.lineColor2;
					ctx.stroke();
				}


				ctx.beginPath(); 
				ctx.moveTo(tickHeight/2 * -1,tickPos);
				ctx.lineTo(tickHeight/2,tickPos);
				ctx.lineWidth = options.tickThickness;
				ctx.strokeStyle = options.tickColor;
				ctx.stroke();

				var text = Math.round(i*tenFactor)/tenFactor;
				ctx.font = 	tickFontSize + "px Lucida Sans Unicode";  
				ctx.fillStyle = "black";
				ctx.fillText(text * -1,-30,tickPos-tickFontSize/2);   //Invert the I 

			}


			for(var i=step;i<rangeY+minY && options.guidelines;i += step){  

				tickPos = i*Unit; 

				if(i%thickLinePer == 0 && options.lines2){   
					ctx.beginPath();     
					ctx.moveTo(O.x * -1,tickPos); 
					ctx.lineTo(width - O.x,tickPos);  
					ctx.lineWidth = options.strokeThickness;
					ctx.strokeStyle = options.lineColor1;
					ctx.stroke();
				}
				else if(options.lines2){
					ctx.beginPath();     
					ctx.moveTo(O.x * -1,tickPos);  
					ctx.lineTo(width - O.x,tickPos);  
					ctx.lineWidth = 1;
					ctx.strokeStyle = options.lineColor2;
					ctx.stroke();
				}


				ctx.beginPath(); 
				ctx.moveTo(tickHeight/2 * -1,tickPos);
				ctx.lineTo(tickHeight/2,tickPos);
				ctx.lineWidth = options.tickThickness;
				ctx.strokeStyle = options.tickColor;
				ctx.stroke();

				var text = Math.round(i*tenFactor)/tenFactor;
				ctx.font = 	tickFontSize + "px Lucida Sans Unicode";  
				ctx.fillStyle = "black";
				ctx.fillText(text * -1,-30,tickPos-tickFontSize/2);    //Invert the i

			} 


			ctx.restore();  //Restore the transformation

		}

		function updateTransform(){  //Update the appearance

			var args = Array.prototype.slice.call(arguments);  //Get the function arguments. Read more: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments

			//Reset the transform options
			canvasContainer.style.transform = '';
			canvasContainer.style.left = '0px';
			canvasContainer.style.top = '0px';

			if(typeof args[0] === 'object' && args[1] == 'transform'){  //Handle mouse displacement

				var disp = args[0]; 
				options.dispCallback(disp);  //Call the callback function defined by user

				if(disp.x == 0 && disp.y == 0) return; //No displacement 

				xUnits = disp.x/Unit * -1;  //Get how much I are increased in this displacement in the X axes
				yUnits = disp.y/Unit * -1;  //Get how much J are increased in this displacement in the Y axes

				minX += xUnits;  //Add them to the current minX
				maxX += xUnits;
				minY += yUnits;  //Add them to the current minY
				maxY += yUnits;

				calculateVariable();  //Recalculate our variables

				init(); //Init the plot again

				for(var j = 0;j<functions.length;j++)  //Plot all the functions after any transform
					drawPlot(functions[j].fn,functions[j].settings);

			}

			else if(typeof args[0] === 'object' && args[1] == 'zoom' && typeof args[2] == 'string'){  //Zoom displacement

				var type = args[2],
					factor = 0;

				if(type == 'in') factor = -1;
				else if(type == 'out') factor = 1;

				minX = Math.abs((scaleSize+factor)) * minX; 
				maxX = Math.abs((scaleSize+factor)) * maxX;
				minY = Math.abs((scaleSize+factor)) * minY;
				maxY = Math.abs((scaleSize+factor)) * maxY;

				rangeX = maxX - minX;
				rangeY = maxY - minY;

				calculateVariable();  //Recalculate our variables

				init(); //Init the plot again

				for(var j = 0;j<functions.length;j++)  //Plot all the functions after any transform
					drawPlot(functions[j].fn,functions[j].settings);

			}

		}


		function calculateVariable(){

 			O.y = (minY / rangeY * height) * -1; //(O,I,J)
		    O.x = (minX / rangeX * width) * -1; 

			Unit = width/rangeX;  //Unit of the plane in pixel ( unit for the x axes) 
			iteration = rangeX / 2000;	

		}

		function normalizeCords(point){

			var newCords = {
				x: (((point.x - contCords.x)/Unit) + minX),
				y: (((point.y - contCords.y)/Unit) + minY)
			}

			return newCords;

		}

		function getTenFactor(x){

			for(var i=0;;i++){
				if(x > 1) return Math.pow(10,i);
				x*=10;
			}

		}

		Plot.prototype.plot = function(fn){  //Plot a new function take fn as a parameter
											 //Fn Should be eiher a string of the function
											 //Or and Object with the parameters of the plot

			var id = Math.round(Date.now() * Math.random(0,10000));   //Generate a random number for the id of the plot of function

			var plotDefault = {  //Default value of the settings of the function plot

				borderColor: 'green', //String
				borderThickness: 3,  //Integer
				equation: (typeof fn.equation === 'function') ? function(){ return; } : '',  //Depends on the type of the equation variable
					//So it is either a function or string
				resolution: iteration //Better to not change it  
					//Resolution is the step of the graph between calculating two points
					//The smaller the number the better the graph is and slower (Default value is always reccomended)


			};

			if(typeof fn == 'function'){  //If the user had not set any settings to the function
				
				functions.push({  //Push the array of the function

					id: id,   //Function Identifier which is a totally random number used to index the function
					fn: fn,   //The function
					settings: plotDefault  //Use the default settings

				});

				drawPlot(fn,plotDefault);  //Draw the function

			}

			else if(typeof fn === 'string'){  //If the user had not set any settings to the function and entered it as a string

				var func = new Equation(fn);  //Parse The Equation
					func = func.getFunction(); //Get the function from the equation 

				functions.push({  //Push !

					id: id,  
					fn: func,
					settings: plotDefault

				});

				drawPlot(func,plotDefault);  //Draw the function

			}

			else if(typeof fn == 'object' && typeof fn.equation !== 'undefined'){  //If the user had used settings for his function
																				   //And HAD SET THE EQUATION

				var plotOptions = extendDefaults(plotDefault, fn);  //Update the settings

				if(typeof plotOptions.equation === 'function'){  //If the user input function is a function

					functions.push({

						id: id,  
						fn: plotOptions.equation,
						settings: plotOptions

					});

					drawPlot(plotOptions.equation,plotOptions);  //Draw the function

				}else if(typeof plotOptions.equation === 'string'){  //If the user input function is a string

					var func = new Equation(plotOptions.equation);  //Parse The Equation
						func = func.getFunction(); //Get the function of the equation 

					functions.push({  //Push !

						id: id,  
						fn: func,
						settings: plotDefault

					});

					drawPlot(func,plotDefault);  //Draw the function

				}else throw new Error("Bad parameters to Plot method"); //If the user had entered bad parameters


			}
			else throw new Error("Bad parameters to Plot method"); //If the user had entered bad parameters

			return {id: id};

		}

		function drawPlot(fn,settings){ //Draw a equation

			ctx.save(); //Save the plane
			ctx.translate(O.x,O.y); //Translate to the center of the plane
			ctx.beginPath();

			var first = true,  //First is the variable that will keep track if this iteration of the loop
			 					//Is the first one or not 
			 	k = 0;

			for(var i=minX;i< (width-O.x)/Unit ;i+=settings.resolution){ 

				var x = i*Unit, //Get the coordinates of the x point
					y = fn(i) * Unit * -1; // Point(x,f(x))  it is multiplied by -1 because the coordinates system in Y axes in inverted

				if(y-1500 < rangeY && y+1500 > -1500){ //Just an optimization to the performance of the drawing

					if((fn(i) - k) < rangeY/2){ 

		 				if(!first)
							ctx.lineTo(x,y);  //Draw the line
						else{	//If this is the first one move to the initial point 
							first = false;
							ctx.moveTo(x,y);
						}

					}else{

						first = true;

					}

					k = fn(i);

				}
				
			}

			ctx.lineWidth = settings.borderThickness;
			ctx.strokeStyle = settings.borderColor;
			ctx.stroke();

			ctx.restore();  //Restore the old transformation

		}


		Plot.prototype.destroyFunction = function(funId){  //Remove Function from the plane

			if(typeof funId === 'undefined' || typeof funId.id === 'undefined') //Check parameters
				throw new Error("Bad parameters to destoryFunction");

			for(var i = 0; i<functions.length;i++){  //Iterate through all the function and check which one this is

				if(functions[i].id == funId.id){  //If this is the intended functions

					functions.splice(i,1);  //Remove this index
					init();

					for(var j = 0;j<functions.length;j++)  //Plot all the functions after remove the specific function
						drawPlot(functions[j].fn,functions[j].settings);

					return true;  //Success

				}

			}

			return false;  //False if the function is not found

		}

		Plot.prototype.clear = function(){  //Clear the plane

			functions = []; //Empty the functions array
			init();
			return true;

		}

		Plot.prototype.destroy = function(){ //Destroy the plane

			container.remove();
			return true;

		}

    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {

        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;

    }



    // Define our constructor
    Equation = function(equation) {

        if (!equation)
            throw('You Have To Write An Equation');

        var parseEquationFixFunctions = function(v) {  //Fix the functions names like cos and sin

            for (var i = 0; i < v.length; i++) //Iterate Through The Array
                if (parseEquationIsArray(v[i]))  //If v[i] is array  In another word if there is a parenthesis opened
                    parseEquationFixFunctions(v[i]);   //Run the function again


            for (var i = 0; i < v.length; i++) {

                if (MATH_EXTENDED[v[i]] != undefined) { //If the function is valid

                    v[i] = 'MATH_EXTENDED.' + v[i].toLowerCase();   //Replace the function with the MATH_EXTENDED.cos() 
                    v.splice(i, 2, new Array('(', v[i], v[i + 1], ')'));
                    i--;

                }

            }

            return v;
        }

        var parseEquationIsArray = function(v) { //Check if v is an array or not 
            if (v == null) {
                return 0;
            }
            if (v.constructor.toString().indexOf("Array") == -1)
                return false;
            return true;
        }

        var parseEquationJoinArray = function(v) {  //Join The Tokens Array Together
            var t = "";
            for (var i = 0; i < v.length; i++) {

                if (parseEquationIsArray(v[i]))
                    t += parseEquationJoinArray(v[i]);
                else
                    t += v[i];


            }
            return t;
        }

        var parseEquationHasElement = function(v,e) { //Check if the array v contain the string e in it

            for(var i=0;i<v.length;i++)
                if(v[i]==e)
                    return true;

            return false;

        }

        var parseEquationFixPowers = function(v) {  //Replace x^3 power operator with javascript readable code Math.pow(x,3)

             for (i = 0; i < v.length; i++) //Iterate Through The Array
                 if (parseEquationIsArray(v[i])) //If v[i] is array  In another word if there is a parenthesis opened
                    parseEquationFixPowers(v[i]);  //Run the function again


             for (var i = 0; i < v.length; i++) {

                 if (v[i] == '^') { //If this a power operator

                     v.splice(i - 1, 3, new Array('Math.pow', new Array('(', v[i - 1], ',', v[i + 1], ')')));
                     i -= 2;

                 }

             }
             return v;

        }

        var decopmoseEquation = function(tokens){       //This block of code turn any parentheses to an array inside the tokens array

            var pstart = -1,v;

            //This block of code turn any parentheses to an array inside the tokens array
            while (parseEquationHasElement(tokens, '(') || parseEquationHasElement(tokens, ')')) {  //While there is parentheses

                pstart = -1;
                for (i = 0; i < tokens.length; i++) {

                    if (tokens[i] == '(') pstart = i; //If you find ( store its index

                    if (tokens[i] == ')' && pstart == -1) {  //If there is an unmatched )
                        throw("Unmatched right parenthesis )");
                    }

                    if (tokens[i] == ')' && pstart != -1) { //If this is the end of parentheses

                        //Replace the parentheses with an array containing what the parentheses contain
                        tokens.splice(pstart, i - pstart + 1, tokens.slice(pstart, i + 1));  //i - pstart + 1 is the length of the string between the parentheses 
                        //The start of ( p^                            ^ An array containing the array of the tokens inside the parentheses      

                        i = -1;   //Reset i and pstart so we search for more parentheses
                        pstart = -1;

                    }

                }

                if (pstart != -1)   //Just checking for any other syntax errors
                    throw("Unmatched left parenthesis (");


            }

            return tokens;

        }


        var parseEquation = function(eq, vars) {

            var jeq = null,
                tokens,
                e, i,
                pstart = -1,
                pend;

            //Sanitize and reformat the string to a proper javascript function
            e = eq.replace(/ /g, ""); //Remove White Spaces From The Equation
            e = e.replace(/([0-9])([x])/ig, "$1*$2"); //For example 4x*5 => 4*x*5

            e = e.replace(/(\))([x]|\()/ig, "$1*$2"); //Reg exp matches )x  And replace it with )*x OR )( And replace it with )*(
            //For example 4x*5*(4*x)x-3 => 4x*5*(4*x)*x-3

            e = e.replace(/([0-9x])(\()/ig, "$1*$2"); //Reg exp x( And replace it x*(
            //For example x(4*x) => x*(4*x)

            //In this three line add spaces between operators
            e = e.replace(/([a-z0-9\.])([^a-z0-9\.])/ig, "$1 $2");
            e = e.replace(/([^a-z0-9\.])([a-z0-9\.])/ig, "$1 $2");
            e = e.replace(/(\-|\)|\()/g, " $1 ");

            tokens = decopmoseEquation(e.split(/ +/)); //Now split them into an array and decompose them
            

            tokens = parseEquationFixFunctions(tokens);  //Replacing the math function with MATH_EXTENDED function
            if (tokens == null) { //If there is any error returned return false
                return false;
            }
            tokens = parseEquationFixPowers(tokens);  //Fix the powers in the equations
            if (tokens == null) {
                return null;
            }

            return parseEquationJoinArray(tokens);
        }


        Equation.prototype.getFunction = function(){
            this.eqFunction = new Function('x','return ' + this.equation);
            return this.eqFunction;
        }

        this.oldEquation = equation;
        this.equation = parseEquation(equation); 
        return this;

    }

}());
