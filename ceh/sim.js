/* ============================================================
   sim.js — shared interactive-demo harness for the DSA notes.
   Injects its own CSS (like codetabs.js) so every page stays
   consistent. A page mounts a demo with:

     DSASim({
       mount: 'my-sim',            // id of <div class="sim">
       setup: function (stage) {    // called on every Reset
         // build a fresh scenario, optionally populate `stage`
         const frames = [ { caption: '...', ... }, ... ];
         return {
           frames,                  // each frame MUST have .caption
           render: function (frame) { ...update stage... },
           legend: [ {cls:'hl-blue', label:'frontier'}, ... ] // optional
         };
       }
     });

   Frames are precomputed (run the algorithm once, snapshot each
   step); the harness just scrubs Reset / Back / Step / Play.
   ============================================================ */
(function () {
    if (window.DSASim) return;

    /* ---------- inject shared styles once ---------- */
    var css = '' +
    '.sim{border:1px solid var(--border,#dcdcdc);border-radius:8px;padding:1rem;margin:1.5rem 0 2rem;background:#fafafa;}' +
    '.sim-stage{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;align-items:flex-end;margin:0 auto .75rem;max-width:100%;overflow-x:auto;}' +
    '.sim-cell{width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-family:"JetBrains Mono",monospace;font-size:.72rem;color:#333;background:#fff;border:1px solid #e3e3e3;border-radius:3px;position:relative;transition:background .12s linear,height .12s linear;flex:0 0 auto;}' +
    /* palette — matches the site legend (red broken / green correct / orange active / blue hit) */
    '.sim-cell.hl-blue{background:#cfe8ff;}' +
    '.sim-cell.hl-green{background:#d9f2d9;}' +
    '.sim-cell.hl-orange{background:orange;}' +
    '.sim-cell.hl-gold{background:#ffd54a;}' +
    '.sim-cell.hl-red{background:#f7b2b2;}' +
    '.sim-cell.hl-dark{background:#333;border-color:#333;color:#fff;}' +
    '.sim-cell.hl-dim{opacity:.3;}' +
    '.sim-cell.hl-start{background:#2e7d32;border-color:#2e7d32;color:#fff;font-weight:700;}' +
    '.sim-cell.hl-goal{background:#c62828;border-color:#c62828;color:#fff;font-weight:700;}' +
    '.sim-cell.hl-mark{outline:2px solid var(--accent,#2563eb);outline-offset:-2px;}' +
    /* bars (sorting / histograms) */
    '.sim-bar{width:30px;background:#cfe8ff;border:1px solid #9cc6ec;border-radius:3px 3px 0 0;display:flex;align-items:flex-end;justify-content:center;font-family:"JetBrains Mono",monospace;font-size:.68rem;color:#234;transition:height .12s linear,background .12s linear;flex:0 0 auto;}' +
    '.sim-bar.hl-orange{background:orange;border-color:#cc8400;}' +
    '.sim-bar.hl-green{background:#9ad59a;border-color:#5fb05f;}' +
    '.sim-bar.hl-gold{background:#ffd54a;border-color:#e0b000;}' +
    '.sim-bar.hl-red{background:#f7b2b2;border-color:#e07a7a;}' +
    '.sim-bar.hl-dim{opacity:.35;}' +
    /* controls */
    '.sim-controls{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;justify-content:center;}' +
    '.sim-controls button{font-family:"Inter",sans-serif;font-size:.85rem;padding:.35rem .8rem;border:1px solid var(--border,#dcdcdc);border-radius:6px;background:#fff;color:var(--text,#222);cursor:pointer;}' +
    '.sim-controls button:hover{background:#f0f4ff;border-color:var(--accent,#2563eb);}' +
    '.sim-controls button:disabled{opacity:.4;cursor:default;}' +
    '.sim-controls .play{font-weight:600;color:var(--accent,#2563eb);}' +
    '.sim-speed{display:flex;align-items:center;gap:.35rem;font-size:.8rem;color:var(--muted,#666);}' +
    '.sim-caption{text-align:center;font-size:.9rem;color:var(--text,#222);margin:.75rem auto 0;min-height:1.4em;font-family:"JetBrains Mono",monospace;}' +
    '.sim-legend{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;font-size:.78rem;color:var(--muted,#666);margin-top:.6rem;}' +
    '.sim-legend span{display:inline-flex;align-items:center;gap:.3rem;}' +
    '.sim-swatch{width:14px;height:14px;border-radius:3px;border:1px solid #ccc;display:inline-block;}' +
    /* svg graphs / trees */
    '.sim-svg{max-width:100%;height:auto;}' +
    '.sim-svg .edge{stroke:#bbb;stroke-width:2;fill:none;}' +
    '.sim-svg .edge.hl-gold{stroke:#e0b000;stroke-width:4;}' +
    '.sim-svg .edge.hl-green{stroke:#5fb05f;stroke-width:4;}' +
    '.sim-svg .edge.hl-orange{stroke:orange;stroke-width:4;}' +
    '.sim-svg .edge.hl-blue{stroke:#6aa9e0;stroke-width:3;}' +
    '.sim-svg .edge.hl-dim{stroke:#e8e8e8;}' +
    '.sim-svg .node{fill:#fff;stroke:#999;stroke-width:1.5;}' +
    '.sim-svg .node.hl-blue{fill:#cfe8ff;}' +
    '.sim-svg .node.hl-green{fill:#d9f2d9;}' +
    '.sim-svg .node.hl-orange{fill:orange;}' +
    '.sim-svg .node.hl-gold{fill:#ffd54a;}' +
    '.sim-svg .node.hl-red{fill:#f7b2b2;}' +
    '.sim-svg .node.hl-dark{fill:#333;stroke:#333;}' +
    '.sim-svg .node.hl-hidden{opacity:0;}' +
    '.sim-svg .edge.hl-hidden{opacity:0;}' +
    '.sim-svg .nlabel{font-family:"Inter",sans-serif;font-size:13px;font-weight:600;text-anchor:middle;dominant-baseline:central;fill:#222;}' +
    '.sim-svg .node.hl-dark + .nlabel,.sim-svg .nlabel.on-dark{fill:#fff;}' +
    '.sim-svg .elabel{font-family:"JetBrains Mono",monospace;font-size:11px;text-anchor:middle;dominant-baseline:central;fill:#555;}' +
    '@media (max-width:768px){.sim-cell{width:30px;height:30px;font-size:.62rem;}}';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var SWATCH = {
        'hl-blue': '#cfe8ff', 'hl-green': '#d9f2d9', 'hl-orange': 'orange',
        'hl-gold': '#ffd54a', 'hl-red': '#f7b2b2', 'hl-dark': '#333',
        'hl-start': '#2e7d32', 'hl-goal': '#c62828'
    };

    /* ---------- the player ---------- */
    function DSASim(opts) {
        var mount = document.getElementById(opts.mount);
        if (!mount) return;
        mount.classList.add('sim');
        mount.innerHTML =
            '<div class="sim-stage"></div>' +
            '<div class="sim-controls">' +
              '<button data-act="reset">&#8635; Reset</button>' +
              '<button data-act="back">&#8249; Back</button>' +
              '<button data-act="step">Step &#8250;</button>' +
              '<button data-act="play" class="play">&#9654; Play</button>' +
              '<label class="sim-speed">speed ' +
                '<input type="range" data-act="speed" min="40" max="600" value="240" step="20"></label>' +
            '</div>' +
            '<div class="sim-caption">&nbsp;</div>' +
            '<div class="sim-legend"></div>';

        var stage   = mount.querySelector('.sim-stage');
        var caption = mount.querySelector('.sim-caption');
        var legend  = mount.querySelector('.sim-legend');
        var bReset  = mount.querySelector('[data-act=reset]');
        var bBack   = mount.querySelector('[data-act=back]');
        var bStep   = mount.querySelector('[data-act=step]');
        var bPlay   = mount.querySelector('[data-act=play]');
        var speed   = mount.querySelector('[data-act=speed]');

        var frames = [], render = function () {}, idx = 0, timer = null;

        function drawLegend(items) {
            if (!items) { legend.innerHTML = ''; return; }
            legend.innerHTML = items.map(function (it) {
                var c = it.color || SWATCH[it.cls] || '#fff';
                return '<span><i class="sim-swatch" style="background:' + c + '"></i> ' + it.label + '</span>';
            }).join('');
        }

        function show() {
            var fr = frames[idx];
            render(fr);
            caption.innerHTML = (fr && fr.caption) ? fr.caption : '&nbsp;';
            bBack.disabled = idx === 0;
            bStep.disabled = idx === frames.length - 1;
            if (idx === frames.length - 1) stop();
        }
        function go(d) { idx = Math.max(0, Math.min(frames.length - 1, idx + d)); show(); }
        function stop() { if (timer) { clearInterval(timer); timer = null; } bPlay.innerHTML = '&#9654; Play'; }
        function play() {
            if (timer) { stop(); return; }
            if (idx === frames.length - 1) { idx = 0; show(); }
            bPlay.innerHTML = '&#10073;&#10073; Pause';
            timer = setInterval(function () {
                if (idx >= frames.length - 1) { stop(); return; }
                go(1);
            }, +speed.value);
        }
        function reset() {
            stop();
            var r = opts.setup(stage);
            frames = r.frames || [];
            render = r.render || function () {};
            drawLegend(r.legend);
            idx = 0;
            show();
        }

        bReset.addEventListener('click', reset);
        bBack.addEventListener('click', function () { stop(); go(-1); });
        bStep.addEventListener('click', function () { stop(); go(1); });
        bPlay.addEventListener('click', play);
        speed.addEventListener('input', function () { if (timer) { stop(); play(); } });

        reset();
    }

    /* ---------- helper builders for common stages ---------- */

    // a horizontal row of n labelled cells; returns the cell elements
    DSASim.cells = function (stage, values) {
        stage.innerHTML = '';
        stage.style.alignItems = 'center';
        return values.map(function (v) {
            var el = document.createElement('div');
            el.className = 'sim-cell';
            el.textContent = v;
            stage.appendChild(el);
            return el;
        });
    };

    // a 2D grid; returns { cells:[], at(r,c) }
    DSASim.grid = function (stage, R, C, size) {
        size = size || 38;
        stage.style.display = 'grid';
        stage.style.gridTemplateColumns = 'repeat(' + C + ',' + size + 'px)';
        stage.style.gap = '2px';
        stage.style.alignItems = 'stretch';
        stage.style.justifyContent = 'center';
        stage.innerHTML = '';
        var cells = [];
        for (var r = 0; r < R; r++) {
            for (var c = 0; c < C; c++) {
                var el = document.createElement('div');
                el.className = 'sim-cell';
                if (size !== 38) { el.style.width = el.style.height = size + 'px'; }
                stage.appendChild(el);
                cells[r * C + c] = el;
            }
        }
        return { cells: cells, at: function (r, c) { return cells[r * C + c]; } };
    };

    // a row of bars scaled to maxVal; returns the bar elements
    DSASim.bars = function (stage, values, maxVal, maxH) {
        maxH = maxH || 160;
        stage.innerHTML = '';
        stage.style.display = 'flex';
        stage.style.alignItems = 'flex-end';
        return values.map(function (v) {
            var el = document.createElement('div');
            el.className = 'sim-bar';
            el.style.height = Math.max(14, (v / maxVal) * maxH) + 'px';
            el.textContent = v;
            stage.appendChild(el);
            return el;
        });
    };

    // reset a list of elements to a base class, then apply a {index:className} map
    DSASim.paint = function (els, base, marks) {
        els.forEach(function (el) { el.className = base; });
        if (marks) Object.keys(marks).forEach(function (i) {
            if (els[i]) els[i].className = base + ' ' + marks[i];
        });
    };

    // an SVG canvas for graphs/trees. nodes:[{id,x,y,label}] edges:[{a,b,w,directed}]
    // coords are in a 0..100 (x) / 0..H (y) viewBox unless vb overrides. Returns handles
    // to recolor: nodeEl(id), labelEl(id), edgeEl(a,b). Use el.setAttribute('class', ...).
    DSASim.graphSVG = function (stage, nodes, edges, opt) {
        opt = opt || {};
        var W = opt.w || 100, H = opt.h || 60, rad = opt.r || 6;
        stage.innerHTML = '';
        stage.style.display = 'block';
        var SVG = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(SVG, 'svg');
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('class', 'sim-svg');
        svg.setAttribute('width', '100%');
        var pos = {}; nodes.forEach(function (n) { pos[n.id] = n; });
        var nodeEls = {}, labelEls = {}, edgeEls = {};
        function ekey(a, b) { return a + '|' + b; }

        var directed = !!opt.directed;
        if (directed) {
            var defs = document.createElementNS(SVG, 'defs');
            defs.innerHTML = '<marker id="dsa-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#999"/></marker>';
            svg.appendChild(defs);
        }

        // edges first (drawn under nodes), trimmed to the node boundary
        edges.forEach(function (e) {
            var A = pos[e.a], B = pos[e.b];
            var dx = B.x - A.x, dy = B.y - A.y, len = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / len, uy = dy / len;
            var line = document.createElementNS(SVG, 'line');
            line.setAttribute('x1', A.x + ux * rad); line.setAttribute('y1', A.y + uy * rad);
            line.setAttribute('x2', B.x - ux * (rad + (directed || e.directed ? 1.5 : 0))); line.setAttribute('y2', B.y - uy * (rad + (directed || e.directed ? 1.5 : 0)));
            line.setAttribute('class', 'edge');
            if (directed || e.directed) line.setAttribute('marker-end', 'url(#dsa-arrow)');
            svg.appendChild(line); edgeEls[ekey(e.a, e.b)] = line;
            if (e.w !== undefined) {
                var t = document.createElementNS(SVG, 'text');
                t.setAttribute('x', (A.x + B.x) / 2 - uy * 2.5); t.setAttribute('y', (A.y + B.y) / 2 + ux * 2.5);
                t.setAttribute('class', 'elabel'); t.textContent = e.w;
                svg.appendChild(t);
            }
        });
        // nodes
        nodes.forEach(function (n) {
            var c = document.createElementNS(SVG, 'circle');
            c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', rad);
            c.setAttribute('class', 'node');
            svg.appendChild(c); nodeEls[n.id] = c;
            var t = document.createElementNS(SVG, 'text');
            t.setAttribute('x', n.x); t.setAttribute('y', n.y);
            t.setAttribute('class', 'nlabel'); t.textContent = n.label !== undefined ? n.label : n.id;
            svg.appendChild(t); labelEls[n.id] = t;
        });
        stage.appendChild(svg);
        return {
            svg: svg,
            nodeEl: function (id) { return nodeEls[id]; },
            labelEl: function (id) { return labelEls[id]; },
            edgeEl: function (a, b) { return edgeEls[ekey(a, b)] || edgeEls[ekey(b, a)]; },
            setNode: function (id, cls) { if (nodeEls[id]) nodeEls[id].setAttribute('class', 'node' + (cls ? ' ' + cls : '')); },
            setLabel: function (id, txt) { if (labelEls[id]) labelEls[id].textContent = txt; },
            setEdge: function (a, b, cls) { var e = edgeEls[ekey(a, b)] || edgeEls[ekey(b, a)]; if (e) e.setAttribute('class', 'edge' + (cls ? ' ' + cls : '')); }
        };
    };

    window.DSASim = DSASim;
})();
