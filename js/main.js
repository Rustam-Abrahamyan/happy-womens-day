let gardenCanvas = document.getElementById('garden');

let $width = window.innerWidth;
let smallScreen = $width < 1024;
let $height = smallScreen ? window.innerHeight / 2 : window.innerHeight;

gardenCanvas.width = smallScreen ? $width : $width / 2;
gardenCanvas.height = $height;
gardenCtx = gardenCanvas.getContext("2d");
gardenCtx.globalCompositeOperation = "lighter";
garden = new Garden(gardenCtx, gardenCanvas);

setInterval(function () {
    garden.render();
}, Garden.options.growSpeed);

let xs = [];
let ys = [];

function Circle(steps, radius, centerX, centerY, s = 0, e = 150, r = false) {
    for (let i = s; r ? i > e : i < e; i = i + (r ? -3 : 3)) {
        xs.push(centerX + radius * Math.cos(2 * Math.PI * i / steps));
        ys.push(centerY + radius * Math.sin(2 * Math.PI * i / steps));
    }
}

let h = $height;

let s = (h - 100) / 14;

let steps = s * 3;
let r1 = s * 3;
let r2 = s * 3 - 25;
let r3 = s * 4;
let r4 = s * 4 - 25;
let centerX = Math.max(r1, r2, r3, r4) + 50 * (smallScreen ? 5 : 1);
let centerY_1 = r1 + 50;
let centerY_2 = 2 * r1 + r3 + 50;

Circle(steps, r1, centerX, centerY_1, 0, steps / 4);
Circle(steps, r3, centerX, centerY_2, 0.75 * steps, 0, true);
Circle(steps, r3, centerX, centerY_2, steps, 0.75 * steps, true);
Circle(steps, r1, centerX, centerY_1, steps / 4, steps);

Circle(steps, r2, centerX, centerY_1, 0, steps / 4);
Circle(steps, r4, centerX, centerY_2, 0.75 * steps, 0, true);
Circle(steps, r4, centerX, centerY_2, steps, 0.75 * steps, true);
Circle(steps, r2, centerX, centerY_1, steps / 4, steps);

startHeartAnimation();

function getHeartPoint(angle) {
    return [xs[angle], ys[angle]];
}

function startHeartAnimation() {
    let interval = 5;
    let angle = 0;
    let heart = [];
    let animationTimer = setInterval(function () {
        let bloom = getHeartPoint(angle);
        let draw = true;
        for (let i = 0; i < heart.length; i++) {
            let p = heart[i];
            let distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }

        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }

        if (angle >= xs.length - 1) {
            clearInterval(animationTimer);
        } else {
            angle++;
        }
    }, interval);
}

(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            let $ele = $(this), str = $ele.html(), progress = 0;

            $ele.html('');

            let timer = setInterval(function () {
                let current = str.substr(progress, 1);

                if (current === '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }

                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                }
            }, 75);
        });
        return this;
    };
})($);

$("#code").typewriter();
