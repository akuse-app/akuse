// drag n scroll anime-list
const ele = document.getElementById('current');

const sliderCurrent = document.getElementById('current');
const sliderRewatching = document.getElementById('completed');
let mouseDown = false;
let startX, scrollLeft;

let startDragging = function(e, slider) {
    mouseDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
};

let stopDragging = function(e) {
    mouseDown = false;
};

let mouseDrag = function(e, slider) {
    e.preventDefault();
    if(!mouseDown) { return; }
    const x = e.pageX - slider.offsetLeft;
    const scroll = x - startX;
    slider.scrollLeft = scrollLeft - scroll;
}

sliderCurrent.addEventListener('mousedown', e => startDragging(e, sliderCurrent), false);
sliderCurrent.addEventListener('mouseup', stopDragging, false);
sliderCurrent.addEventListener('mouseleave', stopDragging, false);
sliderCurrent.addEventListener('mousemove', e => mouseDrag(e, sliderCurrent), false);

sliderRewatching.addEventListener('mousedown', e => startDragging(e, sliderRewatching), false);
sliderRewatching.addEventListener('mouseup', stopDragging, false);
sliderRewatching.addEventListener('mouseleave', stopDragging, false);
sliderRewatching.addEventListener('mousemove', e => mouseDrag(e, sliderRewatching), false);



// anime-page
