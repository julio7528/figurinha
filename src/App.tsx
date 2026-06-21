import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { getStickers, groupLetters } from './data/teams'
import {
  loadStickerStatuses,
  loadTeamFlags,
  loadTeams,
  upsertStickerStatus,
  upsertTeamFlag,
} from './services/albumService'
import type { Sticker, StickerStatus, Team } from './types'

const TOTAL_STICKERS = 20

type TeamStats = {
  total: number
  tem: number
  rep: number
  nao: number
  marcadas: number
  lists: Record<StickerStatus, string[]>
}

const statusLabels: Record<StickerStatus, string> = {
  tem: 'Tem',
  rep: 'Rep',
  nao: 'Não tem',
}

function statusKey(teamId: string, stickerKey: string): string {
  return `${teamId}:${stickerKey}`
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Não foi possível carregar os dados do painel.'
}

function getStickerSummaryLabel(sticker: Sticker): string {
  return String(sticker.number)
}

function App() {
  const stickers = useMemo(() => getStickers(), [])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const [statuses, setStatuses] = useState<Record<string, StickerStatus>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [isEditEnabled, setIsEditEnabled] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadAlbum() {
      try {
        setLoading(true)
        setError(null)

        const [loadedTeams, loadedFlags, loadedStatuses] = await Promise.all([
          loadTeams(),
          loadTeamFlags(),
          loadStickerStatuses(),
        ])

        if (!isMounted) {
          return
        }

        setTeams(loadedTeams)
        setSelectedTeamId(loadedTeams[0]?.id ?? null)
        setFlags(
          Object.fromEntries(
            loadedFlags.map((flag) => [flag.teamId, flag.isFlagged]),
          ),
        )
        setStatuses(
          Object.fromEntries(
            loadedStatuses.map((record) => [
              statusKey(record.teamId, record.stickerKey),
              record.status,
            ]),
          ),
        )
      } catch (loadError) {
        if (isMounted) {
          const fallbackTeams = await loadTeams()
          setTeams(fallbackTeams)
          setSelectedTeamId((current) => current ?? fallbackTeams[0]?.id ?? null)
          setError(getErrorMessage(loadError))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAlbum()

    return () => {
      isMounted = false
    }
  }, [])

  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTeamId) ?? teams[0] ?? null,
    [selectedTeamId, teams],
  )

  const filteredTeams = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return teams
    }

    return teams.filter((team) => {
      const fields = [
        team.name,
        team.code,
        team.group,
        `grupo ${team.group}`,
        String(team.displayNumber),
        `${team.displayNumber} | ${team.code}`,
      ]

      return fields.some((field) =>
        field.toLowerCase().includes(normalizedSearch),
      )
    })
  }, [searchTerm, teams])

  function getTeamStats(teamId: string): TeamStats {
    const summary = stickers.reduce(
      (acc, sticker) => {
        const currentStatus = statuses[statusKey(teamId, sticker.key)] ?? 'nao'
        acc.totals[currentStatus] += 1
        acc.lists[currentStatus].push(getStickerSummaryLabel(sticker))
        return acc
      },
      {
        totals: { tem: 0, rep: 0, nao: 0 },
        lists: { tem: [], rep: [], nao: [] },
      } as {
        totals: Record<StickerStatus, number>
        lists: Record<StickerStatus, string[]>
      },
    )

    return {
      total: TOTAL_STICKERS,
      tem: summary.totals.tem,
      rep: summary.totals.rep,
      nao: summary.totals.nao,
      marcadas: summary.totals.tem + summary.totals.rep,
      lists: summary.lists,
    }
  }

  async function handleToggleFlag(teamId: string) {
    if (!isEditEnabled) {
      return
    }

    const previousFlag = flags[teamId] ?? false
    const nextFlag = !previousFlag

    setFlags((current) => ({ ...current, [teamId]: nextFlag }))
    setSavingKey(`${teamId}:flag`)
    setError(null)

    try {
      await upsertTeamFlag(teamId, nextFlag)
    } catch (saveError) {
      setFlags((current) => ({ ...current, [teamId]: previousFlag }))
      setError(getErrorMessage(saveError))
    } finally {
      setSavingKey(null)
    }
  }

  async function handleStatusChange(
    teamId: string,
    sticker: Sticker,
    status: StickerStatus,
  ) {
    if (!isEditEnabled) {
      return
    }

    const key = statusKey(teamId, sticker.key)
    const previousStatus = statuses[key]

    setStatuses((current) => ({ ...current, [key]: status }))
    setSavingKey(key)
    setError(null)

    try {
      await upsertStickerStatus(teamId, sticker, status)
    } catch (saveError) {
      setStatuses((current) => {
        const next = { ...current }

        if (previousStatus) {
          next[key] = previousStatus
        } else {
          delete next[key]
        }

        return next
      })
      setError(getErrorMessage(saveError))
    } finally {
      setSavingKey(null)
    }
  }

  const selectedStats = selectedTeam ? getTeamStats(selectedTeam.id) : null

  return (
    <div className={`app${isEditEnabled ? ' is-editing' : ' is-edit-locked'}`}>
      <header className="app-header">
        <div>
          <p className="app-kicker">MVP sem login</p>
          <div className="app-title-row">
            <h1>Painel de Controle de Figurinhas da Copa</h1>
            <div className="edit-controls">
              <span
                className={`edit-status${isEditEnabled ? ' is-enabled' : ''}`}
              >
                {isEditEnabled ? 'Edição liberada' : 'Bloqueado'}
              </span>
              <button
                className={`edit-toggle-button${
                  isEditEnabled ? ' is-enabled' : ''
                }`}
                type="button"
                aria-pressed={isEditEnabled}
                onClick={() => setIsEditEnabled((current) => !current)}
              >
                {isEditEnabled ? 'Bloquear edição' : 'Habilitar edição'}
              </button>
            </div>
          </div>
          <p>
            Selecione uma seleção, marque as figurinhas e acompanhe os totais
            salvos no Supabase.
          </p>
        </div>
      </header>

      {error && (
        <div className="app-alert" role="alert">
          {error}
        </div>
      )}

      <main className="app-shell">
        <aside className="sidebar" aria-label="Seleções">
          <label className="search-label" htmlFor="team-search">
            Buscar seleção
          </label>
          <input
            id="team-search"
            className="team-search"
            type="search"
            placeholder="mex, Grupo A, BRA, 24..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="team-groups">
            {groupLetters.map((group) => {
              const groupTeams = filteredTeams.filter(
                (team) => team.group === group,
              )

              if (searchTerm && groupTeams.length === 0) {
                return null
              }

              return (
                <section className="team-group" key={group}>
                  <h2>Grupo {group}</h2>
                  <div className="team-list">
                    {groupTeams.map((team) => {
                      const stats = getTeamStats(team.id)
                      const isActive = team.id === selectedTeam?.id
                      const isFlagged = flags[team.id] ?? false

                      return (
                        <button
                          className={`team-button${isActive ? ' is-active' : ''}`}
                          key={team.id}
                          type="button"
                          onClick={() => setSelectedTeamId(team.id)}
                        >
                          <img
                            className="team-flag"
                            src={team.flagUrl}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            width="28"
                            height="28"
                          />
                          <span className="team-copy">
                            <span className="team-code">
                              {team.displayNumber} | {team.code}
                            </span>
                            <span className="team-name">{team.name}</span>
                            <span className="team-progress">
                              {stats.marcadas}/{stats.total} marcadas
                            </span>
                          </span>
                          {isFlagged && (
                            <span className="team-star" aria-label="Flagada">
                              ★
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </aside>

        <section className="workspace" aria-label="Controle de figurinhas">
          {loading && <div className="empty-state">Carregando painel...</div>}

          {!loading && selectedTeam && selectedStats && (
            <>
              <div className="team-header">
                <div>
                  <div className="selected-team-line">
                    <img
                      className="selected-team-flag"
                      src={selectedTeam.flagUrl}
                      alt=""
                      aria-hidden="true"
                      width="42"
                      height="42"
                    />
                    <h2>
                      {selectedTeam.displayNumber} | {selectedTeam.code} -{' '}
                      {selectedTeam.name}
                    </h2>
                  </div>
                  <p>
                    Grupo {selectedTeam.group} · Controle das figurinhas desta
                    seleção
                  </p>
                </div>

                <button
                  className={`flag-button${
                    flags[selectedTeam.id] ? ' is-flagged' : ''
                  }`}
                  type="button"
                  onClick={() => handleToggleFlag(selectedTeam.id)}
                  disabled={
                    !isEditEnabled || savingKey === `${selectedTeam.id}:flag`
                  }
                >
                  {flags[selectedTeam.id] ? 'Seleção flagada' : 'Flagar seleção'}
                </button>
              </div>

              <div className="stats-grid" aria-label="Estatísticas">
                <div className="stat-card stat-card-total">
                  <span>Total</span>
                  <strong>{selectedStats.total}</strong>
                  <p>figurinhas</p>
                </div>
                <div className="stat-card stat-card-list">
                  <div className="stat-card-heading">
                    <span>Tenho</span>
                    <strong>{selectedStats.tem}</strong>
                  </div>
                  <p>{selectedStats.lists.tem.join(', ') || 'Nenhuma'}</p>
                </div>
                <div className="stat-card stat-card-list">
                  <div className="stat-card-heading">
                    <span>Repetidas</span>
                    <strong>{selectedStats.rep}</strong>
                  </div>
                  <p>{selectedStats.lists.rep.join(', ') || 'Nenhuma'}</p>
                </div>
                <div className="stat-card stat-card-list">
                  <div className="stat-card-heading">
                    <span>Não tenho</span>
                    <strong>{selectedStats.nao}</strong>
                  </div>
                  <p>{selectedStats.lists.nao.join(', ') || 'Nenhuma'}</p>
                </div>
              </div>

              <div className="sticker-grid">
                {stickers.map((sticker) => {
                  const key = statusKey(selectedTeam.id, sticker.key)
                  const activeStatus = statuses[key] ?? 'nao'

                  return (
                    <article className="sticker-card" key={sticker.key}>
                      <div>
                        <h3>{sticker.title}</h3>
                        <p>Código: {sticker.code}</p>
                      </div>

                      <div className="status-actions">
                        {(Object.keys(statusLabels) as StickerStatus[]).map(
                          (status) => (
                            <button
                              className={`status-button status-${status}${
                                activeStatus === status ? ' is-active' : ''
                              }`}
                              key={status}
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  selectedTeam.id,
                                  sticker,
                                  status,
                                )
                              }
                              disabled={!isEditEnabled || savingKey === key}
                            >
                              {statusLabels[status]}
                            </button>
                          ),
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}

          {!loading && !selectedTeam && (
            <div className="empty-state">
              Nenhuma seleção encontrada para a busca atual.
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
