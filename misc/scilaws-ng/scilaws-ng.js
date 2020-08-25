const WINDOW_WIDTH = 640;
const WINDOW_HEIGHT = 480;
const X_OFFSET = 100;
const MAX_BALL_DIAMETER = 30;

class Ball {
    constructor(left, top, right, bottom) {
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.x = Math.random() * (right-left) + left;
        this.y = Math.random() * (bottom-top) + top;
        this.xmov = Math.floor(Math.random() * 2) ? -1 : 1;
        this.ymov = Math.floor(Math.random() * 2) ? -1 : 1;
    }

    draw(ctx, yPiston, radius) {
        const delta = Math.random() * 10;
        const xnew = this.x + this.xmov*delta;
        if (xnew < this.left+radius || xnew > this.right-radius) {
            this.xmov *= -1;
        } else {
            this.x = xnew;
        }

        const ynew = this.y + this.ymov*delta;
        if (ynew < yPiston+radius || ynew > this.bottom-radius) {
            this.ymov *= -1;
        } else {
            this.y = ynew;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2*Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    pushDown(yPiston, radius) {
        const realY = yPiston+radius;
        if (this.y < realY) {
            this.y = realY;
        }
    }
}

class Piston {
    constructor(x, yStart, width, thickness) {
        this.width = width;
        this.x = x;
        this.y = yStart;
        this.thickness = thickness;
        this.handleHeight = thickness*3;
    }

    draw(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y-this.thickness, this.width, this.thickness);
        ctx.fillRect(this.handleLeft, this.handleTop, this.thickness, this.handleHeight);
    }

    isCursorOnHandle(cursorPos) {
        return cursorPos.x >= this.handleLeft && cursorPos.x <= this.handleLeft+this.thickness &&
               cursorPos.y >= this.handleTop && cursorPos.y <= this.handleTop+this.handleHeight;
    }

    get handleLeft() {
        return this.x + (this.width-this.thickness)/2;
    }

    get handleTop() {
        return this.y - this.handleHeight - this.thickness;
    }
}

class Container {
    constructor(left, top, width, height, thickness) {
        this.thickness = thickness;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.left-this.thickness, this.top, this.thickness, this.height);
        ctx.fillRect(this.right, this.top, this.thickness, this.height);
        ctx.fillRect(this.left-this.thickness, this.bottom, this.width + 2*this.thickness, this.thickness);
    }

    get bottom() {
        return this.top + this.height;
    }

    get right() {
        return this.left + this.width;
    }
}

class Simulation {
    constructor(id, container_width, pistonTop) {
        this.thickness = 20;
        this.yoffset = 100;
        this.container_width = container_width;
        this.container_height = WINDOW_HEIGHT - 125 - this.yoffset;

        const canvas = document.getElementById(id);
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;

        this.ctx = canvas.getContext('2d');

        this.container = new Container(X_OFFSET, this.yoffset, container_width, this.container_height, this.thickness);
        this.piston = new Piston(X_OFFSET, pistonTop, container_width, this.thickness);
        this.balls = [];

        this.onUnhold();
        canvas.addEventListener("mousedown", e => this.onHold(Simulation.cursorPos(canvas, e)), false);
        canvas.addEventListener("mouseup", e => this.onUnhold(), false);
        canvas.addEventListener("mousemove", e => {
            if(this.dragging) {
                this.onDrag(Simulation.cursorPos(canvas, e));
            }
        }, false);

        this.id = id;
        window.requestAnimationFrame(() => this.draw());
    }

    draw() {
        const radius = this.ballRadius;
        const count = this.ballCount;

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

        this.container.draw(this.ctx);
        this.piston.draw(this.ctx);

        if(this.balls.length < count) {
            this.balls = this.balls.concat(Array.from({length: count-this.balls.length}, () => new Ball(this.container.left, this.piston.y, this.container.right, this.container.bottom)));
        }
        else if(this.balls.length > count) {
            this.balls = this.balls.slice(0, count);
        }
        this.balls.forEach(ball => ball.draw(this.ctx, this.piston.y, radius));

        window.requestAnimationFrame(() => this.draw());
    }

    onHold(currentPos) {
        this.dragging = true;
        this.lastPos = currentPos;
    }

    onUnhold() {
        this.dragging = false;
    }

    onDrag(currentPos) {
        this.lastPos = currentPos;
    }

    static cursorPos(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    get ballRadius() {
        return parseInt(document.getElementById(this.id + 'radius').value);
    }

    get ballCount() {
        return parseInt(document.getElementById(this.id + 'count').value);
    }
}

class BoylesLawSimulation extends Simulation {
    constructor() {
        const pistonTop = 200;
        super('boyle', WINDOW_WIDTH - 2*X_OFFSET, pistonTop);
        this.pistonTop = pistonTop;
    }

    draw() {
        super.draw();
        this.ctx.fillStyle = 'gray';
        if (!this.onHandle) {
            this.ctx.font = '15.5px "Times New Roman"';
            this.ctx.fillText("\u2190 Drag the piston up and down", WINDOW_WIDTH/2 + 20, this.piston.y - 50);
        }
        this.ctx.font = 'bold 36px "Times New Roman"';
        var top = this.container.bottom + this.container.thickness + 36;
        const vol = WINDOW_HEIGHT - this.piston.y;
        const pres = (100.0/vol).toFixed(3);
        const volLeft = X_OFFSET;
        const presLeft = (WINDOW_WIDTH-this.ctx.measureText(pres).width)/2;
        this.ctx.fillText(vol.toFixed(1), volLeft, top);
        this.ctx.fillText('\u00d7', WINDOW_WIDTH/2 - X_OFFSET, top);
        this.ctx.fillText(pres, presLeft, top);
        this.ctx.fillText('=', WINDOW_WIDTH/2 + X_OFFSET, top);
        this.ctx.fillText('100', WINDOW_WIDTH - X_OFFSET - this.ctx.measureText('100').width, top);

        top += 36;
        this.ctx.fillText(this.volume, volLeft, top);
        this.ctx.fillText(this.pressure, presLeft, top);
    }

    onHold(currentPos) {
        super.onHold(currentPos);
        this.onHandle = this.piston.isCursorOnHandle(currentPos);
    }

    onUnhold() {
        super.onUnhold();
        this.onHandle = false;
        this.volume = "Volume";
        this.pressure = "Pressure";
    }

    onDrag(currentPos) {
        if (this.onHandle) {
            const yDiff = currentPos.y - this.lastPos.y;
            const newPistonY = this.piston.y + yDiff;
            if (newPistonY >= this.container.top+this.container.thickness && newPistonY <= this.container.bottom-MAX_BALL_DIAMETER) {
                this.piston.y = newPistonY;
                if (yDiff > 0) {
                    const radius = this.ballRadius;
                    this.balls.forEach(ball => ball.pushDown(newPistonY, radius));
                    this.volume = '\u2193';
                    this.pressure = '\u2191';
                }
                else {
                    this.volume = '\u2191';
                    this.pressure = '\u2193';
                }
            }
        }
        super.onDrag(currentPos);
    }
}
new BoylesLawSimulation();

class Gauge {
    constructor(left, top, width, height, sliderHeight, sliderY) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.sliderHeight = sliderHeight;
        this.sliderY = sliderY;
    }

    draw(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.left, this.top, this.width, this.height);

        ctx.fillStyle = 'black';
        ctx.fillRect(this.left, this.sliderY - this.sliderHeight/2, this.width, this.sliderHeight);

        ctx.strokeStyle = 'white';
        const l = this.left + 3;
        const r = this.left + this.width - 3;
        var y = this.sliderY - 5;
        ctx.beginPath();
        ctx.moveTo(l, y);
        ctx.lineTo(r, y);
        y += 5;
        ctx.moveTo(l, y);
        ctx.lineTo(r, y);
        y += 5;
        ctx.moveTo(l, y);
        ctx.lineTo(r, y);
        ctx.stroke();
    }

    isCursorOnSlider(cursorPos) {
        return cursorPos.x >= this.left && cursorPos.x <= this.left + this.width &&
               cursorPos.y >= this.top && cursorPos.y <= this.top + this.height;
    }

    tryMoving(yDiff) {
        const newY = this.sliderY + yDiff;
        const bottom = this.top + this.height;
        if (newY >= this.top + this.sliderHeight/2 && newY <= bottom - this.sliderHeight/2) {
            this.sliderY = newY;
            return true;
        }
        return false;
    }
}

class CharlesLawSimulation extends Simulation {
    constructor() {
        const gaugePos = 300;
        super('charles', (WINDOW_WIDTH - X_OFFSET)/2, gaugePos);
        const sliderOffset = MAX_BALL_DIAMETER + this.thickness;
        this.gauge = new Gauge(WINDOW_WIDTH - X_OFFSET - this.thickness*0.5, this.yoffset - sliderOffset + this.thickness, this.thickness*1.5, this.container.height + sliderOffset, sliderOffset*2, gaugePos);
    }

    draw() {
        super.draw();
        this.gauge.draw(this.ctx);
        this.ctx.fillStyle = 'gray';
        if (!this.onSlider) {
            this.ctx.font = '15.5px "Times New Roman"';
            const l = this.container.right + this.thickness + 5;
            this.ctx.fillText("Drag the temperature", l, this.gauge.sliderY);
            this.ctx.fillText("gauge up & down \u2192", l, this.gauge.sliderY + 15.5);
        }
        this.ctx.font = 'bold 36px "Times New Roman"';
        var top = this.container.bottom + this.container.thickness + 36;
        const temp = WINDOW_HEIGHT - this.piston.y;
        const vol = (temp/5).toFixed(1);
        const tempLeft = X_OFFSET - this.thickness;
        const volLeft = this.container.right + this.thickness - this.ctx.measureText(vol).width;
        this.ctx.fillText(temp.toFixed(1), tempLeft, top);
        this.ctx.fillText('\u00f7', this.container.left + this.container.width/2, top);
        this.ctx.fillText(vol, volLeft, top);
        this.ctx.fillText('=', (this.container.right + this.gauge.left)/2, top);
        this.ctx.fillText('5', this.gauge.left + this.gauge.width - this.ctx.measureText('5').width, top);

        top += 36;
        this.ctx.fillText(this.temp, tempLeft, top);
        this.ctx.fillText(this.volume, volLeft, top);
    }

    onHold(currentPos) {
        super.onHold(currentPos);
        this.onSlider = this.gauge.isCursorOnSlider(currentPos);
    }

    onUnhold() {
        super.onUnhold();
        this.onSlider = false;
        this.temp = "Temperature";
        this.volume = "Volume";
    }

    onDrag(currentPos) {
        if (this.onSlider) {
            const yDiff = currentPos.y - this.lastPos.y;
            if (this.gauge.tryMoving(yDiff)) {
                this.piston.y = this.gauge.sliderY;
                if (yDiff > 0) {
                    const radius = this.ballRadius;
                    this.balls.forEach(ball => ball.pushDown(this.gauge.sliderY, radius));
                    this.temp = '\u2193';
                    this.volume = '\u2193';
                }
                else {
                    this.temp = '\u2191';
                    this.volume = '\u2191';
                }
            }
        }
        super.onDrag(currentPos);
    }
}
new CharlesLawSimulation();

function reveal(who, what) {
    who.innerHTML = what;
}
