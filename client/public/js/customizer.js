let tshirtType = "polo";
let paintArea = "body";
let designType = "none";
let designColor = "#000000";

const canvas = document.getElementById("tshirtCanvas");
const ctx = canvas.getContext("2d");

let baseImg = new Image();
let maskImg = new Image();
let designMaskImg = new Image();

let bodyColor = "#ffffff";
let sleeveColor = "#ffffff";

/* ---------- LOAD IMAGES ---------- */

function loadImages() {
    baseImg.src = `/static/images/${tshirtType}.png`;
    maskImg.src = `/static/images/${tshirtType}_mask.png`;
    designMaskImg.src = `/static/images/${tshirtType}_design_mask.png`;
}

baseImg.onload = () => resizeAndDraw();
maskImg.onload = () => resizeAndDraw();
designMaskImg.onload = () => resizeAndDraw();

/* ---------- TYPE ---------- */

function setType(type) {
    tshirtType = type;

    document.getElementById("btnPolo").classList.remove("active");
    document.getElementById("btnRound").classList.remove("active");

    if(type === "polo"){
        document.getElementById("btnPolo").classList.add("active");
    } else {
        document.getElementById("btnRound").classList.add("active");
    }

    loadImages();
}

/* ---------- AREA ---------- */

function setArea(area) {
    paintArea = area;

    document.getElementById("btnBody").classList.remove("active");
    document.getElementById("btnSleeves").classList.remove("active");

    if(area==="body") document.getElementById("btnBody").classList.add("active");
    else document.getElementById("btnSleeves").classList.add("active");
}

/* ---------- COLORS ---------- */

function applyColor(color) {
    if(paintArea==="body") bodyColor = color;
    else sleeveColor = color;
    draw();
}

/* ---------- DESIGN ---------- */

function setDesign(type){
    designType = type;
    draw();
}

function setDesignColor(color){
    designColor = color;
    draw();
}

/* ---------- DRAW ---------- */

function resizeAndDraw(){
    if(!baseImg.complete) return;

    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    draw();
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(baseImg,0,0,canvas.width,canvas.height);

    applyColorMask();
    applyDesignMask();
}

/* ---------- COLOR MASK ---------- */

function applyColorMask(){
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tctx = tempCanvas.getContext("2d");

    tctx.drawImage(maskImg,0,0,canvas.width,canvas.height);
    const maskData = tctx.getImageData(0,0,canvas.width,canvas.height);

    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

    for(let i=0;i<maskData.data.length;i+=4){
        let r = maskData.data[i];

        if(r > 240){
            setPixel(imageData.data,i,bodyColor);
        }
        else if(r > 120 && r < 200){
            setPixel(imageData.data,i,sleeveColor);
        }
    }

    ctx.putImageData(imageData,0,0);
}

/* ---------- DESIGN MASK ---------- */

function applyDesignMask(){
    if(designType==="none") return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tctx = tempCanvas.getContext("2d");

    tctx.drawImage(designMaskImg,0,0,canvas.width,canvas.height);
    const maskData = tctx.getImageData(0,0,canvas.width,canvas.height);

    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const rgb = hexToRgb(designColor);

    for(let y=0;y<canvas.height;y++){
        for(let x=0;x<canvas.width;x++){
            const i = (y*canvas.width + x)*4;

            const r = maskData.data[i];
            const g = maskData.data[i+1];
            const b = maskData.data[i+2];

            // ONLY black region of design mask
            if(r < 50 && g < 50 && b < 50){

                if(shouldDrawPattern(x,y)){
                    imageData.data[i]   = rgb.r;
                    imageData.data[i+1] = rgb.g;
                    imageData.data[i+2] = rgb.b;
                }
            }
        }
    }

    ctx.putImageData(imageData,0,0);
}

/* ---------- PATTERNS ---------- */

function shouldDrawPattern(x,y){
    if(designType==="dots")  return (x%20===0 && y%20===0);
    if(designType==="lines") return (y%18===0);
    if(designType==="hash")  return ((x+y)%25===0);
    if(designType==="stars") return (x%32===0 && y%32===0);
    return false;
}

/* ---------- UTIL ---------- */

function setPixel(data,i,color){
    let rgb = hexToRgb(color);
    data[i]=rgb.r;
    data[i+1]=rgb.g;
    data[i+2]=rgb.b;
}

function hexToRgb(hex){
    hex = hex.replace("#","");
    return {
        r: parseInt(hex.substring(0,2),16),
        g: parseInt(hex.substring(2,4),16),
        b: parseInt(hex.substring(4,6),16)
    }
}

/* ---------- START ---------- */

loadImages();
