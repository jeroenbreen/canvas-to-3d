const settings = {
    width: 512,
    height: 512,
    resolution: 0.5,
    text: 'Frenkie de Jong',
    font: 'Arial',
    patterns: [
        {
            image: 'pattern-1.svg',
            opacity: .5,
            scale: 1,
            x: 0,
            y: 0
        }, {
            image: 'camo.svg',
            opacity: .5,
            scale: 4,
            x: 50,
            ty: 50
        }
    ],
    visible: true
};

let canvas, ctx, claraApi, sceneCanvasId;


function init() {
    setupClara();
    executeToggle();
    initSettings();
    canvas = $('canvas')[0];
    ctx = canvas.getContext("2d");
}

$(window).ready(function(){
    init();
});

function initSettings() {
    $('#resolution').val(settings.resolution);
    $('#scale-pattern-1').val(settings.patterns[0].scale);
    $('#opacity-pattern-1').val(settings.patterns[0].opacity);
    $('#scale-pattern-2').val(settings.patterns[1].scale);
    $('#opacity-pattern-2').val(settings.patterns[1].opacity);

    // $('#color').val(settings.color);
    // $('#repetition').val(settings.repetition);
    // $('#size').val(settings.size);
    // $('#text').val(settings.text);
    // $('input:radio[name=pattern][value=' + settings.pattern + ']').prop('checked', true);
    // $('input:radio[name=logo][value=' + settings.logo + ']').prop('checked', true);
    // $('#font').val(settings.font);
}

function setupClara() {
    claraApi = claraplayer('configurator');
    claraApi.sceneIO.fetchAndUse('f234c3fa-4bd9-4a66-969e-921217131648');

    claraApi.on('loaded', function(){
        //this is the scene ID of the canvas texture
        sceneCanvasId = claraApi.scene.find({name:'Canvas'});
        //The ID of the canvas needs to be the same as the "External ID" property of the canvas texture in clara
        //This is what enables the live connection between 2d canvas on the page and 3d canvas in the model
        claraApi.scene.set({
            sceneCanvasId: sceneCanvasId,
            plug:'Image',
            property:'externalId'
        },'thecanvas');
        draw();
    });
}

function toggle() {
    settings.visible = !settings.visible;
    executeToggle();
}

function executeToggle() {
    let cvs = $('#thecanvas');
    settings.visible ? cvs.show() : cvs.hide();
}





// update / draw

function selectPattern(image, pattern) {
    settings.patterns[pattern].image = image;
    draw();
}

function update() {
    settings.resolution = Number($('#resolution').val());
    settings.patterns[0].opacity = Number($('#opacity-pattern-1').val());
    settings.patterns[0].scale = Number($('#scale-pattern-1').val());
    settings.patterns[1].opacity = Number($('#opacity-pattern-2').val());
    settings.patterns[1].scale = Number($('#scale-pattern-2').val());
    draw();
}

function draw() {
    canvas.width = getWidth();
    canvas.height = getHeight();
    drawPatterns();
}

function drawPatterns() {
    for (let pattern of settings.patterns) {
        //drawPattern(pattern);
        drawPatternWithAlgorithm(pattern);
    }
}

function drawPattern(pattern) {
    var img = new Image();
    img.onload = function() {
        setTimeout(function(){
            ctx.globalAlpha = pattern.opacity;
            ctx.drawImage(img, 0, 0, getWidth() * pattern.scale, getHeight() * pattern.scale);
            claraApi.sceneGraph.touch(sceneCanvasId);
        }, 100);
    };
    img.src = 'patterns/' + pattern.image;
}

function drawPatternWithAlgorithm(pattern) {
    var path = 'patterns/' + pattern.image;
    ctx.globalAlpha = pattern.opacity;
    ctx.drawSvg(path, pattern.x, pattern.y, getWidth() * pattern.scale, getHeight() * pattern.scale);
    claraApi.sceneGraph.touch(sceneCanvasId);
}







// helpers

function getWidth() {
    return settings.width * settings.resolution;
}

function getHeight() {
    return settings.height * settings.resolution
}
