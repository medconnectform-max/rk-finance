import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { MessageCircle, X, Download, FileText, Loader2 } from 'lucide-react';
import {
  WHATSAPP_NUMBER,
  WHATSAPP_TEMPLATE,
  SUBJECTS,
  getChapters,
  getQuestions,
} from '../config/constants';

// ─── Helpers ───────────────────────────────────────────────────────────
function getOptionScore(options, answer) {
  if (!answer || !options || options.length === 0) return 0;
  const idx = options.indexOf(answer);
  if (idx === -1) return 0;
  if (idx === 0) return 1;
  if (idx === options.length - 1) return 0;
  return 0.5;
}

function getChapterStorage(subjectName, chapterName) {
  const key = `trackpro_${subjectName}_${chapterName.replace(/\s+/g, '')}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getChapterScore(subjectName, chapterName) {
  const parsed = getChapterStorage(subjectName, chapterName);
  if (!parsed) return 0;

  const questions = getQuestions(subjectName, chapterName) || [];
  return questions.reduce(
    (sum, q) => sum + getOptionScore(q.options, parsed[q.id]),
    0
  );
}

function getChapterYesPercentage(subjectName, chapterName) {
  const parsed = getChapterStorage(subjectName, chapterName) || {};
  const questions = getQuestions(subjectName, chapterName) || [];

  if (questions.length === 0) {
    return { yesCount: 0, total: 0, percent: 0 };
  }

  let yesCount = 0;
  questions.forEach((q) => {
    if (parsed[q.id] === 'Yes') yesCount += 1;
  });

  return {
    yesCount,
    total: questions.length,
    percent: Math.round((yesCount / questions.length) * 100),
  };
}

// ─── Constants ─────────────────────────────────────────────────────────
const COLORS = {
  Physics: '#6366f1',
  Chemistry: '#10b981',
  Mathematics: '#f59e0b',
  Biology: '#ef4444',
};

const QUESTION_CHARTS = [
  { id: 'q1', label: 'Lectures Completion', color: '#6366f1' },
  { id: 'q2', label: 'Reading Completion', color: '#10b981' },
  { id: 'q3', label: 'Practice Completion', color: '#f59e0b' },
  { id: 'q4', label: 'Revision Completion', color: '#ef4444' },
];

const SHORT_NAMES = {
  'Corp Issuers': 'Corp Iss.',
  'Portfolio Mgmt': 'Port. Mgmt',
  'Fixed Income': 'Fixed Inc.',
  Derivatives: 'Deriv.',
  'Alt Inv': 'Alt Inv',
};

// ─── SVG Chart Builders ────────────────────────────────────────────────
function buildChartSVG(subjectName, isDark) {
  const chapters = getChapters(subjectName);
  if (!chapters || chapters.length === 0) {
    return '<p style="color:#888;font-size:0.8rem;">No chapters</p>';
  }

  const scores = chapters.map((ch) => getChapterScore(subjectName, ch));
  const maxScores = chapters.map((ch) => (getQuestions(subjectName, ch) || []).length);
  const maxScore = Math.max(...maxScores, 1);

  const color = COLORS[subjectName] || '#6366f1';
  const W = Math.max(360, chapters.length * 40);
  const H = 140;
  const barW = Math.min(28, (W - 40) / chapters.length - 4);
  const gap = (W - barW * chapters.length) / (chapters.length + 1);
  const textCol = isDark ? '#a0aec0' : '#718096';
  const gridCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  let yLabels = '';
  for (let i = 0; i <= maxScore; i++) {
    const y = H - (i / maxScore) * H + 10;
    yLabels += `<text x="18" y="${y + 3}" text-anchor="end" font-size="8" fill="${textCol}">${i}</text>`;
    yLabels += `<line x1="22" y1="${y}" x2="${W + 25}" y2="${y}" stroke="${gridCol}" stroke-width="0.5" stroke-dasharray="3,3"/>`;
  }

  let bars = '';
  scores.forEach((score, idx) => {
    const x = 25 + gap + idx * (barW + gap);
    const barH = maxScore > 0 ? (score / maxScore) * H : 0;
    const y = H - barH + 10;

    bars += `<rect x="${x}" y="10" width="${barW}" height="${H}" rx="4" fill="${isDark ? '#2d3748' : '#e2e8f0'}" opacity="0.5"/>`;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${color}"/>`;

    if (score > 0) {
      bars += `<text x="${x + barW / 2}" y="${y - 4}" text-anchor="middle" font-size="8" font-weight="700" fill="${color}">${score % 1 === 0 ? score : score.toFixed(1)}</text>`;
    }

    bars += `<text x="${x + barW / 2}" y="${H + 22}" text-anchor="middle" font-size="7" fill="${textCol}">Ch${idx + 1}</text>`;
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${W + 40} ${H + 35}">
      ${yLabels}
      ${bars}
      <line x1="22" y1="${H + 10}" x2="${W + 25}" y2="${H + 10}" stroke="${gridCol}" stroke-width="1"/>
      <line x1="22" y1="10" x2="22" y2="${H + 10}" stroke="${gridCol}" stroke-width="1"/>
    </svg>
  `;
}

function buildQuestionChartSVG(qId, qColor, isDark) {
  const yesCounts = SUBJECTS.map((sub) => {
    const chapters = getChapters(sub) || [];
    let count = 0;

    chapters.forEach((ch) => {
      const key = `trackpro_${sub}_${ch.replace(/\s+/g, '')}`;
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed[qId] === 'Yes') count += 1;
        }
      } catch {}
    });

    return count;
  });

  const maxCounts = SUBJECTS.map((sub) => (getChapters(sub) || []).length);
  const globalMax = Math.max(...maxCounts, 1);
  const totalBars = SUBJECTS.length;
  const W = Math.max(460, totalBars * 44);
  const H = 130;
  const barW = 26;
  const gap = (W - 30 - barW * totalBars) / (totalBars + 1);
  const textCol = isDark ? '#a0aec0' : '#718096';
  const gridCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const trackFill = isDark ? '#2d3748' : '#e2e8f0';

  let yLabels = '';
  for (let i = 0; i <= globalMax; i++) {
    const y = H - (i / globalMax) * H + 10;
    yLabels += `<text x="18" y="${y + 3}" text-anchor="end" font-size="8" fill="${textCol}">${i}</text>`;
    yLabels += `<line x1="22" y1="${y}" x2="${W + 5}" y2="${y}" stroke="${gridCol}" stroke-width="0.5" stroke-dasharray="3,3"/>`;
  }

  let bars = '';
  yesCounts.forEach((count, idx) => {
    const x = 25 + gap + idx * (barW + gap);
    const barH = globalMax > 0 ? (count / globalMax) * H : 0;
    const y = H - barH + 10;

    bars += `<rect x="${x}" y="10" width="${barW}" height="${H}" rx="4" fill="${trackFill}" opacity="0.5"/>`;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${qColor}"/>`;

    if (count > 0) {
      const isComplete = count === maxCounts[idx];
      const textColor = isComplete ? '#22c55e' : '#ef4444';

      bars += `
        <text x="${x + barW / 2}" y="${y - 4}" text-anchor="middle" font-size="8" font-weight="700" fill="${textColor}">
          ${count}/${maxCounts[idx]}
        </text>
      `;
    }

    const label = SHORT_NAMES[SUBJECTS[idx]] || SUBJECTS[idx];
    const words = label.split(' ');
    const line1 = words[0];
    const line2 = words.slice(1).join(' ');

    if (words.length > 1) {
      bars += `
        <text x="${x + barW / 2}" y="${H + 18}" text-anchor="middle" font-size="12px" font-weight="900" fill="${textCol}">
          <tspan x="${x + barW / 2}" dy="0">${line1}</tspan>
          <tspan x="${x + barW / 2}" dy="9">${line2}</tspan>
        </text>
      `;
    } else {
      bars += `<text x="${x + barW / 2}" y="${H + 22}" text-anchor="middle" font-size="12px" font-weight="900" fill="${textCol}">${label}</text>`;
    }
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${W + 10} ${H + 35}">
      ${yLabels}
      ${bars}
      <line x1="22" y1="${H + 10}" x2="${W + 5}" y2="${H + 10}" stroke="${gridCol}" stroke-width="1"/>
      <line x1="22" y1="10" x2="22" y2="${H + 10}" stroke="${gridCol}" stroke-width="1"/>
    </svg>
  `;
}

// ─── Subject-wise chapter tables ───────────────────────────────────────
function buildSubjectChapterTables(isDark, txt2, accent, bdr) {
  const tableBg = isDark ? '#1f2937' : '#ffffff';
  const headBg = isDark ? '#2d3748' : '#e2e8f0';
  const rowAlt = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  return SUBJECTS.map((subject) => {
    const chapters = getChapters(subject) || [];

    const rows = chapters.map((chapter, index) => {
      const { yesCount, total, percent } = getChapterYesPercentage(subject, chapter);

      const color =
        percent === 100 ? '#22c55e' :
        percent >= 70 ? '#3b82f6' :
        percent >= 40 ? '#f59e0b' :
        '#ef4444';

      return `
        <tr style="background:${index % 2 === 0 ? 'transparent' : rowAlt};">
          <td style="padding:10px;border:1px solid ${bdr};text-align:left;">${chapter}</td>
          <td style="padding:10px;border:1px solid ${bdr};text-align:center;font-weight:700;color:${color};">
            ${percent}%
          </td>
        
        </tr>
      `;
    }).join('');

    return `
      <div class="subject-table-block" style="margin-top:22px; page-break-inside: avoid; break-inside: avoid;">
        <h3 style="margin:0 0 10px 0;font-size:1.05rem;color:${accent}; page-break-after: avoid; break-after: avoid;">
          ${subject} 
        </h3>

        <div style="overflow:hidden;border:1px solid ${bdr};border-radius:10px;background:${tableBg}; page-break-inside: avoid; break-inside: avoid;">
          <table style="width:100%;border-collapse:collapse;font-size:0.88rem;">
            <thead>
              <tr style="background:${headBg};">
                <th style="padding:10px;border:1px solid ${bdr};text-align:left;">Chapter</th>
                <th style="padding:10px;border:1px solid ${bdr};text-align:center;">Score</th>
            
              </tr>
            </thead>
            <tbody>
              ${rows || `
                <tr>
                  <td colspan="3" style="padding:12px;border:1px solid ${bdr};text-align:center;color:${txt2};">
                    No chapter data available
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');
}


function buildSubjectSummaryChartSVG(yesCounts, isDark) {
  const values = yesCounts.map((sub) =>
    sub.max ? Math.round((sub.total / sub.max) * 100) : 0
  );

  const W = Math.max(460, SUBJECTS.length * 70);
  const H = 180;
  const barW = 38;
  const gap = (W - 40 - barW * SUBJECTS.length) / (SUBJECTS.length + 1);

  const textCol = isDark ? '#a0aec0' : '#718096';
  const gridCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const trackFill = isDark ? '#2d3748' : '#e2e8f0';

  let yLabels = '';
  for (let i = 0; i <= 100; i += 20) {
    const y = H - (i / 100) * H + 10;
    yLabels += `<text x="24" y="${y + 3}" text-anchor="end" font-size="9" fill="${textCol}">${i}%</text>`;
    yLabels += `<line x1="30" y1="${y}" x2="${W + 5}" y2="${y}" stroke="${gridCol}" stroke-width="0.6" stroke-dasharray="3,3"/>`;
  }

  let bars = '';
  values.forEach((percent, idx) => {
    const x = 35 + gap + idx * (barW + gap);
    const barH = (percent / 100) * H;
    const y = H - barH + 10;

    const color =
      percent === 100 ? '#22c55e' :
      percent >= 70 ? '#3b82f6' :
      percent >= 40 ? '#f59e0b' :
      '#ef4444';

    const label = SHORT_NAMES[SUBJECTS[idx]] || SUBJECTS[idx];
    const words = label.split(' ');
    const line1 = words[0];
    const line2 = words.slice(1).join(' ');

    bars += `<rect x="${x}" y="10" width="${barW}" height="${H}" rx="6" fill="${trackFill}" opacity="0.5"/>`;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="6" fill="${color}"/>`;

    bars += `
      <text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" font-size="10" font-weight="700" fill="${color}">
        ${percent}%
      </text>
    `;

    if (words.length > 1) {
      bars += `
        <text x="${x + barW / 2}" y="${H + 24}" text-anchor="middle" font-size="10" font-weight="700" fill="${textCol}">
          <tspan x="${x + barW / 2}" dy="0">${line1}</tspan>
          <tspan x="${x + barW / 2}" dy="11">${line2}</tspan>
        </text>
      `;
    } else {
      bars += `
        <text x="${x + barW / 2}" y="${H + 28}" text-anchor="middle" font-size="10" font-weight="700" fill="${textCol}">
          ${label}
        </text>
      `;
    }
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${W + 10} ${H + 55}">
      ${yLabels}
      ${bars}
      <line x1="30" y1="${H + 10}" x2="${W + 5}" y2="${H + 10}" stroke="${gridCol}" stroke-width="1"/>
      <line x1="30" y1="10" x2="30" y2="${H + 10}" stroke="${gridCol}" stroke-width="1"/>
    </svg>
  `;
}


function getTimeRemaining(examMonthYear) {
  if (!examMonthYear) return '';

  try {
    const [monthStr, yearStr] = examMonthYear.split(' ');
    const targetDate = new Date(`${monthStr} 1, ${yearStr}`);
    const today = new Date();

    const diff = targetDate - today;
    if (diff <= 0) return 'Exam time reached';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    return `${months} months ${remainingDays} days left`;
  } catch {
    return '';
  }
}






// ─── Build full report HTML ────────────────────────────────────────────
function buildReportHTML() {
  let details = { fullName: '', uniqueId: '', mobile: '', exam: '' };
  try {
    details = JSON.parse(localStorage.getItem('generalDetails')) || details;
  } catch {}


  const timeLeft = getTimeRemaining(details.exam);

  const yesCounts = SUBJECTS.map((sub) => {
    const chapters = getChapters(sub) || [];
    const counts = { q1: 0, q2: 0, q3: 0, q4: 0 };

    chapters.forEach((ch) => {
      const key = `trackpro_${sub}_${ch.replace(/\s+/g, '')}`;
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.q1 === 'Yes') counts.q1++;
          if (parsed.q2 === 'Yes') counts.q2++;
          if (parsed.q3 === 'Yes') counts.q3++;
          if (parsed.q4 === 'Yes') counts.q4++;
        }
      } catch {}
    });

    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
    return { subject: sub, total: totalCount, max: chapters.length * 4 };
  });

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bg = isDark ? '#1a202c' : '#f0f4f8';
  const txt = isDark ? '#e2e8f0' : '#1a202c';
  const txt2 = isDark ? '#a0aec0' : '#4a5568';
  const accent = '#3182ce';
  const bdr = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  return `
    <div style="font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:${bg};padding:28px;color:${txt};width:800px;">
      <style>
        * { box-sizing: border-box; }

        .page-break-avoid,
        .subject-table-block,
        .chart-card,
        .summary-table-wrap,
        .report-header {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        h1, h2, h3, h4 {
          page-break-after: avoid;
          break-after: avoid;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          display: table-header-group;
        }

        tr, td, th {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      </style>

      <div class="report-header" style="text-align:center;margin-bottom:20px;">
        <h1 style="font-size:1.5rem;margin:0 0 4px 0;color:${accent};">📊 Student Progress Report</h1>
        <p style="margin:0;font-size:0.85rem;color:${txt2};">
          Generated on ${new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
          ${details.exam ? `
  <div style="margin:10px auto 0 auto;max-width:320px;padding:10px 14px;border-radius:12px;background:${isDark ? 'rgba(49,130,206,0.12)' : 'rgba(49,130,206,0.08)'};border:1px solid ${isDark ? 'rgba(49,130,206,0.28)' : 'rgba(49,130,206,0.20)'};">
    <p style="margin:0;font-size:0.9rem;font-weight:700;color:${txt};">
      Exam: <span style="color:${accent};">${details.exam}</span>
    </p>
    ${timeLeft ? `
      <p style="margin:4px 0 0 0;font-size:0.82rem;color:${txt2};">
        ⏳ ${timeLeft}
      </p>
    ` : ''}
  </div>
` : ''}
     
        </div>

      <div class="page-break-avoid">
        <h3 style="margin:0 0 12px 0;font-size:1.1rem;color:${accent};">📊 Subject-wise Completion</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${QUESTION_CHARTS.map((q) => {
            const chartBg = isDark ? `${q.color}15` : `${q.color}12`;
            return `
              <div class="chart-card" style="padding:12px;border:1px solid ${bdr};border-radius:10px;background:${chartBg};">
                <h4 style="margin:0 0 6px 0;font-size:0.9rem;color:${txt};display:flex;align-items:center;gap:6px;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${q.color};"></span>
                  ${q.label}
                </h4>
                ${buildQuestionChartSVG(q.id, q.color, isDark)}
                <div style="text-align:center;font-size:0.65rem;color:${txt2};margin-top:2px;">
                  Yes = 1 | No = 0 · per chapter
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

     <div class="summary-table-wrap" style="margin-top:20px;">
  <h3 style="margin:0 0 12px 0;font-size:1.1rem;color:${accent};">
    Subject Level Summary
  </h3>

  <div
    class="chart-card"
    style="
      padding:14px;
      border:1px solid ${bdr};
      border-radius:10px;
      background:${isDark ? '#1f2937' : '#ffffff'};
    "
  >
    ${buildSubjectSummaryChartSVG(yesCounts, isDark)}
    <div style="text-align:center;font-size:0.72rem;color:${txt2};margin-top:4px;">
      Overall subject score in percentage
    </div>
  </div>
</div>

      ${buildSubjectChapterTables(isDark, txt2, accent, bdr)}
    </div>
  `;
}

// ─── PDF Generator ─────────────────────────────────────────────────────
async function createPdfFromElement(element) {
  const fileName = `Student_Progress_${new Date().toISOString().split('T')[0]}.pdf`;

  const opt = {
    margin: [1,1,1,1],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      backgroundColor: null,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode: ['css', 'avoid-all', 'legacy'],
      avoid: ['.subject-table-block', '.summary-table-wrap', '.chart-card', 'table', 'tr', 'h3', 'h4'],
    },
  };

  const worker = html2pdf().set(opt).from(element);

  const pdfBlob = await worker.outputPdf('blob');
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
  const pdfUrl = URL.createObjectURL(pdfBlob);

  return {
    pdfBlob,
    pdfFile,
    pdfUrl,
    pdfFileName: fileName,
  };
}

// ─── Component ─────────────────────────────────────────────────────────
export default function TalkWithSirButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);   // ← store the File object
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [shareError, setShareError] = useState('');

  // ── Phase 1: Generate only, no sharing ──────────────────────────────
  const handleGenerate = async () => {
    let wrapper = null;
    try {
      setIsGenerating(true);
      setShareError('');

      // Clean up any previous blob URL
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfFile(null);

      wrapper = document.createElement('div');
      wrapper.style.cssText =
        'position:fixed;left:-99999px;top:0;width:800px;z-index:-1;';
      wrapper.innerHTML = buildReportHTML();
      document.body.appendChild(wrapper);

      await new Promise((r) => setTimeout(r, 300));

      const target = wrapper.firstElementChild;
      if (!target) throw new Error('Report element not found');

      const { pdfFile: file, pdfUrl: url, pdfFileName: name } =
        await createPdfFromElement(target);

      setPdfFile(file);
      setPdfUrl(url);
      setPdfFileName(name);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert(`Failed to generate PDF: ${err.message}`);
    } finally {
      if (wrapper) wrapper.remove();
      setIsGenerating(false);
    }
  };

  // ── Phase 2: Share — called from a FRESH click handler ──────────────
  const handleShare = () => {
    if (!pdfFile) return;

    const canShare =
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [pdfFile] });

    if (canShare) {
      // navigator.share() is called SYNCHRONOUSLY inside this click handler
      // No awaits before this point — gesture context is intact
      navigator.share({
        title: 'Student Progress Report',
        text: 'Please find my progress report attached.',
        files: [pdfFile],
      }).catch((err) => {
        if (err?.name === 'AbortError') return; // user dismissed — fine
        setShareError(
          'Sharing failed. Download the PDF and attach it manually in WhatsApp.'
        );
        setIsOpen(true);
      });
    } else {
      setShareError(
        'Direct file sharing is not supported here. Download the PDF and attach it in WhatsApp.'
      );
      setIsOpen(true);
    }
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = pdfFileName || 'Student_Progress.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const openWhatsApp = () => {
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEMPLATE)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const closeModal = () => {
    setIsOpen(false);
    setShareError('');
  };

  // ── Render ───────────────────────────────────────────────────────────
  const pdfReady = !!pdfFile;

  return (
    <>
      <div
        className="mt-6 mb-8 text-center glass-panel"
        style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Ready to share your progress?</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0 auto 1.5rem auto', maxWidth: '600px' }}>
          {pdfReady
            ? 'PDF is ready! Tap "Share PDF" to send it.'
            : 'Tap "Generate PDF" first, then share it on WhatsApp.'}
        </p>

        {/* Step 1 — Generate */}
        <button
          className="btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            maxWidth: 400, margin: '0 auto 12px auto', width: '100%',
            padding: '1rem', fontSize: '1.1rem',
            background: pdfReady
              ? 'linear-gradient(135deg,#38a169,#276749)'
              : 'linear-gradient(135deg,#3182ce,#2c5282)',
            color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            opacity: isGenerating ? 0.8 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >

          {isGenerating ? (
  <><Loader2 className="animate-spin" /> Generating…</>
) : pdfReady ? (
  <><FileText /> ✓ PDF Ready — Regenerate</>
) : (
  <><MessageCircle /> Talk With Sir</>
)}
        </button>

        {/* Step 2 — Share (only shown when PDF exists) */}
        {pdfReady && (
          <button
            className="btn"
            onClick={handleShare}   // ← synchronous, no async before navigator.share
            style={{
              maxWidth: 400, margin: '0 auto', width: '100%',
              padding: '1rem', fontSize: '1.1rem',
              background: 'linear-gradient(135deg,#25D366,#128C7E)',
              color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <MessageCircle /> Share PDF on WhatsApp
          </button>
        )}
      </div>

      {/* Fallback modal — same as before */}
      {isOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* … your existing modal JSX … */}
          </div>
        </div>
      )}
    </>
  );
}