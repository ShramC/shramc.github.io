const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let w, h, particles;
const PARTICLE_COUNT = 80;
const CONNECT_DIST = 150;
const MOUSE = { x: null, y: null };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;

    if (MOUSE.x !== null) {
      const dx = MOUSE.x - this.x;
      const dy = MOUSE.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02;
        this.vx += dx * force * 0.01;
        this.vy += dy * force * 0.01;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 45, 85, ${this.alpha})`;
    ctx.fill();
  }
}

function init() {
  resize();
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 45, 85, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
});

window.addEventListener('mousemove', (e) => {
  MOUSE.x = e.clientX;
  MOUSE.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  MOUSE.x = null;
  MOUSE.y = null;
});

init();
animate();
