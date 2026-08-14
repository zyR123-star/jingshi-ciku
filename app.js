(function () {
  "use strict";

  const STORAGE_KEY = "jingshi_glossary_v1";
  const DAILY_GOAL = 3;
  const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30];
  const MASTERY_LEVELS = {
    forgot: { label: "忘记", en: "Forgot", days: 1, stageStep: 0 },
    vague: { label: "模糊", en: "Vague", days: 2, stageStep: 1 },
    roughly: { label: "大概", en: "Roughly", days: 4, stageStep: 2 }
  };
  const MOTIVATION_FALLBACK = [
    "今天也超棒，先把一个词拿下！",
    "少想一点，先学一个，就赢在今天。",
    "别人卷，我稳稳打卡，也算赢。",
    "今天的你，比昨天多懂一点就够了。",
    "别急，慢慢来，反正每一步都算数。",
    "学完一个词，就离“懂”更近一步。",
    "累了就休息，醒了继续冲。"
  ];
  const $ = (id) => document.getElementById(id);
  const FALLBACK_ICONS = {
    "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    "route": '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    "library": '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    "shuffle": '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
    "check-circle-2": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    "clipboard-check": '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/>',
    "brain": '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v14"/>',
    "eye": '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "filter": '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "refresh-cw": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    "bookmark": '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "layout-grid": '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    "minus": '<path d="M5 12h14"/>',
    "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>'
    ,"trash-2": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>'
  };

  if (typeof TEMPLATES !== "undefined") {
    SUBJECTS.forEach((subject) => {
      if (subject.custom) return;
      const stages = STAGES.filter((s) => s.subject === subject.id).sort((a, b) => a.id - b.id);
      const stageIndex = {};
      stages.forEach((s, i) => { stageIndex[s.id] = i + 1; });
      TEMPLATES.push({
        id: "tpl-" + subject.id,
        name: subject.name,
        en: subject.en,
        color: subject.color,
        desc: subject.desc || subject.en,
        stages: stages.map((s) => ({
          name: s.name,
          en: s.en,
          code: s.code,
          goal: s.goal,
          weeks: s.weeks,
          topics: s.topics || []
        })),
        terms: TERMS.filter((t) => t.subject === subject.id).map((t) => ({
          id: t.id,
          stage: stageIndex[t.stage] || 1,
          term: t.term,
          en: t.en,
          cat: t.cat,
          diff: t.diff,
          def: t.def,
          example: t.example,
          tip: t.tip,
          related: t.related || []
        }))
      });
    });
  }

  const state = {
    view: "today",
    subjectId: "econ",
    currentTermId: null,
    masteryTermId: null,
    selectedStage: null,
    calendarYear: null,
    calendarMonth: null,
    selectedDateKey: null,
    search: "",
    stageFilter: 0,
    diffFilter: 0,
    masteredOnly: false,
    progress: { seen: {}, mastered: {}, history: [], days: {}, reviews: {}, deep: {}, mistakes: {}, settings: { dailyGoal: 3 }, custom: { subjects: [], stages: [], terms: [] } }
  };

  function todayKey() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function addDays(dateKey, offset) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const date = new Date(y, m - 1, d + offset);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + mm + "-" + dd;
  }

  function termById(id) {
    return TERMS.find((t) => t.id === id);
  }

  function subjectById(id) {
    return SUBJECTS.find((s) => s.id === id);
  }

  function stageById(id, subject) {
    return STAGES.find((s) => s.id === id && (!subject || s.subject === subject));
  }

  function escapeHtml(text) {
    const el = document.createElement("div");
    el.textContent = text == null ? "" : String(text);
    return el.innerHTML;
  }

  function shortLabel(text, max) {
    const s = String(text || "");
    return s.length > max ? s.slice(0, max) + "…" : s;
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.seen && parsed.history && parsed.days) {
          state.progress = parsed;
        }
      }
    } catch (e) {
      state.progress = { seen: {}, mastered: {}, history: [], days: {} };
    }
    state.progress.reviews = state.progress.reviews || {};
    state.progress.deep = state.progress.deep || {};
    state.progress.mistakes = state.progress.mistakes || {};
    state.progress.mastered = state.progress.mastered || {};
    state.progress.settings = state.progress.settings || {};
    const goal = Number(state.progress.settings.dailyGoal);
    if (!goal || goal < 1 || goal > 20) {
      state.progress.settings.dailyGoal = DAILY_GOAL;
    }
    if (!SUBJECTS.some((s) => s.id === state.progress.settings.activeSubject)) {
      state.progress.settings.activeSubject = "econ";
    }
    state.subjectId = state.progress.settings.activeSubject;
    state.progress.custom = state.progress.custom || { subjects: [], stages: [], terms: [] };
    mergeCustomData();
    const today = todayKey();
    Object.keys(state.progress.seen).forEach((id) => {
      if (!state.progress.reviews[id]) {
        state.progress.reviews[id] = {
          learnedAt: state.progress.seen[id].first || today,
          nextDue: today,
          stage: 0,
          count: 0,
          lastReview: null,
          completed: false
        };
      }
    });
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    } catch (e) {
      /* storage may be unavailable; progress stays in memory */
    }
  }

  function markSeen(id) {
    const today = todayKey();
    if (!state.progress.seen[id]) {
      state.progress.seen[id] = { first: today, last: today };
    } else {
      state.progress.seen[id].last = today;
    }
    state.progress.history.push(id);
    if (state.progress.history.length > 400) {
      state.progress.history.splice(0, state.progress.history.length - 400);
    }
    recordActivity(id);
    ensureReview(id);
    saveProgress();
  }

  function ensureReview(id) {
    const today = todayKey();
    if (!state.progress.reviews[id]) {
      state.progress.reviews[id] = {
        learnedAt: today,
        nextDue: today,
        stage: 0,
        count: 0,
        lastReview: null,
        completed: false
      };
    }
  }

  function getReview(id) {
    return state.progress.reviews[id] || null;
  }

  function masteredLevel(id) {
    const m = state.progress.mastered[id];
    if (!m) return null;
    if (typeof m === "string") return "roughly";
    return m.level || "roughly";
  }

  function applyMastery(id, level) {
    const cfg = MASTERY_LEVELS[level];
    if (!cfg) return;
    const today = todayKey();
    ensureReview(id);
    const review = state.progress.reviews[id];
    if (level === "forgot") {
      review.stage = Math.max(0, review.stage - 1);
      review.completed = false;
    } else {
      review.stage = Math.min(EBBINGHAUS_INTERVALS.length, review.stage + cfg.stageStep);
      if (review.stage >= EBBINGHAUS_INTERVALS.length) {
        review.completed = true;
        review.nextDue = addDays(today, 30);
      }
    }
    if (!review.completed) {
      review.nextDue = addDays(today, cfg.days);
    }
    review.count += 1;
    review.lastReview = today;
    review.lastLevel = level;
    state.progress.mastered[id] = { level: level, date: today };
    recordActivity(id);
    saveProgress();
  }

  function getDailyGoal() {
    const goal = state.progress.settings && state.progress.settings.dailyGoal;
    return Math.max(1, Math.min(20, Number(goal) || DAILY_GOAL));
  }

  function setDailyGoal(value) {
    const goal = Math.max(1, Math.min(20, Math.round(Number(value) || DAILY_GOAL)));
    state.progress.settings = state.progress.settings || {};
    state.progress.settings.dailyGoal = goal;
    saveProgress();
    renderGoal();
  }

  function recordActivity(id) {
    const today = todayKey();
    if (!state.progress.days[today]) {
      state.progress.days[today] = {};
    }
    state.progress.days[today][id] = 1;
  }

  function mergeCustomData() {
    const custom = state.progress.custom || { subjects: [], stages: [], terms: [] };
    state.progress.custom = custom;
    custom.subjects.forEach((s) => {
      if (!SUBJECTS.some((x) => x.id === s.id)) SUBJECTS.push(s);
    });
    custom.stages.forEach((s) => {
      if (!STAGES.some((x) => x.id === s.id)) STAGES.push(s);
    });
    custom.terms.forEach((t) => {
      if (!TERMS.some((x) => x.id === t.id)) TERMS.push(t);
    });
  }

  function syncCustomData() {
    state.progress.custom = {
      subjects: SUBJECTS.filter((s) => s.custom),
      stages: STAGES.filter((s) => s.custom),
      terms: TERMS.filter((t) => t.custom)
    };
    saveProgress();
  }

  function ensureDeep(id) {
    if (!state.progress.deep[id]) {
      state.progress.deep[id] = { addedAt: todayKey(), notes: "" };
    }
  }

  function toggleDeep(id) {
    if (state.progress.deep[id]) {
      delete state.progress.deep[id];
    } else {
      ensureDeep(id);
    }
    saveProgress();
  }

  function saveDeepNote(id, text) {
    ensureDeep(id);
    state.progress.deep[id].notes = text;
    state.progress.deep[id].updatedAt = todayKey();
    saveProgress();
  }

  function diffDays(fromKey, toKey) {
    const [y1, m1, d1] = fromKey.split("-").map(Number);
    const [y2, m2, d2] = toKey.split("-").map(Number);
    const a = new Date(y1, m1 - 1, d1).getTime();
    const b = new Date(y2, m2 - 1, d2).getTime();
    return Math.round((b - a) / 86400000);
  }

  function reviewDueLabel(review) {
    const today = todayKey();
    if (review.nextDue < today) {
      return "逾期 " + diffDays(review.nextDue, today) + " 天";
    }
    return "今天复习";
  }

  function getDueReviews() {
    const today = todayKey();
    return TERMS
      .filter((term) => {
        const review = state.progress.reviews[term.id];
        return term.subject === state.subjectId && review && !review.completed && review.nextDue <= today;
      })
      .sort((a, b) => state.progress.reviews[a.id].nextDue.localeCompare(state.progress.reviews[b.id].nextDue));
  }

  function getDueReviewsForSubject(subjectId) {
    const today = todayKey();
    return TERMS
      .filter((term) => {
        const review = state.progress.reviews[term.id];
        return term.subject === subjectId && review && !review.completed && review.nextDue <= today;
      })
      .sort((a, b) => state.progress.reviews[a.id].nextDue.localeCompare(state.progress.reviews[b.id].nextDue));
  }

  function computeStats() {
    const seenCount = Object.keys(state.progress.seen).length;
    const masteredCount = Object.keys(state.progress.mastered).length;
    const today = todayKey();
    const todayCount = Object.keys(state.progress.days[today] || {}).length;

    let streak = 0;
    let cursor = today;
    if (!state.progress.days[today]) {
      cursor = addDays(today, -1);
    }
    while (state.progress.days[cursor]) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }

    return { seenCount, masteredCount, todayCount, streak };
  }

  function stageProgress(stageId) {
    const terms = TERMS.filter((t) => t.stage === stageId);
    const seen = terms.filter((t) => state.progress.seen[t.id]).length;
    const mastered = terms.filter((t) => state.progress.mastered[t.id]).length;
    return { total: terms.length, seen, mastered };
  }

  function subjectProgress(subjectId) {
    const terms = TERMS.filter((t) => t.subject === subjectId);
    const seen = terms.filter((t) => state.progress.seen[t.id]).length;
    const mastered = terms.filter((t) => state.progress.mastered[t.id]).length;
    return { total: terms.length, seen, mastered };
  }

  function activeSubject() {
    return subjectById(state.subjectId) || SUBJECTS[0];
  }

  function subjectTerms(subjectId) {
    return TERMS.filter((t) => t.subject === subjectId);
  }

  function unlearnedStageTerms(subjectId) {
    const stages = STAGES.filter((s) => s.subject === subjectId);
    for (const stage of stages) {
      const terms = subjectTerms(subjectId).filter((t) => t.stage === stage.id && !state.progress.seen[t.id]);
      if (terms.length > 0) return terms;
    }
    return null;
  }

  function drawNext() {
    const avoid = new Set();
    if (state.currentTermId) {
      avoid.add(state.currentTermId);
    }
    const recent = state.progress.history.slice(-6).reverse();
    for (const id of recent) {
      if (avoid.size >= 5) break;
      avoid.add(id);
    }
    const stagePool = unlearnedStageTerms(state.subjectId);
    let pool = (stagePool || subjectTerms(state.subjectId)).filter((t) => !avoid.has(t.id));
    if (pool.length === 0) {
      pool = stagePool || subjectTerms(state.subjectId);
    }
    const next = pool[Math.floor(Math.random() * pool.length)];
    if (!next) {
      state.currentTermId = null;
      render();
      return;
    }
    state.currentTermId = next.id;
    markSeen(next.id);
    render();
  }

  function renderChips(container, term) {
    const stage = stageById(term.stage, term.subject);
    const chips = [
      { text: "阶段" + stage.code + " · " + stage.name, style: "background:" + stage.color + ";border-color:" + stage.color },
      { text: term.cat, cls: "" },
      { text: DIFF_LABELS[term.diff], cls: "diff-chip" }
    ];
    container.innerHTML = chips.map((c) =>
      '<span class="chip' + (c.cls ? " " + c.cls : "") + '"' + (c.style ? ' style="' + c.style + '"' : "") + ">" + escapeHtml(c.text) + "</span>"
    ).join("");
  }

  function renderRelated(container, term, onClick) {
    const related = (term.related || [])
      .map(termById)
      .filter(Boolean)
      .slice(0, 5);
    if (related.length === 0) {
      container.innerHTML = '<span class="chip">暂无关联词</span>';
      return;
    }
    container.innerHTML = related.map((r) =>
      '<button class="related-chip" data-term="' + r.id + '"><i data-lucide="arrow-up-right"></i>' + escapeHtml(r.term) + "</button>"
    ).join("");
    container.querySelectorAll(".related-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (container.closest("#deepModal")) {
          openDeep(btn.dataset.term);
        } else {
          openModal(btn.dataset.term);
        }
      });
    });
  }

  function conceptViz(term) {
    const related = (term.related || [])
      .map(termById)
      .filter(Boolean)
      .slice(0, 4);
    const stage = stageById(term.stage, term.subject);
    const cx = 320;
    const cy = 88;
    const rx = 232;
    const ry = 62;
    const colors = ["#c94f2b", "#0e7c6b", "#2e6f8f", "#a97d12"];

    let lines = "";
    let nodes = "";
    const count = related.length || 1;
    for (let i = 0; i < count; i += 1) {
      const angle = (-90 + (i * 360) / count) * (Math.PI / 180);
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      lines += '<line x1="' + cx.toFixed(1) + '" y1="' + cy.toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="#d5ddd7" stroke-width="1.2"/>';
      const r = related[i] || term;
      const fill = i % 2 === 0 ? "#ffffff" : "#f7faf7";
      nodes +=
        '<g>' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="34" fill="' + fill + '" stroke="' + colors[i % colors.length] + '" stroke-width="1.4"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="650" fill="#24312c">' + escapeHtml(shortLabel(r.term, 5)) + "</text>" +
        "</g>";
    }

    return (
      '<svg viewBox="0 0 640 176" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + escapeHtml(term.term) + " 概念关系图" + '">' +
      '<defs>' +
      '<radialGradient id="coreFill" cx="35%" cy="30%" r="80%">' +
      '<stop offset="0%" stop-color="#e96f4a"/>' +
      '<stop offset="100%" stop-color="' + stage.color + '"/>' +
      "</radialGradient>" +
      "</defs>" +
      lines +
      '<circle cx="320" cy="88" r="54" fill="url(#coreFill)" stroke="' + stage.color + '" stroke-width="2"/>' +
      '<circle cx="320" cy="88" r="42" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>' +
      '<text x="320" y="84" text-anchor="middle" font-size="22" font-weight="850" fill="#ffffff">' + escapeHtml(shortLabel(term.term, 3)) + "</text>" +
      '<text x="320" y="102" text-anchor="middle" font-size="9" font-weight="650" fill="rgba(255,255,255,0.82)">' + stage.name + "</text>" +
      nodes +
      "</svg>"
    );
  }

  function renderDaily() {
    const term = termById(state.currentTermId);
    if (!term) {
      if (subjectTerms(state.subjectId).length > 0) {
        drawNext();
        return;
      }
      const subject = activeSubject();
      $("cardNo").textContent = "NO. 000";
      $("termName").textContent = "暂无词条";
      $("termEn").textContent = subject ? subject.en : "Custom Subject";
      $("termDef").textContent = "这个学科还没有词条，先到词库总览添加第一个词。";
      $("termExample").textContent = "自定义学科同样支持阶段路线、复习与深度学习。";
      $("termTip").textContent = "词条添加后，今日词签会自动开始。";
      $("cardChips").innerHTML = '<span class="chip">' + escapeHtml(subject ? subject.name : "自定义学科") + "</span>";
      $("relatedList").innerHTML = "";
      $("vizWrap").innerHTML = "";
      $("masterBtn").disabled = true;
      $("deepBtn").disabled = true;
      $("drawBtn").disabled = true;
      return;
    }
    const index = subjectTerms(term.subject).findIndex((t) => t.id === term.id) + 1;
    $("cardNo").textContent = "NO. " + String(index).padStart(3, "0");
    $("termName").textContent = term.term;
    $("termEn").textContent = term.en;
    $("termDef").textContent = term.def;
    $("termExample").textContent = term.example;
    $("termTip").textContent = term.tip;
    renderChips($("cardChips"), term);
    renderRelated($("relatedList"), term);
    $("vizWrap").innerHTML = conceptViz(term);

    const mastered = !!state.progress.mastered[term.id];
    const level = masteredLevel(term.id);
    const btn = $("masterBtn");
    btn.classList.toggle("on", mastered);
    btn.querySelector("span").textContent = mastered ? "已掌握 · " + (level ? MASTERY_LEVELS[level].label : "大概") : "标记掌握";
    btn.setAttribute("aria-pressed", String(mastered));

    const deepBtn = $("deepBtn");
    deepBtn.classList.toggle("on", !!state.progress.deep[term.id]);
    deepBtn.querySelector("span").textContent = state.progress.deep[term.id] ? "深度学习" : "深入了解";

    const stage = stageById(term.stage, term.subject);
    $("miniStageName").textContent = stage.name;
    const p = stageProgress(term.stage);
    $("miniStageBar").style.width = p.total ? Math.round((p.seen / p.total) * 100) + "%" : "0%";
    $("miniStageCount").textContent = p.seen + " / " + p.total + " 词";
  }

  function renderRecent() {
    const seen = [];
    const seenIds = new Set();
    for (let i = state.progress.history.length - 1; i >= 0 && seen.length < 6; i -= 1) {
      const id = state.progress.history[i];
      if (!seenIds.has(id)) {
        seenIds.add(id);
        const term = termById(id);
        if (term && term.subject === state.subjectId) seen.push(term);
      }
    }
    $("recentHint").textContent = seen.length + " 个词";
    const container = $("recentList");
    if (seen.length === 0) {
      container.innerHTML = '<div class="recent-empty">今天抽到的词会出现在这里</div>';
      return;
    }
    container.innerHTML = seen.map((term) =>
      '<button class="recent-item" data-term="' + term.id + '">' +
      '<h3>' + escapeHtml(term.term) + "</h3>" +
      "<p>" + escapeHtml(term.def) + "</p>" +
      "</button>"
    ).join("");
    container.querySelectorAll(".recent-item").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.term));
    });
  }

  function renderReviewQueue() {
    const due = getDueReviews();
    $("reviewHint").textContent = due.length + " 个待复习";
    const container = $("reviewList");
    if (!due.length) {
      container.innerHTML = '<div class="recent-empty">今天没有待复习的词条</div>';
      return;
    }
    container.innerHTML = due.map((term) => {
      const review = state.progress.reviews[term.id];
      const stage = stageById(term.stage, term.subject);
      const round = Math.min(review.stage + 1, EBBINGHAUS_INTERVALS.length);
      return (
        '<div class="review-item" role="button" tabindex="0" data-term="' + term.id + '">' +
        '<div class="review-item-top">' +
        '<span class="stage-mini" style="background:' + stage.color + '">' + stage.code + "</span>" +
        '<span class="review-due">' + escapeHtml(reviewDueLabel(review)) + "</span>" +
        "</div>" +
        "<h3>" + escapeHtml(term.term) + "</h3>" +
        "<p>" + escapeHtml(term.def) + "</p>" +
        '<div class="review-meta"><span>第 ' + round + " / " + EBBINGHAUS_INTERVALS.length + " 轮</span><span>已复习 " + review.count + " 次</span></div>" +
        "</div>"
      );
    }).join("");
    container.querySelectorAll(".review-item").forEach((item) => {
      const open = () => openModal(item.dataset.term);
      item.addEventListener("click", open);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
  }

  function renderDeepView() {
    const list = Object.keys(state.progress.deep)
      .map(termById)
      .filter(Boolean)
      .filter((t) => t.subject === state.subjectId)
      .sort((a, b) => String(state.progress.deep[a.id].addedAt).localeCompare(String(state.progress.deep[b.id].addedAt)));
    $("deepHint").textContent = list.length + " 个词条";
    const container = $("deepList");
    if (!list.length) {
      container.innerHTML = '<div class="glossary-empty">还没有加入深度学习的词条</div>';
      return;
    }
    container.innerHTML = list.map((term) => {
      const review = getReview(term.id);
      const stage = stageById(term.stage, term.subject);
      const record = state.progress.deep[term.id];
      const note = record.notes || "";
      const progressText = review
        ? review.completed
          ? "复习已完成"
          : "第 " + Math.min(review.stage + 1, EBBINGHAUS_INTERVALS.length) + " / " + EBBINGHAUS_INTERVALS.length + " 轮"
        : "尚未开始复习";
      return (
        '<article class="glossary-item deep-item">' +
        '<div class="glossary-item-top">' +
        '<span class="stage-mini" style="background:' + stage.color + '">' + stage.code + "</span>" +
        '<span class="mastered-mark" aria-label="已在深度学习清单"><i data-lucide="bookmark"></i></span>' +
        "</div>" +
        "<h3>" + escapeHtml(term.term) + "</h3>" +
        '<p class="en-line">' + escapeHtml(term.en) + "</p>" +
        '<p class="def">' + escapeHtml(note || term.def) + "</p>" +
        '<div class="review-meta"><span>' + escapeHtml(progressText) + "</span><span>加入 " + escapeHtml(record.addedAt) + "</span></div>" +
        '<button class="btn btn-ghost deep-open" data-term="' + term.id + '"><i data-lucide="book-open"></i><span>继续学习</span></button>' +
        "</article>"
      );
    }).join("");
    container.querySelectorAll(".deep-open").forEach((btn) => {
      btn.addEventListener("click", () => openDeep(btn.dataset.term));
    });
  }

  function deepAngle(term) {
    const stage = stageById(term.stage, term.subject);
    return (
      "它属于「" + stage.name + "」阶段的「" + term.cat + "」模块，难度为「" + DIFF_LABELS[term.diff] +
      "」。考试中通常要求先准确说出定义，再用生活例子佐证；进阶题还会把它和关联概念放在一起比较。"
    );
  }

  function renderSchedule(term) {
    const review = getReview(term.id);
    const stage = review ? review.stage : 0;
    const container = $("deepSchedule");
    container.innerHTML = EBBINGHAUS_INTERVALS.map((days, i) =>
      '<span class="schedule-chip' + (i < stage ? " done" : "") + '">第 ' + (i + 1) + " 轮 · " + days + " 天</span>"
    ).join("");
  }

  function renderDeepModal(term) {
    $("deepTerm").textContent = term.term;
    $("deepEn").textContent = term.en;
    $("deepDef").textContent = term.def;
    $("deepExample").textContent = term.example;
    $("deepTip").textContent = term.tip;
    $("deepAngle").textContent = deepAngle(term);
    renderChips($("deepChips"), term);
    renderRelated($("deepRelated"), term);
    renderSchedule(term);
    $("deepNotes").value = (state.progress.deep[term.id] && state.progress.deep[term.id].notes) || "";
    const inList = !!state.progress.deep[term.id];
    const toggleBtn = $("deepToggleBtn");
    toggleBtn.classList.toggle("on", inList);
    toggleBtn.querySelector("span").textContent = inList ? "已在深度学习清单" : "加入深度学习";
    toggleBtn.dataset.term = term.id;
    $("deepReviewBtn").dataset.term = term.id;
    const mistakeBtn = $("deepMistakeBtn");
    const hasMistake = !!state.progress.mistakes[term.id];
    mistakeBtn.hidden = !hasMistake;
    mistakeBtn.dataset.term = term.id;
  }

  function openDeep(id) {
    const term = termById(id);
    if (!term) return;
    markSeen(id);
    renderDeepModal(term);
    $("deepModal").hidden = false;
    document.body.style.overflow = "hidden";
    $("deepToggleBtn").focus();
    renderRecent();
    renderReviewQueue();
    renderSubjectCenter();
    renderMasthead();
    renderGoal();
    refreshIcons();
  }

  function closeDeep() {
    $("deepModal").hidden = true;
    document.body.style.overflow = "";
  }

  function renderMasteryOptions(term) {
    const container = $("masteryOptions");
    const descriptions = {
      forgot: "几乎想不起来，1 天后复习",
      vague: "有印象但不完整，2 天后复习",
      roughly: "能说出大意，4 天后复习"
    };
    container.innerHTML = Object.keys(MASTERY_LEVELS).map((key) => {
      const cfg = MASTERY_LEVELS[key];
      return (
        '<button class="mastery-option mastery-' + key + '" data-level="' + key + '">' +
        '<span class="mastery-name">' + cfg.label + "</span>" +
        '<span class="mastery-desc">' + descriptions[key] + "</span>" +
        "</button>"
      );
    }).join("");
    container.querySelectorAll(".mastery-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = state.masteryTermId;
        if (!id) return;
        applyMastery(id, btn.dataset.level);
        closeMasteryPopup();
        const term = termById(id);
        if (!term) return;
        renderDaily();
        if (!$("modal").hidden) renderModal(term);
        if (!$("deepModal").hidden) renderDeepModal(term);
        renderReviewQueue();
        renderDeepView();
        renderSubjectCenter();
        renderMasthead();
        renderGoal();
        refreshIcons();
      });
    });
  }

  function openMasteryPopup(id, mode) {
    const term = termById(id);
    if (!term) return;
    state.masteryTermId = id;
    state.masteryMode = mode || "master";
    $("masteryTerm").textContent = term.term;
    const isReview = state.masteryMode === "review";
    $("masteryTitle").textContent = isReview ? "本次掌握程度" : state.progress.mastered[id] ? "更新掌握程度" : "选择掌握程度";
    renderMasteryOptions(term);
    $("masteryModal").hidden = false;
    document.body.style.overflow = "hidden";
    $("masteryOptions").querySelector("button").focus();
  }

  function closeMasteryPopup() {
    $("masteryModal").hidden = true;
    if ($("modal").hidden && $("deepModal").hidden) {
      document.body.style.overflow = "";
    }
  }

  function renderMasthead() {
    const stats = computeStats();
    $("statSeen").textContent = stats.seenCount;
    $("statMastered").textContent = stats.masteredCount;
    $("statStreak").innerHTML = stats.streak + "<small>天</small>";
  }

  function renderSubjectSelect() {
    const select = $("subjectSelect");
    select.innerHTML = SUBJECTS
      .filter((s) => s.custom || s.id === state.subjectId)
      .map((s) => '<option value="' + s.id + '">' + escapeHtml(s.name) + "</option>")
      .join("");
    select.value = state.subjectId;
  }

  function renderSubjectCenter() {
    const customSubjects = SUBJECTS.filter((s) => s.custom);
    $("subjectHint").textContent = customSubjects.length + " 个已创建 · " + TEMPLATES.length + " 个模板";
    const container = $("subjectGrid");
    container.innerHTML = customSubjects.map((subject) => {
      const p = subjectProgress(subject.id);
      const due = getDueReviewsForSubject(subject.id).length;
      const pct = p.total ? Math.round((p.seen / p.total) * 100) : 0;
      return (
        '<div class="subject-card' + (subject.id === state.subjectId ? " active" : "") + '" role="button" tabindex="0" data-subject="' + subject.id + '" style="border-top:4px solid ' + subject.color + '">' +
        '<div class="subject-card-top">' +
        '<span class="stage-mini" style="background:' + subject.color + '">' + subject.code + "</span>" +
        '<span class="subject-due">待复习 ' + due + "</span>" +
        "</div>" +
        "<h3>" + escapeHtml(subject.name) + "</h3>" +
        '<p class="term-en">' + escapeHtml(subject.en) + "</p>" +
        '<p class="subject-desc">' + escapeHtml(subject.desc) + "</p>" +
        '<div class="stage-progress-row"><div class="mini-bar"><span style="width:' + pct + '%;background:' + subject.color + '"></span></div><strong>' + p.seen + " / " + p.total + " 词</strong></div>" +
        '<div class="subject-meta"><span>已掌握 ' + p.mastered + "</span><span>" + pct + "%</span></div>" +
        (subject.custom ? '<button class="subject-delete" data-delete-subject="' + subject.id + '">删除</button>' : "") +
        "</div>"
      );
    }).join("") +
      '<div class="subject-card subject-add" role="button" tabindex="0" data-action="new">' +
      '<div class="subject-add-icon">+</div>' +
      "<h3>专业模板</h3>" +
      '<p class="subject-desc">选择一个专业，立即开始学习</p>' +
      "</div>";
    container.querySelectorAll(".subject-card").forEach((card) => {
      if (card.dataset.action === "new") {
        card.addEventListener("click", openSubjectModal);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openSubjectModal();
          }
        });
      } else {
        const open = () => setActiveSubject(card.dataset.subject);
        card.addEventListener("click", open);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        });
      }
    });
    container.querySelectorAll("[data-delete-subject]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteCustomSubject(btn.dataset.deleteSubject);
      });
    });
  }

  function setActiveSubject(id) {
    if (!subjectById(id)) return;
    state.subjectId = id;
    state.currentTermId = null;
    state.selectedStage = null;
    state.stageFilter = 0;
    state.diffFilter = 0;
    state.search = "";
    const searchInput = $("searchInput");
    if (searchInput) searchInput.value = "";
    state.progress.settings = state.progress.settings || {};
    state.progress.settings.activeSubject = id;
    saveProgress();
    renderSubjectSelect();
    render();
    renderQuizCard();
    switchView("today");
  }

  function renderTemplateGrid(query) {
    const container = $("templateGrid");
    if (typeof TEMPLATES === "undefined" || TEMPLATES.length === 0) {
      container.innerHTML = '<div class="glossary-empty">暂无专业模板</div>';
      return;
    }
    const q = (query || "").trim().toLowerCase();
    const list = TEMPLATES.filter((tpl) => (tpl.name + " " + tpl.en + " " + tpl.desc).toLowerCase().includes(q));
    if (list.length === 0) {
      container.innerHTML = '<div class="glossary-empty">没有匹配的专业模板</div>';
      return;
    }
    container.innerHTML = list.map((tpl) =>
      '<button class="template-card" data-template="' + tpl.id + '" style="border-top:4px solid ' + tpl.color + '">' +
      '<span class="template-count">' + tpl.terms.length + " 个词</span>" +
      "<h3>" + escapeHtml(tpl.name) + "</h3>" +
      '<p class="term-en">' + escapeHtml(tpl.en) + "</p>" +
      '<p class="subject-desc">' + escapeHtml(tpl.desc) + "</p>" +
      "</button>"
    ).join("");
    container.querySelectorAll(".template-card").forEach((btn) => {
      btn.addEventListener("click", () => createSubjectFromTemplate(btn.dataset.template));
    });
  }

  function openSubjectModal() {
    const searchInput = $("templateSearchInput");
    if (searchInput) searchInput.value = "";
    renderTemplateGrid();
    $("subjectModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSubjectModal() {
    $("subjectModal").hidden = true;
    if ($("modal").hidden && $("deepModal").hidden && $("masteryModal").hidden) {
      document.body.style.overflow = "";
    }
  }

  function createSubjectFromTemplate(templateId) {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    const id = "c" + Date.now();
    const code = String(SUBJECTS.length + 1).padStart(2, "0");
    const subject = { id, custom: true, name: tpl.name, en: tpl.en, code, color: tpl.color, desc: tpl.desc, default: false };
    const stages = tpl.stages.map((s, i) => ({
      id: id + "-s" + (i + 1),
      custom: true,
      subject: id,
      name: s.name,
      en: s.en,
      code: s.code,
      goal: s.goal,
      weeks: s.weeks,
      color: tpl.color,
      topics: s.topics || []
    }));
    const terms = tpl.terms.map((t) => ({
      id: id + "-" + t.id,
      custom: true,
      subject: id,
      stage: id + "-s" + t.stage,
      term: t.term,
      en: t.en,
      cat: t.cat,
      diff: t.diff,
      def: t.def,
      example: t.example,
      tip: t.tip,
      related: (t.related || []).map((r) => id + "-" + r)
    }));
    SUBJECTS.push(subject);
    STAGES.push.apply(STAGES, stages);
    TERMS.push.apply(TERMS, terms);
    syncCustomData();
    closeSubjectModal();
    renderSubjectSelect();
    renderSubjectCenter();
    render();
    setActiveSubject(id);
  }

  function deleteCustomSubject(id) {
    const subject = subjectById(id);
    if (!subject || !subject.custom) return;
    if (!confirm("确定删除自定义学科「" + subject.name + "」？其中的词条和学习记录也会一并删除。")) return;
    const termIds = TERMS.filter((t) => t.subject === id).map((t) => t.id);
    STAGES = STAGES.filter((s) => s.subject !== id);
    TERMS = TERMS.filter((t) => t.subject !== id);
    const index = SUBJECTS.indexOf(subject);
    if (index >= 0) SUBJECTS.splice(index, 1);
    termIds.forEach((tid) => {
      delete state.progress.seen[tid];
      delete state.progress.mastered[tid];
      delete state.progress.reviews[tid];
      delete state.progress.deep[tid];
    });
    syncCustomData();
    if (state.subjectId === id) {
      setActiveSubject("econ");
    } else {
      render();
    }
  }

  function renderGoal() {
    const stats = computeStats();
    const goal = getDailyGoal();
    const count = Math.min(stats.todayCount, goal);
    const circumference = 2 * Math.PI * 50;
    const fill = $("goalFill");
    fill.style.strokeDasharray = circumference.toFixed(2);
    fill.style.strokeDashoffset = (circumference * (1 - count / goal)).toFixed(2);
    $("goalCount").textContent = count;
    $("goalText").textContent = count + " / " + goal + " 词";
    $("goalHint").textContent = stats.todayCount >= goal ? "今日目标完成" : "每天认识 " + goal + " 个词";
    $("goalInput").value = goal;
  }

  function getDailyMotivation() {
    const today = todayKey();
    const existing = state.progress.settings.motivation;
    if (existing && existing.date === today && existing.text) {
      return existing;
    }
    const fallback = MOTIVATION_FALLBACK[Math.floor(Math.random() * MOTIVATION_FALLBACK.length)];
    const mot = { date: today, text: fallback, source: "本地鼓励语" };
    state.progress.settings.motivation = mot;
    saveProgress();
    fetchMotivation(today);
    return mot;
  }

  function fetchMotivation(dateKey) {
    if (typeof fetch !== "function") return;
    const urls = Array.from({ length: 3 }, () => "https://v1.hitokoto.cn/?c=d&encode=json");
    Promise.all(urls.map((url) => fetch(url).then((r) => r.json()).catch(() => null)))
      .then((list) => {
        const quotes = list.filter(Boolean);
        if (!quotes.length) return;
        const keys = ["坚持", "努力", "加油", "梦想", "继续", "未来", "勇敢", "开始", "成长", "向前", "希望", "慢慢", "每天", "奋斗", "专注", "进步", "相信", "更好", "值得"];
        const data = quotes.find((q) => keys.some((k) => (q.hitokoto || "").includes(k))) || quotes[0];
        if (!data || !data.hitokoto) return;
        if (state.progress.settings.motivation && state.progress.settings.motivation.date !== dateKey) return;
        state.progress.settings.motivation = {
          date: dateKey,
          text: data.hitokoto,
          source: data.from ? "来自「" + data.from + "」" : "来自网络"
        };
        saveProgress();
        renderDashboard();
      })
      .catch(() => {});
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderQuizCard() {
    const learned = subjectTerms(state.subjectId).filter((t) => state.progress.seen[t.id]);
    $("quizMeta").textContent = "每 3 天一次 · 每次 10 题";
    $("quizStatus").textContent = "已学 " + learned.length + " 词 · 可随时开始";
  }

  function buildQuizQuestions() {
    const learned = subjectTerms(state.subjectId).filter((t) => state.progress.seen[t.id]);
    const pool = shuffleArray(learned).slice(0, 10);
    return pool.map((term) => {
      const others = subjectTerms(state.subjectId).filter((t) => t.id !== term.id);
      const correct = Math.random() > 0.5;
      if (correct) {
        return { term: term, statement: term.term + "：" + term.def, answer: true, explanation: term.tip || term.def };
      }
      const other = others.length ? others[Math.floor(Math.random() * others.length)] : null;
      const wrongDef = other ? other.def : "这是关于" + term.cat + "的一个错误描述。";
      return { term: term, statement: term.term + "：" + wrongDef, answer: false, explanation: "正确解释：" + term.def };
    });
  }

  function startQuiz() {
    const questions = buildQuizQuestions();
    if (questions.length === 0) {
      alert("先学习至少 1 个词条再来小测");
      return;
    }
    state.quiz = { index: 0, questions: questions, correctCount: 0, answered: false };
    $("quizModal").hidden = false;
    document.body.style.overflow = "hidden";
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const q = state.quiz.questions[state.quiz.index];
    $("quizProgress").textContent = "第 " + (state.quiz.index + 1) + " / " + state.quiz.questions.length + " 题";
    $("quizQuestion").innerHTML = '<p class="quiz-statement">' + escapeHtml(q.statement) + "</p>";
    $("quizActions").hidden = false;
    $("quizFeedback").hidden = true;
    $("quizNextBtn").hidden = true;
    state.quiz.answered = false;
  }

  function answerQuiz(answer) {
    if (!state.quiz || state.quiz.answered) return;
    state.quiz.answered = true;
    const q = state.quiz.questions[state.quiz.index];
    const correct = answer === q.answer;
    if (correct) {
      state.quiz.correctCount += 1;
    } else {
      addMistake(q.term.id);
    }
    const fb = $("quizFeedback");
    fb.hidden = false;
    fb.className = "quiz-feedback " + (correct ? "correct" : "wrong");
    fb.innerHTML = "<strong>" + (correct ? "回答正确" : "回答错误") + "</strong><p>" + escapeHtml(q.explanation) + "</p>";
    $("quizActions").hidden = true;
    const next = $("quizNextBtn");
    next.hidden = false;
    next.querySelector("span").textContent = state.quiz.index === state.quiz.questions.length - 1 ? "完成小测" : "下一题";
  }

  function nextQuizStep() {
    if (!state.quiz) return;
    if (state.quiz.index >= state.quiz.questions.length - 1) {
      finishQuiz();
      return;
    }
    state.quiz.index += 1;
    renderQuizQuestion();
  }

  function finishQuiz() {
    const today = todayKey();
    state.progress.settings.quizLastDate = today;
    state.progress.settings.nextQuizDate = addDays(today, 3);
    const score = state.quiz ? state.quiz.correctCount : 0;
    saveProgress();
    state.quiz = null;
    closeQuiz();
    renderQuizCard();
    renderDashboard();
    renderDeepView();
    renderMistakes();
    alert("小测完成：" + score + " / 10 题，错题已收入错题本");
  }

  function closeQuiz() {
    $("quizModal").hidden = true;
    if ($("modal").hidden && $("deepModal").hidden && $("masteryModal").hidden && $("subjectModal").hidden) {
      document.body.style.overflow = "";
    }
  }

  function addMistake(termId) {
    const today = todayKey();
    if (!state.progress.mistakes[termId]) {
      state.progress.mistakes[termId] = { count: 0, first: today, last: today };
    }
    state.progress.mistakes[termId].count += 1;
    state.progress.mistakes[termId].last = today;
    saveProgress();
  }

  function removeMistake(termId) {
    if (state.progress.mistakes[termId]) {
      delete state.progress.mistakes[termId];
      saveProgress();
    }
  }

  function renderMistakes() {
    const container = $("mistakePanel");
    const ids = Object.keys(state.progress.mistakes).filter((id) => {
      const t = termById(id);
      return t && t.subject === state.subjectId;
    });
    if (!ids.length) {
      container.innerHTML =
        '<div class="mistake-head"><span class="eyebrow">错题本</span><span class="mistake-count">0 题</span></div>' +
        '<p class="recent-empty">做错的题会自动收在这里</p>';
      return;
    }
    container.innerHTML =
      '<div class="mistake-head"><span class="eyebrow">错题本</span><span class="mistake-count">' + ids.length + " 题</span></div>" +
      '<div class="mistake-list">' +
      ids.map((id) => {
        const t = termById(id);
        const m = state.progress.mistakes[id];
        return (
          '<div class="mistake-item"><div><h4>' + escapeHtml(t.term) + "</h4><p>错 " + m.count + " 次 · 最近 " + escapeHtml(m.last) + "</p></div>" +
          '<div class="mistake-actions">' +
          '<button class="btn btn-ghost" data-mistake-review="' + id + '"><span>继续学习</span></button>' +
          '<button class="btn btn-ghost" data-mistake-remove="' + id + '"><span>移出</span></button>' +
          "</div></div>"
        );
      }).join("") +
      "</div>";
    container.querySelectorAll("[data-mistake-review]").forEach((btn) => {
      btn.addEventListener("click", () => openDeep(btn.dataset.mistakeReview));
    });
    container.querySelectorAll("[data-mistake-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeMistake(btn.dataset.mistakeRemove);
        renderMistakes();
        renderDeepView();
      });
    });
  }

  function renderDashboard() {
    const stats = computeStats();
    const goal = getDailyGoal();
    const due = getDueReviews().length;
    const deepCount = Object.keys(state.progress.deep)
      .map(termById)
      .filter((t) => t && t.subject === state.subjectId).length;
    const mot = getDailyMotivation();
    $("dashboardHint").textContent = mot.text;
    $("dashboardHint").title = mot.source || "";
    const items = [
      { label: "今日已学", value: stats.todayCount + " / " + goal, sub: "每日目标" },
      { label: "复习待办", value: due, sub: "到期词条" },
      { label: "深度学习", value: deepCount, sub: "清单词条" },
      { label: "连续学习", value: stats.streak + " 天", sub: "保持节奏" }
    ];
    $("dashboardGrid").innerHTML = items.map((item) =>
      '<div class="dashboard-item">' +
      '<span class="label">' + item.label + "</span>" +
      "<strong>" + item.value + "</strong>" +
      '<span class="dashboard-sub">' + item.sub + "</span>" +
      "</div>"
    ).join("");
  }

  function dateKeyOf(year, month, day) {
    return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }

  function renderCalendar() {
    const now = new Date();
    if (state.calendarYear === null) {
      state.calendarYear = now.getFullYear();
      state.calendarMonth = now.getMonth();
      state.selectedDateKey = todayKey();
    }
    const y = state.calendarYear;
    const m = state.calendarMonth;
    $("calendarTitle").textContent = y + " 年 " + (m + 1) + " 月";
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7;
    const goal = Math.max(1, getDailyGoal());
    const today = todayKey();
    let html = "";
    for (let i = 0; i < firstWeekday; i += 1) {
      html += '<span class="calendar-day empty"></span>';
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const key = dateKeyOf(y, m, d);
      const activity = Object.keys(state.progress.days[key] || {}).length;
      const level = activity === 0 ? 0 : activity >= goal ? 4 : Math.max(1, Math.ceil((activity / goal) * 3));
      const classes = ["calendar-day", "level-" + level, key === today ? "today" : "", key === state.selectedDateKey ? "selected" : ""].join(" ");
      html +=
        '<button class="' + classes + '" data-date="' + key + '">' +
        '<span class="day-num">' + d + "</span>" +
        (activity > 0 ? '<span class="day-dot"></span>' : "") +
        "</button>";
    }
    $("calendarGrid").innerHTML = html;
    $("calendarHint").textContent = "本月学习 " + countStudiedDaysInMonth(y, m) + " 天";
    renderCalendarDetail();
    $("calendarGrid").querySelectorAll("[data-date]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedDateKey = btn.dataset.date;
        renderCalendar();
      });
    });
  }

  function countStudiedDaysInMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let count = 0;
    for (let d = 1; d <= daysInMonth; d += 1) {
      if (state.progress.days[dateKeyOf(year, month, d)]) count += 1;
    }
    return count;
  }

  function renderCalendarDetail() {
    const key = state.selectedDateKey || todayKey();
    const parts = key.split("-").map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    const studiedIds = Object.keys(state.progress.days[key] || {});
    const studiedTerms = studiedIds.map(termById).filter(Boolean);
    const reviewIds = Object.keys(state.progress.reviews).filter((id) => state.progress.reviews[id].lastReview === key);
    const reviewTerms = reviewIds.map(termById).filter(Boolean).filter((t) => !studiedIds.includes(t.id));
    const container = $("calendarDetail");
    container.innerHTML =
      '<div class="calendar-detail-head"><span class="eyebrow">' + y + " 年 " + m + " 月 " + d + " 日</span><h3>学习记录</h3></div>" +
      '<div class="calendar-detail-stats"><span>已学 ' + studiedIds.length + "</span><span>复习 " + reviewIds.length + "</span></div>" +
      (studiedTerms.length === 0 && reviewTerms.length === 0 ? '<p class="recent-empty">这一天还没有学习记录</p>' : "") +
      (studiedTerms.length ? '<p class="label">当日词条</p><div class="calendar-word-list">' + studiedTerms.map((t) => "<span>" + escapeHtml(t.term) + "</span>").join("") + "</div>" : "") +
      (reviewTerms.length ? '<p class="label">当日复习</p><div class="calendar-word-list">' + reviewTerms.map((t) => "<span>" + escapeHtml(t.term) + "</span>").join("") + "</div>" : "");
  }

  function changeCalendarMonth(offset) {
    let y = state.calendarYear;
    let m = state.calendarMonth + offset;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    state.calendarYear = y;
    state.calendarMonth = m;
    renderCalendar();
  }

  function renderStageTimeline() {
    const container = $("stageTimeline");
    const subject = activeSubject();
    const subjectStages = STAGES.filter((s) => s.subject === state.subjectId);
    container.innerHTML = subjectStages.map((stage) => {
      const p = stageProgress(stage.id);
      const pct = p.total ? Math.round((p.seen / p.total) * 100) : 0;
      return (
        '<div class="stage-row">' +
        '<div class="stage-dot" style="border-color:' + stage.color + ";color:" + stage.color + '">' + stage.code + "</div>" +
        '<button class="stage-card" data-stage="' + stage.id + '" style="border-left:4px solid ' + stage.color + '">' +
        '<div class="stage-card-head">' +
        '<div><h3>' + escapeHtml(stage.name) + '</h3><p class="term-en">' + escapeHtml(stage.en) + "</p></div>" +
        '<div class="stage-card-meta"><span>' + escapeHtml(stage.weeks) + "</span><strong>" + p.seen + " / " + p.total + " 词</strong></div>" +
        "</div>" +
        '<p class="stage-card-goal">' + escapeHtml(stage.goal) + "</p>" +
        '<div class="stage-card-topics">' + stage.topics.map((t) => '<span class="topic-tag">' + escapeHtml(t) + "</span>").join("") + "</div>" +
        '<div class="stage-progress-row"><div class="mini-bar"><span style="width:' + pct + '%;background:' + stage.color + '"></span></div><strong>' + pct + "%</strong></div>" +
        "</button>" +
        "</div>"
      );
    }).join("");
    container.querySelectorAll(".stage-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.selectedStage = Number(card.dataset.stage);
        renderStageDetail();
        $("stageDetail").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    $("roadmapHint").textContent = subject.name + " · " + subjectStages.length + " 个阶段 · " + subjectTerms(state.subjectId).length + " 个词";
  }

  function renderStageDetail() {
    const stage = state.selectedStage ? stageById(state.selectedStage, state.subjectId) : null;
    const detail = $("stageDetail");
    if (!stage) {
      detail.hidden = true;
      return;
    }
    detail.hidden = false;
    $("stageDetailCode").textContent = "STAGE " + stage.code;
    $("stageDetailTitle").textContent = stage.name;
    $("stageDetailEn").textContent = stage.en;
    $("stageDetailWeeks").textContent = stage.weeks;
    const p = stageProgress(stage.id);
    const pct = p.total ? Math.round((p.seen / p.total) * 100) : 0;
    $("stageDetailCount").textContent = p.seen + " / " + p.total + " 词";
    $("stageDetailGoal").textContent = stage.goal;
    $("stageDetailTopics").innerHTML = stage.topics.map((t) => '<span class="topic-tag">' + escapeHtml(t) + "</span>").join("");
    $("stageDetailBar").style.width = pct + "%";
    const words = subjectTerms(state.subjectId).filter((t) => t.stage === stage.id);
    $("stageDetailWords").innerHTML = words.map((term) =>
      '<button class="stage-word' + (state.progress.mastered[term.id] ? " mastered" : "") + '" data-term="' + term.id + '">' + escapeHtml(term.term) + "</button>"
    ).join("");
    $("stageDetailWords").querySelectorAll(".stage-word").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.term));
    });
  }

  function renderStageMini() {
    const current = termById(state.currentTermId);
    if (!current) return;
    const stage = stageById(current.stage, current.subject);
    const p = stageProgress(stage.id);
    $("miniStageName").textContent = stage.name;
    $("miniStageBar").style.width = p.total ? Math.round((p.seen / p.total) * 100) + "%" : "0%";
    $("miniStageCount").textContent = p.seen + " / " + p.total + " 词";
  }

  function renderFilters() {
    const stageBox = $("stageFilters");
    const stageOptions = [{ id: 0, label: "全部阶段" }].concat(
      STAGES.filter((s) => s.subject === state.subjectId).map((s) => ({ id: s.id, label: "阶段" + s.code }))
    );
    stageBox.innerHTML = stageOptions.map((o) =>
      '<button class="filter-chip' + (state.stageFilter === o.id ? " active" : "") + '" data-stage-filter="' + o.id + '">' + o.label + "</button>"
    ).join("");
    stageBox.querySelectorAll("[data-stage-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.stageFilter = Number(btn.dataset.stageFilter);
        renderFilters();
        renderGlossary();
      });
    });

    const diffBox = $("diffFilters");
    const diffOptions = [{ id: 0, label: "全部难度" }, { id: 1, label: "入门" }, { id: 2, label: "进阶" }, { id: 3, label: "挑战" }];
    diffBox.innerHTML = diffOptions.map((o) =>
      '<button class="filter-chip' + (state.diffFilter === o.id ? " active" : "") + '" data-diff-filter="' + o.id + '">' + o.label + "</button>"
    ).join("");
    diffBox.querySelectorAll("[data-diff-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.diffFilter = Number(btn.dataset.diffFilter);
        renderFilters();
        renderGlossary();
      });
    });
  }

  function renderGlossary() {
    const query = state.search.trim().toLowerCase();
    let list = TERMS.filter((term) => {
      if (term.subject !== state.subjectId) return false;
      if (state.stageFilter && term.stage !== state.stageFilter) return false;
      if (state.diffFilter && term.diff !== state.diffFilter) return false;
      if (state.masteredOnly && !state.progress.mastered[term.id]) return false;
      if (query) {
        const hay = (term.term + " " + term.en + " " + term.cat + " " + term.def).toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    $("glossaryCount").textContent = "共 " + list.length + " 个词";
    const grid = $("glossaryGrid");
    if (list.length === 0) {
      const noTerms = subjectTerms(state.subjectId).length === 0;
      grid.innerHTML = '<div class="glossary-empty">' + (noTerms ? "这个学科还没有词条" : "没有匹配的词条") + "</div>";
      return;
    }

    grid.innerHTML = list.map((term) => {
      const stage = stageById(term.stage, term.subject);
      const mastered = !!state.progress.mastered[term.id];
      return (
        '<button class="glossary-item" data-term="' + term.id + '">' +
        '<div class="glossary-item-top">' +
        '<span class="stage-mini" style="background:' + stage.color + '">' + stage.code + "</span>" +
        (mastered ? '<span class="mastered-mark" aria-label="已掌握"><i data-lucide="check"></i></span>' : "") +
        "</div>" +
        "<h3>" + escapeHtml(term.term) + "</h3>" +
        '<p class="en-line">' + escapeHtml(term.en) + "</p>" +
        '<p class="def">' + escapeHtml(term.def) + "</p>" +
        "</button>"
      );
    }).join("");

    grid.querySelectorAll(".glossary-item").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.term));
    });
  }

  function renderModal(term) {
    $("modalTerm").textContent = term.term;
    $("modalEn").textContent = term.en;
    $("modalDef").textContent = term.def;
    $("modalExample").textContent = term.example;
    $("modalTip").textContent = term.tip;
    renderChips($("modalChips"), term);
    renderRelated($("modalRelated"), term);
    const mastered = !!state.progress.mastered[term.id];
    const level = masteredLevel(term.id);
    const btn = $("modalMasterBtn");
    btn.classList.toggle("on", mastered);
    btn.querySelector("span").textContent = mastered ? "已掌握 · " + (level ? MASTERY_LEVELS[level].label : "大概") : "标记掌握";
    btn.dataset.term = term.id;

    $("modalReviewBtn").dataset.term = term.id;
    $("modalDeepBtn").dataset.term = term.id;
    const review = getReview(term.id);
    const reviewBtn = $("modalReviewBtn");
    reviewBtn.classList.toggle("on", !!(review && review.completed));
    reviewBtn.querySelector("span").textContent = review && review.completed ? "已完成复习" : "复习完成";
    const deep = $("modalDeepBtn");
    deep.classList.toggle("on", !!state.progress.deep[term.id]);
    deep.querySelector("span").textContent = state.progress.deep[term.id] ? "已在深度学习" : "深入了解";
  }

  function openModal(id) {
    const term = termById(id);
    if (!term) return;
    markSeen(id);
    renderModal(term);
    $("modal").hidden = false;
    document.body.style.overflow = "hidden";
    $("modalMasterBtn").focus();
    renderRecent();
    renderReviewQueue();
    renderSubjectCenter();
    renderMasthead();
    renderGoal();
    refreshIcons();
  }

  function closeModal() {
    $("modal").hidden = true;
    document.body.style.overflow = "";
  }

  function switchView(view) {
    state.view = view;
    document.querySelectorAll(".tab").forEach((tab) => {
      const active = tab.dataset.view === view;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".view").forEach((section) => {
      const active = section.id === "view-" + view;
      section.hidden = !active;
      section.classList.toggle("active", active);
    });
    if (view === "roadmap") {
      renderStageTimeline();
      renderStageDetail();
    }
    if (view === "subjects") {
      renderSubjectCenter();
    }
    if (view === "calendar") {
      renderCalendar();
    }
    if (view === "glossary") {
      renderFilters();
      renderGlossary();
    }
    if (view === "deep") {
      renderDeepView();
    }
    refreshIcons();
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
      return;
    }
    document.querySelectorAll("i[data-lucide]").forEach((icon) => {
      const name = icon.dataset.lucide;
      const paths = FALLBACK_ICONS[name];
      if (!paths || icon.dataset.fallbackInjected) return;
      icon.dataset.fallbackInjected = "1";
      icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        paths +
        "</svg>";
    });
  }
  function render() {
    renderMasthead();
    renderSubjectSelect();
    renderSubjectCenter();
    renderGoal();
    renderDashboard();
    renderQuizCard();
    renderCalendar();
    renderDaily();
    renderRecent();
    renderReviewQueue();
    renderDeepView();
    renderMistakes();
    renderStageTimeline();
    renderStageDetail();
    refreshIcons();
  }

  function bindEvents() {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => switchView(tab.dataset.view));
    });

    $("subjectSelect").addEventListener("change", (e) => setActiveSubject(e.target.value));
    $("templateSearchInput").addEventListener("input", (e) => renderTemplateGrid(e.target.value));
    $("calendarPrevBtn").addEventListener("click", () => changeCalendarMonth(-1));
    $("calendarNextBtn").addEventListener("click", () => changeCalendarMonth(1));

    $("drawBtn").addEventListener("click", drawNext);
    $("masterBtn").addEventListener("click", () => {
      if (!state.currentTermId) return;
      openMasteryPopup(state.currentTermId, "master");
    });

    $("deepBtn").addEventListener("click", () => {
      if (!state.currentTermId) return;
      openDeep(state.currentTermId);
    });

    $("searchInput").addEventListener("input", (e) => {
      state.search = e.target.value;
      renderGlossary();
    });

    $("masteredOnly").addEventListener("click", () => {
      state.masteredOnly = !state.masteredOnly;
      const btn = $("masteredOnly");
      btn.classList.toggle("on", state.masteredOnly);
      btn.setAttribute("aria-pressed", String(state.masteredOnly));
      renderGlossary();
    });

    $("goalMinusBtn").addEventListener("click", () => setDailyGoal(getDailyGoal() - 1));
    $("goalPlusBtn").addEventListener("click", () => setDailyGoal(getDailyGoal() + 1));
    $("goalInput").addEventListener("change", (e) => setDailyGoal(e.target.value));

    $("quizBtn").addEventListener("click", startQuiz);
    $("quizTrueBtn").addEventListener("click", () => answerQuiz(true));
    $("quizFalseBtn").addEventListener("click", () => answerQuiz(false));
    $("quizNextBtn").addEventListener("click", nextQuizStep);

    $("modalMasterBtn").addEventListener("click", () => {
      const id = $("modalMasterBtn").dataset.term;
      if (!id) return;
      openMasteryPopup(id, "master");
    });

    $("modalReviewBtn").addEventListener("click", () => {
      const id = $("modalReviewBtn").dataset.term;
      if (!id) return;
      openMasteryPopup(id, "review");
    });

    $("modalDeepBtn").addEventListener("click", () => {
      const id = $("modalDeepBtn").dataset.term;
      if (!id) return;
      openDeep(id);
    });

    $("deepToggleBtn").addEventListener("click", () => {
      const id = $("deepToggleBtn").dataset.term;
      if (!id) return;
      toggleDeep(id);
      renderDeepModal(termById(id));
      renderDeepView();
      renderDaily();
      renderSubjectCenter();
      refreshIcons();
    });

    $("deepMistakeBtn").addEventListener("click", () => {
      const id = $("deepMistakeBtn").dataset.term;
      if (!id) return;
      removeMistake(id);
      renderDeepModal(termById(id));
      renderMistakes();
      renderDeepView();
    });

    $("deepReviewBtn").addEventListener("click", () => {
      const id = $("deepReviewBtn").dataset.term;
      if (!id) return;
      openMasteryPopup(id, "review");
    });

    $("deepNotes").addEventListener("input", (e) => {
      const id = $("deepToggleBtn").dataset.term;
      if (!id) return;
      saveDeepNote(id, e.target.value);
      renderDeepView();
    });

    document.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.querySelectorAll("[data-close-deep]").forEach((el) => {
      el.addEventListener("click", closeDeep);
    });

    document.querySelectorAll("[data-close-mastery]").forEach((el) => {
      el.addEventListener("click", closeMasteryPopup);
    });

    document.querySelectorAll("[data-close-subject]").forEach((el) => {
      el.addEventListener("click", closeSubjectModal);
    });

    document.querySelectorAll("[data-close-quiz]").forEach((el) => {
      el.addEventListener("click", closeQuiz);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!$("quizModal").hidden) closeQuiz();
        if (!$("subjectModal").hidden) closeSubjectModal();
        if (!$("masteryModal").hidden) closeMasteryPopup();
        if (!$("modal").hidden) closeModal();
        if (!$("deepModal").hidden) closeDeep();
      }
    });
  }

  function init() {
    loadProgress();
    const now = new Date();
    $("footerDate").textContent = now.getFullYear() + " 年 " + (now.getMonth() + 1) + " 月 " + now.getDate() + " 日";

    if (!state.currentTermId) {
      drawNext();
    } else {
      render();
    }
    renderQuizCard();
    bindEvents();
    renderMasthead();
    renderGoal();
    refreshIcons();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
