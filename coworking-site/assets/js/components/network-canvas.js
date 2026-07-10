/**
 * Rede de conexões animada em canvas.
 * Pontos que se movem devagar e desenham linhas entre si quando próximos —
 * representa visualmente o conceito de "conectar profissionais" da marca.
 * Reutilizável em qualquer tela que precise desse fundo (login, cadastro...).
 */
export function initNetworkCanvas(canvas, options = {}) {
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const config = {
    nodeCount: options.nodeCount ?? 46,
    maxDistance: options.maxDistance ?? 140,
    color: options.color ?? '251, 191, 36', // RGB do dourado, sem o alpha
    speed: options.speed ?? 0.15,
  };

  let nodes = [];

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createNodes() {
    nodes = Array.from({ length: config.nodeCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
    }));
  }

  function step() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxDistance) {
          const opacity = (1 - dist / config.maxDistance) * 0.3;
          ctx.strokeStyle = `rgba(${config.color}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.color}, 0.55)`;
      ctx.fill();
    });

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  resize();
  createNodes();
  step(); // desenha ao menos um frame, mesmo com movimento reduzido

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });
}