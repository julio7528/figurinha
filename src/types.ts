export type Team = {
  id: string
  group: string
  displayNumber: number
  code: string
  name: string
  emoji: string
  flagUrl: string
  sortOrder: number
}

export type StickerStatus = 'tem' | 'rep' | 'nao'

export type StickerType = 'player'

export type Sticker = {
  key: string
  type: StickerType
  number: number | null
  title: string
  code: string
}

export type TeamFlag = {
  teamId: string
  isFlagged: boolean
}

export type StickerStatusRecord = {
  teamId: string
  stickerKey: string
  stickerType: StickerType
  stickerNumber: number | null
  status: StickerStatus
}

export type FigurinhaActionType = 'team_flag' | 'sticker_status'

export type FigurinhaActionRow = {
  id?: string
  action_key: string
  action_type: FigurinhaActionType
  team_id: string
  is_flagged: boolean | null
  sticker_key: string | null
  sticker_type: StickerType | null
  sticker_number: number | null
  status: StickerStatus | null
  updated_at?: string
}
