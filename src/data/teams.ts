import type { Sticker, Team } from '../types'

const flagImageBaseUrl = 'https://images.emojiterra.com/twitter/v14.0/512px'

const flagImageCodes: Record<string, string> = {
  mex: '1f1f2-1f1fd',
  rsa: '1f1ff-1f1e6',
  kor: '1f1f0-1f1f7',
  cze: '1f1e8-1f1ff',
  can: '1f1e8-1f1e6',
  bih: '1f1e7-1f1e6',
  qat: '1f1f6-1f1e6',
  sui: '1f1e8-1f1ed',
  bra: '1f1e7-1f1f7',
  mar: '1f1f2-1f1e6',
  hai: '1f1ed-1f1f9',
  sco: '1f3f4-e0067-e0062-e0073-e0063-e0074-e007f',
  usa: '1f1fa-1f1f8',
  par: '1f1f5-1f1fe',
  aus: '1f1e6-1f1fa',
  tur: '1f1f9-1f1f7',
  ger: '1f1e9-1f1ea',
  cuw: '1f1e8-1f1fc',
  civ: '1f1e8-1f1ee',
  ecu: '1f1ea-1f1e8',
  ned: '1f1f3-1f1f1',
  jpn: '1f1ef-1f1f5',
  swe: '1f1f8-1f1ea',
  tun: '1f1f9-1f1f3',
  bel: '1f1e7-1f1ea',
  egy: '1f1ea-1f1ec',
  irn: '1f1ee-1f1f7',
  nzl: '1f1f3-1f1ff',
  esp: '1f1ea-1f1f8',
  cpv: '1f1e8-1f1fb',
  ksa: '1f1f8-1f1e6',
  uru: '1f1fa-1f1fe',
  fra: '1f1eb-1f1f7',
  sen: '1f1f8-1f1f3',
  irq: '1f1ee-1f1f6',
  nor: '1f1f3-1f1f4',
  arg: '1f1e6-1f1f7',
  alg: '1f1e9-1f1ff',
  aut: '1f1e6-1f1f9',
  jor: '1f1ef-1f1f4',
  por: '1f1f5-1f1f9',
  cod: '1f1e8-1f1e9',
  uzb: '1f1fa-1f1ff',
  col: '1f1e8-1f1f4',
  eng: '1f3f4-e0067-e0062-e0065-e006e-e0067-e007f',
  cro: '1f1ed-1f1f7',
  gha: '1f1ec-1f1ed',
  pan: '1f1f5-1f1e6',
}

export const groupLetters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
] as const

const baseTeams: Omit<Team, 'flagUrl'>[] = [
  { id: 'mex', group: 'A', displayNumber: 8, code: 'MEX', name: 'Mexico', emoji: '🇲🇽', sortOrder: 1 },
  { id: 'rsa', group: 'A', displayNumber: 10, code: 'RSA', name: 'South Africa', emoji: '🇿🇦', sortOrder: 2 },
  { id: 'kor', group: 'A', displayNumber: 12, code: 'KOR', name: 'Korea Republic', emoji: '🇰🇷', sortOrder: 3 },
  { id: 'cze', group: 'A', displayNumber: 14, code: 'CZE', name: 'Czechia', emoji: '🇨🇿', sortOrder: 4 },

  { id: 'can', group: 'B', displayNumber: 16, code: 'CAN', name: 'Canada', emoji: '🇨🇦', sortOrder: 5 },
  { id: 'bih', group: 'B', displayNumber: 18, code: 'BIH', name: 'Bosnia-Herzegovina', emoji: '🇧🇦', sortOrder: 6 },
  { id: 'qat', group: 'B', displayNumber: 20, code: 'QAT', name: 'Qatar', emoji: '🇶🇦', sortOrder: 7 },
  { id: 'sui', group: 'B', displayNumber: 22, code: 'SUI', name: 'Switzerland', emoji: '🇨🇭', sortOrder: 8 },

  { id: 'bra', group: 'C', displayNumber: 24, code: 'BRA', name: 'Brazil', emoji: '🇧🇷', sortOrder: 9 },
  { id: 'mar', group: 'C', displayNumber: 26, code: 'MAR', name: 'Morocco', emoji: '🇲🇦', sortOrder: 10 },
  { id: 'hai', group: 'C', displayNumber: 28, code: 'HAI', name: 'Haiti', emoji: '🇭🇹', sortOrder: 11 },
  { id: 'sco', group: 'C', displayNumber: 30, code: 'SCO', name: 'Scotland', emoji: '🏴', sortOrder: 12 },

  { id: 'usa', group: 'D', displayNumber: 32, code: 'USA', name: 'USA', emoji: '🇺🇸', sortOrder: 13 },
  { id: 'par', group: 'D', displayNumber: 34, code: 'PAR', name: 'Paraguay', emoji: '🇵🇾', sortOrder: 14 },
  { id: 'aus', group: 'D', displayNumber: 36, code: 'AUS', name: 'Australia', emoji: '🇦🇺', sortOrder: 15 },
  { id: 'tur', group: 'D', displayNumber: 38, code: 'TUR', name: 'Türkiye', emoji: '🇹🇷', sortOrder: 16 },

  { id: 'ger', group: 'E', displayNumber: 40, code: 'GER', name: 'Germany', emoji: '🇩🇪', sortOrder: 17 },
  { id: 'cuw', group: 'E', displayNumber: 42, code: 'CUW', name: 'Curaçao', emoji: '🇨🇼', sortOrder: 18 },
  { id: 'civ', group: 'E', displayNumber: 44, code: 'CIV', name: "Côte d'Ivoire", emoji: '🇨🇮', sortOrder: 19 },
  { id: 'ecu', group: 'E', displayNumber: 46, code: 'ECU', name: 'Ecuador', emoji: '🇪🇨', sortOrder: 20 },

  { id: 'ned', group: 'F', displayNumber: 48, code: 'NED', name: 'Netherlands', emoji: '🇳🇱', sortOrder: 21 },
  { id: 'jpn', group: 'F', displayNumber: 50, code: 'JPN', name: 'Japan', emoji: '🇯🇵', sortOrder: 22 },
  { id: 'swe', group: 'F', displayNumber: 52, code: 'SWE', name: 'Sweden', emoji: '🇸🇪', sortOrder: 23 },
  { id: 'tun', group: 'F', displayNumber: 54, code: 'TUN', name: 'Tunisia', emoji: '🇹🇳', sortOrder: 24 },

  { id: 'bel', group: 'G', displayNumber: 58, code: 'BEL', name: 'Belgium', emoji: '🇧🇪', sortOrder: 25 },
  { id: 'egy', group: 'G', displayNumber: 60, code: 'EGY', name: 'Egypt', emoji: '🇪🇬', sortOrder: 26 },
  { id: 'irn', group: 'G', displayNumber: 62, code: 'IRN', name: 'IR Iran', emoji: '🇮🇷', sortOrder: 27 },
  { id: 'nzl', group: 'G', displayNumber: 64, code: 'NZL', name: 'New Zealand', emoji: '🇳🇿', sortOrder: 28 },

  { id: 'esp', group: 'H', displayNumber: 66, code: 'ESP', name: 'Spain', emoji: '🇪🇸', sortOrder: 29 },
  { id: 'cpv', group: 'H', displayNumber: 68, code: 'CPV', name: 'Cabo Verde', emoji: '🇨🇻', sortOrder: 30 },
  { id: 'ksa', group: 'H', displayNumber: 70, code: 'KSA', name: 'Saudi Arabia', emoji: '🇸🇦', sortOrder: 31 },
  { id: 'uru', group: 'H', displayNumber: 72, code: 'URU', name: 'Uruguay', emoji: '🇺🇾', sortOrder: 32 },

  { id: 'fra', group: 'I', displayNumber: 74, code: 'FRA', name: 'France', emoji: '🇫🇷', sortOrder: 33 },
  { id: 'sen', group: 'I', displayNumber: 76, code: 'SEN', name: 'Senegal', emoji: '🇸🇳', sortOrder: 34 },
  { id: 'irq', group: 'I', displayNumber: 78, code: 'IRQ', name: 'Iraq', emoji: '🇮🇶', sortOrder: 35 },
  { id: 'nor', group: 'I', displayNumber: 80, code: 'NOR', name: 'Norway', emoji: '🇳🇴', sortOrder: 36 },

  { id: 'arg', group: 'J', displayNumber: 82, code: 'ARG', name: 'Argentina', emoji: '🇦🇷', sortOrder: 37 },
  { id: 'alg', group: 'J', displayNumber: 84, code: 'ALG', name: 'Algeria', emoji: '🇩🇿', sortOrder: 38 },
  { id: 'aut', group: 'J', displayNumber: 86, code: 'AUT', name: 'Austria', emoji: '🇦🇹', sortOrder: 39 },
  { id: 'jor', group: 'J', displayNumber: 88, code: 'JOR', name: 'Jordan', emoji: '🇯🇴', sortOrder: 40 },

  { id: 'por', group: 'K', displayNumber: 90, code: 'POR', name: 'Portugal', emoji: '🇵🇹', sortOrder: 41 },
  { id: 'cod', group: 'K', displayNumber: 92, code: 'COD', name: 'Congo DR', emoji: '🇨🇩', sortOrder: 42 },
  { id: 'uzb', group: 'K', displayNumber: 94, code: 'UZB', name: 'Uzbekistan', emoji: '🇺🇿', sortOrder: 43 },
  { id: 'col', group: 'K', displayNumber: 96, code: 'COL', name: 'Colombia', emoji: '🇨🇴', sortOrder: 44 },

  { id: 'eng', group: 'L', displayNumber: 98, code: 'ENG', name: 'England', emoji: '🏴', sortOrder: 45 },
  { id: 'cro', group: 'L', displayNumber: 100, code: 'CRO', name: 'Croatia', emoji: '🇭🇷', sortOrder: 46 },
  { id: 'gha', group: 'L', displayNumber: 102, code: 'GHA', name: 'Ghana', emoji: '🇬🇭', sortOrder: 47 },
  { id: 'pan', group: 'L', displayNumber: 104, code: 'PAN', name: 'Panama', emoji: '🇵🇦', sortOrder: 48 },
]

export const teams: Team[] = baseTeams.map((team) => ({
  ...team,
  flagUrl: `${flagImageBaseUrl}/${flagImageCodes[team.id]}.png`,
}))

export function getStickers(): Sticker[] {
  const stickers: Sticker[] = [
    {
      key: 'time',
      type: 'team',
      number: null,
      title: 'Figurinha do Time',
      code: 'TIME',
    },
  ]

  for (let i = 1; i <= 20; i += 1) {
    stickers.push({
      key: String(i),
      type: 'player',
      number: i,
      title: `Figurinha ${i}`,
      code: `FIG-${String(i).padStart(2, '0')}`,
    })
  }

  return stickers
}
