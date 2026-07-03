import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { skillMarketApi } from '../api/skillMarket'
import { useSettingsStore } from '../stores/settingsStore'
import { useSkillMarketStore } from '../stores/skillMarketStore'
import { useSkillStore } from '../stores/skillStore'
import type { SkillMarketDetail, SkillMarketItem } from '../types/skillMarket'
import { SkillCenter } from './SkillCenter'

vi.mock('../api/skillMarket', () => ({
  skillMarketApi: {
    list: vi.fn(),
    detail: vi.fn(),
    install: vi.fn(),
  },
}))

vi.mock('../components/skills/SkillList', () => ({
  SkillList: () => <div data-testid="installed-skill-list">Installed skills</div>,
}))

vi.mock('../components/markdown/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown-renderer">{content}</div>
  ),
}))

vi.mock('../components/chat/CodeViewer', () => ({
  CodeViewer: ({ code }: { code: string }) => <div data-testid="code-viewer">{code}</div>,
}))

const mockedSkillMarketApi = vi.mocked(skillMarketApi)

function makeItem(overrides: Partial<SkillMarketItem> = {}): SkillMarketItem {
  return {
    source: 'clawhub',
    sourceMode: 'primary',
    slug: 'ppt-generator',
    displayName: 'PPT Generator',
    summary: 'Create presentation decks from structured prompts.',
    owner: 'OpenClaw',
    canonicalUrl: 'https://clawhub.ai/skills/ppt-generator',
    upstreamUrl: 'https://github.com/example/ppt-generator',
    license: 'MIT',
    version: '1.0.0',
    downloads: 42000,
    stars: 128,
    trustState: 'clean',
    installed: false,
    ...overrides,
  }
}

function makeDetail(overrides: Partial<SkillMarketDetail> = {}): SkillMarketDetail {
  return {
    ...makeItem(),
    files: [{ path: 'SKILL.md', size: 512 }],
    filePreviews: [
      {
        path: 'SKILL.md',
        content: '# PPT Generator',
        language: 'markdown',
        size: 512,
      },
    ],
    entryPreview: '# PPT Generator',
    riskLabels: [],
    installEligibility: { status: 'installable' },
    ...overrides,
  }
}

describe('SkillCenter', () => {
  beforeEach(() => {
    useSettingsStore.setState({ locale: 'en' })
    useSkillMarketStore.setState({
      items: [],
      nextCursor: null,
      selectedDetail: null,
      source: 'auto',
      resolvedSource: null,
      sourceStatus: null,
      statusMessage: null,
      sort: 'downloads',
      query: '',
      isLoading: false,
      isLoadingMore: false,
      isDetailLoading: false,
      isInstalling: false,
      error: null,
    })
    useSkillStore.setState({
      skills: [],
      selectedSkill: null,
      selectedSkillReturnTab: 'skills',
      isLoading: false,
      isDetailLoading: false,
      error: null,
      fetchSkills: vi.fn(),
      fetchSkillDetail: vi.fn(),
      clearSelection: vi.fn(() => useSkillStore.setState({ selectedSkill: null })),
    })
    mockedSkillMarketApi.list.mockResolvedValue({
      items: [makeItem()],
      nextCursor: null,
      source: 'clawhub',
      sourceStatus: 'ok',
    })
    mockedSkillMarketApi.detail.mockResolvedValue({ detail: makeDetail() })
    mockedSkillMarketApi.install.mockResolvedValue({
      installed: true,
      skillName: 'ppt-generator',
      targetPath: '/Users/nanmi/.claude/skills/ppt-generator',
    })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    useSettingsStore.setState({ locale: 'en' })
    useSkillMarketStore.setState({
      items: [],
      nextCursor: null,
      selectedDetail: null,
      source: 'auto',
      resolvedSource: null,
      sourceStatus: null,
      statusMessage: null,
      sort: 'downloads',
      query: '',
      isLoading: false,
      isLoadingMore: false,
      isDetailLoading: false,
      isInstalling: false,
      error: null,
    })
    useSkillStore.setState({
      skills: [],
      selectedSkill: null,
      selectedSkillReturnTab: 'skills',
      isLoading: false,
      isDetailLoading: false,
      error: null,
    })
  })

  it('loads marketplace cards and opens a detail confirmation panel', async () => {
    const { container } = render(<SkillCenter />)

    expect(screen.getByRole('tab', { name: 'Marketplace' })).toHaveAttribute('aria-selected', 'true')
    expect(await screen.findByRole('button', { name: 'PPT Generator' })).toBeInTheDocument()
    expect(mockedSkillMarketApi.list).toHaveBeenCalledWith({
      source: 'auto',
      sort: 'downloads',
      q: undefined,
      limit: 100,
    })

    fireEvent.click(screen.getByRole('button', { name: 'PPT Generator' }))

    await waitFor(() => {
      expect(mockedSkillMarketApi.detail).toHaveBeenCalledWith('clawhub', 'ppt-generator')
    })
    const detail = await screen.findByText('# PPT Generator')
    expect(detail).toBeInTheDocument()
    const dialog = screen.getByRole('dialog', { name: 'PPT Generator' })
    const detailLayer = screen.getByTestId('skill-market-detail-layer')
    expect(container.contains(dialog)).toBe(false)
    expect(document.body.contains(dialog)).toBe(true)
    expect(detailLayer).toHaveClass('fixed', 'inset-0', 'z-50')
    expect(screen.getByRole('button', { name: 'Install' })).toBeEnabled()
    expect(screen.getByText('Open upstream')).toHaveAttribute('href', 'https://github.com/example/ppt-generator')
    expect(screen.getByText('File preview')).toBeInTheDocument()
    expect(screen.getByText('SKILL.md')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Install' }))
    expect(mockedSkillMarketApi.install).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: 'Confirm skill install' })).toBeInTheDocument()
    expect(screen.getByText('~/.claude/skills/ppt-generator')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Install skill' }))
    await waitFor(() => {
      expect(mockedSkillMarketApi.install).toHaveBeenCalledWith('clawhub', 'ppt-generator', '1.0.0')
    })
  })

  it('renders raw Markdown and Python previews for an uninstalled marketplace skill', async () => {
    mockedSkillMarketApi.detail.mockResolvedValue({
      detail: makeDetail({
        files: [
          { path: 'SKILL.md', size: 256, contentType: 'text/markdown' },
          { path: 'scripts/audit.py', size: 42, contentType: 'text/x-python' },
        ],
        filePreviews: [
          {
            path: 'SKILL.md',
            content: '# Audit Skill\n\nUse this before install.',
            language: 'markdown',
            size: 256,
          },
          {
            path: 'scripts/audit.py',
            content: 'print("audit")\n',
            language: 'python',
            size: 42,
          },
        ],
        entryPreview: '# Audit Skill',
        riskLabels: ['scripts', 'executables'],
      }),
    })

    render(<SkillCenter />)
    fireEvent.click(await screen.findByRole('button', { name: 'PPT Generator' }))

    expect(await screen.findByText('File preview')).toBeInTheDocument()
    expect(screen.getByText('scripts/audit.py')).toBeInTheDocument()
    expect(screen.getByText('python')).toBeInTheDocument()
    expect(screen.getByText(/print\("audit"\)/)).toBeInTheDocument()
    expect(screen.getByText('Scripts')).toBeInTheDocument()
    expect(screen.getByText('Executables')).toBeInTheDocument()
  })

  it('explains when marketplace file preview is unavailable', async () => {
    mockedSkillMarketApi.detail.mockResolvedValue({
      detail: makeDetail({
        source: 'skillhub',
        sourceMode: 'fallback',
        filePreviews: [],
        entryPreview: undefined,
        previewUnavailableReason: 'SkillHub does not expose a safe raw file preview endpoint yet.',
      }),
    })

    render(<SkillCenter />)
    fireEvent.click(await screen.findByRole('button', { name: 'PPT Generator' }))

    expect(await screen.findByText('Preview unavailable')).toBeInTheDocument()
    expect(screen.getByText('SkillHub does not expose a safe raw file preview endpoint yet.')).toBeInTheDocument()
  })

  it('shows marketplace source fallback status without losing the selected source control', async () => {
    mockedSkillMarketApi.list.mockResolvedValue({
      items: [makeItem({ source: 'skillhub', sourceMode: 'fallback' })],
      nextCursor: null,
      source: 'skillhub',
      sourceStatus: 'fallback',
      message: 'ClawHub unavailable, using SkillHub.',
    })

    render(<SkillCenter />)

    expect(await screen.findByText('ClawHub unavailable, using SkillHub.')).toBeInTheDocument()
    expect(screen.getByText('Fallback active')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Auto' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('replaces raw network failures with a user-facing marketplace error', async () => {
    mockedSkillMarketApi.list.mockRejectedValue(new Error('Failed to fetch'))

    render(<SkillCenter />)

    expect(await screen.findByText('Marketplace unavailable')).toBeInTheDocument()
    expect(screen.getByText(/could not be reached/)).toBeInTheDocument()
    expect(screen.queryByText('Failed to fetch')).not.toBeInTheDocument()
  })

  it('opens the installed skill detail from an installed marketplace item', async () => {
    const fetchSkillDetail = vi.fn()
    useSkillStore.setState({
      skills: [
        {
          name: 'ppt-generator',
          displayName: 'PPT Generator',
          description: 'Installed local skill',
          source: 'user',
          userInvocable: true,
          contentLength: 80,
          hasDirectory: true,
        },
      ],
      fetchSkillDetail,
    })
    mockedSkillMarketApi.detail.mockResolvedValue({
      detail: makeDetail({
        installed: true,
        installEligibility: { status: 'installed', installedSkillName: 'ppt-generator' },
      }),
    })
    render(<SkillCenter />)

    fireEvent.click(await screen.findByRole('button', { name: 'PPT Generator' }))
    const viewInstalledButton = await screen.findByRole('button', { name: 'View installed' })
    expect(viewInstalledButton).toHaveClass('bg-[var(--color-success-container)]')
    fireEvent.click(viewInstalledButton)

    expect(screen.getByRole('tab', { name: 'Mine' })).toHaveAttribute('aria-selected', 'true')
    expect(fetchSkillDetail).toHaveBeenCalledWith('user', 'ppt-generator', undefined, 'skills')
  })

  it('submits market searches without auto-searching every keystroke', async () => {
    render(<SkillCenter />)
    await screen.findByRole('button', { name: 'PPT Generator' })
    mockedSkillMarketApi.list.mockClear()

    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: '  ppt  ' },
    })
    expect(mockedSkillMarketApi.list).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Run search' }))

    await waitFor(() => {
      expect(mockedSkillMarketApi.list).toHaveBeenCalledWith({
        source: 'auto',
        sort: 'downloads',
        q: 'ppt',
        limit: 100,
      })
    })
  })

  it('marks blocked marketplace details as not installable', async () => {
    mockedSkillMarketApi.detail.mockResolvedValue({
      detail: makeDetail({
        trustState: 'blocked',
        riskLabels: ['scripts'],
        installEligibility: { status: 'blocked', reason: 'Risky script detected.' },
      }),
    })
    render(<SkillCenter />)

    fireEvent.click(await screen.findByRole('button', { name: 'PPT Generator' }))

    const detailPanel = await screen.findByText('Risk signals')
    expect(detailPanel).toBeInTheDocument()
    expect(screen.getByText('Scripts')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Blocked' })).toBeDisabled()
  })

  it('switches to the installed skills tab', async () => {
    render(<SkillCenter />)
    await screen.findByRole('button', { name: 'PPT Generator' })

    fireEvent.click(screen.getByRole('tab', { name: 'Mine' }))

    expect(screen.getByTestId('installed-skill-list')).toBeInTheDocument()
    expect(within(screen.getByTestId('skill-mine-tab')).getByTestId('installed-skill-list')).toBeInTheDocument()
  })

  it('opens the mine tab when an installed skill detail is already selected', async () => {
    useSkillStore.setState({
      selectedSkill: {
        meta: {
          name: 'local-ppt',
          displayName: 'Local PPT',
          description: 'Installed local skill',
          source: 'user',
          userInvocable: true,
          contentLength: 80,
          hasDirectory: true,
        },
        tree: [{ name: 'SKILL.md', path: 'SKILL.md', type: 'file' }],
        files: [
          {
            path: 'SKILL.md',
            content: '# Local PPT',
            body: '# Local PPT',
            language: 'markdown',
            isEntry: true,
          },
        ],
        skillRoot: '/tmp/local-ppt',
      },
    })

    render(<SkillCenter />)

    expect(await screen.findByText('Local PPT')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Mine' })).toHaveAttribute('aria-selected', 'true')
    expect(mockedSkillMarketApi.list).not.toHaveBeenCalled()
  })
})
