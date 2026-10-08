export interface PostItem {
  id: string;
  plataforma: 'Instagram Feed' | 'Instagram Stories' | 'Facebook' | 'Tiktok';
  tipo?: string;
  formato?: string;
  data: string; // YYYY-MM-DD or DD/MM/YYYY
  dataDisplay: string;
  diaSemana: string;
  categoria: string;
  grupo: string;
  subGrupo?: string;
  alcance: number;
  impressoes: number; // ou visualizações
  interacoes: number;
  curtidas: number;
  comentarios: number;
  compartilhamentos: number; // envios
  salvos?: number;
  cliquesLink?: number;
  respostas?: number;
  visitasPerfil?: number;
  navegacoes?: number;
  engajamento: number; // em %
  link?: string;
}

export const CAMPAIGN_POSTS: PostItem[] = [
  // --- INSTAGRAM FEED (8 posts) ---
  {
    id: 'ig-feed-1',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-28',
    dataDisplay: '28/09/2026',
    diaSemana: 'segunda-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 49783,
    impressoes: 70408,
    interacoes: 863,
    curtidas: 706,
    comentarios: 32,
    compartilhamentos: 66,
    salvos: 26,
    engajamento: 1.73,
    link: 'https://www.instagram.com/p/Dd19AwjDObT/'
  },
  {
    id: 'ig-feed-2',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-28',
    dataDisplay: '28/09/2026',
    diaSemana: 'segunda-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 17835,
    impressoes: 23544,
    interacoes: 322,
    curtidas: 223,
    comentarios: 25,
    compartilhamentos: 55,
    salvos: 4,
    engajamento: 1.81,
    link: 'https://www.instagram.com/p/Dd1CTCPxKzy/'
  },
  {
    id: 'ig-feed-3',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-29',
    dataDisplay: '29/09/2026',
    diaSemana: 'terça-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 53190,
    impressoes: 53190,
    interacoes: 663,
    curtidas: 535,
    comentarios: 29,
    compartilhamentos: 54,
    salvos: 20,
    engajamento: 1.25
  },
  {
    id: 'ig-feed-4',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-29',
    dataDisplay: '29/09/2026',
    diaSemana: 'terça-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 100772,
    impressoes: 100772,
    interacoes: 2610,
    curtidas: 2000,
    comentarios: 95,
    compartilhamentos: 298,
    salvos: 77,
    engajamento: 4.91
  },
  {
    id: 'ig-feed-5',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-29',
    dataDisplay: '29/09/2026',
    diaSemana: 'terça-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 28484,
    impressoes: 28484,
    interacoes: 274,
    curtidas: 243,
    comentarios: 6,
    compartilhamentos: 17,
    salvos: 8,
    engajamento: 0.52
  },
  {
    id: 'ig-feed-6',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 18052,
    impressoes: 18052,
    interacoes: 153,
    curtidas: 131,
    comentarios: 7,
    compartilhamentos: 5,
    salvos: 10,
    engajamento: 0.29
  },
  {
    id: 'ig-feed-7',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 45401,
    impressoes: 45401,
    interacoes: 1038,
    curtidas: 848,
    comentarios: 46,
    compartilhamentos: 66,
    salvos: 32,
    engajamento: 1.95
  },
  {
    id: 'ig-feed-8',
    plataforma: 'Instagram Feed',
    formato: 'Reels',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 132780,
    impressoes: 132780,
    interacoes: 4040,
    curtidas: 2833,
    comentarios: 137,
    compartilhamentos: 808,
    salvos: 154,
    engajamento: 7.60
  },

  // --- INSTAGRAM STORIES (5 posts) ---
  {
    id: 'ig-story-1',
    plataforma: 'Instagram Stories',
    formato: 'Stories',
    data: '2026-09-28',
    dataDisplay: '28/09/2026',
    diaSemana: 'segunda-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 61004,
    impressoes: 80582,
    interacoes: 8943,
    curtidas: 163,
    comentarios: 0,
    respostas: 15,
    compartilhamentos: 17,
    cliquesLink: 8780,
    visitasPerfil: 561,
    navegacoes: 68823,
    engajamento: 14.66
  },
  {
    id: 'ig-story-2',
    plataforma: 'Instagram Stories',
    formato: 'Stories',
    data: '2026-09-29',
    dataDisplay: '29/09/2026',
    diaSemana: 'terça-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 68540,
    impressoes: 85471,
    interacoes: 4275,
    curtidas: 172,
    comentarios: 0,
    respostas: 19,
    compartilhamentos: 13,
    cliquesLink: 4103,
    visitasPerfil: 1384,
    navegacoes: 74288,
    engajamento: 6.24
  },
  {
    id: 'ig-story-3',
    plataforma: 'Instagram Stories',
    formato: 'Stories',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 85385,
    impressoes: 124965,
    interacoes: 20594,
    curtidas: 231,
    comentarios: 0,
    respostas: 34,
    compartilhamentos: 36,
    cliquesLink: 20363,
    visitasPerfil: 936,
    navegacoes: 107676,
    engajamento: 24.12
  },
  {
    id: 'ig-story-4',
    plataforma: 'Instagram Stories',
    formato: 'Stories',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 35010,
    impressoes: 44569,
    interacoes: 183,
    curtidas: 183,
    comentarios: 0,
    respostas: 9,
    compartilhamentos: 82,
    cliquesLink: 0,
    visitasPerfil: 287,
    navegacoes: 39532,
    engajamento: 0.52
  },
  {
    id: 'ig-story-5',
    plataforma: 'Instagram Stories',
    formato: 'Stories',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'Esquenta',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 28292,
    impressoes: 41167,
    interacoes: 5653,
    curtidas: 204,
    comentarios: 0,
    respostas: 11,
    compartilhamentos: 86,
    cliquesLink: 5449,
    visitasPerfil: 515,
    navegacoes: 35216,
    engajamento: 19.98
  },

  // --- FACEBOOK (5 posts) ---
  {
    id: 'fb-1',
    plataforma: 'Facebook',
    tipo: 'Estático',
    formato: 'Imagem Estática',
    data: '2026-09-28',
    dataDisplay: '28/09/2026',
    diaSemana: 'segunda-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 4430,
    impressoes: 4430,
    interacoes: 33,
    curtidas: 33,
    comentarios: 0,
    compartilhamentos: 0,
    engajamento: 2.39
  },
  {
    id: 'fb-2',
    plataforma: 'Facebook',
    tipo: 'Estático',
    formato: 'Imagem Estática',
    data: '2026-09-28',
    dataDisplay: '28/09/2026',
    diaSemana: 'segunda-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 16072,
    impressoes: 16072,
    interacoes: 176,
    curtidas: 158,
    comentarios: 10,
    compartilhamentos: 8,
    engajamento: 1.52,
    link: 'https://facebook.com/photo?fbid=143778804514877'
  },
  {
    id: 'fb-3',
    plataforma: 'Facebook',
    tipo: 'Estático',
    formato: 'Imagem Estática',
    data: '2026-09-29',
    dataDisplay: '29/09/2026',
    diaSemana: 'terça-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 12981,
    impressoes: 12981,
    interacoes: 78,
    curtidas: 65,
    comentarios: 7,
    compartilhamentos: 6,
    engajamento: 0.60
  },
  {
    id: 'fb-4',
    plataforma: 'Facebook',
    tipo: 'Estático',
    formato: 'Imagem Estática',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 15603,
    impressoes: 15603,
    interacoes: 133,
    curtidas: 121,
    comentarios: 8,
    compartilhamentos: 4,
    engajamento: 0.85
  },
  {
    id: 'fb-5',
    plataforma: 'Facebook',
    tipo: 'Estático',
    formato: 'Imagem Estática',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 2473,
    impressoes: 2473,
    interacoes: 17,
    curtidas: 16,
    comentarios: 0,
    compartilhamentos: 1,
    engajamento: 0.69
  },

  // --- TIKTOK (3 posts) ---
  {
    id: 'tt-1',
    plataforma: 'Tiktok',
    tipo: 'Vídeo',
    formato: 'Vídeo Curto',
    data: '2026-09-28',
    dataDisplay: '28/09/2026',
    diaSemana: 'segunda-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 995,
    impressoes: 995, // visualizações
    interacoes: 26,
    curtidas: 25,
    comentarios: 0,
    compartilhamentos: 1,
    engajamento: 2.61,
    link: 'https://tiktok.com'
  },
  {
    id: 'tt-2',
    plataforma: 'Tiktok',
    tipo: 'Vídeo',
    formato: 'Vídeo Curto',
    data: '2026-09-29',
    dataDisplay: '29/09/2026',
    diaSemana: 'terça-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 1156,
    impressoes: 1156,
    interacoes: 38,
    curtidas: 38,
    comentarios: 0,
    compartilhamentos: 0,
    engajamento: 3.29
  },
  {
    id: 'tt-3',
    plataforma: 'Tiktok',
    tipo: 'Vídeo',
    formato: 'Vídeo Curto',
    data: '2026-09-30',
    dataDisplay: '30/09/2026',
    diaSemana: 'quarta-feira',
    categoria: 'OFERTAS',
    grupo: 'ESQUENTA ANIVERSÁRIO',
    alcance: 3499,
    impressoes: 3499,
    interacoes: 89,
    curtidas: 74,
    comentarios: 3,
    compartilhamentos: 12,
    engajamento: 2.54
  }
];

// Funções de agregação e estatísticas
export function getTotals(posts = CAMPAIGN_POSTS) {
  const alcance = posts.reduce((acc, p) => acc + p.alcance, 0);
  const impressoes = posts.reduce((acc, p) => acc + p.impressoes, 0);
  const interacoes = posts.reduce((acc, p) => acc + p.interacoes, 0);
  const curtidas = posts.reduce((acc, p) => acc + p.curtidas, 0);
  const comentarios = posts.reduce((acc, p) => acc + p.comentarios, 0);
  const compartilhamentos = posts.reduce((acc, p) => acc + p.compartilhamentos, 0);
  const salvos = posts.reduce((acc, p) => acc + (p.salvos || 0), 0);
  const cliquesLink = posts.reduce((acc, p) => acc + (p.cliquesLink || 0), 0);
  
  // ER consolidado sobre alcance
  const erMedio = alcance > 0 ? (interacoes / alcance) * 100 : 0;

  return {
    totalPosts: posts.length,
    alcance,
    impressoes,
    interacoes,
    curtidas,
    comentarios,
    compartilhamentos,
    salvos,
    cliquesLink,
    erMedio
  };
}

export function getPlatformTotals(posts = CAMPAIGN_POSTS) {
  const platforms = ['Instagram Feed', 'Instagram Stories', 'Facebook', 'Tiktok'] as const;
  return platforms.map(plat => {
    const list = posts.filter(p => p.plataforma === plat);
    const alcance = list.reduce((a, b) => a + b.alcance, 0);
    const impressoes = list.reduce((a, b) => a + b.impressoes, 0);
    const interacoes = list.reduce((a, b) => a + b.interacoes, 0);
    const er = alcance > 0 ? (interacoes / alcance) * 100 : 0;
    return {
      plataforma: plat,
      postsCount: list.length,
      alcance,
      impressoes,
      interacoes,
      er
    };
  });
}
