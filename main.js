const settings = {
    width: 512,
    height: 512,
    resolution: 0.5,
    text: 'Frenkie de Jong',
    font: 'Arial',
    color1: '#23ff00',
    color2: 'pink',
    color3: 'purple',
    color4: 'yellow',
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
    canvas = new fabric.Canvas('thecanvas');
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

    $('#color-1').val(settings.color1);
    $('#color-2').val(settings.color2);
    $('#color-3').val(settings.color3);
    $('#color-4').val(settings.color4);

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
    let cvs = $('.canvas-container');
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
    settings.color1 = $('#color-1').val();
    settings.color2 = $('#color-2').val();
    settings.color3 = $('#color-3').val();
    settings.color4 = $('#color-4').val();
    draw();
}

function draw() {
    canvas.width = getWidth();
    canvas.height = getHeight();
    canvas.clear();
    drawPatterns();
}

function drawPatterns() {
    for (var i = 0, l = settings.patterns.length; i < 1; i++) {
        var pattern = settings.patterns[i];
        drawPatternWithFabric(pattern);

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


function drawPatternWithFabric(pattern) {
    fabric.loadSVGFromURL('patterns/' + pattern.image, function(objects, options) {
        setColor(objects);
        var obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).renderAll();
        claraApi.sceneGraph.touch(sceneCanvasId);
    });
}

function setColor(objects) {
    var usedColors = [];
    for (var i = 0, l = objects.length; i < l; i++) {
        var item, colorIndex;
        item = objects[i];
        if (usedColors.indexOf(item.fill) === -1) {
            usedColors.push(item.fill);
        }
        colorIndex = usedColors.indexOf(item.fill);
        item.fill = settings['color' + (colorIndex + 1)];
    }

}








// helpers

function getWidth() {
    return settings.width * settings.resolution;
}

function getHeight() {
    return settings.height * settings.resolution
}
