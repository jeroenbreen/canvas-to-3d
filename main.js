const settings = {
    width: 512,
    height: 512,
    resolution: 1,
    text: 'Frenkie de Jong',
    font: 'Arial',
    pattern: 4,
    logo: 'eagle',
    color: 'pink',
    repetition: 8,
    size: 10,
    visible: false
};

let canvas, ctx, claraApi, sceneCanvasId;


function init() {
    executeToggle();
    setupClara();
    $('#resolution').val(settings.resolution);
    $('#color').val(settings.color);
    $('#repetition').val(settings.repetition);
    $('#size').val(settings.size);
    $('#text').val(settings.text);
    $('input:radio[name=pattern][value=' + settings.pattern + ']').prop('checked', true);
    $('input:radio[name=logo][value=' + settings.logo + ']').prop('checked', true);
    $('#font').val(settings.font);
    canvas = $('canvas')[0];
    ctx = canvas.getContext("2d");
}

function setupClara() {
    claraApi = claraplayer('configurator');
    claraApi.sceneIO.fetchAndUse('f234c3fa-4bd9-4a66-969e-921217131648');

    claraApi.on('loaded', function(){
        //this is the scene ID of the canvas texture
        sceneCanvasId = claraApi.scene.find({name:'Canvas'});
        //The ID of the canvas needs to be the same as the "External ID" property of the canvas texture in clara
        //This is what enables the live connection between 2d canvas on the page and 3d canvas in the model
        claraApi.scene.set({sceneCanvasId,plug:'Image',property:'externalId'},'thecanvas')
        draw();
    });
}

function toggle() {
    settings.visible = !settings.visible;
    executeToggle();
}

function executeToggle() {
    let canvas = $('#thecanvas');
    settings.visible ? canvas.show() : canvas.hide();
}

function update() {
    settings.resolution = Number($('#resolution').val());
    settings.color = $('#color').val();
    settings.repetition = Number($('#repetition').val());
    settings.size = Number($('#size').val());
    settings.text = $('#text').val();
    settings.pattern = Number($('input[name=pattern]:checked').val());
    settings.logo = $('input[name=logo]:checked').val();
    settings.font =  $('#font').val();
    draw();
}

function draw() {
    canvas.width = getWidth();
    canvas.height = getHeight();
    if (settings.pattern < 4) {
        drawPattern(drawNext);
    } else {
        drawPatternByCode();
        drawNext();
    }
}

function drawNext() {
    drawLogo(drawText);
}

function getWidth() {
    return settings.width * settings.resolution;
}

function getHeight() {
    return settings.height * settings.resolution
}

function drawText() {
    let size = 45 * settings.resolution;
    ctx.font = size + 'px ' + settings.font;
    console.log(ctx.font);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(settings.text, 0.5 * getWidth(), 0.3 * getHeight());
    
    //here we update the canvas texture in clara
    claraApi.sceneGraph.touch(sceneCanvasId);
}

function drawPattern(callback) {
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, getWidth(), getHeight());
        callback();
    };
    img.src = 'patterns/pattern-' + settings.pattern + '.svg';
}

function drawLogo(callback) {
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0.35 * getWidth(), 0.6 * getHeight(), 0.3 * getWidth(), 0.3 * getHeight());
        callback();
    };
    img.src = 'logos/' + settings.logo + '.svg';
}

function drawPatternByCode() {
    const n = settings.repetition;
    for (var x = 0; x < n; x++) {
        for (var y = 0; y < n; y++) {
            let xPosition, offset;
            ctx.beginPath();
            offset = (y % 2 === 0) ? 0.75 : 0.25;
            xPosition = (x + offset)/n * getWidth();
            ctx.arc(xPosition, (y + 0.5)/n * getHeight(), settings.size * settings.resolution, 0,2*Math.PI);
            ctx.fillStyle = settings.color;
            ctx.fill();
        }

    }
}

$(window).ready(function(){
    init();
});

