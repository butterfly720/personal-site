/* ============================================================
   童泓昊 · 个人主页 —— 交互脚本
   纯原生 JS，无依赖。包含：
   1. 数据定义（技能 / 项目）  2. 渲染函数   3. 技能筛选
   4. 导航与滚动状态          5. 移动端菜单  6. 滚动进场
   7. 年份与回到顶部
   ============================================================ */

/* ---------- 1. 数据定义 ---------- */
const SKILLS = [
  {
    icon: '网',
    title: '网络与路由交换',
    tags: ['VLAN', '三层交换', 'DHCP', '静态路由', 'Packet Tracer', '子网划分']
  },
  {
    icon: '安',
    title: '网络信息安全',
    tags: ['Wireshark', '抓包分析', '恶意代码特征', '防御策略', '访问控制']
  },
  {
    icon: '编',
    title: '编程与基础',
    tags: ['HTML', 'CSS', 'JavaScript', 'C 语言', '数据结构', 'Git']
  },
  {
    icon: 'AI',
    title: '工具与平台',
    tags: ['WorkBuddy', 'Trae', 'SDN', 'Linux 基础', 'Markdown']
  }
];

const PROJECTS = [
  {
    badge: '课程设计',
    badgeClass: 'blue',
    title: '校园局域网设计与实现',
    desc: '用 Cisco Packet Tracer 搭建覆盖多栋楼宇的校园 LAN：按功能划分 VLAN，配置三层交换实现跨 VLAN 通信，规划 DHCP 地址池并完成服务器区（WEB / FTP / DNS）的联通性调试。',
    tags: ['Packet Tracer', 'VLAN 21~26', '三层交换', 'DHCP']
  },
  {
    badge: '安全实践',
    badgeClass: '',
    title: '恶意代码特征分析与防御报告',
    desc: '从样本行为特征、传播机制、驻留方式三个维度拆解典型恶意代码，结合抓包数据验证判断，并整理出可落地的分层防护建议。',
    tags: ['网络信息安全', '特征分析', 'Wireshark', '防御策略']
  },
  {
    badge: '个人项目',
    badgeClass: 'amber',
    title: '本站：纯静态个人主页',
    desc: '不用任何框架，从零手写 HTML 语义结构、CSS 布局与原生 JS 交互，并完整走通「本地开发 → Git 管理 → 云端部署 → 域名绑定」的上线闭环。',
    tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages']
  }
];

/* ---------- 2. 渲染函数 ---------- */
function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.innerHTML = SKILLS.map(group => `
    <div class="skill-card" data-tags="${group.tags.join('|')}">
      <h3><span class="skill-ico">${group.icon}</span>${group.title}</h3>
      <div class="tags">
        ${group.tags.map(t => `<button class="tag" type="button">${t}</button>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderProjects() {
  const box = document.getElementById('project-cards');
  if (!box) return;

  box.innerHTML = PROJECTS.map(p => `
    <article class="card reveal">
      <div class="card-top">
        <span class="card-badge ${p.badgeClass}">${p.badge}</span>
      </div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="card-tags">
        ${p.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

/* ---------- 3. 技能筛选 ---------- */
function initSkillFilter() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  let active = null;

  grid.addEventListener('click', e => {
    const tag = e.target.closest('.tag');
    if (!tag) return;

    const label = tag.textContent.trim();

    // 再次点击同一标签 = 取消筛选
    if (active === label) {
      active = null;
      grid.querySelectorAll('.tag').forEach(t => t.classList.remove('is-on'));
      grid.querySelectorAll('.skill-card').forEach(c => c.classList.remove('is-dim'));
      return;
    }

    active = label;
    grid.querySelectorAll('.tag').forEach(t => {
      t.classList.toggle('is-on', t.textContent.trim() === label);
    });
    grid.querySelectorAll('.skill-card').forEach(card => {
      const has = card.dataset.tags.split('|').includes(label);
      card.classList.toggle('is-dim', !has);
    });
  });
}

/* ---------- 4. 导航与滚动状态 ---------- */
function initNavState() {
  const header = document.querySelector('.site-header');
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const onScroll = () => {
    // 顶栏阴影
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);

    // 当前所在区块高亮
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= y) current = sec;
    });
    links.forEach(a => {
      a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id);
    });

    // 回到顶部按钮
    const btn = document.getElementById('to-top');
    if (btn) btn.classList.toggle('is-show', window.scrollY > 420);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- 5. 移动端菜单 ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });

  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
}

/* ---------- 6. 滚动进场 ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}

/* ---------- 7. 年份与回到顶部 ---------- */
function initMisc() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const btn = document.getElementById('to-top');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ---------- 启动 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderProjects();
  initSkillFilter();
  initNavState();
  initMobileMenu();
  initReveal();
  initMisc();
});
