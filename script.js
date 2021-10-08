window.addEventListener("load", () => {
	const canvas = document.querySelector("canvas");
	const canvasDiv = document.querySelector("canvas-div");
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
	slider.addEventListener("touchmove", () => {
		font_size = slider.value / 100;
		rangeValue.innerText = font_size.toFixed(1);
	});

	// color
	const btn = document.querySelector(".colors");
	const color = document.querySelector(".color-range");
	btn.addEventListener("click", (e) => {
		ctx.strokeStyle = e.target.value;
	});
	btn.addEventListener("touchstart", (e) => {
		ctx.strokeStyle = e.target.value;
	});
	color.addEventListener("input", (e) => {
		ctx.strokeStyle = e.target.value;
	});
	color.addEventListener("touchstart", (e) => {
		ctx.strokeStyle = e.target.value;
	});

	//Resizing
	// canvas.height = window.innerHeight * 0.85;
	// canvas.width = window.innerWidth * 0.985;
	canvas.height = 650;
	canvas.width = 1500;

	const tick = document.querySelector(".adjust");

	tick.addEventListener("click", () => {
		const h = document.querySelector(".H").value;
		const w = document.querySelector(".W").value;

		if (h > 10000 || w > 10000) {
			alert("Size is too big");
			return;
		}
		if (h < 100 || w < 100) {
			alert("Size is too small");
			return;
		}
		canvas.height = h;
		canvas.width = w;
	});
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

	function tstartPosition(e) {
		if (e.target.length == 2 && ev.targetTouches.length == 2) {
			canvas.classList.toggle("move");
			toolbar.style.backgroundColor = "red";
		}
		cursor.style.opacity = 0;
		painting = true;
		tdraw(e);
	}

	function finishedPosition() {
		canvas.classList.remove("move");
		if (painting) storeHistory();
		painting = false;
		ctx.beginPath();
	}

	function tfinishedPosition() {
		if (painting) storeHistory();
		// e.preventDefault();
		painting = false;
		lastPt = null;
		ctx.beginPath();
	}

	function draw(e) {
		e.preventDefault();
		if (!painting) return;
		ctx.lineWidth = font_size;
		ctx.lineCap = "round";
		ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
	}

	let lastPt = null;

	function tdraw(e) {
		e.preventDefault();
		if (lastPt != null) {
			ctx.lineWidth = font_size;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(lastPt.x, lastPt.y);
			ctx.lineTo(
				e.touches[0].pageX - canvas.offsetLeft,
				e.touches[0].pageY - canvas.offsetTop,
			);
			ctx.stroke();
		}
		lastPt = {
			x: e.touches[0].pageX - canvas.offsetLeft,
			y: e.touches[0].pageY - canvas.offsetTop,
		};
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
	undo.addEventListener("click", undo_last);
	clear.addEventListener("click", clear_canvas);

	canvas.addEventListener("touchstart", tstartPosition);
	canvas.addEventListener("touchend", tfinishedPosition);
	canvas.addEventListener("touchcancel", tfinishedPosition);
	canvas.addEventListener("touchend", tfinishedPosition);
	canvas.addEventListener("touchmove", tdraw);
	undo.addEventListener("touch", undo_last);
	clear.addEventListener("touchstart", clear_canvas);
});
