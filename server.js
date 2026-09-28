#!/usr/bin/env node
/**
 * Flowgorithm — educational flowchart programming in the browser.
 * Run: node server.js
 * Open: http://localhost:3000
 */

const http = require("http");
const { URL } = require("url");

const PORT = Number(process.env.PORT) || 3000;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
  <title>Flowgorithm</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg0: #0f1c24;
      --bg1: #152833;
      --panel: #1a303c;
      --panel-2: #213845;
      --line: #2f4a58;
      --text: #e8f1f4;
      --muted: #8aa3af;
      --accent: #2eb8a6;
      --accent-2: #f0b429;
      --danger: #e85d5d;
      --io: #3d8bfd;
      --decide: #e6c35c;
      --process: #5ad4c0;
      --terminal: #9b8cff;
      --shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
      --font: "Figtree", sans-serif;
      --mono: "IBM Plex Mono", monospace;
      --app-height: 100dvh;
    }

    * { box-sizing: border-box; }
    html {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    html, body {
      margin: 0;
      width: 100%;
      max-width: 100%;
      height: var(--app-height);
      max-height: var(--app-height);
      overflow: hidden;
      overscroll-behavior: none;
      touch-action: manipulation;
      font-family: var(--font);
      color: var(--text);
      background:
        radial-gradient(1200px 600px at 10% -10%, rgba(46, 184, 166, 0.18), transparent 55%),
        radial-gradient(900px 500px at 100% 0%, rgba(240, 180, 41, 0.12), transparent 50%),
        linear-gradient(160deg, var(--bg0), var(--bg1));
    }

    body {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      min-height: 0;
    }

    header.app-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(10px);
      background: rgba(15, 28, 36, 0.92);
      min-width: 0;
      flex-shrink: 0;
      z-index: 40;
    }

    .brand {
      display: flex;
      align-items: baseline;
      gap: 0.55rem;
      min-width: 0;
      flex-shrink: 1;
    }
    .brand h1 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .brand span {
      color: var(--muted);
      font-size: 0.78rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      align-items: center;
      flex: 1;
      min-width: 0;
    }

    /* Desktop: fixed vertical topbar (left rail) */
    @media (min-width: 981px) {
      body {
        grid-template-columns: 92px minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr);
      }

      header.app-bar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 92px;
        height: var(--app-height);
        max-height: var(--app-height);
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 0.85rem;
        padding: 1rem 0.55rem;
        border-bottom: none;
        border-right: 1px solid rgba(255,255,255,0.06);
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
      }

      .brand {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.15rem;
        flex-shrink: 0;
      }
      .brand h1 {
        font-size: 0.78rem;
        letter-spacing: 0.02em;
        white-space: normal;
        line-height: 1.15;
        writing-mode: horizontal-tb;
      }
      .brand span {
        display: none;
      }

      .toolbar {
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
        flex: 1;
        gap: 0.35rem;
        width: 100%;
      }

      .toolbar button,
      .toolbar .file-btn {
        width: 100%;
        justify-content: center;
        text-align: center;
        padding: 0.55rem 0.35rem;
        font-size: 0.72rem;
      }

      main {
        grid-column: 2;
        grid-row: 1;
        height: var(--app-height);
        max-height: var(--app-height);
      }
    }

    button, .file-btn {
      font-family: var(--font);
      font-weight: 600;
      font-size: 0.85rem;
      border: 1px solid transparent;
      border-radius: 0.55rem;
      padding: 0.45rem 0.8rem;
      cursor: pointer;
      color: var(--text);
      background: var(--panel-2);
      transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
    }
    button:hover, .file-btn:hover {
      background: #2a4654;
      border-color: rgba(255,255,255,0.08);
    }
    button:active { transform: translateY(1px); }
    button.primary {
      background: linear-gradient(135deg, #2eb8a6, #249889);
      color: #06221e;
    }
    button.primary:hover { background: linear-gradient(135deg, #3dccb9, #2eb8a6); }
    button.warn { background: #3a2a18; color: #ffd27a; }
    button.ghost,
    .file-btn.ghost {
      background: transparent;
      border-color: var(--line);
      color: var(--muted);
    }
    button:disabled,
    .file-btn:disabled,
    button[disabled] {
      opacity: 0.4;
      cursor: not-allowed;
      filter: grayscale(0.35);
    }
    button.warn:disabled {
      background: var(--panel-2);
      color: var(--muted);
      filter: none;
      opacity: 0.45;
    }

    .file-btn { display: inline-flex; align-items: center; }
    .file-btn input { display: none; }

    main {
      display: grid;
      grid-template-columns: 210px minmax(0, 1fr) 300px;
      min-height: 0;
      min-width: 0;
      height: 100%;
      overflow: hidden;
      gap: 0;
    }

    aside, .side {
      background: rgba(26, 48, 60, 0.88);
      border-right: 1px solid rgba(255,255,255,0.05);
      padding: 1rem;
      overflow: auto;
      min-height: 0;
      min-width: 0;
    }
    .side {
      border-right: none;
      border-left: 1px solid rgba(255,255,255,0.05);
      display: grid;
      /* Inspector + Variables stay compact; Console takes leftover space */
      grid-template-rows: auto auto minmax(0, 1fr);
      gap: 0.65rem;
      align-content: start;
    }
    .side > div {
      min-width: 0;
      min-height: 0;
    }

    h2 {
      margin: 0 0 0.75rem;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 700;
    }

    .palette {
      display: grid;
      gap: 0.45rem;
    }
    .palette button {
      text-align: left;
      display: grid;
      grid-template-columns: 14px 1fr;
      gap: 0.55rem;
      align-items: center;
      padding: 0.55rem 0.7rem;
    }
    .swatch {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      border: 1px solid rgba(0,0,0,0.25);
    }
    .swatch.start { background: #c6efce; }
    .swatch.declare { background: #ffffff; }
    .swatch.assign { background: #ffffff; }
    .swatch.input, .swatch.output { background: #bdd7ee; }
    .swatch.if, .swatch.while, .swatch.for { background: #ffe699; }
    .swatch.end { background: #c6efce; }

    .hint {
      margin-top: 1rem;
      color: var(--muted);
      font-size: 0.8rem;
      line-height: 1.45;
    }

    .workspace {
      position: relative;
      min-height: 0;
      min-width: 0;
      height: 100%;
      overflow: hidden;
      /* Classic Flowgorithm chart surface */
      background-color: #eceff3;
      background-image:
        linear-gradient(rgba(60, 80, 100, 0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(60, 80, 100, 0.07) 1px, transparent 1px);
      background-size: 24px 24px;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
    }

    #canvas {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      display: block;
      cursor: grab;
      touch-action: none;
      -webkit-user-select: none;
      user-select: none;
    }
    #canvas.dragging { cursor: grabbing; }

    .inspector label {
      display: block;
      font-size: 0.75rem;
      color: var(--muted);
      margin: 0.55rem 0 0.25rem;
    }
    .inspector input, .inspector select, .inspector textarea {
      width: 100%;
      font-family: var(--mono);
      font-size: 0.82rem;
      color: var(--text);
      background: #122029;
      border: 1px solid var(--line);
      border-radius: 0.45rem;
      padding: 0.5rem 0.55rem;
    }
    .inspector textarea { min-height: 4.5rem; resize: vertical; }
    .empty-state {
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .console-wrap {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      border-top: 1px solid rgba(255,255,255,0.06);
      background: #101c23;
      border-radius: 0.65rem;
      overflow: hidden;
    }
    .console-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.45rem 0.65rem;
      background: #152631;
      font-size: 0.75rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
    }
    #console {
      margin: 0;
      padding: 0.65rem;
      overflow: auto;
      font-family: var(--mono);
      font-size: 0.78rem;
      line-height: 1.45;
      white-space: pre-wrap;
      color: #d7ebe6;
    }
    #console .err { color: #ff8f8f; }
    #console .out { color: #9be7d8; }
    #console .sys { color: #8aa3af; }
    .prompt-row {
      display: flex;
      gap: 0.35rem;
      align-items: center;
      padding: 0.45rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .prompt-row input {
      flex: 1;
      min-width: 0;
      font-family: var(--mono);
      font-size: 0.8rem;
      color: var(--text);
      background: #122029;
      border: 1px solid var(--line);
      border-radius: 0.4rem;
      padding: 0.45rem 0.55rem;
    }
    .prompt-row button {
      flex-shrink: 0;
      white-space: nowrap;
    }

    .vars {
      font-family: var(--mono);
      font-size: 0.78rem;
      background: #101c23;
      border-radius: 0.65rem;
      padding: 0.55rem 0.65rem;
      min-height: 2.25rem;
      max-height: 5.5rem;
      overflow: auto;
      color: #c9dde5;
      white-space: pre-wrap;
    }

    .inspector .hint {
      margin-top: 0.45rem;
      font-size: 0.72rem;
    }

    @media (max-width: 980px) {
      header.app-bar {
        flex-wrap: wrap;
        padding: 0.65rem 0.85rem;
        gap: 0.55rem;
      }
      .brand span { display: none; }
      .brand h1 { font-size: 1.15rem; }
      main {
        grid-template-columns: 1fr;
        grid-template-rows: auto minmax(0, 1fr) minmax(0, 32%);
        overflow: hidden;
      }
      aside, .side {
        border: none;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      aside {
        max-height: 7.5rem;
        padding: 0.65rem 0.85rem;
      }
      .side {
        padding: 0.55rem 0.85rem;
        grid-template-rows: auto auto minmax(0, 1fr);
        overflow: auto;
        max-height: 100%;
      }
      .palette { grid-template-columns: repeat(3, 1fr); }
      .hint,
      .inspector .hint { display: none; }
      .console-wrap {
        min-height: 0;
        height: auto;
        max-height: none;
      }
      .vars {
        min-height: 1.75rem;
        max-height: 3.5rem;
      }
      /* Keep iOS from zooming/stretching the page on focus */
      .inspector input,
      .inspector select,
      .inspector textarea,
      .prompt-row input,
      button,
      .file-btn {
        font-size: 16px;
      }
    }

    @supports not (height: 100dvh) {
      :root { --app-height: 100vh; }
    }
  </style>
  <script>
    /* Keep layout locked to the visible viewport (mobile browser chrome). */
    (function () {
      function setAppHeight() {
        var h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        document.documentElement.style.setProperty("--app-height", h + "px");
      }
      setAppHeight();
      window.addEventListener("resize", setAppHeight);
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", setAppHeight);
        window.visualViewport.addEventListener("scroll", setAppHeight);
      }
      document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, { passive: false });
    })();
  </script>
</head>
<body>
  <header class="app-bar">
    <div class="brand">
      <h1>Flowgorithm</h1>
      <span>flowchart → program</span>
    </div>
    <div class="toolbar">
      <button type="button" class="primary" id="btn-run">Run</button>
      <button type="button" class="warn" id="btn-stop" disabled>Stop</button>
      <button type="button" class="ghost" id="btn-step">Step</button>
      <button type="button" class="ghost" id="btn-new">New</button>
      <button type="button" class="ghost" id="btn-example">Example</button>
      <label class="file-btn ghost" id="btn-open">Open<input type="file" id="file-open" accept=".json,.fprg,application/json,text/xml" /></label>
      <button type="button" class="ghost" id="btn-save">Save</button>
      <button type="button" class="ghost" id="btn-delete" title="Delete selected">Delete</button>
    </div>
  </header>

  <main>
    <aside>
      <h2>Shapes</h2>
      <div class="palette" id="palette"></div>
      <p class="hint">
        Click a shape to add it. Drag the chart to pan.
        Shift-click two shapes to link. For If/While/For:
        target on the left = True, right = False.
      </p>
    </aside>

    <section class="workspace">
      <svg id="canvas" xmlns="http://www.w3.org/2000/svg"></svg>
    </section>

    <section class="side">
      <div>
        <h2>Inspector</h2>
        <div class="inspector" id="inspector">
          <p class="empty-state">Select a shape to edit its properties.</p>
        </div>
      </div>
      <div>
        <h2>Variables</h2>
        <div class="vars" id="vars">(idle)</div>
      </div>
      <div class="console-wrap">
        <div class="console-head">
          <span>Console</span>
          <button type="button" class="ghost" id="btn-clear-console" style="padding:0.2rem 0.45rem;font-size:0.7rem">Clear</button>
        </div>
        <pre id="console"></pre>
        <div class="prompt-row">
          <input id="stdin" placeholder="Input value…" disabled />
          <button type="button" id="btn-submit" disabled>Enter</button>
        </div>
      </div>
    </section>
  </main>

  <script>
  (() => {
    const SHAPE_DEFS = [
      { type: "start", label: "Start", once: true },
      { type: "declare", label: "Declare" },
      { type: "input", label: "Input" },
      { type: "assign", label: "Assign" },
      { type: "output", label: "Output" },
      { type: "if", label: "If" },
      { type: "while", label: "While" },
      { type: "for", label: "For" },
      { type: "end", label: "End", once: true },
    ];

    /* Classic Flowgorithm-inspired chart style */
    const STYLE = {
      fill: {
        start: "#c6efce",
        end: "#c6efce",
        declare: "#ffffff",
        assign: "#ffffff",
        input: "#bdd7ee",
        output: "#bdd7ee",
        if: "#ffe699",
        while: "#f8cbad",
        for: "#f8cbad",
      },
      stroke: "#1f2a32",
      line: "#1f2a32",
      trueStroke: "#2e7d32",
      falseStroke: "#c62828",
      text: "#102028",
      selected: "#1565c0",
      link: "#6a1b9a",
      exec: "#ef6c00",
      size: {
        start: { w: 150, h: 48 },
        end: { w: 150, h: 48 },
        declare: { w: 170, h: 52 },
        assign: { w: 170, h: 52 },
        input: { w: 170, h: 52 },
        output: { w: 170, h: 52 },
        if: { w: 180, h: 78 },
        while: { w: 180, h: 78 },
        for: { w: 190, h: 78 },
      },
    };

    const state = {
      nodes: [],
      edges: [],
      selectedId: null,
      linkFrom: null,
      pan: { x: 80, y: 28 },
      draggingNode: null,
      panning: false,
      panStart: null,
      running: false,
      waitingInput: null,
      stepMode: false,
      stepResolve: null,
      highlightId: null,
      vars: Object.create(null),
      idSeq: 1,
    };

    const svg = document.getElementById("canvas");
    const inspector = document.getElementById("inspector");
    const consoleEl = document.getElementById("console");
    const varsEl = document.getElementById("vars");
    const stdin = document.getElementById("stdin");
    const btnSubmit = document.getElementById("btn-submit");
    const btnRun = document.getElementById("btn-run");
    const btnStop = document.getElementById("btn-stop");
    const btnStep = document.getElementById("btn-step");

    function uid() {
      return "n" + (state.idSeq++);
    }

    function log(text, cls = "sys") {
      const span = document.createElement("span");
      span.className = cls;
      span.textContent = text + "\\n";
      consoleEl.appendChild(span);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    function defaultProps(type) {
      switch (type) {
        case "declare": return { name: "x", typeName: "Integer", isArray: false, size: "" };
        case "input": return { variable: "x" };
        case "output": return { expression: '"Hello"' };
        case "assign": return { variable: "x", expression: "x + 1" };
        case "if": return { condition: "x > 0" };
        case "while": return { condition: "x < 10" };
        case "for": return { variable: "i", start: "1", end: "10", step: "1" };
        default: return {};
      }
    }

    function nodeLabel(n) {
      const p = n.props || {};
      switch (n.type) {
        case "start": return "Start";
        case "end": return "End";
        case "declare": return p.isArray ? \`\${p.typeName} \${p.name}[\${p.size || "?"}]\` : \`\${p.typeName} \${p.name}\`;
        case "input": return \`Input \${p.variable}\`;
        case "output": return \`Output \${p.expression}\`;
        case "assign": return \`\${p.variable} = \${p.expression}\`;
        case "if": return p.condition;
        case "while": return \`While \${p.condition}\`;
        case "for": return \`For \${p.variable} = \${p.start} to \${p.end}\`;
        default: return n.type;
      }
    }

    function makeNode(type, x, y, props) {
      const sz = STYLE.size[type] || { w: 170, h: 52 };
      return {
        id: uid(),
        type,
        x,
        y,
        w: sz.w,
        h: sz.h,
        props: props || defaultProps(type),
      };
    }

    function addNode(type, x = 220 + state.nodes.length * 8, y = 60 + state.nodes.length * 70) {
      if ((type === "start" || type === "end") && state.nodes.some((n) => n.type === type)) {
        log(\`Only one \${type} shape is allowed.\`, "err");
        return;
      }
      const node = makeNode(type, x, y);
      state.nodes.push(node);
      state.selectedId = node.id;
      render();
      renderInspector();
    }

    function findNode(id) {
      return state.nodes.find((n) => n.id === id);
    }

    function deleteSelected() {
      if (!state.selectedId) return;
      const id = state.selectedId;
      state.nodes = state.nodes.filter((n) => n.id !== id);
      state.edges = state.edges.filter((e) => e.from !== id && e.to !== id);
      if (state.linkFrom === id) state.linkFrom = null;
      state.selectedId = null;
      render();
      renderInspector();
    }

    function connect(fromId, toId) {
      if (fromId === toId) return;
      const from = findNode(fromId);
      const to = findNode(toId);
      if (!from || !to) return;

      let branch = "next";
      if (from.type === "if" || from.type === "while" || from.type === "for") {
        // Flowgorithm convention: True on the left, False on the right
        const fromCx = from.x + from.w / 2;
        const toCx = to.x + to.w / 2;
        branch = toCx <= fromCx ? "true" : "false";
      }

      if (from.type === "if" || from.type === "while" || from.type === "for") {
        state.edges = state.edges.filter((e) => !(e.from === fromId && e.branch === branch));
      } else {
        state.edges = state.edges.filter((e) => e.from !== fromId);
      }
      state.edges.push({ from: fromId, to: toId, branch });
      state.linkFrom = null;
      log(\`Linked → \${branch === "next" ? "next" : branch}\`, "sys");
      render();
    }

    function shapePath(type, w, h) {
      // Classic flowchart geometry (Flowgorithm-style)
      if (type === "start" || type === "end") {
        const r = h / 2;
        return \`M \${r},0 H \${w - r} A \${r},\${r} 0 0 1 \${w - r},\${h} H \${r} A \${r},\${r} 0 0 1 \${r},0 Z\`;
      }
      if (type === "input" || type === "output") {
        const skew = Math.min(22, w * 0.14);
        return \`M \${skew},0 H \${w} L \${w - skew},\${h} H 0 Z\`;
      }
      if (type === "if" || type === "while" || type === "for") {
        return \`M \${w / 2},0 L \${w},\${h / 2} L \${w / 2},\${h} L 0,\${h / 2} Z\`;
      }
      // declare / assign rectangle
      return \`M 0,0 H \${w} V \${h} H 0 Z\`;
    }

    function anchorPoint(node, which) {
      const cx = node.x + node.w / 2;
      const cy = node.y + node.h / 2;
      if (which === "top") return { x: cx, y: node.y };
      if (which === "bottom") return { x: cx, y: node.y + node.h };
      if (which === "left") return { x: node.x, y: cy };
      if (which === "right") return { x: node.x + node.w, y: cy };
      return { x: cx, y: cy };
    }

    function elbowPath(x1, y1, x2, y2, branch) {
      // Orthogonal connectors like Flowgorithm
      if (branch === "true") {
        const midX = Math.min(x1, x2) - 18;
        const drop = y1 + Math.max(18, (y2 - y1) * 0.35);
        return \`M \${x1} \${y1} L \${midX} \${y1} L \${midX} \${drop} L \${x2} \${drop} L \${x2} \${y2}\`;
      }
      if (branch === "false") {
        const midX = Math.max(x1, x2) + 18;
        const drop = y1 + Math.max(18, (y2 - y1) * 0.35);
        return \`M \${x1} \${y1} L \${midX} \${y1} L \${midX} \${drop} L \${x2} \${drop} L \${x2} \${y2}\`;
      }
      const midY = y1 + Math.max(24, (y2 - y1) / 2);
      return \`M \${x1} \${y1} L \${x1} \${midY} L \${x2} \${midY} L \${x2} \${y2}\`;
    }

    function render() {
      const ns = "http://www.w3.org/2000/svg";
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const root = document.createElementNS(ns, "g");
      root.setAttribute("transform", \`translate(\${state.pan.x},\${state.pan.y})\`);
      svg.appendChild(root);

      const defs = document.createElementNS(ns, "defs");
      defs.innerHTML = \`
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="\${STYLE.line}"></path>
        </marker>
        <marker id="arrow-true" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="\${STYLE.trueStroke}"></path>
        </marker>
        <marker id="arrow-false" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="\${STYLE.falseStroke}"></path>
        </marker>
        <filter id="shape-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#000" flood-opacity="0.18"/>
        </filter>
      \`;
      root.appendChild(defs);

      // edges first (under shapes)
      for (const e of state.edges) {
        const a = findNode(e.from);
        const b = findNode(e.to);
        if (!a || !b) continue;

        let start;
        let end = anchorPoint(b, "top");
        let stroke = STYLE.line;
        let marker = "url(#arrow)";

        if (e.branch === "true") {
          start = anchorPoint(a, "left");
          stroke = STYLE.trueStroke;
          marker = "url(#arrow-true)";
        } else if (e.branch === "false") {
          start = anchorPoint(a, "right");
          stroke = STYLE.falseStroke;
          marker = "url(#arrow-false)";
        } else {
          start = anchorPoint(a, "bottom");
        }

        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", elbowPath(start.x, start.y, end.x, end.y, e.branch));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", stroke);
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("marker-end", marker);
        root.appendChild(path);

        if (e.branch === "true" || e.branch === "false") {
          const label = document.createElementNS(ns, "text");
          const lx = e.branch === "true" ? start.x - 28 : start.x + 10;
          const ly = start.y - 6;
          label.setAttribute("x", lx);
          label.setAttribute("y", ly);
          label.setAttribute("fill", stroke);
          label.setAttribute("font-size", "12");
          label.setAttribute("font-weight", "700");
          label.setAttribute("font-family", "Figtree, sans-serif");
          label.textContent = e.branch === "true" ? "True" : "False";
          root.appendChild(label);
        }
      }

      for (const n of state.nodes) {
        const g = document.createElementNS(ns, "g");
        g.setAttribute("transform", \`translate(\${n.x},\${n.y})\`);
        g.style.cursor = "pointer";
        g.dataset.id = n.id;

        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", shapePath(n.type, n.w, n.h));
        path.setAttribute("fill", STYLE.fill[n.type] || "#fff");
        path.setAttribute("stroke", n.id === state.highlightId
          ? STYLE.exec
          : n.id === state.linkFrom
            ? STYLE.link
            : n.id === state.selectedId
              ? STYLE.selected
              : STYLE.stroke);
        path.setAttribute("stroke-width", n.id === state.selectedId || n.id === state.highlightId || n.id === state.linkFrom ? "2.6" : "1.7");
        path.setAttribute("filter", "url(#shape-shadow)");
        g.appendChild(path);

        // multiline-ish label
        const text = document.createElementNS(ns, "text");
        text.setAttribute("x", n.w / 2);
        text.setAttribute("y", n.h / 2 + 4);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", STYLE.text);
        text.setAttribute("font-size", n.type === "if" || n.type === "while" || n.type === "for" ? "12" : "13");
        text.setAttribute("font-weight", "700");
        text.setAttribute("font-family", "Figtree, sans-serif");
        const label = nodeLabel(n);
        text.textContent = label.length > 24 ? label.slice(0, 23) + "…" : label;
        g.appendChild(text);

        g.addEventListener("pointerdown", onNodePointerDown);
        g.addEventListener("dblclick", () => {
          state.selectedId = n.id;
          renderInspector();
          render();
        });
        root.appendChild(g);
      }
    }

    function onNodePointerDown(ev) {
      ev.stopPropagation();
      const id = ev.currentTarget.dataset.id;
      if (ev.shiftKey || state.linkFrom) {
        if (!state.linkFrom) {
          state.linkFrom = id;
          state.selectedId = id;
          log("Click another shape to link. For If/While/For: left = True, right = False.", "sys");
        } else {
          connect(state.linkFrom, id);
        }
        render();
        renderInspector();
        return;
      }
      state.selectedId = id;
      state.draggingNode = { id, ox: ev.clientX, oy: ev.clientY, nx: findNode(id).x, ny: findNode(id).y };
      svg.setPointerCapture(ev.pointerId);
      render();
      renderInspector();
    }

    svg.addEventListener("pointerdown", (ev) => {
      if (ev.target === svg) {
        state.selectedId = null;
        state.panning = true;
        state.panStart = { x: ev.clientX, y: ev.clientY, px: state.pan.x, py: state.pan.y };
        svg.classList.add("dragging");
        renderInspector();
        render();
      }
    });

    svg.addEventListener("pointermove", (ev) => {
      if (state.draggingNode) {
        const n = findNode(state.draggingNode.id);
        if (!n) return;
        n.x = state.draggingNode.nx + (ev.clientX - state.draggingNode.ox);
        n.y = state.draggingNode.ny + (ev.clientY - state.draggingNode.oy);
        render();
      } else if (state.panning && state.panStart) {
        state.pan.x = state.panStart.px + (ev.clientX - state.panStart.x);
        state.pan.y = state.panStart.py + (ev.clientY - state.panStart.y);
        render();
      }
    });

    svg.addEventListener("pointerup", () => {
      state.draggingNode = null;
      state.panning = false;
      state.panStart = null;
      svg.classList.remove("dragging");
    });

    function renderInspector() {
      const n = findNode(state.selectedId);
      if (!n) {
        inspector.innerHTML = '<p class="empty-state">Select a shape to edit its properties.</p>';
        return;
      }
      const p = n.props;
      let fields = \`<div style="margin-bottom:0.35rem;color:var(--muted);font-size:0.8rem">\${n.type.toUpperCase()}</div>\`;
      if (n.type === "declare") {
        fields += field("name", "Name", p.name);
        fields += select("typeName", "Type", p.typeName, ["Integer", "Real", "String", "Boolean"]);
        fields += check("isArray", "Array", p.isArray);
        fields += field("size", "Size", p.size || "");
      } else if (n.type === "input") {
        fields += field("variable", "Variable", p.variable);
      } else if (n.type === "output") {
        fields += field("expression", "Expression", p.expression);
      } else if (n.type === "assign") {
        fields += field("variable", "Variable", p.variable);
        fields += field("expression", "Expression", p.expression);
      } else if (n.type === "if" || n.type === "while") {
        fields += field("condition", "Condition", p.condition);
      } else if (n.type === "for") {
        fields += field("variable", "Variable", p.variable);
        fields += field("start", "Start", p.start);
        fields += field("end", "End", p.end);
        fields += field("step", "Step", p.step);
      } else {
        fields += '<p class="empty-state">No editable properties.</p>';
      }
      fields += '<p class="hint" style="margin-top:0.75rem">Tip: Shift-click to link. Left of If = True, right = False.</p>';
      inspector.innerHTML = fields;
      inspector.querySelectorAll("[data-prop]").forEach((el) => {
        el.addEventListener("change", () => {
          const key = el.dataset.prop;
          n.props[key] = el.type === "checkbox" ? el.checked : el.value;
          render();
        });
        el.addEventListener("input", () => {
          if (el.type === "checkbox") return;
          n.props[el.dataset.prop] = el.value;
          render();
        });
      });
    }

    function field(key, label, value) {
      return \`<label>\${label}<input data-prop="\${key}" value="\${escapeAttr(value)}" /></label>\`;
    }
    function select(key, label, value, options) {
      return \`<label>\${label}<select data-prop="\${key}">\${options.map((o) => \`<option \${o === value ? "selected" : ""}>\${o}</option>\`).join("")}</select></label>\`;
    }
    function check(key, label, value) {
      return \`<label style="display:flex;gap:0.45rem;align-items:center;margin-top:0.7rem"><input type="checkbox" data-prop="\${key}" \${value ? "checked" : ""} /> \${label}</label>\`;
    }
    function escapeAttr(s) {
      return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    }

    function showVars() {
      const keys = Object.keys(state.vars);
      if (!keys.length) {
        varsEl.textContent = "(none)";
        return;
      }
      varsEl.textContent = keys.map((k) => {
        const v = state.vars[k];
        return Array.isArray(v) ? \`\${k} = [\${v.join(", ")}]\` : \`\${k} = \${JSON.stringify(v)}\`;
      }).join("\\n");
    }

    // ---- expression evaluator (safe-ish subset) ----
    function tokenize(expr) {
      const tokens = [];
      let i = 0;
      const s = String(expr);
      while (i < s.length) {
        const c = s[i];
        if (/\\s/.test(c)) { i++; continue; }
        if ('"+\\''.includes(c)) {
          const q = c;
          let j = i + 1, out = "";
          while (j < s.length && s[j] !== q) {
            if (s[j] === "\\\\") { out += s[j + 1]; j += 2; }
            else { out += s[j++]; }
          }
          tokens.push({ t: "str", v: out });
          i = j + 1;
          continue;
        }
        if (/[0-9.]/.test(c)) {
          let j = i;
          while (j < s.length && /[0-9.]/.test(s[j])) j++;
          tokens.push({ t: "num", v: Number(s.slice(i, j)) });
          i = j;
          continue;
        }
        if (/[A-Za-z_]/.test(c)) {
          let j = i;
          while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++;
          const name = s.slice(i, j);
          if (name === "true" || name === "false") tokens.push({ t: "bool", v: name === "true" });
          else tokens.push({ t: "id", v: name });
          i = j;
          continue;
        }
        const two = s.slice(i, i + 2);
        if (["==", "!=", "<=", ">=", "&&", "||"].includes(two)) {
          tokens.push({ t: "op", v: two });
          i += 2;
          continue;
        }
        if ("+-*/%<>=!()[],".includes(c)) {
          tokens.push({ t: "op", v: c });
          i++;
          continue;
        }
        throw new Error("Unexpected character: " + c);
      }
      return tokens;
    }

    function evalExpr(expr, env) {
      const tokens = tokenize(expr);
      let pos = 0;
      function peek() { return tokens[pos]; }
      function take() { return tokens[pos++]; }
      function parsePrimary() {
        const tok = take();
        if (!tok) throw new Error("Unexpected end of expression");
        if (tok.t === "num" || tok.t === "str" || tok.t === "bool") return tok.v;
        if (tok.t === "id") {
          if (!(tok.v in env)) throw new Error("Unknown variable: " + tok.v);
          let val = env[tok.v];
          if (peek() && peek().v === "[") {
            take();
            const idx = parseExpr();
            if (!peek() || peek().v !== "]") throw new Error("Expected ]");
            take();
            return val[idx];
          }
          return val;
        }
        if (tok.v === "(") {
          const v = parseExpr();
          if (!peek() || peek().v !== ")") throw new Error("Expected )");
          take();
          return v;
        }
        if (tok.v === "-") return -parsePrimary();
        if (tok.v === "!") return !parsePrimary();
        throw new Error("Unexpected token: " + tok.v);
      }
      function parseMul() {
        let left = parsePrimary();
        while (peek() && "*/%".includes(peek().v)) {
          const op = take().v;
          const right = parsePrimary();
          if (op === "*") left *= right;
          else if (op === "/") left /= right;
          else left %= right;
        }
        return left;
      }
      function parseAdd() {
        let left = parseMul();
        while (peek() && (peek().v === "+" || peek().v === "-")) {
          const op = take().v;
          const right = parseMul();
          left = op === "+" ? left + right : left - right;
        }
        return left;
      }
      function parseCmp() {
        let left = parseAdd();
        while (peek() && ["<", ">", "<=", ">=", "==", "!="].includes(peek().v)) {
          const op = take().v;
          const right = parseAdd();
          if (op === "<") left = left < right;
          else if (op === ">") left = left > right;
          else if (op === "<=") left = left <= right;
          else if (op === ">=") left = left >= right;
          else if (op === "==") left = left == right;
          else left = left != right;
        }
        return left;
      }
      function parseAnd() {
        let left = parseCmp();
        while (peek() && peek().v === "&&") {
          take();
          left = left && parseCmp();
        }
        return left;
      }
      function parseExpr() {
        let left = parseAnd();
        while (peek() && peek().v === "||") {
          take();
          left = left || parseAnd();
        }
        return left;
      }
      const value = parseExpr();
      if (pos < tokens.length) throw new Error("Unexpected trailing tokens");
      return value;
    }

    function coerce(typeName, raw) {
      if (typeName === "Integer") return parseInt(raw, 10);
      if (typeName === "Real") return parseFloat(raw);
      if (typeName === "Boolean") {
        const s = String(raw).toLowerCase();
        if (s === "true" || s === "1") return true;
        if (s === "false" || s === "0") return false;
        throw new Error("Expected Boolean");
      }
      return String(raw);
    }

    function nextEdge(nodeId, branch = "next") {
      return state.edges.find((e) => e.from === nodeId && e.branch === branch)
        || (branch === "next" ? state.edges.find((e) => e.from === nodeId) : null);
    }

    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async function waitStep() {
      if (!state.stepMode) {
        await sleep(220);
        return;
      }
      return new Promise((resolve) => { state.stepResolve = resolve; });
    }

    function askInput(promptText) {
      return new Promise((resolve) => {
        state.waitingInput = resolve;
        stdin.disabled = false;
        btnSubmit.disabled = false;
        stdin.value = "";
        stdin.focus();
        log(promptText, "sys");
      });
    }

    function submitInput() {
      if (!state.waitingInput) return;
      const v = stdin.value;
      log("> " + v, "out");
      const resolve = state.waitingInput;
      state.waitingInput = null;
      stdin.disabled = true;
      btnSubmit.disabled = true;
      resolve(v);
    }

    async function runProgram(stepMode = false) {
      if (state.running) return;
      const start = state.nodes.find((n) => n.type === "start");
      if (!start) {
        log("Add a Start shape first.", "err");
        return;
      }
      state.running = true;
      state.stepMode = stepMode;
      state.vars = Object.create(null);
      const declared = Object.create(null);
      btnRun.disabled = true;
      btnStop.disabled = false;
      log("— Run started —", "sys");
      showVars();

      let current = start;
      const loopStack = [];
      let steps = 0;

      try {
        while (current && state.running) {
          if (++steps > 10000) throw new Error("Too many steps (possible infinite loop)");
          state.highlightId = current.id;
          render();
          await waitStep();
          if (!state.running) break;

          const n = current;
          let branch = "next";

          if (n.type === "start") {
            // fall through
          } else if (n.type === "end") {
            break;
          } else if (n.type === "declare") {
            const { name, typeName, isArray, size } = n.props;
            declared[name] = typeName;
            if (isArray) {
              const len = Number(evalExpr(size || "0", state.vars));
              state.vars[name] = Array.from({ length: len }, () =>
                typeName === "String" ? "" : typeName === "Boolean" ? false : 0
              );
            } else {
              state.vars[name] = typeName === "String" ? "" : typeName === "Boolean" ? false : 0;
            }
          } else if (n.type === "assign") {
            state.vars[n.props.variable] = evalExpr(n.props.expression, state.vars);
          } else if (n.type === "output") {
            const val = evalExpr(n.props.expression, state.vars);
            log(String(val), "out");
          } else if (n.type === "input") {
            const raw = await askInput("Enter " + n.props.variable + ":");
            if (!state.running) break;
            const t = declared[n.props.variable] || "String";
            state.vars[n.props.variable] = coerce(t, raw);
          } else if (n.type === "if") {
            branch = evalExpr(n.props.condition, state.vars) ? "true" : "false";
          } else if (n.type === "while") {
            const ok = !!evalExpr(n.props.condition, state.vars);
            if (ok) {
              loopStack.push({ type: "while", nodeId: n.id });
              branch = "true";
            } else {
              branch = "false";
            }
          } else if (n.type === "for") {
            const { variable, start: st, end, step } = n.props;
            if (!n._forInit) {
              state.vars[variable] = evalExpr(st, state.vars);
              n._forInit = true;
            }
            const i = state.vars[variable];
            const endV = evalExpr(end, state.vars);
            const stepV = evalExpr(step || "1", state.vars);
            const cont = stepV >= 0 ? i <= endV : i >= endV;
            if (cont) {
              loopStack.push({ type: "for", nodeId: n.id, stepV });
              branch = "true";
            } else {
              n._forInit = false;
              branch = "false";
            }
          }

          showVars();

          // after body of loops, return to loop header
          if (n.type !== "while" && n.type !== "for" && n.type !== "if") {
            const edge = nextEdge(n.id, "next");
            if (!edge && loopStack.length) {
              const frame = loopStack.pop();
              const header = findNode(frame.nodeId);
              if (frame.type === "for") {
                state.vars[header.props.variable] =
                  Number(state.vars[header.props.variable]) + Number(frame.stepV);
              }
              current = header;
              continue;
            }
            current = edge ? findNode(edge.to) : null;
          } else if (n.type === "if") {
            const edge = nextEdge(n.id, branch);
            current = edge ? findNode(edge.to) : null;
          } else {
            // while / for
            const edge = nextEdge(n.id, branch);
            if (branch === "false") {
              // leave loop
              current = edge ? findNode(edge.to) : null;
            } else {
              current = edge ? findNode(edge.to) : null;
              if (!current) throw new Error(n.type + " has no true/body branch");
            }
          }
        }
        log("— Run finished —", "sys");
      } catch (err) {
        log("Error: " + err.message, "err");
      } finally {
        state.nodes.forEach((n) => { delete n._forInit; });
        state.running = false;
        state.highlightId = null;
        state.stepResolve = null;
        state.waitingInput = null;
        stdin.disabled = true;
        btnSubmit.disabled = true;
        btnRun.disabled = false;
        btnStop.disabled = true;
        render();
        showVars();
      }
    }

    function stopProgram() {
      state.running = false;
      if (state.stepResolve) state.stepResolve();
      if (state.waitingInput) {
        state.waitingInput("");
        state.waitingInput = null;
      }
      log("— Stopped —", "sys");
    }

    function newProgram() {
      state.nodes = [];
      state.edges = [];
      state.selectedId = null;
      state.linkFrom = null;
      state.idSeq = 1;
      const s = makeNode("start", 260, 36);
      const e = makeNode("end", 260, 220);
      state.nodes = [s, e];
      state.edges = [{ from: s.id, to: e.id, branch: "next" }];
      render();
      renderInspector();
      log("New program.", "sys");
    }

    function loadExample() {
      state.nodes = [];
      state.edges = [];
      state.idSeq = 1;
      const start = makeNode("start", 260, 24);
      const decl = makeNode("declare", 250, 100, { name: "n", typeName: "Integer", isArray: false, size: "" });
      const inp = makeNode("input", 250, 180, { variable: "n" });
      const iff = makeNode("if", 245, 270, { condition: "n % 2 == 0" });
      const even = makeNode("output", 40, 400, { expression: '"Even"' });
      const odd = makeNode("output", 460, 400, { expression: '"Odd"' });
      const end = makeNode("end", 260, 520);
      state.nodes = [start, decl, inp, iff, even, odd, end];
      state.edges = [
        { from: start.id, to: decl.id, branch: "next" },
        { from: decl.id, to: inp.id, branch: "next" },
        { from: inp.id, to: iff.id, branch: "next" },
        { from: iff.id, to: even.id, branch: "true" },
        { from: iff.id, to: odd.id, branch: "false" },
        { from: even.id, to: end.id, branch: "next" },
        { from: odd.id, to: end.id, branch: "next" },
      ];
      state.selectedId = null;
      state.pan = { x: 40, y: 16 };
      render();
      renderInspector();
      log("Loaded even/odd example (Flowgorithm-style chart).", "sys");
    }

    function saveProgram() {
      const data = {
        format: "flowgorithm-web",
        version: 1,
        nodes: state.nodes.map(({ id, type, x, y, w, h, props }) => ({ id, type, x, y, w, h, props })),
        edges: state.edges,
        idSeq: state.idSeq,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "program.flow.json";
      a.click();
      URL.revokeObjectURL(a.href);
    }

    function openProgram(file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result);
          if (text.trim().startsWith("<")) {
            importFprg(text);
          } else {
            const data = JSON.parse(text);
            state.nodes = data.nodes || [];
            state.edges = data.edges || [];
            state.idSeq = data.idSeq || (state.nodes.length + 1);
            state.selectedId = null;
            render();
            renderInspector();
            log("Opened " + file.name, "sys");
          }
        } catch (err) {
          log("Open failed: " + err.message, "err");
        }
      };
      reader.readAsText(file);
    }

    function importFprg(xmlText) {
      const doc = new DOMParser().parseFromString(xmlText, "application/xml");
      const fn = doc.querySelector("function[name='Main'], function");
      if (!fn) throw new Error("No Main function in .fprg");
      const body = [...fn.querySelector("body").children];
      state.nodes = [];
      state.edges = [];
      state.idSeq = 1;
      const start = makeNode("start", 260, 24);
      state.nodes.push(start);
      let y = 100;
      let prev = start;
      const link = (from, to, branch = "next") => state.edges.push({ from: from.id, to: to.id, branch });

      function addFromEl(el) {
        const tag = el.tagName.toLowerCase();
        let node = null;
        if (tag === "declare") {
          node = makeNode("declare", 250, y, {
            name: el.getAttribute("name") || "x",
            typeName: el.getAttribute("type") || "Integer",
            isArray: (el.getAttribute("array") || "False").toLowerCase() === "true",
            size: el.getAttribute("size") || "",
          });
        } else if (tag === "input") {
          node = makeNode("input", 250, y, { variable: el.getAttribute("variable") || "x" });
        } else if (tag === "output") {
          node = makeNode("output", 250, y, { expression: el.getAttribute("expression") || '""' });
        } else if (tag === "assign") {
          node = makeNode("assign", 250, y, {
            variable: el.getAttribute("variable") || "x",
            expression: el.getAttribute("expression") || "0",
          });
        } else if (tag === "if") {
          node = makeNode("if", 245, y, {
            condition: el.getAttribute("expression") || el.getAttribute("condition") || "true",
          });
        } else if (tag === "while") {
          node = makeNode("while", 245, y, {
            condition: el.getAttribute("expression") || el.getAttribute("condition") || "true",
          });
        } else if (tag === "for") {
          node = makeNode("for", 240, y, {
            variable: el.getAttribute("variable") || "i",
            start: el.getAttribute("start") || "1",
            end: el.getAttribute("end") || "10",
            step: el.getAttribute("step") || "1",
          });
        }
        if (node) {
          state.nodes.push(node);
          link(prev, node);
          prev = node;
          y += 90;
        }
      }

      body.forEach(addFromEl);
      const end = makeNode("end", 260, y);
      state.nodes.push(end);
      link(prev, end);
      render();
      renderInspector();
      log("Imported .fprg (linear Main body).", "sys");
    }

    // palette
    const palette = document.getElementById("palette");
    SHAPE_DEFS.forEach((def) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = \`<span class="swatch \${def.type}"></span><span>\${def.label}</span>\`;
      btn.addEventListener("click", () => addNode(def.type));
      palette.appendChild(btn);
    });

    btnRun.addEventListener("click", () => runProgram(false));
    btnStep.addEventListener("click", () => {
      if (state.running && state.stepResolve) state.stepResolve();
      else runProgram(true);
    });
    btnStop.addEventListener("click", stopProgram);
    document.getElementById("btn-new").addEventListener("click", newProgram);
    document.getElementById("btn-example").addEventListener("click", loadExample);
    document.getElementById("btn-save").addEventListener("click", saveProgram);
    document.getElementById("btn-delete").addEventListener("click", deleteSelected);
    document.getElementById("btn-clear-console").addEventListener("click", () => { consoleEl.textContent = ""; });
    document.getElementById("file-open").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) openProgram(f);
      e.target.value = "";
    });
    btnSubmit.addEventListener("click", submitInput);
    stdin.addEventListener("keydown", (e) => { if (e.key === "Enter") submitInput(); });
    window.addEventListener("keydown", (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && !/input|textarea|select/i.test(e.target.tagName)) {
        deleteSelected();
      }
    });

    loadExample();
    log("Flowgorithm web ready. Run the even/odd example or build your own.", "sys");
  })();
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    res.end(HTML);
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, app: "flowgorithm" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Flowgorithm running at http://localhost:${PORT}`);
});
