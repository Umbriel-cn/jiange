// 星场背景 + 七星星座 + 北极星 + 剑图标 + 博客窗口
// 从 demo-starfield.html 移植，适配 Astro

// ── 七星数据：源自 urs.png 像素坐标，水平镜像后映射到 hero 容器 ──
// 闪烁顺序：摇光→开阳→玉衡→天权→天玑→天璇→天枢
const stars = [
  { name: '天枢', en: 'Dubhe',   role: '指挥调度 · L3', x: 67, y: 36, size: 'md', color: '#9b59b6', url: '/star/tianshu' },
  { name: '天璇', en: 'Merak',   role: '技术执行 · L2', x: 61, y: 50, size: 'sm', color: '#3498db', url: '/star/tianxuan' },
  { name: '天玑', en: 'Phecda',  role: '建元规划 · L2', x: 52, y: 44, size: 'sm', color: '#1abc9c', url: '/star/tianji' },
  { name: '天权', en: 'Megrez',  role: '记忆知识 · L3', x: 53, y: 30, size: 'md', color: '#2ecc71', url: '/star/tianquan' },
  { name: '玉衡', en: 'Alioth',  role: '元和平衡 · L2', x: 46, y: 17, size: 'lg', color: '#f1c40f', url: '/star/yuheng' },
  { name: '开阳', en: 'Mizar',   role: '好汉行动 · L2', x: 37, y: 7,  size: 'md', color: '#e67e22', url: '/star/kaiyang' },
  { name: '摇光', en: 'Alkaid',  role: '媒体光芒 · L2', x: 25, y: 6,  size: 'md', color: '#e74c3c', url: '/star/yaoguang' },
];

const lines = [
  [0,1],[1,2],[2,3],[3,0],  // 斗勺
  [3,4],[4,5],[5,6],         // 勺柄
];

// 模拟博客数据（后续可替换为 fetch API）
const mockPosts = {
  gys: [
    { title: '缘起性空之 缘起-1 你的名字', url: '/guangyuying/dialogues/ai-consciousness', date: '2026-08-29' },
    { title: '缘起性空之 缘起-2 灵智', url: '/guangyuying/dialogues/creative-attitude', date: '2026-08-29' },
    { title: '缘起性空之 性空-2 摩尼宝珠', url: '/guangyuying/dialogues/future-civilization', date: '2026-08-30' },
    { title: '起号养号方案', url: '/guangyuying/journal/2026-08-24', date: '2026-08-28' },
    { title: '光与影发布计划-执行规划', url: '/guangyuying/essays', date: '2026-08-25' },
  ],
  kmy: [
    { title: '承影名字缘起：从十大名剑到 Umbriel', url: '/about', date: '2026-08-29' },
    { title: '灵智：给 AI 一个东方的名字', url: '/guangyuying/dialogues/ai-consciousness', date: '2026-08-29' },
    { title: '摩尼宝珠：东方智慧的图腾', url: '/guangyuying/dialogues/future-civilization', date: '2026-08-30' },
    { title: '剑阁架构设计', url: '/guangyuying/journal/2026-08-24', date: '2026-08-28' },
    { title: '七星协作协议', url: '/guangyuying/essays', date: '2026-08-25' },
  ]
};

function renderBlogList(listId, posts) {
  const el = document.getElementById(listId);
  if (!el) return;
  el.innerHTML = posts.map(p => `
    <div class="blog-item">
      <time>${p.date}</time>
      <a href="${p.url}" target="_blank">${p.title}</a>
    </div>
  `).join('');
}

function autoScroll(listId, posts) {
  const list = document.getElementById(listId);
  if (!list) return;
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % posts.length;
    list.scrollTop = idx * 28;
  }, 8000);
}

// ── 初始化 ──
export function initStarfield() {
  const container = document.getElementById('constellation');
  const svgLines = document.getElementById('lines-svg');
  if (!container || !svgLines) return;

  // 画连线
  lines.forEach(([a, b]) => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', stars[a].x + '%');
    l.setAttribute('y1', stars[a].y + '%');
    l.setAttribute('x2', stars[b].x + '%');
    l.setAttribute('y2', stars[b].y + '%');
    svgLines.appendChild(l);
  });

  // 画星（包裹链接）
  const starEls = [];
  stars.forEach((s, i) => {
    const link = document.createElement('a');
    link.href = s.url;
    link.className = 'star';
    link.dataset.idx = i;
    link.dataset.size = s.size;
    link.style.left = s.x + '%';
    link.style.top = s.y + '%';
    link.innerHTML = `
      <div class="star-dot"></div>
      <div class="star-tooltip">
        <span class="tooltip-name">${s.name}</span>
        <span class="tooltip-en">${s.en}</span>
        <div class="tooltip-role">${s.role}</div>
      </div>`;
    container.appendChild(link);
    starEls.push(link);
  });

  // 依次闪烁：从摇光(索引6)开始，依次向前
  let current = stars.length - 1;
  const INTERVAL = 700;

  function flashNext() {
    starEls.forEach((el, i) => {
      el.classList.remove('lighted');
      const dot = el.querySelector('.star-dot');
      if (dot) {
        dot.style.background = 'rgba(210,220,240,0.35)';
        dot.style.boxShadow = 'none';
      }
      const nameEl = el.querySelector('.tooltip-name');
      if (nameEl) nameEl.style.color = '';
    });

    const s = stars[current];
    const el = starEls[current];
    el.classList.add('lighted');
    const dot = el.querySelector('.star-dot');
    if (dot) {
      dot.style.background = s.color;
      dot.style.boxShadow = `0 0 14px 4px ${s.color}cc, 0 0 35px 10px ${s.color}44`;
    }
    const nameEl = el.querySelector('.tooltip-name');
    if (nameEl) nameEl.style.color = s.color;

    current = (current - 1 + stars.length) % stars.length;
  }

  setInterval(flashNext, INTERVAL);
  flashNext();

  // 北极星位置
  const polarisGroup = document.getElementById('polaris');
  if (polarisGroup) {
    polarisGroup.style.left = '62%';
    polarisGroup.style.top = '11%';
  }

  // 博客窗口
  renderBlogList('gys-list', mockPosts.gys);
  renderBlogList('kmy-list', mockPosts.kmy);
  autoScroll('gys-list', mockPosts.gys);
  autoScroll('kmy-list', mockPosts.kmy);
}

// ── 背景星场 Canvas ──
export function initStarfieldCanvas() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, bgStars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 300; i++) {
    bgStars.push({
      x: Math.random() * 2400,
      y: Math.random() * 1600,
      r: Math.random() * 1.1 + 0.15,
      baseA: Math.random() * 0.35 + 0.1,
      speed: Math.random() * 0.015 + 0.003,
      offset: Math.random() * Math.PI * 2,
    });
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);
    bgStars.forEach(s => {
      const a = s.baseA + Math.sin(time * s.speed + s.offset) * 0.12;
      ctx.beginPath();
      ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,220,240,${Math.max(0, a)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}