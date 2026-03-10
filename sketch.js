/* Slime Hunter: Slime Quest
   Built by: Karen Wu
*/

let hero, slimes, platforms;
let bgImg, heroImg, slimeImg;

function preload() {
  // Matching your folder structure exactly from image_f49e34.png
  bgImg = loadImage("assets/background_layer.png");
  heroImg = loadImage("assets/main_player.png");
  slimeImg = loadImage("assets/blue_slime.png");
}

function setup() {
  new Canvas(600, 240, "pixelated");
  world.gravity.y = 12;

  // 1. THE HERO (Based on Tiny Hero layout)
  hero = new Sprite(50, 150, 14, 24);
  hero.rotationLock = true;
  hero.friction = 0;

  // Manual mapping for the Tiny Hero sheet
  // Note: We use the sheet from main_player.png
  hero.addAnis({
    idle: { row: 3, frames: 4, frameDelay: 10 },
    run: { row: 1, frames: 6, frameDelay: 6 },
    jump: { row: 5, frames: 1, frameDelay: Infinity, frame: 2 },
    attack: { row: 2, frames: 4, frameDelay: 4 },
  });
  hero.ani = "idle";

  // 2. THE ENEMIES (Blue Slime)
  slimes = new Group();
  slimes.w = 20;
  slimes.h = 14;
  slimes.addAnis({
    move: { row: 2, frames: 7, frameDelay: 8 },
  });

  // 3. THE WORLD
  platforms = new Group();
  platforms.collider = "static";
  platforms.visible = false; // We use the BG for visuals, platforms are "invisible" hitboxes

  // Floor that matches the grass in your Forest background
  new platforms.Sprite(600, 230, 1200, 20);

  // 4. SPAWN ENEMIES
  for (let i = 0; i < 3; i++) {
    let s = new slimes.Sprite(300 + i * 200, 200);
    s.vel.x = -1;
  }
}

function draw() {
  // Draw background first
  // We use camera.off() so the background doesn't scroll away from us
  push();
  camera.off();
  image(bgImg, 0, 0, width, height);
  pop();

  // Camera follows hero
  camera.x = hero.x;

  // Hero Controls
  if (kb.pressing("left")) {
    hero.vel.x = -2.5;
    hero.mirror.x = true;
    hero.ani = "run";
  } else if (kb.pressing("right")) {
    hero.vel.x = 2.5;
    hero.mirror.x = false;
    hero.ani = "run";
  } else {
    hero.vel.x = 0;
    if (hero.ani.name !== "attack") hero.ani = "idle";
  }

  if (kb.presses("up") && hero.grounded) {
    hero.vel.y = -5;
  }
  if (!hero.grounded) hero.ani = "jump";

  if (kb.presses("space")) {
    hero.ani = "attack";
  }

  // Combat Logic
  hero.collides(slimes, (h, s) => {
    if (h.ani.name === "attack") {
      s.remove();
    } else {
      h.x = 50; // Reset position on hit
      h.y = 150;
    }
  });

  // Slime patrol behavior
  for (let s of slimes) {
    if (s.x < 100 || s.x > 1100) s.vel.x *= -1;
  }
}
