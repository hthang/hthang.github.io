'use strict';
/*------------------------------------------------

1. Header
2. Cases
3. Pagepiling
4. Swiper
5. Validate

------------------------------------------------*/

/* 1. Header */
document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.header__menu');
    const menuExit = document.querySelector('.header__menu-exit');
    const main = document.querySelector('.main');
    const header = document.querySelector('.header');

    burger.addEventListener('click', function () {
        menu.classList.add('active');
    });

    menuExit.addEventListener('click', function () {
        menu.classList.remove('active');
    });

    if (header.classList.contains("header-js")) {
        window.addEventListener('scroll', () => {
            let y = window.scrollY;
            let headerHeight = header.offsetHeight;

            if (y > headerHeight) {
                main.style.paddingTop = headerHeight + 'px';
                header.classList.add('is-fixed');
                header.style.top = -headerHeight + "px";
                header.style.transform = "translateY(100%)";
            } else if (y === 0) {
                header.classList.remove('is-fixed');
                main.style.paddingTop = 0;
                header.style.top = 0;
                header.style.transform = "translateY(0%)";
            }
        });
    }
    function disabledPreloader() {
        console.log('work')
        document.getElementById('preloader').style.display = 'none';
    }

});

/* 2. Cases */
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.js-cases-row')) {
        const row = document.querySelector('.js-cases-row');
        const casesCard = [...row.querySelectorAll('.js-cases-card')];

        function cloneNodes() {
            casesCard.forEach((card) => {
                const clone = card.cloneNode(true)

                clone.dataset.clone = true

                row.appendChild(clone)
            })
        }
        cloneNodes()

        casesCard.forEach((card) => {
            row.appendChild(card)
        })

        cloneNodes()
    }
});

/* 3. Pagepiling */
document.addEventListener('DOMContentLoaded', function () {
    function isTablet() {
        return window.matchMedia('(max-width: 1000px)').matches
    }

    let isInited = window.matchMedia('(max-width: 1000px)').matches
    const sections = [...document.querySelectorAll('.js-section')]

    function onScroll() {
        const isPageEnd = window.scrollY + window.innerHeight >= document.scrollingElement.scrollHeight;

        sections.forEach((section) => {
            const { top, bottom } = section.getBoundingClientRect()
            const inViewport = top <= 0 && bottom >= 0
            const id = section.getAttribute('id')

            if (inViewport && !isPageEnd) {
                document.querySelector(`[data-menuanchor="${id}"]`).classList.add('active')
            } else {
                document.querySelector(`[data-menuanchor="${id}"]`).classList.remove('active')
            }
        })

        if (isPageEnd) {
            const id = sections[sections.length - 1].getAttribute('id')
            document.querySelector(`[data-menuanchor="${id}"]`).classList.add('active')
        }
    }

    function moveToContacts() {
        const linkToContacts = document.getElementById('linkToContacts')

        linkToContacts.addEventListener('click', (event) => {
            const searchSection = document.getElementById('contacts')

            event.preventDefault()
            const { top, bottom } = searchSection.getBoundingClientRect()


            window.scrollTo({
                top: window.scrollY + top,
                behavior: "smooth"
            });
        })
    }

    function scrollToSection() {
        const items = document.querySelectorAll('.header__menu-item');

        [...items].forEach(item => {
            const section = document.getElementById(item.dataset.menuanchor);

            item.addEventListener('click', function (event) {
                event.preventDefault();

                const { top } = section.getBoundingClientRect()

                window.scrollTo({
                    top: window.scrollY + top,
                    behavior: "smooth"
                });

                if (isTablet()) {
                    document.querySelector('.header__menu').classList.remove('active');
                }
            })
        })
    }

    function initPaging() {

        if (isTablet() && isInited) {
            isInited = false

            if ($.fn.pagepiling.destroy) {
                $.fn.pagepiling.destroy('all');
            }

            document.querySelector('body').style.overflow = 'auto';
            document.querySelector('html').style.overflow = 'auto';
            [...document.querySelectorAll('.header__menu-item')].forEach(element => {
                if (element.classList.contains('active')) {
                    element.classList.remove('active')
                }
                if (document.getElementById('pagepiling')) {
                    scrollToSection();
                    moveToContacts()
                }
            });
            if (document.getElementById('pagepiling')) {
                window.addEventListener('scroll', onScroll)
            }
        } else if (!isTablet() && !isInited && document.getElementById('pagepiling')) {
            isInited = true

            if (document.getElementById('pagepiling')) {
                window.removeEventListener('scroll', onScroll)
            }

            const anchors = ['home', 'cases', 'about', 'services', 'partners', 'contacts']
            const labels = ['Trang chủ', 'Xem jobs', 'Giới thiệu', 'Kỹ năng', 'Khách hàng', 'liên hệ']

            function setLabel(index) {
                const label = labels[index];

                [...document.querySelectorAll('.js-page-label')].forEach(element => {
                    element.textContent = label
                });
            }

            function setPageNumber(index) {
                [...document.querySelectorAll('.js-page-number')].forEach(element => {
                    element.textContent = `${index + 1}/${labels.length}`
                });
            }

            function setActiveMenu(index) {
                const anchor = anchors[index];
                const header = document.querySelector('.header__menu')

                header.classList.remove('active')
                document.querySelector(`[data-menuanchor="${anchor}"]`).classList.add('active')
            }

            function progressBar(index) {
                const progressBar = document.querySelector('.gold-line-js');

                progressBar.style.height = 100 / 9 * index + '%';
            }

            function animationActiveSection(index, nextIndex) {
                const anchor = anchors[index];
                const nextAnchor = anchors[nextIndex];
                const nextActiveSection = document.querySelector(`.section-${nextAnchor}`);
                const activeSection = document.querySelector(`.section-${anchor}`);

                if (nextActiveSection.classList.contains('active')) {
                    nextActiveSection.querySelector('.section-main').style.opacity = "1";
                    activeSection.querySelector('.section-main').style.opacity = "0";
                }
            }

            let timeout = null;

            $('#pagepiling').pagepiling({
                anchors: anchors,
                verticalCentered: false,
                scrollingSpeed: 150,
                easing: 'swing',
                menu: '#myMenu',

                onLeave: function (index, nextIndex, direction) {
                    setPageNumber(nextIndex - 1)
                    setLabel(nextIndex - 1)
                    progressBar(nextIndex)
                    clearTimeout(timeout);
                    timeout = setTimeout(animationActiveSection, 700, index - 1, nextIndex - 1)
                },

                afterRender: function () {
                    setPageNumber(0)
                    setLabel(0)
                    setActiveMenu(0)
                    progressBar(1)
                    clearTimeout(timeout);
                    timeout = setTimeout(animationActiveSection, 700, 1, 0)
                }
            });
        }
    }

    initPaging();

    window.addEventListener('resize', initPaging);

    function disabledPreloader() {
        document.getElementById('preloader').style.display = 'none';
    }

    

    setTimeout(disabledPreloader, 1200);

    $("a.fancybox").fancybox({
        type: 'iframe',
        allowfullscreen: 'true'
    });
});

/* 4. Swiper */
let swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

});


let swiper2 = new Swiper('.swiper-container2', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 3,
    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next2',
        prevEl: '.swiper-button-prev2',
    },
    breakpoints: {
        // when window width is >= 320px
        280: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
        700: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        // when window width is >= 480px
        1200: {
            slidesPerView: 3,
        },
        2200: {
            slidesPerView: 4,
        },
        // when window width is >= 640px
    }
});

/* 5. Validate */
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.js-form')) {
        new JustValidate('.js-form', {
            rules: {
              checkbox: {
                required: true
              },
              email: {
                required: true,
                email: true
              },
              name: {
                required: true,
                minLength: 2
            },
            messages: {
              name: {
                minLength: 'My custom message about only minLength rule'
              },
              email: 'My custom message about error (one error message for all rules)'
            },  
            },
        })
    }
})



/*
  
  
Kitschy New Orleans SVG Mardi Gras Parade

Cut and Paste and Fun for Everyone!

Festive Browsers Only. :(

This is my first attempt at SVG animation.  Found out some interesting things putting this all together.  Comments where appropriate.

Happy Mardi Gras from New Orleans!

Made some use of the Buzz Audio Library.
http://buzz.jaysalvat.com/documentation/sound/  

MP3s are pretty safe to use when you are targeting HTML5 Audio.  Non supported browsers just don't hear the awesomeness of New Orleans.  

Read the Buzz Docs.  Super easy to use.


*/

/***************************
A simple jQuery way to swap out text.  More elegant ways to achieve this. But this is expedient.
****************************/			
	
	
jQuery.fn.extend({
    toggleText: function (a, b){
        var that = this;
            if (that.text() != a && that.text() != b){
                that.text(a);
            }
            else
            if (that.text() == a){
                that.text(b);
            }
            else
            if (that.text() == b){
                that.text(a);
            }
        return this;
    }
});

/***************************

SVG Class Dom Fix

When I started playing with assigning classes to SVG elements and groups - didn't work.  Seems like it would.  But, it doesn't.  Like always, jumped on Google and found the answer on a post by Todd Motto.  He has some super useful info on his blog.

https://toddmotto.com/hacking-svg-traversing-with-ease-addclass-removeclass-toggleclass-functions/

Long story short, it's a DOM issue.  Below is a little plugin Todd wrote to fix this.

https://github.com/toddmotto/toddmotto.github.io/blob/master/_posts/2013-10-27-hacking-svg-traversing-with-ease-addclass-removeclass-toggleclass-functions.md

***************************/


(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.svgClassFix = factory();
  }
})(this, function () {

  'use strict';

  var svgClassFix = {};

  svgClassFix.hasClass = function (elem, name) {
    return new RegExp('(\\s|^)' + name + '(\\s|$)').test(elem.getAttribute('class'));
  };

  svgClassFix.addClass = function (elem, name) {
    !svgClassFix.hasClass(elem, name) && elem.setAttribute('class', (!!elem.getAttribute('class') ? elem.getAttribute('class') + ' ' : '') + name);
  };

  svgClassFix.removeClass = function (elem, name) {
    var remove = elem.getAttribute('class').replace(new RegExp('(\\s|^)' + name + '(\\s|$)', 'g'), '$2');
    svgClassFix.hasClass(elem, name) && elem.setAttribute('class', remove);
  };

  svgClassFix.toggleClass = function (elem, name) {
    svgClassFix[svgClassFix.hasClass(elem, name) ? 'removeClass' : 'addClass'](elem, name);
  };

  return svgClassFix;

});

/***************************

Using Todd's fix to toggle classes using setInterval so everything loops.

***************************/

$(document).ready(function(){
// query SVG DOM
var baton = document.querySelector('#MarchingBand #Baton');
var drumstick = document.querySelector('#MarchingBand #DrumStick');
var bandleader = document.querySelector('#MarchingBand #BandMajor');


setInterval(function(){ 

svgClassFix.toggleClass(baton, 'BatonSpinx' , 'StopDrumstick');

svgClassFix.toggleClass(bandleader, 'BackwardMarch' , 'FowardMarch');

}, 5000);

setInterval(function(){ 

svgClassFix.toggleClass(DrumstickGroup, 'DrumStickSpin' , 'StopDrumstick');

}, 3000);


		
	
});



/* Just some Confetti by Patrik Svensson (http://metervara.net) */

$(document).ready(function() {
    var frameRate = 30;
    var dt = 1.0 / frameRate;
    var DEG_TO_RAD = Math.PI / 180;
    var RAD_TO_DEG = 180 / Math.PI;
    var colors = [
        ["#7B148F", "#4F043F"],
        ["#025612", "#2F7713"],
        ["#D8B816", "#f6d00e"]
     
    ];

    function Vector2(_x, _y) {
        this.x = _x, this.y = _y;
        this.Length = function() {
            return Math.sqrt(this.SqrLength());
        }
        this.SqrLength = function() {
            return this.x * this.x + this.y * this.y;
        }
        this.Equals = function(_vec0, _vec1) {
            return _vec0.x == _vec1.x && _vec0.y == _vec1.y;
        }
        this.Add = function(_vec) {
            this.x += _vec.x;
            this.y += _vec.y;
        }
        this.Sub = function(_vec) {
            this.x -= _vec.x;
            this.y -= _vec.y;
        }
        this.Div = function(_f) {
            this.x /= _f;
            this.y /= _f;
        }
        this.Mul = function(_f) {
            this.x *= _f;
            this.y *= _f;
        }
        this.Normalize = function() {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / Math.sqrt(sqrLen);
                this.x *= factor;
                this.y *= factor;
            }
        }
        this.Normalized = function() {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / Math.sqrt(sqrLen);
                return new Vector2(this.x * factor, this.y * factor);
            }
            return new Vector2(0, 0);
        }
    }
    Vector2.Lerp = function(_vec0, _vec1, _t) {
        return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
    }
    Vector2.Distance = function(_vec0, _vec1) {
        return Math.sqrt(Vector2.SqrDistance(_vec0, _vec1));
    }
    Vector2.SqrDistance = function(_vec0, _vec1) {
        var x = _vec0.x - _vec1.x;
        var y = _vec0.y - _vec1.y;
        return (x * x + y * y + z * z);
    }
    Vector2.Scale = function(_vec0, _vec1) {
        return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
    }
    Vector2.Min = function(_vec0, _vec1) {
        return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
    }
    Vector2.Max = function(_vec0, _vec1) {
        return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
    }
    Vector2.ClampMagnitude = function(_vec0, _len) {
        var vecNorm = _vec0.Normalized;
        return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
    }
    Vector2.Sub = function(_vec0, _vec1) {
        return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
    }

    function EulerMass(_x, _y, _mass, _drag) {
        this.position = new Vector2(_x, _y);
        this.mass = _mass;
        this.drag = _drag;
        this.force = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.AddForce = function(_f) {
            this.force.Add(_f);
        }
        this.Integrate = function(_dt) {
            var acc = this.CurrentForce(this.position);
            acc.Div(this.mass);
            var posDelta = new Vector2(this.velocity.x, this.velocity.y);
            posDelta.Mul(_dt);
            this.position.Add(posDelta);
            acc.Mul(_dt);
            this.velocity.Add(acc);
            this.force = new Vector2(0, 0);
        }
        this.CurrentForce = function(_pos, _vel) {
            var totalForce = new Vector2(this.force.x, this.force.y);
            var speed = this.velocity.Length();
            var dragVel = new Vector2(this.velocity.x, this.velocity.y);
            dragVel.Mul(this.drag * this.mass * speed);
            totalForce.Sub(dragVel);
            return totalForce;
        }
    }

    function ConfettiPaper(_x, _y) {
        this.pos = new Vector2(_x, _y);
        this.rotationSpeed = Math.random() * 600 + 800;
        this.angle = DEG_TO_RAD * Math.random() * 360;
        this.rotation = DEG_TO_RAD * Math.random() * 360;
        this.cosA = 1.0;
        this.size = 5.0;
        this.oscillationSpeed = Math.random() * 1.5 + 0.5;
        this.xSpeed = 40.0;
        this.ySpeed = Math.random() * 60 + 50.0;
        this.corners = new Array();
        this.time = Math.random();
        var ci = Math.round(Math.random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        for (var i = 0; i < 4; i++) {
            var dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
            var dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
            this.corners[i] = new Vector2(dx, dy);
        }
        this.Update = function(_dt) {
            this.time += _dt;
            this.rotation += this.rotationSpeed * _dt;
            this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
            this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
            this.pos.y += this.ySpeed * _dt;
            if (this.pos.y > ConfettiPaper.bounds.y) {
                this.pos.x = Math.random() * ConfettiPaper.bounds.x;
                this.pos.y = 0;
            }
        }
        this.Draw = function(_g) {
            if (this.cosA > 0) {
                _g.fillStyle = this.frontColor;
            } else {
                _g.fillStyle = this.backColor;
            }
            _g.beginPath();
            _g.moveTo(this.pos.x + this.corners[0].x * this.size, this.pos.y + this.corners[0].y * this.size * this.cosA);
            for (var i = 1; i < 4; i++) {
                _g.lineTo(this.pos.x + this.corners[i].x * this.size, this.pos.y + this.corners[i].y * this.size * this.cosA);
            }
            _g.closePath();
            _g.fill();
        }
    }
    ConfettiPaper.bounds = new Vector2(0, 0);

    function ConfettiRibbon(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
        this.particleDist = _dist;
        this.particleCount = _count;
        this.particleMass = _mass;
        this.particleDrag = _drag;
        this.particles = new Array();
        var ci = Math.round(Math.random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        this.xOff = Math.cos(DEG_TO_RAD * _angle) * _thickness;
        this.yOff = Math.sin(DEG_TO_RAD * _angle) * _thickness;
        this.position = new Vector2(_x, _y);
        this.prevPosition = new Vector2(_x, _y);
        this.velocityInherit = Math.random() * 2 + 4;
        this.time = Math.random() * 100;
        this.oscillationSpeed = Math.random() * 2 + 2;
        this.oscillationDistance = Math.random() * 40 + 40;
        this.ySpeed = Math.random() * 40 + 80;
        for (var i = 0; i < this.particleCount; i++) {
            this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
        }
        this.Update = function(_dt) {
            var i = 0;
            this.time += _dt * this.oscillationSpeed;
            this.position.y += this.ySpeed * _dt;
            this.position.x += Math.cos(this.time) * this.oscillationDistance * _dt;
            this.particles[0].position = this.position;
            var dX = this.prevPosition.x - this.position.x;
            var dY = this.prevPosition.y - this.position.y;
            var delta = Math.sqrt(dX * dX + dY * dY);
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            for (i = 1; i < this.particleCount; i++) {
                var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
                dirP.Normalize();
                dirP.Mul((delta / _dt) * this.velocityInherit);
                this.particles[i].AddForce(dirP);
            }
            for (i = 1; i < this.particleCount; i++) {
                this.particles[i].Integrate(_dt);
            }
            for (i = 1; i < this.particleCount; i++) {
                var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
                rp2.Sub(this.particles[i - 1].position);
                rp2.Normalize();
                rp2.Mul(this.particleDist);
                rp2.Add(this.particles[i - 1].position);
                this.particles[i].position = rp2;
            }
            if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
                this.Reset();
            }
        }
        this.Reset = function() {
            this.position.y = -Math.random() * ConfettiRibbon.bounds.y;
            this.position.x = Math.random() * ConfettiRibbon.bounds.x;
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            this.velocityInherit = Math.random() * 2 + 4;
            this.time = Math.random() * 100;
            this.oscillationSpeed = Math.random() * 2.0 + 1.5;
            this.oscillationDistance = Math.random() * 40 + 40;
            this.ySpeed = Math.random() * 40 + 80;
            var ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0];
            this.backColor = colors[ci][1];
            this.particles = new Array();
            for (var i = 0; i < this.particleCount; i++) {
                this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
        }
        this.Draw = function(_g) {
            for (var i = 0; i < this.particleCount - 1; i++) {
                var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
                var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
                if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
                    _g.fillStyle = this.frontColor;
                    _g.strokeStyle = this.frontColor;
                } else {
                    _g.fillStyle = this.backColor;
                    _g.strokeStyle = this.backColor;
                }
                if (i == 0) {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                    _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                    _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                    _g.beginPath();
                    _g.moveTo(p1.x, p1.y);
                    _g.lineTo(p0.x, p0.y);
                    _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                } else if (i == this.particleCount - 2) {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                    _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                    _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                    _g.beginPath();
                    _g.moveTo(p1.x, p1.y);
                    _g.lineTo(p0.x, p0.y);
                    _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                } else {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                    _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                    _g.lineTo(p1.x, p1.y);
                    _g.lineTo(p0.x, p0.y);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                }
            }
        }
        this.Side = function(x1, y1, x2, y2, x3, y3) {
            return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
        }
    }
    ConfettiRibbon.bounds = new Vector2(0, 0);
    confetti = {};
    confetti.Context = function(parent) {
        var i = 0;
        var canvasParent = document.getElementById(parent);
        var canvas = document.createElement('canvas');
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;
        canvasParent.appendChild(canvas);
        var context = canvas.getContext('2d');
        var interval = null;
        var confettiRibbonCount = 7;
        var rpCount = 30;
        var rpDist = 8.0;
        var rpThick = 8.0;
        var confettiRibbons = new Array();
        ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);
        for (i = 0; i < confettiRibbonCount; i++) {
            confettiRibbons[i] = new ConfettiRibbon(Math.random() * canvas.width, -Math.random() * canvas.height * 2, rpCount, rpDist, rpThick, 45, 1, 0.05);
        }
        var confettiPaperCount = 25;
        var confettiPapers = new Array();
        ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
        for (i = 0; i < confettiPaperCount; i++) {
            confettiPapers[i] = new ConfettiPaper(Math.random() * canvas.width, Math.random() * canvas.height);
        }
        this.resize = function() {
            canvas.width = canvasParent.offsetWidth;
            canvas.height = canvasParent.offsetHeight;
            ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
            ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);
        }
        this.start = function() {
            this.stop()
            var context = this
            this.interval = setInterval(function() {
                confetti.update();
            }, 1000.0 / frameRate)
        }
        this.stop = function() {
            clearInterval(this.interval);
        }
        this.update = function() {
            var i = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < confettiPaperCount; i++) {
                confettiPapers[i].Update(dt);
                confettiPapers[i].Draw(context);
            }
            for (i = 0; i < confettiRibbonCount; i++) {
                confettiRibbons[i].Update(dt);
                confettiRibbons[i].Draw(context);
            }
        }
    }
    var confetti = new confetti.Context('confetti');
    confetti.start();
    $(window).resize(function() {
        confetti.resize();
    });
});


