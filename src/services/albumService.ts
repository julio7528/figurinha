import { teams } from '../data/teams'
import { getSupabaseClient } from '../supabase'
import type {
  FigurinhaActionRow,
  Sticker,
  StickerStatus,
  StickerStatusRecord,
  Team,
  TeamFlag,
} from '../types'

const TABLE_NAME = 'tbf_figurinha'

function toSupabaseError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message)
  }
}

function flagActionKey(teamId: string): string {
  return `${teamId}:flag`
}

function stickerActionKey(teamId: string, stickerKey: string): string {
  return `${teamId}:sticker:${stickerKey}`
}

export async function loadTeams(): Promise<Team[]> {
  return [...teams].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function loadTeamFlags(): Promise<TeamFlag[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .select('team_id,is_flagged')
    .eq('action_type', 'team_flag')

  toSupabaseError(error)

  return (data ?? [])
    .filter((row) => typeof row.is_flagged === 'boolean')
    .map((row) => ({
      teamId: row.team_id,
      isFlagged: row.is_flagged,
    }))
}

export async function loadStickerStatuses(): Promise<StickerStatusRecord[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .select('team_id,sticker_key,sticker_type,sticker_number,status')
    .eq('action_type', 'sticker_status')

  toSupabaseError(error)

  return (data ?? [])
    .filter((row) => row.sticker_key && row.sticker_type && row.status)
    .map((row) => ({
      teamId: row.team_id,
      stickerKey: row.sticker_key,
      stickerType: row.sticker_type,
      stickerNumber: row.sticker_number,
      status: row.status,
    }))
}

export async function upsertTeamFlag(
  teamId: string,
  isFlagged: boolean,
): Promise<void> {
  const payload: FigurinhaActionRow = {
    action_key: flagActionKey(teamId),
    action_type: 'team_flag',
    team_id: teamId,
    is_flagged: isFlagged,
    sticker_key: null,
    sticker_type: null,
    sticker_number: null,
    status: null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .upsert(payload, { onConflict: 'action_key' })

  toSupabaseError(error)
}

export async function upsertStickerStatus(
  teamId: string,
  sticker: Sticker,
  status: StickerStatus,
): Promise<void> {
  const payload: FigurinhaActionRow = {
    action_key: stickerActionKey(teamId, sticker.key),
    action_type: 'sticker_status',
    team_id: teamId,
    is_flagged: null,
    sticker_key: sticker.key,
    sticker_type: sticker.type,
    sticker_number: sticker.number,
    status,
    updated_at: new Date().toISOString(),
  }

  const { error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .upsert(payload, { onConflict: 'action_key' })

  toSupabaseError(error)
}
