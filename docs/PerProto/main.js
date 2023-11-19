// The title of the game to be displayed on the title screen
title = "MONARCHS ODYSSEY";

// The description, which is also displayed on the title screen
description = `
Destroy enemies.
Gain powers.
`;

// The array of custom sprites
characters = [
// player model "a"
` 
 l
 l
clc
clc
clc
c c
`,
//mid tier enemy "b"
`
PPPPPP
rPPPPr
PPPPPP
lPPPPl
llllll
PPPPPP
`,
//mid tier enemy bullet "c"
`
y  y
yyyyyy
 y  y
yyyyyy
 y  y
`,
//powerup "d"
`
  bb
 bbbb
bbbbbb
bbbbbb
 llll
  ll
`,
//beginning enemies "e"
`
RR  RR
RR  RR
RRRRRR
RRRRRR
RRRRRR
  RR
  RR
`,
//beginning enemies bullet "f"
`
pp
pp
`,
//high tier enemies "g"
`
g    g
 gggg
 lggl
gggggg
gllllg
 gggg
`,
//high tier enemeies bullet "h"
`
yyyyyy
yyyyyy
yyyyyy
yyyyyy
yyyyyy
yyyyyy
`
];

// Game design variable container
const G = {
	WIDTH: 100,
	HEIGHT: 150,

    STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
    
    PLAYER_FIRE_RATE: 20,

    FBULLET_SPEED: 2.5,

    FPOWERUP_MIN_SPEED: 1.0,
    FPOWERUP_MAX_SPEED: 3.0,

    ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0,
    ENEMY_FIRE_RATE: 45,
    

    EBULLET_SPEED: 2.0,
    EBULLET_SPEED1: 1,
    EBULLET_ROTATION_SPD: 0.1
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    isPlayingBgm: true,
    isReplayEnabled: true,
    theme: "shapeDark"
};

// JSDoc comments for typing
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star [] }
 */
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number,
 * isFiringLeft: boolean,
 * hasPowerUp: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} FBullet
 */

/**
 * @type { FBullet [] }
 */
let fBullets;

/**
 * @typedef {{
* pos: Vector
* }} FPowerUp
*/

/**
* @type { FPowerUp [] }
*/
let fPowerUp;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @typedef {{
* pos: Vector,
* firingCooldown: number
* }} Enemy1
*/

/**
* @type { Enemy [] }
*/
let enemies1;

/**
 * @typedef {{
* pos: Vector,
* firingCooldown: number
* rotation: number
* }} Enemy2
*/

/**
* @type { Enemy [] }
*/
let enemies2;

/**
* @typedef {{
* pos: Vector,
* angle: number,
* rotation: number
* }} EBullet1
*/

/**
* @typedef {{
* pos: Vector,
* angle: number,
* rotation: number
* }} EBullet2
*/

/**
 * @type { EBullet [] }
 */
let eBullets;

/**
 * @type { EBullet1 [] }
 */
let eBullets1;

/**
 * @type { EBullet1 [] }
 */
let eBullets2;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let currentFPowerupSpeed;

/**
 * @type { number }
 */
let waveCount;

/**
 * 
 */

// The game loop function
function update() {
    // The init function running at startup
	if (!ticks) {
        // A CrispGameLib function
        // First argument (number): number of times to run the second argument
        // Second argument (function): a function that returns an object. This
        // object is then added to an array. This array will eventually be
        // returned as output of the times() function.
		//  STARS
        stars = times(20, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            // An object of type Star with appropriate properties
            return {
                // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
                speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
            };
        }); 

        player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
            firingCooldown: G.PLAYER_FIRE_RATE,
            isFiringLeft: true,
            hasPowerUp: 0
        };

        fBullets = [];
        fPowerUp = [];
        enemies = [];
        enemies1 = [];
        enemies2 = [];
        eBullets = [];
        eBullets1 = [];
        eBullets2 = [];
        waveCount = 0;
	}

    // Spawning middle tier enemies
    if (enemies.length === 0 && waveCount >= 5) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 5; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            enemies.push({
                pos: vec(posX, posY),
                firingCooldown: G.ENEMY_FIRE_RATE 
            });
        }
        waveCount++; // Increase the tracking variable by one
    }

    // Spawning starter enemies
    if (enemies1.length === 0 && waveCount < 5) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 5; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            enemies1.push({
                pos: vec(posX, posY),
                firingCooldown: G.ENEMY_FIRE_RATE 
            });
        }
        waveCount++; // Increase the tracking variable by one
    }

    // Spawning high tier enemies
    if (enemies2.length === 0 && waveCount > 5) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 5; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            enemies2.push({
                pos: vec(posX, posY),
                firingCooldown: G.ENEMY_FIRE_RATE 
            });
        }
    }

    // Spawning powerups
    if (fPowerUp.length === 0) {
        currentFPowerupSpeed =
            rnd(G.FPOWERUP_MIN_SPEED, G.FPOWERUP_MAX_SPEED) * difficulty;
        for (let i = 0; i < 2; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            fPowerUp.push({
                pos: vec(posX, posY),
            });
        }
    }

    // Update for Star
    stars.forEach((s) => {
        // Move the star downwards
        s.pos.y += s.speed;
        // Bring the star back to top once it's past the bottom of the screen
        if (s.pos.y > G.HEIGHT) s.pos.y = 0;

        // Choose a color to draw
        color("light_blue");
        // Draw the star as a square of size 1
        box(s.pos, 1);
    });

    // Updating and drawing the player
    player.pos = vec(input.pos.x, input.pos.y);
    player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    // Cooling down for the next shot
    player.firingCooldown--;
    
    // Time to fire the next shot
    if (player.firingCooldown <= 0) {
        // Create the bullet
        fBullets.push({
            pos: vec(player.pos.x, player.pos.y)
        });
        // Switch the side of the firing gun by flipping the boolean value
        //player.isFiringLeft = !player.isFiringLeft;
        if (player.firingCooldown <= 0 && player.hasPowerUp >= 0) {  
            fBullets.push({
                pos: vec(player.pos.x, player.pos.y)
            });
        } 

        color("yellow");
        // Generate particles
        particle(
            player.pos.x, // x coordinate
            player.pos.y, // y coordinate
            4, // The number of particles
            1, // The speed of the particles
            -PI/2, // The emitting angle
            PI/4  // The emitting width
        );
        // Reset the firing cooldown
        player.firingCooldown = G.PLAYER_FIRE_RATE;
    }  
    
    // Time to fire the next shot
    if (player.firingCooldown <= 0 && player.hasPowerUp >= 0) {
        // Create the bullet
        fBullets.push({
            pos: vec(player.pos.x /*+ offset*/, player.pos.y)
        });
        // Reset the firing cooldown
        player.firingCooldown = G.PLAYER_FIRE_RATE;
        // Switch the side of the firing gun by flipping the boolean value
        //player.isFiringLeft = !player.isFiringLeft;
    
        color("yellow");
        // Generate particles
        particle(
            player.pos.x /*+ offset*/, // x coordinate
            player.pos.y, // y coordinate
            4, // The number of particles
            1, // The speed of the particles
            -PI/2, // The emitting angle
            PI/4  // The emitting width
        );
    } 
        
    color ("black");
    char("a", player.pos);
    
    // text(fBullets.length.toString(), 3, 10);

    // Updating and drawing bullets
    fBullets.forEach((fb) => {
        fb.pos.y -= G.FBULLET_SPEED;

        // Drawing fBullets for the first time, allowing interaction from enemies
        color("yellow");
        if(player.hasPowerUp >= 0) {
            box(fb.pos, player.hasPowerUp);
        }
        //box(fb.pos, 2);
    });


    //powerups logic
    remove(fPowerUp, (e) => {
        e.pos.y += currentFPowerupSpeed;
        color("black");
        const isCollidingWithPlayer = char("d", e.pos).isColliding.char.a;
        if (isCollidingWithPlayer) {
            player.hasPowerUp++;
        }

        return (isCollidingWithPlayer || e.pos.y > G.HEIGHT);
    });

    //mid tier enemies logic
    remove(enemies, (e) => {
        e.pos.y += currentEnemySpeed;
        e.firingCooldown--;
        if (e.firingCooldown <= 0) {
            eBullets.push({
                pos: vec(e.pos.x, e.pos.y),
                angle: e.pos.angleTo(player.pos),
                rotation: rnd()
            });
            e.firingCooldown = G.ENEMY_FIRE_RATE;
            play("select");
        }

        color("black");
        // Interaction from enemies to fBullets
        // Shorthand to check for collision against another specific type
        // Also draw the sprits
        const isCollidingWithFBullets = char("b", e.pos).isColliding.rect.yellow;
        const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
        if (isCollidingWithPlayer) {
            if(player.hasPowerUp >= 0) {
                return 
            }
            else {
            end();
            play("powerUp");
            }
        }
        
        if (isCollidingWithFBullets) {
            color("yellow");
            particle(e.pos);
            play("explosion");
            addScore(20 * waveCount, e.pos);
        }
        
        // Also another condition to remove the object
        return (isCollidingWithFBullets || e.pos.y > G.HEIGHT);
    });

    //beginning enemies logic
    remove(enemies1, (e) => {
        e.pos.y += currentEnemySpeed;
        e.firingCooldown--;
        if (e.firingCooldown <= 0) {
            eBullets1.push({
                pos: vec(e.pos.x, e.pos.y),
                angle: e.pos.angleTo(player.pos),
                rotation: rnd()
            });
            e.firingCooldown = G.ENEMY_FIRE_RATE;
            play("select");
        }

        color("black");
        // Interaction from enemies to fBullets
        // Shorthand to check for collision against another specific type
        // Also draw the sprits
        const isCollidingWithFBullets = char("e", e.pos).isColliding.rect.yellow;
        const isCollidingWithPlayer = char("e", e.pos).isColliding.char.a;
        if (isCollidingWithPlayer) {
            if(player.hasPowerUp >= 0) {
                return 
            }
            else {
            end();
            play("powerUp");
            }
        }
        
        if (isCollidingWithFBullets) {
            color("yellow");
            particle(e.pos);
            play("explosion");
            addScore(10 * waveCount, e.pos);
        }
        
        // Also another condition to remove the object
        return (isCollidingWithFBullets || e.pos.y > G.HEIGHT);
    }); 

    //high tier enemies logic
    remove(enemies2, (e) => {
        e.pos.y += currentEnemySpeed;
        e.firingCooldown--;
        if (e.firingCooldown <= 0) {
            eBullets2.push({
                pos: vec(e.pos.x, e.pos.y),
                angle: e.pos.angleTo(player.pos),
                rotation: rnd()
            });
            e.firingCooldown = G.ENEMY_FIRE_RATE;
            play("select");
        }

        color("black");
        // Interaction from enemies to fBullets
        // Shorthand to check for collision against another specific type
        // Also draw the sprits
        const isCollidingWithFBullets = char("g", e.pos).isColliding.rect.yellow;
        const isCollidingWithPlayer = char("g", e.pos).isColliding.char.a;
        if (isCollidingWithPlayer) {
            if(player.hasPowerUp >= 0) {
                return 
            }
            else {
            end();
            play("powerUp");
            }
        }
        
        if (isCollidingWithFBullets) {
            color("yellow");
            particle(e.pos);
            play("explosion");
            addScore(30 * waveCount, e.pos);
        }
        
        // Also another condition to remove the object
        return (isCollidingWithFBullets || e.pos.y > G.HEIGHT);
    }); 

    //friendly bullets logic
    remove(fBullets, (fb) => {
        // Interaction from fBullets to enemies, after enemies have been drawn
        color("yellow");
        const isCollidingWithEnemies = box(fb.pos, 2).isColliding.char.b;
        return (isCollidingWithEnemies || fb.pos.y < 0);
    });

    //mid tier enemies bullets logic
    remove(eBullets, (eb) => {
        // Old-fashioned trigonometry to find out the velocity on each axis
        eb.pos.x += G.EBULLET_SPEED * Math.cos(eb.angle);
        eb.pos.y += G.EBULLET_SPEED * Math.sin(eb.angle);
        // The bullet also rotates around itself
        eb.rotation += G.EBULLET_ROTATION_SPD;

        color("red");
        const isCollidingWithPlayer
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.char.a;

        if (isCollidingWithPlayer) {
            // End the game
            end();
            play("powerUp");
        }

        const isCollidingWithFBullets
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.rect.yellow;
        if (isCollidingWithFBullets) addScore(5, eb.pos);
        
        // If eBullet is not onscreen, remove it
        return (!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT) || isCollidingWithFBullets);
    });

    //beginning enemies bullets logic
    remove(eBullets1, (eb) => {
        // Old-fashioned trigonometry to find out the velocity on each axis
        eb.pos.x += G.EBULLET_SPEED1 * Math.cos(eb.angle);
        eb.pos.y += G.EBULLET_SPEED1 * Math.sin(eb.angle);
        // The bullet also rotates around itself
        eb.rotation += G.EBULLET_ROTATION_SPD;

        color("red");
        const isCollidingWithPlayer
            = char("f", eb.pos, {rotation: eb.rotation}).isColliding.char.a;

        if (isCollidingWithPlayer) {
            // End the game
            end();
            play("powerUp");
        }

        const isCollidingWithFBullets
            = char("f", eb.pos, {rotation: eb.rotation}).isColliding.rect.yellow;
        if (isCollidingWithFBullets) addScore(1, eb.pos);
        
        // If eBullet is not onscreen, remove it
        return (!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT) || isCollidingWithFBullets);
    });

    //high tier enemies bullets logic
    remove(eBullets2, (eb) => {
        // Old-fashioned trigonometry to find out the velocity on each axis
        eb.pos.x += G.EBULLET_SPEED1 * Math.cos(eb.angle);
        eb.pos.y += G.EBULLET_SPEED1 * Math.sin(eb.angle);
        // The bullet also rotates around itself
        eb.rotation += G.EBULLET_ROTATION_SPD;

        color("red");
        const isCollidingWithPlayer
            = char("h", eb.pos, {rotation: eb.rotation}).isColliding.char.a;

        if (isCollidingWithPlayer) {
            // End the game
            end();
            play("powerUp");
        }

        const isCollidingWithFBullets
            = char("h", eb.pos, {rotation: eb.rotation}).isColliding.rect.yellow;
        if (isCollidingWithFBullets) addScore(10, eb.pos);
        
        // If eBullet is not onscreen, remove it
        return (!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT) || isCollidingWithFBullets);
    });

}