/**
 * NalaNiaga — CRM Freelancer & Creative Agency
 * Client Management, Kanban Pipeline, Invoice Generator & WhatsApp Billing.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'nalaniaga_crm_v1';

  const STAGES = {
    LEAD: { id: 'LEAD', title: 'Prospek Baru', dotClass: 'dot-lead' },
    DISCOVERY: { id: 'DISCOVERY', title: 'Briefing & Diskusi', dotClass: 'dot-disc' },
    PROPOSAL: { id: 'PROPOSAL', title: 'Proposal Terkirim', dotClass: 'dot-prop' },
    NEGOTIATION: { id: 'NEGOTIATION', title: 'Negosiasi Harga', dotClass: 'dot-nego' },
    WON: { id: 'WON', title: 'Deal Aktif (Won)', dotClass: 'dot-won' },
    COMPLETED: { id: 'COMPLETED', title: 'Selesai & Lunas', dotClass: 'dot-done' }
  };

  const STAGE_ORDER = ['LEAD', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON', 'COMPLETED'];

  // --- SEED DATA ---
  const DEFAULT_DATA = {
    clients: [
      { id: 1, company: 'PT. Sumber Sukses Berdikari', pic: 'Bpk. Dimas Ardiansyah', wa: '081234567890', email: 'dimas@sumbersukses.co.id', city: 'Yogyakarta', tier: 'VIP' },
      { id: 2, company: 'Kopi Kenari Nusantara', pic: 'Ibu Sarah Anindita', wa: '085712349988', email: 'sarah@kopikenari.id', city: 'Jakarta Selatan', tier: 'Aktif' },
      { id: 3, company: 'Klinik Estetika Glowria', pic: 'dr. Nadya Paramita', wa: '081987654321', email: 'info@glowria.com', city: 'Surabaya', tier: 'Aktif' },
      { id: 4, company: 'CV. Bintang Logistik Express', pic: 'Bpk. Hendra Wijaya', wa: '082133445566', email: 'hendra@bintangexpress.com', city: 'Semarang', tier: 'Prospek' },
      { id: 5, company: 'Urban Outfitters Store', pic: 'Sdri. Jessica Tan', wa: '081122334455', email: 'jessica@urbanoutfit.id', city: 'Bandung', tier: 'Prospek' }
    ],
    deals: [
      {
        id: 101,
        title: 'Revamp Website E-Commerce & Payment Gateway',
        clientId: 2,
        clientName: 'Kopi Kenari Nusantara',
        category: 'Web Development',
        value: 18500000,
        stage: 'WON',
        priority: 'High',
        deadline: '2026-12-15',
        notes: 'Integrasi Midtrans, katalog biji kopi specialty, dan mobile-first design.'
      },
      {
        id: 102,
        title: 'Desain Brand Identity & Guideline Kemasan',
        clientId: 1,
        clientName: 'PT. Sumber Sukses Berdikari',
        category: 'Branding & Visual',
        value: 9500000,
        stage: 'COMPLETED',
        priority: 'Medium',
        deadline: '2026-11-20',
        notes: 'Logo, color palette, packaging box, dan kartu garansi premium.'
      },
      {
        id: 103,
        title: 'UI/UX Redesign Aplikasi Mobile Pasien',
        clientId: 3,
        clientName: 'Klinik Estetika Glowria',
        category: 'UI/UX Design',
        value: 14000000,
        stage: 'NEGOTIATION',
        priority: 'High',
        deadline: '2026-12-05',
        notes: 'Klien meminta diskon 10% atau penambahan 3 screen konsultasi dokter online.'
      },
      {
        id: 104,
        title: 'Company Profile & Sistem Tracking Paket',
        clientId: 4,
        clientName: 'CV. Bintang Logistik Express',
        category: 'Web Development',
        value: 22000000,
        stage: 'PROPOSAL',
        priority: 'Medium',
        deadline: '2026-12-28',
        notes: 'Proposal dikirim via email tanggal 18 Nov, menunggu approval direktur.'
      },
      {
        id: 105,
        title: 'Campaign Social Media & Meta Ads 3 Bulan',
        clientId: 5,
        clientName: 'Urban Outfitters Store',
        category: 'Social Media & Ads',
        value: 8500000,
        stage: 'DISCOVERY',
        priority: 'Low',
        deadline: '2027-01-10',
        notes: 'Fase eksplorasi moodboard dan estimasi target jangkauan audience Jabodetabek.'
      },
      {
        id: 106,
        title: 'SEO Audit & Copywriting Landing Page',
        clientId: 1,
        clientName: 'PT. Sumber Sukses Berdikari',
        category: 'SEO & Copywriting',
        value: 6000000,
        stage: 'LEAD',
        priority: 'Low',
        deadline: '2027-01-20',
        notes: 'Inquiry baru via form kontak website.'
      }
    ],
    invoices: [
      {
        id: 201,
        number: 'INV/2026/XI/001',
        clientId: 1,
        clientName: 'PT. Sumber Sukses Berdikari',
        dealTitle: 'Desain Brand Identity & Guideline Kemasan',
        date: '2026-11-15',
        dueDate: '2026-11-29',
        status: 'Lunas',
        taxEnabled: true,
        bank: 'BCA 8020-4567-89 (A.n NalaNiaga Kreatif)',
        items: [
          { desc: 'Desain Logo Utama, Filosofi & Brand Guidelines', qty: 1, price: 5500000 },
          { desc: 'Desain Kemasan Packaging Box & Label Seal', qty: 1, price: 4000000 }
        ]
      },
      {
        id: 202,
        number: 'INV/2026/XI/002',
        clientId: 2,
        clientName: 'Kopi Kenari Nusantara',
        dealTitle: 'Revamp Website E-Commerce & Payment Gateway',
        date: '2026-11-20',
        dueDate: '2026-12-04',
        status: 'Menunggu DP 50%',
        taxEnabled: false,
        bank: 'BCA 8020-4567-89 (A.n NalaNiaga Kreatif)',
        items: [
          { desc: 'DP 50% Pengembangan Website Next.js E-Commerce', qty: 1, price: 9250000 }
        ]
      }
    ],
    followups: [
      {
        id: 301,
        dealId: 103,
        clientName: 'Klinik Estetika Glowria (dr. Nadya)',
        date: '2026-11-23',
        type: 'WhatsApp',
        note: 'Follow-up keputusan revisi scope dan kesepakatan final harga UI/UX app.'
      },
      {
        id: 302,
        dealId: 104,
        clientName: 'CV. Bintang Logistik (Bpk. Hendra)',
        date: '2026-11-24',
        type: 'Zoom Meeting',
        note: 'Presentasi demo wireframe sistem live tracking paket via Google Meet.'
      },
      {
        id: 303,
        dealId: 202,
        clientName: 'Kopi Kenari Nusantara (Ibu Sarah)',
        date: '2026-11-25',
        type: 'Penagihan DP / Invoice',
        note: 'Konfirmasi bukti transfer DP 50% invoice INV/2026/XI/002 untuk kickoff proyek.'
      }
    ],
    activityLogs: [
      { time: 'Hari ini, 09:30', text: 'Invoice INV/2026/XI/002 diterbitkan untuk Kopi Kenari Nusantara.' },
      { time: 'Kemarin, 14:15', text: 'Deal "Desain Brand Identity" dipindahkan ke tahap Selesai & Lunas.' },
      { time: '20 Nov, 11:00', text: 'Klien baru "Urban Outfitters Store" berhasil ditambahkan.' }
    ]
  };

  // --- STATE CONTAINER ---
  let appState = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
      const parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULT_DATA, parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Save state failed:', e);
    }
  }

  function formatRupiah(num) {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  }

  // --- RENDER 1: KANBAN PIPELINE ---
  function renderKanban() {
    const board = document.getElementById('kanbanBoard');
    if (!board) return;

    let totalPotensi = 0;
    let activeCount = 0;
    let wonValue = 0;

    appState.deals.forEach(d => {
      if (d.stage !== 'COMPLETED') {
        totalPotensi += Number(d.value);
      }
      if (d.stage === 'WON') {
        activeCount++;
      }
      if (d.stage === 'COMPLETED') {
        wonValue += Number(d.value);
      }
    });

    const elTotalPotensi = document.getElementById('pipeTotalPotensi');
    const elActiveCount = document.getElementById('pipeActiveCount');
    const elWonValue = document.getElementById('pipeWonValue');

    if (elTotalPotensi) elTotalPotensi.textContent = formatRupiah(totalPotensi);
    if (elActiveCount) elActiveCount.textContent = `${activeCount} Proyek`;
    if (elWonValue) elWonValue.textContent = formatRupiah(wonValue);

    let html = '';

    STAGE_ORDER.forEach(stageKey => {
      const stageConfig = STAGES[stageKey];
      const stageDeals = appState.deals.filter(d => d.stage === stageKey);
      const stageTotal = stageDeals.reduce((sum, d) => sum + Number(d.value), 0);

      html += `
        <div class="kanban-column" data-stage="${stageKey}">
          <div class="column-header">
            <div class="col-title-wrap">
              <span class="col-dot ${stageConfig.dotClass}"></span>
              <h3 class="col-title">${stageConfig.title}</h3>
            </div>
            <span class="col-count-badge">${stageDeals.length}</span>
          </div>

          <div class="col-total-value">${formatRupiah(stageTotal)}</div>

          <div class="column-cards-list">
            ${stageDeals.map(d => renderDealCard(d)).join('')}
            ${stageDeals.length === 0 ? '<div style="text-align:center; padding:1.5rem 0.5rem; color:#94a3b8; font-size:0.8rem;">Tidak ada deal di tahap ini</div>' : ''}
          </div>
        </div>
      `;
    });

    board.innerHTML = html;
    initCardActions();
  }

  function renderDealCard(d) {
    let prioClass = 'prio-medium';
    if (d.priority === 'High') prioClass = 'prio-high';
    else if (d.priority === 'Low') prioClass = 'prio-low';

    const currentStageIdx = STAGE_ORDER.indexOf(d.stage);
    const prevStage = currentStageIdx > 0 ? STAGE_ORDER[currentStageIdx - 1] : null;
    const nextStage = currentStageIdx < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentStageIdx + 1] : null;

    return `
      <div class="deal-card" data-deal-id="${d.id}">
        <div class="deal-card-top">
          <span class="deal-category-tag">${d.category}</span>
          <span class="deal-priority-pill ${prioClass}">${d.priority}</span>
        </div>

        <h4 class="deal-title">${d.title}</h4>
        <div class="deal-client-name">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>${d.clientName}</span>
        </div>

        <div class="deal-value-row">
          <strong class="deal-amount">${formatRupiah(d.value)}</strong>
          <span class="deal-deadline">${d.deadline ? 'Due: ' + d.deadline : ''}</span>
        </div>

        <div class="deal-actions-row">
          <div style="display:flex; gap:0.25rem;">
            ${prevStage ? `<button type="button" class="btn-stage-move" data-action="prev" data-target="${prevStage}" title="Kembali ke ${STAGES[prevStage].title}">&larr;</button>` : ''}
            ${nextStage ? `<button type="button" class="btn-stage-move" data-action="next" data-target="${nextStage}" title="Lanjut ke ${STAGES[nextStage].title}">Lanjut &rarr;</button>` : '<span style="font-size:0.75rem; color:#10b981; font-weight:700;">✓ Selesai</span>'}
          </div>

          <div style="display:flex; gap:0.2rem;">
            <button type="button" class="deal-icon-btn btn-edit-deal" title="Edit Deal">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button type="button" class="deal-icon-btn btn-del-deal" title="Hapus Deal">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function initCardActions() {
    document.querySelectorAll('.deal-card').forEach(card => {
      const dealId = Number(card.getAttribute('data-deal-id'));
      const deal = appState.deals.find(d => d.id === dealId);
      if (!deal) return;

      // Stage move buttons
      card.querySelectorAll('.btn-stage-move').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetStage = btn.getAttribute('data-target');
          if (targetStage && STAGES[targetStage]) {
            deal.stage = targetStage;
            logActivity(`Deal "${deal.title}" dipindahkan ke tahap ${STAGES[targetStage].title}.`);
            saveState();
            renderAll();
          }
        });
      });

      // Edit Deal
      const editBtn = card.querySelector('.btn-edit-deal');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openDealModal(deal);
        });
      }

      // Delete Deal
      const delBtn = card.querySelector('.btn-del-deal');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Hapus deal "${deal.title}"?`)) {
            appState.deals = appState.deals.filter(d => d.id !== dealId);
            logActivity(`Deal "${deal.title}" dihapus.`);
            saveState();
            renderAll();
          }
        });
      }
    });
  }

  // --- RENDER 2: DATABASE KLIEN ---
  let clientSearchQuery = '';
  let clientTierFilter = 'ALL';

  function renderClients() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    let items = appState.clients;

    if (clientTierFilter !== 'ALL') {
      items = items.filter(c => c.tier === clientTierFilter);
    }

    if (clientSearchQuery) {
      const q = clientSearchQuery.toLowerCase();
      items = items.filter(c => c.company.toLowerCase().includes(q) || c.pic.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
    }

    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:#64748b;">Tidak ada data klien yang cocok.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(c => {
      // Calculate total deals and LTV
      const clientDeals = appState.deals.filter(d => d.clientId === c.id);
      const totalDeals = clientDeals.length;
      const ltv = clientDeals.reduce((sum, d) => sum + Number(d.value), 0);

      let tierBadge = 'tier-aktif';
      if (c.tier === 'VIP') tierBadge = 'tier-vip';
      else if (c.tier === 'Prospek') tierBadge = 'tier-prospek';

      // WhatsApp direct message link
      const waNumberClean = c.wa.replace(/[^0-9]/g, '').replace(/^0/, '62');
      const waText = encodeURIComponent(`Halo ${c.pic} (${c.company}), salam dari NalaNiaga Studio. Kami ingin menanyakan kabar proyek Anda...`);

      return `
        <tr>
          <td>
            <strong>${c.company}</strong>
            <div style="font-size:0.75rem; color:#64748b;">${c.city}</div>
          </td>
          <td>${c.pic}</td>
          <td>
            <div>${c.wa}</div>
            <div style="font-size:0.75rem; color:#64748b;">${c.email}</div>
          </td>
          <td><span class="badge-tier ${tierBadge}">${c.tier}</span></td>
          <td><strong>${totalDeals} Proyek</strong></td>
          <td><strong style="font-family:var(--font-mono); color:var(--primary);">${formatRupiah(ltv)}</strong></td>
          <td>
            <div class="table-action-btns">
              <a href="https://wa.me/${waNumberClean}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn-table-wa">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2"/></svg>
                <span>Chat WA</span>
              </a>
              <button type="button" class="btn-secondary btn-del-client" data-client-id="${c.id}" style="padding:0.35rem 0.55rem; font-size:0.75rem;" title="Hapus Klien">&times;</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach delete handlers
    tbody.querySelectorAll('.btn-del-client').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-client-id'));
        const client = appState.clients.find(c => c.id === id);
        if (confirm(`Hapus kontak klien "${client?.company}"?`)) {
          appState.clients = appState.clients.filter(c => c.id !== id);
          logActivity(`Klien "${client?.company}" dihapus.`);
          saveState();
          renderAll();
        }
      });
    });
  }

  // --- RENDER 3: INVOICE GENERATOR ---
  function renderInvoices() {
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;

    if (appState.invoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:#64748b;">Belum ada invoice yang diterbitkan.</td></tr>';
      return;
    }

    tbody.innerHTML = appState.invoices.map(inv => {
      const subtotal = (inv.items || []).reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);
      const tax = inv.taxEnabled ? Math.round(subtotal * 0.11) : 0;
      const grandTotal = subtotal + tax;

      let statusBadge = '<span class="badge-tier tier-prospek">Menunggu Bayar</span>';
      if (inv.status === 'Lunas') {
        statusBadge = '<span class="badge-tier tier-aktif">Lunas</span>';
      } else if (inv.status === 'Menunggu DP 50%') {
        statusBadge = '<span class="badge-tier tier-vip">DP 50%</span>';
      }

      return `
        <tr>
          <td><strong style="font-family:var(--font-mono);">${inv.number}</strong></td>
          <td>
            <strong>${inv.clientName}</strong>
            <div style="font-size:0.75rem; color:#64748b;">${inv.dealTitle || '-'}</div>
          </td>
          <td>${inv.date}</td>
          <td>${inv.dueDate}</td>
          <td><strong style="font-family:var(--font-mono); color:var(--primary);">${formatRupiah(grandTotal)}</strong></td>
          <td>${statusBadge}</td>
          <td>
            <div class="table-action-btns">
              <button type="button" class="btn-secondary btn-view-invoice" data-inv-id="${inv.id}" style="padding:0.35rem 0.75rem; font-size:0.75rem;">Lihat / Cetak</button>
              <button type="button" class="btn-secondary btn-status-invoice" data-inv-id="${inv.id}" style="padding:0.35rem 0.55rem; font-size:0.75rem;" title="Ganti Status">${inv.status === 'Lunas' ? 'Tandai Belum Lunas' : 'Tandai Lunas'}</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach actions
    tbody.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-inv-id'));
        openPrintModal(id);
      });
    });

    tbody.querySelectorAll('.btn-status-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-inv-id'));
        const inv = appState.invoices.find(i => i.id === id);
        if (inv) {
          inv.status = inv.status === 'Lunas' ? 'Menunggu Pembayaran' : 'Lunas';
          logActivity(`Status invoice ${inv.number} diubah menjadi "${inv.status}".`);
          saveState();
          renderInvoices();
          renderAnalytics();
        }
      });
    });
  }

  // --- RENDER 4: JADWAL FOLLOW-UP ---
  function renderFollowups() {
    const grid = document.getElementById('followupGrid');
    if (!grid) return;

    if (appState.followups.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#64748b;">Tidak ada jadwal follow-up yang aktif.</div>';
      return;
    }

    grid.innerHTML = appState.followups.map(fu => `
      <div class="followup-card">
        <div>
          <div class="fu-top">
            <span class="fu-type-tag">${fu.type}</span>
            <span class="fu-date-badge">${fu.date}</span>
          </div>
          <h4 class="fu-client">${fu.clientName}</h4>
          <p class="fu-note">${fu.note}</p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.75rem; border-top:1px solid #f1f5f9;">
          <button type="button" class="btn-sm-secondary btn-done-fu" data-fu-id="${fu.id}">Selesai Follow-up</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-done-fu').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-fu-id'));
        appState.followups = appState.followups.filter(f => f.id !== id);
        logActivity('Follow-up telah ditandai selesai.');
        saveState();
        renderFollowups();
      });
    });
  }

  // --- RENDER 5: STATISTIK & ANALYTICS ---
  function renderAnalytics() {
    let wonRevenue = 0;
    let activePipeline = 0;
    let wonDealsCount = 0;

    appState.deals.forEach(d => {
      if (d.stage === 'COMPLETED') {
        wonRevenue += Number(d.value);
        wonDealsCount++;
      } else if (d.stage !== 'LEAD') {
        activePipeline += Number(d.value);
      }
    });

    const totalDeals = appState.deals.length;
    const winRate = totalDeals > 0 ? Math.round((wonDealsCount / totalDeals) * 100) : 0;

    const elWonRevenue = document.getElementById('metricWonRevenue');
    const elActivePipeline = document.getElementById('metricActivePipeline');
    const elWinRate = document.getElementById('metricWinRate');
    const elWinRatio = document.getElementById('metricWinRatio');
    const elTotalClients = document.getElementById('metricTotalClients');

    if (elWonRevenue) elWonRevenue.textContent = formatRupiah(wonRevenue);
    if (elActivePipeline) elActivePipeline.textContent = formatRupiah(activePipeline);
    if (elWinRate) elWinRate.textContent = `${winRate}%`;
    if (elWinRatio) elWinRatio.textContent = `${wonDealsCount} dari ${totalDeals} deal selesai`;
    if (elTotalClients) elTotalClients.textContent = appState.clients.length;

    // Service category breakdown
    const categoryTotals = {};
    let totalAllCategories = 0;

    appState.deals.forEach(d => {
      const cat = d.category || 'Lainnya';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(d.value);
      totalAllCategories += Number(d.value);
    });

    const distList = document.getElementById('serviceDistList');
    if (distList) {
      distList.innerHTML = Object.keys(categoryTotals).map(cat => {
        const val = categoryTotals[cat];
        const pct = totalAllCategories > 0 ? Math.round((val / totalAllCategories) * 100) : 0;
        return `
          <div class="service-dist-item">
            <div class="s-info-row">
              <span>${cat}</span>
              <strong>${formatRupiah(val)} (${pct}%)</strong>
            </div>
            <div class="s-bar-bg">
              <div class="s-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Activity Log
    const actList = document.getElementById('activityLogList');
    if (actList) {
      actList.innerHTML = appState.activityLogs.slice(0, 6).map(act => `
        <div class="activity-item">
          <span class="act-bullet"></span>
          <div>
            <div>${act.text}</div>
            <div style="font-size:0.75rem; color:#64748b;">${act.time}</div>
          </div>
        </div>
      `).join('');
    }
  }

  function logActivity(text) {
    const now = new Date();
    const timeStr = 'Hari ini, ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    appState.activityLogs.unshift({ time: timeStr, text });
  }

  // --- MODALS & FORMS ---
  function initModals() {
    // 1. Deal Modal
    const dealModal = document.getElementById('dealModal');
    const formDeal = document.getElementById('formDeal');
    const btnQuickAddDeal = document.getElementById('btnQuickAddDeal');
    const btnCloseDealModal = document.getElementById('btnCloseDealModal');
    const btnCancelDealModal = document.getElementById('btnCancelDealModal');

    const closeDealModal = () => { if (dealModal) dealModal.hidden = true; };

    if (btnQuickAddDeal) {
      btnQuickAddDeal.addEventListener('click', () => openDealModal(null));
    }
    if (btnCloseDealModal) btnCloseDealModal.addEventListener('click', closeDealModal);
    if (btnCancelDealModal) btnCancelDealModal.addEventListener('click', closeDealModal);

    if (formDeal) {
      formDeal.addEventListener('submit', (e) => {
        e.preventDefault();
        const idInput = document.getElementById('dealIdInput')?.value;
        const title = document.getElementById('dealTitleInput')?.value.trim();
        const clientId = Number(document.getElementById('dealClientSelect')?.value);
        const client = appState.clients.find(c => c.id === clientId);
        const category = document.getElementById('dealServiceCategory')?.value;
        const value = Number(document.getElementById('dealValueInput')?.value);
        const stage = document.getElementById('dealStageSelect')?.value;
        const priority = document.getElementById('dealPrioritySelect')?.value;
        const deadline = document.getElementById('dealDeadlineInput')?.value;
        const notes = document.getElementById('dealNotesInput')?.value.trim();

        if (!title || !client || !value) return;

        if (idInput) {
          // Edit
          const existing = appState.deals.find(d => d.id === Number(idInput));
          if (existing) {
            existing.title = title;
            existing.clientId = clientId;
            existing.clientName = client.company;
            existing.category = category;
            existing.value = value;
            existing.stage = stage;
            existing.priority = priority;
            existing.deadline = deadline;
            existing.notes = notes;
            logActivity(`Deal "${title}" diperbarui.`);
          }
        } else {
          // Add new
          const newDeal = {
            id: Date.now(),
            title,
            clientId,
            clientName: client.company,
            category,
            value,
            stage,
            priority,
            deadline,
            notes
          };
          appState.deals.push(newDeal);
          logActivity(`Deal baru "${title}" (${formatRupiah(value)}) ditambahkan.`);
        }

        saveState();
        renderAll();
        closeDealModal();
      });
    }

    // 2. Client Modal
    const clientModal = document.getElementById('clientModal');
    const formClient = document.getElementById('formClient');
    const btnOpenAddClient = document.getElementById('btnOpenAddClientModal');
    const btnCloseClientModal = document.getElementById('btnCloseClientModal');
    const btnCancelClientModal = document.getElementById('btnCancelClientModal');

    const closeClientModal = () => { if (clientModal) clientModal.hidden = true; };

    if (btnOpenAddClient) {
      btnOpenAddClient.addEventListener('click', () => {
        formClient.reset();
        if (clientModal) clientModal.hidden = false;
      });
    }
    if (btnCloseClientModal) btnCloseClientModal.addEventListener('click', closeClientModal);
    if (btnCancelClientModal) btnCancelClientModal.addEventListener('click', closeClientModal);

    if (formClient) {
      formClient.addEventListener('submit', (e) => {
        e.preventDefault();
        const company = document.getElementById('clientCompanyInput')?.value.trim();
        const pic = document.getElementById('clientPersonInput')?.value.trim();
        const tier = document.getElementById('clientTierSelect')?.value;
        const wa = document.getElementById('clientWaInput')?.value.trim();
        const email = document.getElementById('clientEmailInput')?.value.trim();
        const city = document.getElementById('clientCityInput')?.value.trim() || 'Indonesia';

        if (!company || !pic || !wa) return;

        const newClient = {
          id: Date.now(),
          company,
          pic,
          tier,
          wa,
          email,
          city
        };

        appState.clients.push(newClient);
        logActivity(`Klien baru "${company}" ditambahkan.`);
        saveState();
        renderAll();
        closeClientModal();
      });
    }

    // 3. Invoice Modal
    const invModal = document.getElementById('invoiceModal');
    const formInvoice = document.getElementById('formInvoice');
    const btnCreateNewInvoice = document.getElementById('btnCreateNewInvoice');
    const btnCloseInvoiceModal = document.getElementById('btnCloseInvoiceModal');
    const btnCancelInvoiceModal = document.getElementById('btnCancelInvoiceModal');
    const btnAddInvoiceItem = document.getElementById('btnAddInvoiceItem');

    const closeInvoiceModal = () => { if (invModal) invModal.hidden = true; };

    if (btnCreateNewInvoice) {
      btnCreateNewInvoice.addEventListener('click', () => openNewInvoiceModal());
    }
    if (btnCloseInvoiceModal) btnCloseInvoiceModal.addEventListener('click', closeInvoiceModal);
    if (btnCancelInvoiceModal) btnCancelInvoiceModal.addEventListener('click', closeInvoiceModal);

    if (btnAddInvoiceItem) {
      btnAddInvoiceItem.addEventListener('click', () => addInvoiceItemRow('', 1, 0));
    }

    if (formInvoice) {
      formInvoice.addEventListener('submit', (e) => {
        e.preventDefault();
        const number = document.getElementById('invNumberInput')?.value.trim();
        const clientId = Number(document.getElementById('invClientSelect')?.value);
        const client = appState.clients.find(c => c.id === clientId);
        const date = document.getElementById('invDateInput')?.value;
        const dueDate = document.getElementById('invDueDateInput')?.value;
        const status = document.getElementById('invStatusSelect')?.value;
        const bank = document.getElementById('invBankSelect')?.value;
        const taxEnabled = document.getElementById('invTaxCheck')?.checked || false;

        const rows = document.querySelectorAll('.inv-row-item');
        const items = [];
        rows.forEach(r => {
          const desc = r.querySelector('.item-desc')?.value.trim();
          const qty = Number(r.querySelector('.item-qty')?.value) || 1;
          const price = Number(r.querySelector('.item-price')?.value) || 0;
          if (desc && price > 0) {
            items.push({ desc, qty, price });
          }
        });

        if (items.length === 0) {
          alert('Tambahkan minimal 1 baris item jasa invoice dengan tarif.');
          return;
        }

        const newInvoice = {
          id: Date.now(),
          number,
          clientId,
          clientName: client ? client.company : 'Klien Umum',
          dealTitle: items[0].desc,
          date,
          dueDate,
          status,
          taxEnabled,
          bank,
          items
        };

        appState.invoices.unshift(newInvoice);
        logActivity(`Invoice ${number} diterbitkan untuk ${newInvoice.clientName}.`);
        saveState();
        renderAll();
        closeInvoiceModal();
      });
    }

    // 4. Follow-up Modal
    const fuModal = document.getElementById('followupModal');
    const formFollowup = document.getElementById('formFollowup');
    const btnOpenAddFollowup = document.getElementById('btnOpenAddFollowup');
    const btnCloseFollowupModal = document.getElementById('btnCloseFollowupModal');
    const btnCancelFollowupModal = document.getElementById('btnCancelFollowupModal');

    const closeFuModal = () => { if (fuModal) fuModal.hidden = true; };

    if (btnOpenAddFollowup) {
      btnOpenAddFollowup.addEventListener('click', () => {
        populateFollowupDealsSelect();
        const dateInput = document.getElementById('fuDateInput');
        if (dateInput) {
          dateInput.value = new Date().toISOString().slice(0, 10);
        }
        if (fuModal) fuModal.hidden = false;
      });
    }
    if (btnCloseFollowupModal) btnCloseFollowupModal.addEventListener('click', closeFuModal);
    if (btnCancelFollowupModal) btnCancelFollowupModal.addEventListener('click', closeFuModal);

    if (formFollowup) {
      formFollowup.addEventListener('submit', (e) => {
        e.preventDefault();
        const dealId = Number(document.getElementById('fuDealSelect')?.value);
        const deal = appState.deals.find(d => d.id === dealId);
        const date = document.getElementById('fuDateInput')?.value;
        const type = document.getElementById('fuTypeSelect')?.value;
        const note = document.getElementById('fuNoteInput')?.value.trim();

        if (!note || !date) return;

        const newFu = {
          id: Date.now(),
          dealId,
          clientName: deal ? `${deal.clientName} (${deal.title})` : 'Klien',
          date,
          type,
          note
        };

        appState.followups.unshift(newFu);
        logActivity(`Jadwal follow-up dicatat: ${newFu.clientName}.`);
        saveState();
        renderFollowups();
        closeFuModal();
      });
    }

    // 5. Print Modal
    const printModal = document.getElementById('printInvoiceModal');
    const btnClosePrintModal = document.getElementById('btnClosePrintModal');
    const btnDonePrintModal = document.getElementById('btnDonePrintModal');
    const btnTriggerPrint = document.getElementById('btnTriggerPrint');

    const closePrintModal = () => { if (printModal) printModal.hidden = true; };

    if (btnClosePrintModal) btnClosePrintModal.addEventListener('click', closePrintModal);
    if (btnDonePrintModal) btnDonePrintModal.addEventListener('click', closePrintModal);
    if (btnTriggerPrint) btnTriggerPrint.addEventListener('click', () => window.print());
  }

  function openDealModal(deal = null) {
    const modal = document.getElementById('dealModal');
    const form = document.getElementById('formDeal');
    const titleModal = document.getElementById('dealModalTitle');
    const clientSelect = document.getElementById('dealClientSelect');

    if (!modal || !form || !clientSelect) return;

    // Populate clients select
    clientSelect.innerHTML = appState.clients.map(c => `<option value="${c.id}">${c.company} (${c.pic})</option>`).join('');

    if (deal) {
      titleModal.textContent = 'Edit Proyek / Deal';
      document.getElementById('dealIdInput').value = deal.id;
      document.getElementById('dealTitleInput').value = deal.title;
      clientSelect.value = deal.clientId;
      document.getElementById('dealServiceCategory').value = deal.category;
      document.getElementById('dealValueInput').value = deal.value;
      document.getElementById('dealStageSelect').value = deal.stage;
      document.getElementById('dealPrioritySelect').value = deal.priority;
      document.getElementById('dealDeadlineInput').value = deal.deadline || '';
      document.getElementById('dealNotesInput').value = deal.notes || '';
    } else {
      titleModal.textContent = 'Tambah Proyek / Deal Baru';
      form.reset();
      document.getElementById('dealIdInput').value = '';
      document.getElementById('dealDeadlineInput').value = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    }

    modal.hidden = false;
  }

  function openNewInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    const form = document.getElementById('formInvoice');
    const clientSelect = document.getElementById('invClientSelect');
    if (!modal || !form || !clientSelect) return;

    form.reset();
    clientSelect.innerHTML = appState.clients.map(c => `<option value="${c.id}">${c.company} (${c.pic})</option>`).join('');

    const today = new Date().toISOString().slice(0, 10);
    const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    document.getElementById('invDateInput').value = today;
    document.getElementById('invDueDateInput').value = due;

    const count = appState.invoices.length + 1;
    document.getElementById('invNumberInput').value = `INV/2026/XI/${String(count).padStart(3, '0')}`;

    // Clear items and add 1 default row
    const container = document.getElementById('invoiceItemsList');
    if (container) container.innerHTML = '';
    addInvoiceItemRow('Jasa Desain UI/UX & Website Development', 1, 7500000);

    modal.hidden = false;
  }

  function addInvoiceItemRow(desc = '', qty = 1, price = 0) {
    const container = document.getElementById('invoiceItemsList');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'inv-row-item';
    row.innerHTML = `
      <input type="text" class="item-desc" placeholder="Deskripsi Jasa / Fitur" value="${desc}" required>
      <input type="number" class="item-qty" placeholder="Qty" value="${qty}" min="1" required style="width:65px;">
      <input type="number" class="item-price" placeholder="Tarif Satuan (Rp)" value="${price}" min="0" required>
      <button type="button" class="btn-sm-secondary btn-del-item" style="color:#e11d48; border-color:#fecdd3;">&times;</button>
    `;

    row.querySelector('.btn-del-item').addEventListener('click', () => {
      row.remove();
      updateInvoiceTotals();
    });

    row.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', updateInvoiceTotals);
    });

    container.appendChild(row);
    updateInvoiceTotals();
  }

  function updateInvoiceTotals() {
    let subtotal = 0;
    document.querySelectorAll('.inv-row-item').forEach(r => {
      const q = Number(r.querySelector('.item-qty')?.value) || 0;
      const p = Number(r.querySelector('.item-price')?.value) || 0;
      subtotal += q * p;
    });

    const taxCheck = document.getElementById('invTaxCheck');
    const tax = taxCheck && taxCheck.checked ? Math.round(subtotal * 0.11) : 0;
    const grand = subtotal + tax;

    const subDisplay = document.getElementById('invSubtotalDisplay');
    const grandDisplay = document.getElementById('invGrandTotalDisplay');

    if (subDisplay) subDisplay.textContent = formatRupiah(subtotal);
    if (grandDisplay) grandDisplay.textContent = formatRupiah(grand);
  }

  const taxCheckEl = document.getElementById('invTaxCheck');
  if (taxCheckEl) {
    taxCheckEl.addEventListener('change', updateInvoiceTotals);
  }

  function populateFollowupDealsSelect() {
    const sel = document.getElementById('fuDealSelect');
    if (!sel) return;
    sel.innerHTML = appState.deals.map(d => `<option value="${d.id}">${d.clientName} — ${d.title}</option>`).join('');
  }

  // --- OPEN PRINT MODAL ---
  function openPrintModal(invId) {
    const inv = appState.invoices.find(i => i.id === invId);
    if (!inv) return;

    const modal = document.getElementById('printInvoiceModal');
    const client = appState.clients.find(c => c.id === inv.clientId) || { company: inv.clientName, pic: 'Finance', wa: '-', email: '-', city: '-' };

    document.getElementById('prnInvNumber').textContent = inv.number;
    document.getElementById('prnInvStatus').textContent = inv.status;
    document.getElementById('prnClientName').textContent = client.company;
    document.getElementById('prnClientPic').textContent = `Up: ${client.pic}`;
    document.getElementById('prnClientContact').textContent = `${client.wa} • ${client.email}`;
    document.getElementById('prnClientCity').textContent = client.city;

    document.getElementById('prnInvDate').textContent = inv.date;
    document.getElementById('prnInvDueDate').textContent = inv.dueDate;
    document.getElementById('prnBankInfo').textContent = inv.bank;

    const tbody = document.getElementById('prnItemsTableBody');
    let subtotal = 0;

    if (tbody) {
      tbody.innerHTML = (inv.items || []).map(item => {
        const itemTotal = Number(item.qty) * Number(item.price);
        subtotal += itemTotal;
        return `
          <tr>
            <td><strong>${item.desc}</strong></td>
            <td class="text-center">${item.qty}</td>
            <td class="text-right">${formatRupiah(item.price)}</td>
            <td class="text-right"><strong>${formatRupiah(itemTotal)}</strong></td>
          </tr>
        `;
      }).join('');
    }

    const tax = inv.taxEnabled ? Math.round(subtotal * 0.11) : 0;
    const grandTotal = subtotal + tax;

    document.getElementById('prnSubtotal').textContent = formatRupiah(subtotal);
    document.getElementById('prnTax').textContent = inv.taxEnabled ? formatRupiah(tax) : 'Rp 0 (Non-PPN)';
    document.getElementById('prnGrandTotal').textContent = formatRupiah(grandTotal);

    // Setup WhatsApp billing template button
    const btnSendWa = document.getElementById('btnSendInvoiceWa');
    if (btnSendWa) {
      const waNum = client.wa.replace(/[^0-9]/g, '').replace(/^0/, '62');
      const waMsg = encodeURIComponent(`Yth. ${client.pic} (${client.company}),\n\nBerikut kami sampaikan rincian tagihan resmi dari NalaNiaga Studio:\n\n📄 *No. Invoice:* ${inv.number}\n📌 *Proyek:* ${inv.dealTitle || 'Layanan Jasa Digital'}\n💰 *Total Tagihan:* ${formatRupiah(grandTotal)}\n⏰ *Jatuh Tempo:* ${inv.dueDate}\n\n*Rekening Pembayaran:*\n${inv.bank}\n\nMohon konfirmasi jika pembayaran telah dilakukan. Terima kasih atas kerja sama Anda.`);
      btnSendWa.onclick = () => window.open(`https://wa.me/${waNum}?text=${waMsg}`, '_blank');
    }

    if (modal) modal.hidden = false;
  }

  // --- SEARCH & FILTER CLIENTS ---
  function initClientFilters() {
    const searchInput = document.getElementById('clientSearchInput');
    const filterSelect = document.getElementById('clientStatusFilter');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clientSearchQuery = searchInput.value.trim();
        renderClients();
      });
    }

    if (filterSelect) {
      filterSelect.addEventListener('change', () => {
        clientTierFilter = filterSelect.value;
        renderClients();
      });
    }

    // Export CSV Clients
    const btnExport = document.getElementById('btnExportClientsCsv');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const headers = ['Perusahaan', 'PIC', 'WhatsApp', 'Email', 'Kota', 'Kategori', 'Total Proyek', 'Total LTV'];
        const rows = appState.clients.map(c => {
          const clientDeals = appState.deals.filter(d => d.clientId === c.id);
          const ltv = clientDeals.reduce((sum, d) => sum + Number(d.value), 0);
          return [
            `"${c.company}"`,
            `"${c.pic}"`,
            `"${c.wa}"`,
            `"${c.email}"`,
            `"${c.city}"`,
            `"${c.tier}"`,
            clientDeals.length,
            ltv
          ].join(',');
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `Database_Klien_NalaNiaga_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  // --- TAB NAVIGATION ---
  function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const view = tab.getAttribute('data-view');
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));

        const target = document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1));
        if (target) target.classList.add('active');
      });
    });
  }

  // --- PWA SERVICE WORKER ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('NalaNiaga ServiceWorker registered:', reg.scope);
      }).catch(err => {
        console.warn('NalaNiaga ServiceWorker failed:', err);
      });
    });
  }

  // --- MASTER RENDER DISPATCHER ---
  function renderAll() {
    renderKanban();
    renderClients();
    renderInvoices();
    renderFollowups();
    renderAnalytics();
  }

  // --- BOOTSTRAP ---
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initClientFilters();
    renderAll();
  });

})();
