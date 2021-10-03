window.addEventListener("load", () => {
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	const clear = document.querySelector(".clear");

	//cursor
	const cursor = document.querySelector(".pen");
	window.addEventListener("mousemove", (e) => {
		cursor.style.top = e.pageY + "px";
		cursor.style.left = e.pageX + "px";
		cursor.style.backgroundColor = ctx.strokeStyle;
	});

	//undo
	let restore_array = [];
	let index = -1;
	const undo = document.querySelector(".undo");

	//font_size
	const slider = document.querySelector(".slider");
	const rangeValue = document.querySelector(".rangeValue");

	let font_size = slider.value / 100;
	rangeValue.innerText = font_size.toFixed(1);

	slider.addEventListener("input", () => {
		font_size = slider.value / 100;
		rangeValue.innerText = font_size.toFixed(1);
	});

	// color
	const btn = document.querySelector(".colors");
	const color = document.querySelector(".color-range");
	btn.addEventListener("click", (e) => {
		ctx.strokeStyle = e.target.value;
	});
	color.addEventListener("input", (e) => {
		ctx.strokeStyle = e.target.value;
	});

	//Resizing
	canvas.height = window.innerHeight * 0.85;
	canvas.width = window.innerWidth * 0.985;

	// ctx.strokeStyle = "red";
	// ctx.lineWidth = 2;
	//                 x    y  width height
	// ctx.strokeRect(100, 100, 200, 500);
	// ctx.strokeStyle = "blue";
	// ctx.strokeRect(200, 200, 200, 500);

	// ctx.beginPath();
	// ctx.moveTo(100, 100);
	// ctx.lineTo(200, 100);
	// ctx.lineTo(200, 150);
	// ctx.closePath();
	// ctx.stroke();

	// variables

	let painting = false;

	function startPosition(e) {
		painting = true;
		draw(e);
	}

	function finishedPosition() {
		if (painting) storeHistory();
		painting = false;
		ctx.beginPath();
	}

	function draw(e) {
		e.preventDefault();
		if (!painting) return;
		ctx.lineWidth = font_size;
		ctx.lineCap = "round";
		ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
	}

	function storeHistory() {
		if (Event.type != "mouseout" && painting) {
			restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
			index += 1;
		}
		// console.log(restore_array);
	}

	function undo_last() {
		if (index > 0) {
			index -= 1;
			restore_array.pop();
			ctx.putImageData(restore_array[index], 0, 0);
		} else {
			clear_canvas();
		}
	}

	function clear_canvas() {
		ctx.strokeStyle = "black";
		ctx.fillStyle = "white";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		restore_array = [];
		index = -1;
	}

	// Event listeners

	canvas.addEventListener("mousedown", startPosition);
	canvas.addEventListener("mouseup", finishedPosition);
	canvas.addEventListener("mouseout", finishedPosition);
	canvas.addEventListener("mousemove", draw);
	undo.addEventListener("mousedown", undo_last);
	clear.addEventListener("mousedown", clear_canvas);
});
