import React, { useState, useMemo, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  CAMPAIGN_POSTS, 
  getTotals, 
  getPlatformTotals, 
  PostItem 
} from './data/campaignData';
import { 
  Eye, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  TrendingUp, 
  Layers, 
  BarChart3, 
  Filter, 
  RotateCcw, 
  FileSpreadsheet, 
  Printer, 
  Search,
  MousePointerClick,
  Sparkles,
  CheckCircle2,
  PieChart as PieChartIcon
} from 'lucide-react';

export default function App() {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'data' | 'impressoes' | 'interacoes' | 'engajamento'>('data');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Refs para os canvas dos gráficos (conforme modelo dash-esquenta)
  const chartStackedRef = useRef<HTMLCanvasElement | null>(null);
  const chartDoughnutRef = useRef<HTMLCanvasElement | null>(null);
  const chartBarComparativoRef = useRef<HTMLCanvasElement | null>(null);

  // Instâncias do Chart.js
  const chartStackedInstance = useRef<Chart | null>(null);
  const chartDoughnutInstance = useRef<Chart | null>(null);
  const chartBarComparativoInstance = useRef<Chart | null>(null);

  // Filtragem dos posts
  const filteredPosts = useMemo(() => {
    return CAMPAIGN_POSTS.filter(post => {
      if (platformFilter !== 'all' && post.plataforma !== platformFilter) {
        return false;
      }
      if (dateFilter !== 'all' && post.data !== dateFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchPlat = post.plataforma.toLowerCase().includes(q);
        const matchFormat = (post.formato || '').toLowerCase().includes(q);
        const matchGroup = post.grupo.toLowerCase().includes(q);
        const matchDay = post.diaSemana.toLowerCase().includes(q);
        if (!matchPlat && !matchFormat && !matchGroup && !matchDay) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'impressoes') return b.impressoes - a.impressoes;
      if (sortBy === 'interacoes') return b.interacoes - a.interacoes;
      if (sortBy === 'engajamento') return b.engajamento - a.engajamento;
      return b.data.localeCompare(a.data);
    });
  }, [platformFilter, dateFilter, searchQuery, sortBy]);

  // Totais filtrados
  const totals = useMemo(() => getTotals(filteredPosts), [filteredPosts]);

  // Totais por plataforma
  const platformStats = useMemo(() => getPlatformTotals(filteredPosts), [filteredPosts]);

  // Formatação de números
  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num);

  // Dados para os Gráficos do Modelo dash-esquenta
  useEffect(() => {
    // 1. GRÁFICO 1: PERFORMANCE COMPARATIVA (Modelo dash-esquenta)
    if (chartStackedRef.current) {
      if (chartStackedInstance.current) {
        chartStackedInstance.current.destroy();
      }

      // Se todas as plataformas ou filtrado
      let labels: string[] = [];
      let dataImpressoes: number[] = [];
      let dataAlcance: number[] = [];
      let dataInteracoes: number[] = [];

      if (platformFilter === 'all') {
        const plats = ['Instagram Feed', 'Instagram Stories', 'Facebook', 'Tiktok'];
        labels = plats;
        plats.forEach(plat => {
          const items = filteredPosts.filter(p => p.plataforma === plat);
          dataImpressoes.push(items.reduce((acc, p) => acc + p.impressoes, 0));
          dataAlcance.push(items.reduce((acc, p) => acc + p.alcance, 0));
          dataInteracoes.push(items.reduce((acc, p) => acc + p.interacoes, 0));
        });
      } else {
        // Mostra evolução diária ou individual da plataforma
        const dates = ['2026-09-28', '2026-09-29', '2026-09-30'];
        labels = ['28/09 (Seg)', '29/09 (Ter)', '30/09 (Qua)'];
        dates.forEach(d => {
          const items = filteredPosts.filter(p => p.data === d);
          dataImpressoes.push(items.reduce((acc, p) => acc + p.impressoes, 0));
          dataAlcance.push(items.reduce((acc, p) => acc + p.alcance, 0));
          dataInteracoes.push(items.reduce((acc, p) => acc + p.interacoes, 0));
        });
      }

      chartStackedInstance.current = new Chart(chartStackedRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Impressões (Impactos)',
              data: dataImpressoes,
              backgroundColor: '#005599',
              borderRadius: 6
            },
            {
              label: 'Alcance Único',
              data: dataAlcance,
              backgroundColor: '#38bdf8',
              borderRadius: 6
            },
            {
              label: 'Interações',
              data: dataInteracoes,
              backgroundColor: '#F47920',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 750,
            easing: 'easeOutQuart'
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              display: false // Usamos a legenda HTML idêntica ao modelo
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#f8fafc',
              bodyColor: '#f8fafc',
              padding: 12,
              cornerRadius: 8,
              titleFont: { size: 13, weight: 'bold' },
              bodyFont: { size: 12 },
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  const val = context.parsed.y ?? 0;
                  return `${label}${new Intl.NumberFormat('pt-BR').format(val)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: '#475569',
                font: { size: 12, weight: 'bold' }
              }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                color: '#64748b',
                font: { size: 11 },
                callback: function (value: any) {
                  return (value / 1000) >= 1 ? (value / 1000) + 'k' : value;
                }
              }
            }
          }
        }
      });
    }

    // 2. GRÁFICO 2: ROSCA (DOUGHNUT) DAS INTERAÇÕES (Modelo dash-esquenta)
    if (chartDoughnutRef.current) {
      if (chartDoughnutInstance.current) {
        chartDoughnutInstance.current.destroy();
      }

      const totalInt = totals.interacoes || 1;
      const cliques = totals.cliquesLink || 0;
      const curtidas = totals.curtidas || 0;
      const envios = totals.compartilhamentos || 0;
      const comentarios = totals.comentarios || 0;
      const salvos = totals.salvos || 0;
      const outros = Math.max(0, totals.interacoes - (cliques + curtidas + envios + comentarios + salvos));

      const doughnutLabels = ['Cliques no Link (Stories)', 'Curtidas', 'Envios / Shares', 'Comentários', 'Salvos', 'Outras Ações'];
      const doughnutData = [cliques, curtidas, envios, comentarios, salvos, outros];
      const doughnutColors = ['#005599', '#F47920', '#38bdf8', '#10B981', '#f59e0b', '#8b5cf6'];

      chartDoughnutInstance.current = new Chart(chartDoughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: doughnutLabels,
          datasets: [
            {
              data: doughnutData,
              backgroundColor: doughnutColors,
              hoverOffset: 6,
              borderWidth: 2,
              borderColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          animation: {
            animateScale: true,
            animateRotate: true,
            duration: 850
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const val = (context.parsed as number) || 0;
                  const pct = ((val / totalInt) * 100).toFixed(1) + '%';
                  return ` ${label}: ${new Intl.NumberFormat('pt-BR').format(val)} (${pct})`;
                }
              }
            }
          }
        }
      });
    }

    // 3. GRÁFICO 3: BARRAS AGRUPADAS - ESFORÇO VS. RESULTADO (Modelo dash-esquenta)
    if (chartBarComparativoRef.current) {
      if (chartBarComparativoInstance.current) {
        chartBarComparativoInstance.current.destroy();
      }

      const totalImp = totals.impressoes || 1;
      const totalInt = totals.interacoes || 1;

      const platforms = ['Instagram Stories', 'Instagram Feed', 'Facebook', 'Tiktok'];
      const pctImpactos = platforms.map(plat => {
        const sum = filteredPosts.filter(p => p.plataforma === plat).reduce((a, b) => a + b.impressoes, 0);
        return Number(((sum / totalImp) * 100).toFixed(1));
      });
      const pctInteracoes = platforms.map(plat => {
        const sum = filteredPosts.filter(p => p.plataforma === plat).reduce((a, b) => a + b.interacoes, 0);
        return Number(((sum / totalInt) * 100).toFixed(1));
      });

      chartBarComparativoInstance.current = new Chart(chartBarComparativoRef.current, {
        type: 'bar',
        data: {
          labels: platforms,
          datasets: [
            {
              label: '% Impactos (Impressões)',
              data: pctImpactos,
              backgroundColor: '#005599',
              borderRadius: 6
            },
            {
              label: '% Interações Geradas',
              data: pctInteracoes,
              backgroundColor: '#F47920',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 750,
            easing: 'easeOutQuart'
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                usePointStyle: true,
                pointStyle: 'rectRounded',
                color: '#475569',
                font: { size: 11, weight: 'bold' }
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  return ` ${context.dataset.label}: ${context.parsed.y}%`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: '#475569',
                font: { size: 11, weight: 'bold' }
              }
            },
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: '#f1f5f9' },
              ticks: {
                color: '#64748b',
                callback: function (val: any) {
                  return val + '%';
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartStackedInstance.current) chartStackedInstance.current.destroy();
      if (chartDoughnutInstance.current) chartDoughnutInstance.current.destroy();
      if (chartBarComparativoInstance.current) chartBarComparativoInstance.current.destroy();
    };
  }, [filteredPosts, totals, platformFilter]);

  const handleResetFilters = () => {
    setPlatformFilter('all');
    setDateFilter('all');
    setSearchQuery('');
    setSortBy('data');
  };

  const handleCopyCsv = () => {
    const headers = 'Plataforma,Data,Dia,Grupo,Formato,Alcance,Impressões,Interações,Curtidas,Comentários,Envios,Engajamento';
    const rows = CAMPAIGN_POSTS.map(p => 
      `"${p.plataforma}","${p.dataDisplay}","${p.diaSemana}","${p.grupo}","${p.formato || ''}",${p.alcance},${p.impressoes},${p.interacoes},${p.curtidas},${p.comentarios},${p.compartilhamentos},"${p.engajamento}%"`
    );
    const csvContent = [headers, ...rows].join('\n');
    navigator.clipboard.writeText(csvContent).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-900 pb-12 font-sans">
      {/* Container Centralizado Max-W-4XL conforme dash-esquenta */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">

        {/* 1. HEADER SUPERIOR */}
        <header className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 transition-all duration-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Logos & Título */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {/* Logo Assaí Atacadista */}
                <div className="flex items-center">
                  <img
                    src="https://i.imgur.com/ihchsJt.png"
                    alt="Logo Cliente - Assaí Atacadista"
                    className="h-8 sm:h-10 w-auto object-contain max-w-[140px]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const fallback = document.getElementById('clientLogoFallback');
                      if (fallback) fallback.style.display = 'inline-flex';
                    }}
                  />
                  <span id="clientLogoFallback" className="hidden items-center px-2.5 py-1 rounded text-xs font-bold bg-[#005599] text-white tracking-wide">
                    ASSAÍ ATACADISTA
                  </span>
                </div>

                <div className="h-6 w-px bg-gray-200"></div>

                {/* Logo Agência */}
                <div className="flex items-center">
                  <img
                    src="https://i.imgur.com/lAyMWKF.png"
                    alt="Logo Agência"
                    className="h-7 sm:h-9 w-auto object-contain max-w-[130px]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const fallback = document.getElementById('agencyLogoFallback');
                      if (fallback) fallback.style.display = 'inline-flex';
                    }}
                  />
                  <span id="agencyLogoFallback" className="hidden items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-white tracking-wide">
                    AGÊNCIA
                  </span>
                </div>

                {/* Tag de Contexto */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Base Oficial Carregada: Esquenta Aniversário (Todas as Redes)
                </span>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#005599] tracking-tight">
                  DASHBOARD: Campanha de Aniversário 2026
                </h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span>Grupo Ativo: <strong className="text-slate-700">ESQUENTA ANIVERSÁRIO</strong></span>
                  <span>·</span>
                  <span>Período: <strong className="text-slate-700">28/09 a 30/09/2026</strong></span>
                  <span>·</span>
                  <span>Canais: <strong className="text-slate-700">Instagram Feed, Stories, Facebook e TikTok</strong></span>
                </p>
              </div>
            </div>

            {/* Botões Rápidos */}
            <div className="flex items-center gap-2 self-start md:self-center shrink-0 no-print">
              <button
                onClick={() => {
                  document.getElementById('sectionPosts')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#005599] bg-[#EBF4FA] hover:bg-[#dbeafe] transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Ver {filteredPosts.length} Posts (Base)</span>
              </button>
              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>CSV Base</span>
              </button>
            </div>
          </div>

          {/* Linha de Filtros Lado a Lado (Conforme dash-esquenta) */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Filtros:</span>
            </div>

            {/* Dropdown Período */}
            <div className="flex-1">
              <label htmlFor="filterPeriodo" className="sr-only">Período</label>
              <select
                id="filterPeriodo"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-slate-700 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#005599] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="all">Fase Completa: Esquenta Aniversário (28 a 30/09)</option>
                <option value="2026-09-28">28/09/2026 · Segunda-feira (Lançamento)</option>
                <option value="2026-09-29">29/09/2026 · Terça-feira</option>
                <option value="2026-09-30">30/09/2026 · Quarta-feira</option>
              </select>
            </div>

            {/* Dropdown Redes Sociais */}
            <div className="flex-1">
              <label htmlFor="filterRede" className="sr-only">Redes Sociais</label>
              <select
                id="filterRede"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-slate-700 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#005599] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="all">Redes Sociais (Todas as 4 Redes)</option>
                <option value="Instagram Feed">Instagram Feed (8 Reels)</option>
                <option value="Instagram Stories">Instagram Stories (5 Stories)</option>
                <option value="Facebook">Facebook (5 Posts Estáticos)</option>
                <option value="Tiktok">TikTok (3 Vídeos Curtos)</option>
              </select>
            </div>

            {/* Botão Reset Rápido */}
            <button
              onClick={handleResetFilters}
              type="button"
              title="Redefinir Filtros"
              className="text-xs text-slate-400 hover:text-[#005599] font-medium px-2 py-1 transition-colors self-end sm:self-center cursor-pointer"
            >
              Limpar
            </button>
          </div>
        </header>

        {/* 2. CARDS DE KPI (Visão Geral) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Indicadores Chave">
          {/* Card 1: TOTAL DE IMPACTOS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                TOTAL DE IMPACTOS
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#EBF4FA] text-[#005599] flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {formatNumber(totals.impressoes)}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                <Users className="w-3.5 h-3.5 mr-0.5 inline" />
                {formatNumber(totals.alcance)} Alcance
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Total consolidado de impressões e visualizações
            </p>
          </div>

          {/* Card 2: TOTAL DE INTERAÇÕES */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-orange-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                TOTAL DE INTERAÇÕES
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#FEF3EB] text-[#F47920] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {formatNumber(totals.interacoes)}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-[#F47920] bg-orange-50 px-2 py-0.5 rounded">
                <Heart className="w-3.5 h-3.5 mr-0.5 inline" />
                {formatNumber(totals.curtidas)} curtidas
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {formatNumber(totals.cliquesLink)} cliques · {formatNumber(totals.compartilhamentos)} envios · {totals.comentarios} coments
            </p>
          </div>

          {/* Card 3: ENGAJAMENTO MÉDIO (ER) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-emerald-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                ENGAJAMENTO MÉDIO (ER)
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {totals.erMedio.toFixed(2).replace('.', ',')}%
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
                Alta retenção
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Média ponderada sobre o alcance total ({formatNumber(totals.alcance)} contas)
            </p>
          </div>
        </section>

        {/* FAIXA DETALHADA DE INTERAÇÕES (Conforme dash-esquenta) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Detalhamento de Interações da Base ({formatNumber(totals.interacoes)} Ações Registradas)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {/* Curtidas */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <span>❤️ Curtidas</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
                {formatNumber(totals.curtidas)}
              </div>
              <div className="text-[10px] text-slate-400">
                {totals.interacoes > 0 ? ((totals.curtidas / totals.interacoes) * 100).toFixed(1) : 0}% do total
              </div>
            </div>

            {/* Cliques no Link */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <span>🔗 Cliques Link</span>
              </div>
              <div className="text-lg font-extrabold text-[#005599] tabular-nums mt-0.5">
                {formatNumber(totals.cliquesLink)}
              </div>
              <div className="text-[10px] text-slate-400">
                {totals.interacoes > 0 ? ((totals.cliquesLink / totals.interacoes) * 100).toFixed(1) : 0}% (Stories)
              </div>
            </div>

            {/* Envios / Shares */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <span>✈️ Envios / Shares</span>
              </div>
              <div className="text-lg font-extrabold text-[#F47920] tabular-nums mt-0.5">
                {formatNumber(totals.compartilhamentos)}
              </div>
              <div className="text-[10px] text-slate-400">Compartilhamentos</div>
            </div>

            {/* Comentários */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <span>💬 Comentários</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
                {formatNumber(totals.comentarios)}
              </div>
              <div className="text-[10px] text-slate-400">Feed & Facebook</div>
            </div>

            {/* Salvos */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <span>🔖 Salvos</span>
              </div>
              <div className="text-lg font-extrabold text-emerald-600 tabular-nums mt-0.5">
                {formatNumber(totals.salvos)}
              </div>
              <div className="text-[10px] text-slate-400">Posts salvos</div>
            </div>
          </div>
        </section>

        {/* 3. VISÃO CONSOLIDADA POR REDE SOCIAL (Tabela com Heatmap) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print-break-inside-avoid">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#005599] tracking-tight">
                Visão Consolidada por Rede Social
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativo de alcance e taxa de engajamento por plataforma na Campanha de Aniversário
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400 hidden sm:inline">
              Heatmap ER ativo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" id="tableRedes">
              <thead>
                <tr className="bg-gray-50/80 text-xs font-bold uppercase text-slate-500 border-b border-gray-100 tracking-wider">
                  <th scope="col" className="py-3 px-5 sm:px-6">Rede</th>
                  <th scope="col" className="py-3 px-4 text-right">Alcance</th>
                  <th scope="col" className="py-3 px-4 text-right">Impactos (Impressões)</th>
                  <th scope="col" className="py-3 px-4 text-right">Interações</th>
                  <th scope="col" className="py-3 px-5 sm:px-6 text-right">ER Médio</th>
                </tr>
              </thead>
              <tbody id="tbodyRedes" className="divide-y divide-gray-100 font-medium text-slate-700">
                {/* Linha Instagram Stories */}
                <tr 
                  onClick={() => setPlatformFilter(platformFilter === 'Instagram Stories' ? 'all' : 'Instagram Stories')}
                  className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    platformFilter === 'Instagram Stories' ? 'bg-purple-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 sm:px-6 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow-xs">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-pink-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="4 2" />
                          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Instagram Stories</span>
                      <span className="block text-[11px] text-purple-600 font-medium">5 Stories · 38.695 cliques no link</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-700 font-semibold">278.231</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-900 font-bold">376.754</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#F47920] font-bold">39.648</td>
                  <td className="py-3.5 px-5 sm:px-6 text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold tabular-nums">
                      14,25%
                    </span>
                  </td>
                </tr>

                {/* Linha Instagram Feed */}
                <tr 
                  onClick={() => setPlatformFilter(platformFilter === 'Instagram Feed' ? 'all' : 'Instagram Feed')}
                  className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    platformFilter === 'Instagram Feed' ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 sm:px-6 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Instagram Feed</span>
                      <span className="block text-[11px] text-[#005599] font-medium">8 Reels · 7.519 curtidas</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-700 font-semibold">446.297</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-900 font-bold">472.631</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#F47920] font-bold">9.963</td>
                  <td className="py-3.5 px-5 sm:px-6 text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-semibold tabular-nums">
                      2,23%
                    </span>
                  </td>
                </tr>

                {/* Linha TikTok */}
                <tr 
                  onClick={() => setPlatformFilter(platformFilter === 'Tiktok' ? 'all' : 'Tiktok')}
                  className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    platformFilter === 'Tiktok' ? 'bg-slate-100' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 sm:px-6 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68 6.34 6.34 0 009.34 22a6.34 6.34 0 006.34-6.32V9.32a8.3 8.3 0 005-1.63v-3.7a8.2 8.2 0 01-1.09-.3z"/></svg>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">TikTok</span>
                      <span className="block text-[11px] text-slate-500 font-normal">3 Vídeos Curtos de Ofertas</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-700">5.650</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-900 font-semibold">5.650</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#F47920] font-semibold">153</td>
                  <td className="py-3.5 px-5 sm:px-6 text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-semibold tabular-nums">
                      2,71%
                    </span>
                  </td>
                </tr>

                {/* Linha Facebook */}
                <tr 
                  onClick={() => setPlatformFilter(platformFilter === 'Facebook' ? 'all' : 'Facebook')}
                  className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    platformFilter === 'Facebook' ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 sm:px-6 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Facebook</span>
                      <span className="block text-[11px] text-slate-500 font-normal">5 Posts Estáticos de Ofertas</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-700">51.559</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-900 font-semibold">51.559</td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#F47920] font-semibold">437</td>
                  <td className="py-3.5 px-5 sm:px-6 text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold tabular-nums">
                      0,85%
                    </span>
                  </td>
                </tr>
              </tbody>
              {/* Linha Total Consolidada */}
              <tfoot>
                <tr className="bg-gray-50 font-bold text-slate-900 border-t border-gray-200">
                  <td className="py-3 px-5 sm:px-6 text-[#005599]">Total / Média Ponderada</td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-800">781.737</td>
                  <td className="py-3 px-4 text-right tabular-nums text-[#005599]">906.594</td>
                  <td className="py-3 px-4 text-right tabular-nums text-[#F47920]">50.201</td>
                  <td className="py-3 px-5 sm:px-6 text-right tabular-nums text-emerald-700">6,42%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* 4. GRÁFICO 1: PERFORMANCE COMPARATIVA DOS CANAIS (Conforme dash-esquenta) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-6 print-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#005599] tracking-tight">
                Performance Comparativa por Rede Social (Esquenta Aniversário)
              </h2>
              <p className="text-xs text-slate-500">
                Comparativo de Impactos (Impressões), Alcance Único e Total de Interações por plataforma
              </p>
            </div>
            {/* Legenda de Cores Manual/Explícita do Modelo dash-esquenta */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-xs bg-[#005599]"></span> Impressões
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-xs bg-[#38bdf8]"></span> Alcance
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-xs bg-[#F47920]"></span> Interações
              </span>
            </div>
          </div>

          {/* Gráfico 1: Performance Comparativa dos Canais */}
          <div className="relative w-full h-72 sm:h-80">
            <canvas ref={chartStackedRef}></canvas>
          </div>

          {/* Tabela abaixo do gráfico (Conforme dash-esquenta) */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Detalhamento Consolidado por Canal
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">
                    <th scope="col" className="py-2.5 px-4">Canal / Formato</th>
                    <th scope="col" className="py-2.5 px-4 text-right">Alcance</th>
                    <th scope="col" className="py-2.5 px-4 text-right">Impactos (Impressões)</th>
                    <th scope="col" className="py-2.5 px-4 text-right">Interações</th>
                    <th scope="col" className="py-2.5 px-4 text-right">ER (Engajamento)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                  <tr className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                      <span className="font-semibold text-slate-900">Instagram Stories</span>
                      <span className="text-xs text-purple-600 font-normal">(38.695 cliques link)</span>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">278.231</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#005599] font-bold">376.754</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#F47920] font-bold">39.648</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-bold text-emerald-600 bg-emerald-50/60 rounded">14,25%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#005599] shrink-0"></span>
                      <span className="font-semibold text-slate-900">Instagram Feed</span>
                      <span className="text-xs text-[#005599] font-normal">(8 Reels publicados)</span>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">446.297</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#005599] font-bold">472.631</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#F47920] font-bold">9.963</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-slate-800">2,23%</td>
                  </tr>
                  <tr className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] shrink-0"></span>
                      <span className="font-semibold text-slate-900">Facebook</span>
                      <span className="text-xs text-slate-400 font-normal">(5 Posts Estáticos)</span>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">51.559</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">51.559</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#F47920] font-semibold">437</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-slate-800">0,85%</td>
                  </tr>
                  <tr className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0"></span>
                      <span className="font-semibold text-slate-900">TikTok</span>
                      <span className="text-xs text-slate-400 font-normal">(3 Vídeos Curtos)</span>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">5.650</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">5.650</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[#F47920] font-semibold">153</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-slate-800">2,71%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. EQUILÍBRIO EDITORIAL & MATRIZ ESFORÇO VS. RESULTADO (Conforme dash-esquenta) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-6 print-break-inside-avoid">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#005599] tracking-tight">
              Equilíbrio Editorial & Matriz Esforço vs. Resultado
            </h2>
            <p className="text-xs text-slate-500">
              Avaliação de eficiência de cada canal: proporção de impactos gerados versus volume de engajamento conquistado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Gráfico 2 (Esquerda): Gráfico de Rosca (Doughnut Chart) */}
            <div className="flex flex-col items-center">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">
                Composição das {formatNumber(totals.interacoes)} Interações
              </h3>
              <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                <canvas ref={chartDoughnutRef}></canvas>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005599]"></span> Cliques Link: <strong className="text-slate-900">77,1%</strong>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F47920]"></span> Curtidas: <strong className="text-slate-900">17,9%</strong>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span> Envios: <strong className="text-slate-900">3,1%</strong>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Comentários: <strong className="text-slate-900">0,8%</strong>
                </div>
              </div>
            </div>

            {/* Gráfico 3 (Direita): Gráfico de Barras Agrupadas */}
            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 text-center md:text-left">
                Comparativo: % Impactos vs. % Interações por Plataforma
              </h3>
              <div className="relative w-full h-64 sm:h-72">
                <canvas ref={chartBarComparativoRef}></canvas>
              </div>
              {/* Insight Box (Conforme dash-esquenta) */}
              <div className="mt-3 p-3 bg-orange-50/70 border border-orange-100 rounded-lg text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-[#F47920]">Insight de Eficiência:</span> 
                O <strong>Instagram Stories</strong> registrou a maior taxa de conversão e engajamento da campanha (<strong>14,25%</strong>), concentrando <strong>79,0% de todas as interações (39.648)</strong>, impulsionado por expressivos <strong>38.695 cliques no link</strong>. O <strong>Instagram Feed</strong> gerou o maior volume de exibição de marca (<strong>472.631 impactos</strong>), enquanto o <strong>TikTok</strong> apresentou taxa de engajamento positiva de <strong>2,71%</strong>.
              </div>
            </div>
          </div>
        </section>

        {/* 6. TABELA COMPLETA COM AS 21 PUBLICAÇÕES */}
        <section id="sectionPosts" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print-break-inside-avoid">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#005599]" />
                <h2 className="text-base font-bold text-[#005599] tracking-tight">
                  Base de Dados: Todas as 21 Publicações da Campanha ({filteredPosts.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Registros individuais cadastrados no Esquenta Aniversário 2026
              </p>
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
              <span className="text-slate-400 font-medium">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#005599]"
              >
                <option value="data">Data de Publicação</option>
                <option value="impressoes">Maior Impacto (Impressões)</option>
                <option value="interacoes">Mais Interações</option>
                <option value="engajamento">Maior Taxa de Engajamento</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" id="tablePosts">
              <thead>
                <tr className="bg-gray-50/80 text-[11px] font-bold uppercase text-slate-500 border-b border-gray-100 tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">Publicação & Formato</th>
                  <th scope="col" className="py-3 px-3">Data / Dia</th>
                  <th scope="col" className="py-3 px-3 text-right">Alcance</th>
                  <th scope="col" className="py-3 px-3 text-right">Impactos (Impressões)</th>
                  <th scope="col" className="py-3 px-4 text-right">Interações & Ações</th>
                  <th scope="col" className="py-3 px-3 text-right">Taxa ER</th>
                  <th scope="col" className="py-3 px-4 text-center no-print">Link</th>
                </tr>
              </thead>
              <tbody id="tbodyPosts" className="divide-y divide-gray-100 font-medium text-slate-700">
                {filteredPosts.map((post) => {
                  const isStories = post.plataforma === 'Instagram Stories';
                  const isFeed = post.plataforma === 'Instagram Feed';
                  const isFb = post.plataforma === 'Facebook';
                  const isTt = post.plataforma === 'Tiktok';

                  return (
                    <tr key={post.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Plataforma */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isFeed ? 'bg-pink-500' : isStories ? 'bg-purple-600' : isFb ? 'bg-blue-600' : 'bg-slate-900'
                          }`}></span>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                              {post.plataforma}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {post.formato || post.tipo || 'Post'} · {post.grupo}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Data */}
                      <td className="py-3 px-3 text-xs whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block">{post.dataDisplay}</span>
                        <span className="text-[10px] text-slate-400 capitalize block">{post.diaSemana}</span>
                      </td>

                      {/* Alcance */}
                      <td className="py-3 px-3 text-right tabular-nums text-slate-700 font-semibold text-xs sm:text-sm">
                        {formatNumber(post.alcance)}
                      </td>

                      {/* Impressões */}
                      <td className="py-3 px-3 text-right tabular-nums text-slate-900 font-bold text-xs sm:text-sm">
                        {formatNumber(post.impressoes)}
                      </td>

                      {/* Interações */}
                      <td className="py-3 px-4 text-right tabular-nums">
                        <span className="font-extrabold text-[#F47920] block text-xs sm:text-sm">
                          {formatNumber(post.interacoes)}
                        </span>
                        <span className="text-[10px] text-slate-400 block whitespace-nowrap">
                          {isStories ? (
                            `${formatNumber(post.cliquesLink || 0)} cliques · ${post.curtidas} curtidas`
                          ) : (
                            `${post.curtidas} curt · ${post.compartilhamentos} env · ${post.comentarios} com`
                          )}
                        </span>
                      </td>

                      {/* ER */}
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tabular-nums ${
                          post.engajamento >= 10 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : post.engajamento >= 2 
                            ? 'bg-blue-50 text-blue-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {post.engajamento.toFixed(2).replace('.', ',')}%
                        </span>
                      </td>

                      {/* Link */}
                      <td className="py-3 px-4 text-center no-print">
                        {post.link ? (
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#005599] hover:underline"
                            title="Abrir post original"
                          >
                            <span>Abrir</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. FOOTER */}
        <footer className="pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#005599]">ASSAÍ ATACADISTA</span>
            <span>·</span>
            <span>Campanha de Aniversário 2026 · Monitoramento Estratégico</span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <button
              onClick={() => setIsGlossaryModalOpen(true)}
              className="text-slate-600 hover:text-[#005599] transition-colors underline decoration-slate-300 underline-offset-4 cursor-pointer"
            >
              Glossário
            </button>
            <span>·</span>
            <button
              onClick={() => window.print()}
              className="text-[#F47920] hover:text-[#d9630e] transition-colors font-bold underline decoration-orange-300 underline-offset-4 cursor-pointer"
            >
              Exportar PDF
            </button>
          </div>
        </footer>

      </div>

      {/* MODAL 1: CSV / PLANILHA */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#FEF3EB] text-[#F47920]">
                  <FileSpreadsheet className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Base de Dados Oficial: Campanha de Aniversário 2026
                </h3>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              21 publicações consolidadas cobrindo Instagram Feed, Instagram Stories, Facebook e TikTok (28/09 a 30/09/2026).
            </p>

            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
              <div className="text-emerald-400 font-bold mb-1"># Resumo da Base Oficial:</div>
              Total de Publicações: 21<br />
              Total de Impactos: {formatNumber(totals.impressoes)}<br />
              Total de Alcance: {formatNumber(totals.alcance)}<br />
              Total de Interações: {formatNumber(totals.interacoes)}<br />
              Taxa de Engajamento Ponderada: {totals.erMedio.toFixed(2).replace('.', ',')}%
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={handleCopyCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700 transition-colors cursor-pointer"
              >
                {copyFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">CSV Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copiar CSV Completo</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#005599] hover:bg-[#004278] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GLOSSÁRIO */}
      {isGlossaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#005599]">
                Glossário de Métricas & Conceitos
              </h3>
              <button
                onClick={() => setIsGlossaryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 max-h-80 overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Impactos (Impressões)</h4>
                <p>Número total de vezes que as publicações e stories foram exibidos na tela dos usuários (906.594 impactos totais).</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Alcance</h4>
                <p>Quantidade de contas únicas alcançadas pelos posts (781.737 contas no total do Esquenta).</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Interações</h4>
                <p>Soma de curtidas (9.002), cliques no link (38.695), comentários (405), envios (1.564) e salvamentos (331), totalizando 50.201 ações.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">ER Médio (Engagement Rate)</h4>
                <p>Taxa percentual calculada sobre o Alcance: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-slate-800">(Total de Interações / Total de Alcance) * 100</code>, resultando em <strong>6,42%</strong> de média ponderada.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsGlossaryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#005599] hover:bg-[#004278] rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
