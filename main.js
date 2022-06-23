const { Engine, Render, Runner, Bodies, Composite, Common, Body } = Matter;

const eng = Engine.create();

const container = document.body;
const render = Render.create({
  element: container,
  engine: eng,
});

const collide = 0x0001;
const noCollide = 0x0002;

function resize() {
  render.bounds.max.x = window.innerWidth;
  render.bounds.max.y = window.innerHeight;
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;

}

function getRandomColour() {
  const colours = ['#ff5733', '#ffbd33', '#dbff33', '#75ff33', '#33ff57', '#33ffbd'];
  return colours[Math.floor(Math.random() * colours.length)];
}

class Cannon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.head = Bodies.circle(x, y, 90, { isStatic: true, collisionFilter: { category: noCollide } });
    this.arm = Bodies.rectangle(x + 80, y, 150, 30, { friction: 0.0001, isStatic: true, collisionFilter: { category: noCollide } })
    this.arm.position.x -= 75;
    this.arm.positionPrev.x -= 75;
    Composite.add(eng.world, [this.head, this.arm]);
  }

  shoot() {
    const ball = Bodies.circle(this.x, this.y, 10, { friction: 0.0001, collisionFilter: { category: noCollide }, render: { fillStyle: getRandomColour() } });

    Body.applyForce(ball, ball.position, { x: Common.random(0, 0.02), y: this.angle * 0.05 });
    Composite.add(eng.world, ball);
  }

  rotate(angle) {
    this.angle = angle;
    Body.setAngle(this.arm, this.angle);
  }
}

let cannon;

function main() {
  resize();
  window.addEventListener('resize', resize);
  var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60, { isStatic: true, collisionFilter: { category: noCollide } });
  cannon = new Cannon(300, 200);

  // add ground
  Composite.add(eng.world, ground);
  // run the renderer
  Render.run(render);
  // create runner
  var runner = Runner.create();
  // run the engine
  Runner.run(runner, eng);

  setInterval(() => {
    // const angle = Common.random(0, Math.PI)
    // console.log("rotating", angle);
    // cannon.rotate(angle);
    cannon.shoot()
  }, 500);
}



main();