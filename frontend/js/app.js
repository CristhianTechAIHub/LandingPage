/* ══════════════════════════════
   CONFIG — cambia por la URL de Railway al desplegar
══════════════════════════════ */
const API_URL = 'https://portfolio-backend-production-8442.up.railway.app';

/* ══════════════════════════════
   API HELPERS
══════════════════════════════ */
async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    if (res.status === 204) return null;
    return res.json();
}

/* ══════════════════════════════
   STATE
══════════════════════════════ */
let SKILLS = [];
let PROJECTS = [];

async function loadData() {
    [SKILLS, PROJECTS] = await Promise.all([
        apiFetch('/api/skills/'),
        apiFetch('/api/projects/'),
    ]);
}

/* ══════════════════════════════
   EDITOR MODE
══════════════════════════════ */
const EDITOR_PASSWORD = 'cristhian2025';
let editorMode = sessionStorage.getItem('editorMode') === 'true';

function applyEditorMode() {
    document.body.classList.toggle('editor-mode', editorMode);
    const btn = document.getElementById('lockBtn');
    if (!btn) return;
    btn.innerHTML = editorMode ? '🔓 Exit' : '🔒 Edit';
}

function onLockClick() {
    if (editorMode) {
        editorMode = false;
        sessionStorage.removeItem('editorMode');
        applyEditorMode();
        renderPanel();
    } else {
        document.getElementById('passOverlay').classList.add('open');
        setTimeout(() => document.getElementById('passInput').focus(), 80);
    }
}

function submitPassword() {
    const val = document.getElementById('passInput').value;
    const err = document.getElementById('passError');
    if (val === EDITOR_PASSWORD) {
        editorMode = true;
        sessionStorage.setItem('editorMode', 'true');
        applyEditorMode();
        closePassModal();
        renderPanel();
    } else {
        err.classList.add('visible');
        document.getElementById('passInput').value = '';
        document.getElementById('passInput').focus();
    }
}

function closePassModal() {
    document.getElementById('passOverlay').classList.remove('open');
    document.getElementById('passInput').value = '';
    document.getElementById('passError').classList.remove('visible');
}

document.getElementById('passInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitPassword();
    if (e.key === 'Escape') closePassModal();
});

/* ══════════════════════════════
   SKILLS CRUD
══════════════════════════════ */
function openSkillForm(skillId = null) {
    document.getElementById('skillNameInput').value = '';
    document.getElementById('skillEditId').value = '';
    document.getElementById('skillNameError').classList.remove('visible');
    if (skillId) {
        const s = SKILLS.find(x => x.id === skillId);
        if (s) {
            document.getElementById('skillFormTitle').textContent = 'Editar especialidad';
            document.getElementById('skillNameInput').value = s.label;
            document.getElementById('skillEditId').value = s.id;
        }
    } else {
        document.getElementById('skillFormTitle').textContent = 'Nueva especialidad';
    }
    document.getElementById('skillFormOverlay').classList.add('open');
    setTimeout(() => document.getElementById('skillNameInput').focus(), 80);
}

function closeSkillForm() {
    document.getElementById('skillFormOverlay').classList.remove('open');
}

async function saveSkillForm() {
    const label = document.getElementById('skillNameInput').value.trim();
    const err = document.getElementById('skillNameError');
    if (!label) { err.classList.add('visible'); return; }
    err.classList.remove('visible');

    const editId = document.getElementById('skillEditId').value;
    try {
        if (editId) {
            await apiFetch(`/api/skills/${editId}`, { method: 'PUT', body: JSON.stringify({ label }) });
        } else {
            await apiFetch('/api/skills/', { method: 'POST', body: JSON.stringify({ label }) });
        }
        await loadData();
        closeSkillForm();
        if (!SKILLS.find(s => s.id === activeSkill)) activeSkill = SKILLS[0]?.id;
        renderTabs();
        renderPanel();
        if (document.getElementById('skillsCheckGroup').children.length) refreshSkillsCheckboxes();
    } catch {
        err.textContent = 'Error al guardar. Intenta de nuevo.';
        err.classList.add('visible');
    }
}

async function deleteSkill(skillId) {
    if (SKILLS.length <= 1) { alert('Debe existir al menos una especialidad.'); return; }
    if (!confirm('¿Eliminar esta especialidad?')) return;
    await apiFetch(`/api/skills/${skillId}`, { method: 'DELETE' });
    await loadData();
    if (activeSkill === skillId) activeSkill = SKILLS[0].id;
    renderTabs();
    renderPanel();
}

function refreshSkillsCheckboxes() {
    const currentChecked = Array.from(document.querySelectorAll('#skillsCheckGroup input:checked')).map(cb => cb.value);
    document.getElementById('skillsCheckGroup').innerHTML = SKILLS.map(s =>
        `<label class="skill-check-label">
            <input type="checkbox" value="${s.id}" name="fSkill"${currentChecked.includes(s.id) ? ' checked' : ''}> ${s.label}
        </label>`
    ).join('');
}

document.getElementById('skillNameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveSkillForm();
    if (e.key === 'Escape') closeSkillForm();
});

/* ══════════════════════════════
   PROJECT FORM
══════════════════════════════ */
let featureCount = 0;

function openProjectForm(projectId) {
    if (!editorMode) return;
    featureCount = 0;
    document.getElementById('featuresList').innerHTML = '';
    document.getElementById('fEditId').value = '';
    document.getElementById('formTitle').textContent = 'Nuevo proyecto';
    document.getElementById('deleteBtn').style.display = 'none';
    ['fName','fClient','fExcerpt','fDescription','fTech','fImage','fGithub','fVideo'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('imgPreview').classList.remove('visible');

    document.getElementById('skillsCheckGroup').innerHTML = SKILLS.map(s =>
        `<label class="skill-check-label">
            <input type="checkbox" value="${s.id}" name="fSkill"> ${s.label}
        </label>`
    ).join('');

    if (projectId) {
        const p = PROJECTS.find(x => x.id === projectId);
        if (!p) return;
        document.getElementById('formTitle').textContent = 'Editar proyecto';
        document.getElementById('deleteBtn').style.display = 'inline-flex';
        document.getElementById('fEditId').value = p.id;
        document.getElementById('fName').value = p.name || '';
        document.getElementById('fClient').value = p.client || '';
        document.getElementById('fExcerpt').value = p.excerpt || '';
        document.getElementById('fDescription').value = p.description || '';
        document.getElementById('fTech').value = (p.tech || []).join(', ');
        document.getElementById('fImage').value = (p.images || [])[0] || '';
        document.getElementById('fGithub').value = p.github || '';
        document.getElementById('fVideo').value = p.video || '';
        previewImage();
        document.querySelectorAll('#skillsCheckGroup input[type=checkbox]').forEach(cb => {
            cb.checked = (p.skills || []).includes(cb.value);
        });
        (p.features || []).forEach(f => addFeatureRow(f.label, f.text));
    } else {
        addFeatureRow();
    }

    document.getElementById('formOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProjectForm() {
    document.getElementById('formOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function addFeatureRow(label = '', text = '') {
    featureCount++;
    const row = document.createElement('div');
    row.className = 'feature-row';
    row.dataset.idx = featureCount;
    row.innerHTML = `
        <input class="form-input" placeholder="Título (ej: Visión · Localización)" value="${label}">
        <textarea class="form-textarea" placeholder="Descripción técnica de esta característica..." rows="2">${text}</textarea>
        <button class="remove-feature-btn" type="button" onclick="this.parentElement.remove()">✕</button>
    `;
    document.getElementById('featuresList').appendChild(row);
}

function previewImage() {
    const url = document.getElementById('fImage').value.trim();
    const img = document.getElementById('imgPreview');
    if (url) { img.src = url; img.classList.add('visible'); }
    else { img.classList.remove('visible'); }
}

async function uploadImageFile(input) {
    const file = input.files[0];
    if (!file) return;
    const statusEl = document.getElementById('uploadStatus');
    if (statusEl) statusEl.textContent = 'Subiendo imagen...';

    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await fetch(`${API_URL}/api/uploads/image`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error();
        const data = await res.json();
        document.getElementById('fImage').value = data.url;
        previewImage();
        if (statusEl) statusEl.textContent = '✓ Imagen subida';
    } catch {
        alert('Error al subir la imagen. Usa JPG, PNG o WebP, máximo 5 MB.');
        if (statusEl) statusEl.textContent = '';
    }
    input.value = '';
}

async function saveProjectForm() {
    const name = document.getElementById('fName').value.trim();
    const excerpt = document.getElementById('fExcerpt').value.trim();
    if (!name || !excerpt) { alert('El nombre y el resumen son obligatorios.'); return; }

    const selectedSkills = Array.from(document.querySelectorAll('#skillsCheckGroup input:checked')).map(cb => cb.value);
    const skillsErr = document.getElementById('skillsError');
    if (!selectedSkills.length) {
        skillsErr.classList.add('visible');
        document.getElementById('skillsCheckGroup').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    skillsErr.classList.remove('visible');

    const editId = document.getElementById('fEditId').value;
    const existing = editId ? PROJECTS.find(p => p.id === editId) : null;

    const features = Array.from(document.querySelectorAll('#featuresList .feature-row')).map(row => ({
        label: row.querySelectorAll('input')[0].value.trim(),
        text: row.querySelectorAll('textarea')[0].value.trim(),
    })).filter(f => f.text);

    const tech = document.getElementById('fTech').value.split(',').map(t => t.trim()).filter(Boolean);
    const imageUrl = document.getElementById('fImage').value.trim();

    const payload = {
        name,
        client: document.getElementById('fClient').value.trim(),
        featured: existing?.featured ?? false,
        skills: selectedSkills,
        images: imageUrl ? [imageUrl] : [],
        excerpt,
        description: document.getElementById('fDescription').value.trim(),
        features,
        tech,
        github: document.getElementById('fGithub').value.trim() || null,
        video: document.getElementById('fVideo').value.trim() || null,
    };

    try {
        if (editId) {
            await apiFetch(`/api/projects/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            await apiFetch('/api/projects/', { method: 'POST', body: JSON.stringify(payload) });
        }
        await loadData();
        closeProjectForm();
        renderFeatured();
        renderTabs();
        renderPanel();
    } catch {
        alert('Error al guardar el proyecto. Intenta de nuevo.');
    }
}

async function deleteCurrentProject() {
    const id = document.getElementById('fEditId').value;
    if (!id) return;
    if (!confirm('¿Eliminar este proyecto del portafolio?')) return;
    await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
    await loadData();
    closeProjectForm();
    renderFeatured();
    renderTabs();
    renderPanel();
}

/* ══════════════════════════════
   HIGHLIGHTS (usa campo featured en DB)
══════════════════════════════ */
async function toggleHighlight(projectId, event) {
    event.stopPropagation();
    const p = PROJECTS.find(x => x.id === projectId);
    if (!p) return;
    await apiFetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...p, featured: !p.featured }),
    });
    await loadData();
    renderFeatured();
    renderPanel();
}

/* ══════════════════════════════
   RENDER FEATURED PROJECTS
══════════════════════════════ */
function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    const featured = PROJECTS.filter(p => p.featured);
    const t = TRANSLATIONS[currentLang];
    if (!featured.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span class="empty-state-icon">⭐</span><span class="empty-state-text">${t.featuredEmpty}</span></div>`;
        return;
    }
    grid.innerHTML = featured.map(p => {
        const imgHtml = p.images.length
            ? `<img class="feat-img" src="${p.images[0]}" alt="${p.name}" loading="lazy">`
            : `<div class="feat-img-ph"><span class="feat-img-ph-icon">🛠️</span><span class="feat-img-ph-label">${p.name}</span></div>`;
        const tags = (p.tech || []).slice(0, 5).map(t => `<span class="tbadge">${t}</span>`).join('');
        return `
        <div class="feat-card reveal" onclick="openModal('${p.id}')">
            ${imgHtml}
            <div class="feat-body">
                <p class="feat-num">${p.num}</p>
                <h3 class="feat-name">${p.name}</h3>
                <p class="feat-client">${p.client}</p>
                <p class="feat-excerpt">${p.excerpt}</p>
                <div class="feat-tags">${tags}</div>
                <span class="feat-cta">${t.featuredCta}</span>
            </div>
        </div>`;
    }).join('');
    document.querySelectorAll('.feat-card.reveal').forEach(el => revealObs.observe(el));
}

/* ══════════════════════════════
   RENDER SKILL TABS & PANEL
══════════════════════════════ */
let activeSkill = '';

function renderTabs() {
    const container = document.getElementById('skillTabs');
    const t = TRANSLATIONS[currentLang];
    container.innerHTML = SKILLS.map(s => `
        <span class="skill-tab-wrap">
            <button class="skill-tab${s.id === activeSkill ? ' active' : ''}" onclick="selectSkill('${s.id}')">
                ${sLabel(s)}
                <span class="skill-tab-actions">
                    <span class="skill-tab-action" title="Editar" onclick="openSkillForm('${s.id}');event.stopPropagation()">✏</span>
                    <span class="skill-tab-action del" title="Eliminar" onclick="deleteSkill('${s.id}');event.stopPropagation()">✕</span>
                </span>
            </button>
        </span>
    `).join('') + `<button class="add-skill-btn" onclick="openSkillForm()">${t.addSkillBtn}</button>`;
}

function renderPanel() {
    const container = document.getElementById('projectsPanel');
    const filtered = PROJECTS.filter(p => (p.skills || []).includes(activeSkill));
    const t = TRANSLATIONS[currentLang];

    if (!filtered.length) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state-icon">🚧</span>
                <span class="empty-state-text">${t.projectsEmpty}</span>
            </div>`;
        return;
    }

    container.innerHTML = `<div class="projects-panel-grid">
        ${filtered.map(p => {
            const imgHtml = p.images.length
                ? `<img class="mini-img" src="${p.images[0]}" alt="${p.name}" loading="lazy">`
                : `<div class="mini-img-ph">🛠️</div>`;
            return `
            <div class="mini-card" onclick="openModal('${p.id}')" style="position:relative">
                ${imgHtml}
                <button class="highlight-btn${p.featured ? ' active' : ''}" onclick="toggleHighlight('${p.id}', event)">⭐</button>
                <button class="edit-btn" onclick="openProjectForm('${p.id}');event.stopPropagation()">✏️</button>
                <div class="mini-body">
                    <p class="mini-num">${p.num}</p>
                    <p class="mini-name">${p.name}</p>
                    <p class="mini-client">${(p.client || '').split('·')[0].trim()}</p>
                </div>
            </div>`;
        }).join('')}
    </div>`;
}

function selectSkill(id) {
    activeSkill = id;
    renderTabs();
    renderPanel();
}

/* ══════════════════════════════
   MODAL
══════════════════════════════ */
function openModal(projectId) {
    const p = PROJECTS.find(x => x.id === projectId);
    if (!p) return;

    const imgArea = document.getElementById('modalImg');
    imgArea.innerHTML = p.images.length
        ? `<img src="${p.images[0]}" alt="${p.name}">`
        : `<div class="modal-img-ph"><span class="modal-img-ph-icon">🛠️</span><span class="modal-img-ph-label">${p.name}</span></div>`;

    const featuresHtml = (p.features || []).map(f => `
        <li>${f.label ? `<span class="feat-label">${f.label}</span>` : ''}${f.text}</li>
    `).join('');

    const techHtml = (p.tech || []).map(tk => `<span class="tbadge">${tk}</span>`).join('');
    const mt = TRANSLATIONS[currentLang];

    let linksHtml = '';
    if (p.github) linksHtml += `<a href="${p.github}" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:.82rem;padding:.55rem 1.2rem;">GitHub ↗</a>`;
    if (p.video) linksHtml += `<a href="${p.video}" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:.82rem;padding:.55rem 1.2rem;">${currentLang === 'en' ? 'Watch Demo' : 'Ver demo'} ▶</a>`;

    let pendingHtml = '';
    if (!p.github) pendingHtml += `<span class="demo-pending">${mt.modalPending1}</span>`;
    if (!p.video) pendingHtml += `<span class="demo-pending">${mt.modalPending2}</span>`;

    document.getElementById('modalBody').innerHTML = `
        <p class="modal-num">${p.num}</p>
        <h3 class="modal-title">${p.name}</h3>
        <p class="modal-client">${p.client}</p>
        <p class="modal-desc">${p.description}</p>
        <ul class="modal-features">${featuresHtml}</ul>
        <div class="modal-tech">${techHtml}</div>
        <div class="modal-links">${linksHtml}${pendingHtml}</div>
    `;

    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement.children);
        entry.target.style.transitionDelay = `${siblings.indexOf(entry.target) * 0.08}s`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ══════════════════════════════
   ACTIVE NAV LINK
══════════════════════════════ */
const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
    });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));

/* ══════════════════════════════
   FLIP CARD
══════════════════════════════ */
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        if (isTouchDevice()) card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('flipped');
        }
    });
});

/* ══════════════════════════════
   INTERNATIONALIZATION (i18n)
══════════════════════════════ */
let currentLang = localStorage.getItem('portfolio_lang') ?? 'en';

const TRANSLATIONS = {
    en: {
        langBtn: '🇵🇪 ES',
        navHighlights: 'Highlights', navProjects: 'Projects', navContact: 'Contact',
        lockBtn: '🔒 Edit', lockBtnExit: '🔓 Exit',
        heroEyebrow: '// Mechatronic Engineer · Edge AI & Industrial Automation',
        heroHeadline: 'Integrating artificial intelligence',
        heroGradient: 'to the heart of industry',
        heroSub: 'Specialist in Edge AI, Computer Vision and Critical Control Systems. I transform industrial data into autonomous actions with millimeter-level precision.',
        heroMetricLabels: ['years in industrial AI', 'integrated technologies', 'systems in production', 'results-oriented'],
        heroCta1: 'View projects',
        heroTags: ['Edge AI', 'Computer Vision', 'Machine Learning', 'Control Systems', 'Industry 4.0', 'Collaborative Robotics', 'NVIDIA Jetson', 'ROS 2', 'Predictive Analytics'],
        featuredEyebrow: '// best projects',
        featuredTitle: 'Featured Projects',
        featuredSub: 'The projects that best represent my work at the intersection of AI and industrial automation.',
        featuredCta: 'View full project →',
        featuredEmpty: '// mark projects with ⭐ from the section below',
        projectsEyebrow: '// portfolio',
        projectsTitle: 'My Projects',
        projectsSub: "Choose a technology and discover what I've built with it.",
        addSkillBtn: '＋ New specialty',
        projectsEmpty: '// projects on the way',
        contactEyebrow: "// let's talk",
        contactTitle: 'How can I help you optimize',
        contactGradient: 'your processes?',
        contactText: 'Available for consulting projects, R&D collaborations and job opportunities in applied artificial intelligence, industrial automation and robotics.',
        contactAvail: 'Available for new projects',
        flipBadge: 'hover · view profile ↻',
        flipLabel1: '// experience', flipLabel2: '// education',
        flipDegree: 'Bachelor in Mechatronic Engineering',
        modalPending1: '⏳ Code — coming soon', modalPending2: '🎬 Video demo — coming soon',
    },
    es: {
        langBtn: '🇺🇸 EN',
        navHighlights: 'Destacados', navProjects: 'Proyectos', navContact: 'Contacto',
        lockBtn: '🔒 Editar', lockBtnExit: '🔓 Salir',
        heroEyebrow: '// Ingeniero Mecatrónico · Edge AI & Automatización Industrial',
        heroHeadline: 'Integrando la inteligencia artificial',
        heroGradient: 'al corazón de la industria',
        heroSub: 'Especialista en Edge AI, Visión por Computadora y Sistemas de Control Críticos. Transformo datos industriales en acciones autónomas con precisión milimétrica.',
        heroMetricLabels: ['años en IA industrial', 'tecnologías integradas', 'sistemas en producción', 'orientado a resultados'],
        heroCta1: 'Ver proyectos',
        heroTags: ['Edge AI', 'Visión por Computadora', 'Machine Learning', 'Sistemas de Control', 'Industria 4.0', 'Robótica Colaborativa', 'NVIDIA Jetson', 'ROS 2', 'Analítica Predictiva'],
        featuredEyebrow: '// mejores proyectos',
        featuredTitle: 'Proyectos Destacados',
        featuredSub: 'Los proyectos que mejor representan mi trabajo en la intersección de la IA y la automatización industrial.',
        featuredCta: 'Ver proyecto completo →',
        featuredEmpty: '// marca proyectos con ⭐ desde la sección de abajo',
        projectsEyebrow: '// portafolio',
        projectsTitle: 'Mis Proyectos',
        projectsSub: 'Elige una tecnología y descubre qué he construido con ella.',
        addSkillBtn: '＋ Nueva especialidad',
        projectsEmpty: '// proyectos en camino',
        contactEyebrow: '// hablemos',
        contactTitle: '¿Cómo puedo ayudarte a optimizar',
        contactGradient: 'tus procesos?',
        contactText: 'Estoy disponible para proyectos de consultoría, colaboraciones en I+D y oportunidades laborales en inteligencia artificial aplicada, automatización industrial y robótica.',
        contactAvail: 'Disponible para nuevos proyectos',
        flipBadge: 'hover · ver perfil ↻',
        flipLabel1: '// experiencia', flipLabel2: '// educación',
        flipDegree: 'Bachiller en Ingeniería Mecatrónica',
        modalPending1: '⏳ Código — próximamente', modalPending2: '🎬 Demo en video — próximamente',
    },
};

function sLabel(s) {
    return currentLang === 'en' && s.label_en ? s.label_en : s.label;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);
    const t = TRANSLATIONS[lang];

    const lb = document.getElementById('langBtn');
    if (lb) lb.textContent = t.langBtn;

    const navLinks = document.querySelectorAll('.nav-links li a');
    ['navHighlights', 'navProjects', 'navContact'].forEach((key, i) => {
        if (navLinks[i]) navLinks[i].textContent = t[key];
    });

    const lockBtn = document.getElementById('lockBtn');
    if (lockBtn) lockBtn.innerHTML = editorMode ? t.lockBtnExit : t.lockBtn;

    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) eyebrow.textContent = t.heroEyebrow;

    const headline = document.querySelector('.hero-headline');
    if (headline) headline.innerHTML = `${t.heroHeadline}<br><span class="gradient">${t.heroGradient}</span>`;

    const sub = document.querySelector('.hero-sub');
    if (sub) sub.textContent = t.heroSub;

    document.querySelectorAll('.hero-metric').forEach((m, i) => {
        const lbl = m.querySelector('.hero-metric-label');
        if (lbl && t.heroMetricLabels[i]) lbl.textContent = t.heroMetricLabels[i];
    });

    const cta1 = document.querySelector('.hero-cta a:first-child');
    if (cta1) cta1.textContent = t.heroCta1;

    document.querySelectorAll('.hero-tags .hero-tag').forEach((tag, i) => {
        if (t.heroTags[i]) tag.textContent = t.heroTags[i];
    });

    const badge = document.querySelector('.flip-hint-badge');
    if (badge) badge.textContent = t.flipBadge;
    const flipLabels = document.querySelectorAll('.flip-back-label');
    if (flipLabels[0]) flipLabels[0].textContent = t.flipLabel1;
    if (flipLabels[1]) flipLabels[1].textContent = t.flipLabel2;
    const degree = document.querySelector('.flip-back-degree');
    if (degree) degree.textContent = t.flipDegree;

    const fEyebrow = document.querySelector('#destacados .section-eyebrow');
    if (fEyebrow) fEyebrow.textContent = t.featuredEyebrow;
    const fTitle = document.querySelector('#destacados .section-title');
    if (fTitle) fTitle.textContent = t.featuredTitle;
    const fSub = document.querySelector('#destacados .section-sub');
    if (fSub) fSub.textContent = t.featuredSub;

    const pEyebrow = document.querySelector('#proyectos .section-eyebrow');
    if (pEyebrow) pEyebrow.textContent = t.projectsEyebrow;
    const pTitle = document.querySelector('#proyectos .section-title');
    if (pTitle) pTitle.textContent = t.projectsTitle;
    const pSub = document.querySelector('#proyectos .section-sub');
    if (pSub) pSub.textContent = t.projectsSub;

    const cEyebrow = document.querySelector('#contacto .section-eyebrow');
    if (cEyebrow) cEyebrow.textContent = t.contactEyebrow;
    const cTitle = document.querySelector('.contact-title');
    if (cTitle) cTitle.innerHTML = `${t.contactTitle}<br><span class="gradient">${t.contactGradient}</span>`;
    const cText = document.querySelector('.contact-text');
    if (cText) cText.textContent = t.contactText;
    const cAvail = document.querySelector('.contact-availability');
    if (cAvail) cAvail.textContent = t.contactAvail;

    renderFeatured();
    renderTabs();
    renderPanel();
}

function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'es' : 'en');
}

/* ══════════════════════════════
   INIT
══════════════════════════════ */
async function init() {
    applyEditorMode();
    await loadData();
    activeSkill = SKILLS[0]?.id ?? '';
    setLanguage(currentLang);
}

init();
