import type { SkillMarketDetail, SkillMarketFile, SkillMarketItem, SkillMarketListResult, SkillMarketTrustState } from './types.js'

type ClawHubListResponse = {
  items?: Array<{
    slug?: string
    displayName?: string
    summary?: string
    description?: string | null
    topics?: string[]
    tags?: { latest?: string } | null
    stats?: { downloads?: number; installs?: number; stars?: number }
    latestVersion?: { version?: string; license?: string | null } | null
  }>
  nextCursor?: string | null
}

type ClawHubDetailResponse = {
  skill?: {
    slug?: string
    displayName?: string
    summary?: string
    description?: string | null
    topics?: string[]
    tags?: { latest?: string } | null
    stats?: { downloads?: number; installs?: number; stars?: number }
  }
  latestVersion?: { version?: string; license?: string | null } | null
  owner?: { handle?: string; displayName?: string }
}

type ClawHubScanResponse = {
  status?: string
  hasWarnings?: boolean
  sha256?: string
  sha256hash?: string
  hasScanResult?: boolean
  scanners?: Record<string, { status?: string; normalizedStatus?: string; summary?: string; analysis?: string }>
  security?: {
    status?: string
    hasWarnings?: boolean
    sha256?: string
    sha256hash?: string
    hasScanResult?: boolean
    scanners?: Record<string, { status?: string; normalizedStatus?: string; summary?: string; analysis?: string }>
  }
}

type ClawHubVersionResponse = {
  version?: {
    files?: Array<{
      path?: string
      size?: number
      sha256?: string
      contentType?: string | null
    }>
  } | null
}

const CLAWHUB_DETAIL_INSTALLABLE_TRUST_STATES = new Set<SkillMarketTrustState>([
  'clean',
  'benign',
  'signed',
  'official',
])

export function normalizeClawHubList(payload: ClawHubListResponse): SkillMarketListResult {
  const items = (payload.items ?? [])
    .filter((item) => item.slug && item.displayName)
    .map((item): SkillMarketItem => ({
      source: 'clawhub',
      sourceMode: 'primary',
      slug: item.slug!,
      displayName: item.displayName!,
      summary: item.summary || item.description || '',
      owner: undefined,
      canonicalUrl: `https://clawhub.ai/${item.slug}`,
      license: item.latestVersion?.license ?? null,
      version: item.latestVersion?.version ?? item.tags?.latest,
      downloads: item.stats?.downloads,
      installs: item.stats?.installs,
      stars: item.stats?.stars,
      tags: item.topics,
      requiresApiKey: false,
      trustState: 'clean',
      installed: false,
    }))

  return {
    items,
    nextCursor: payload.nextCursor ?? null,
    source: 'clawhub',
    sourceStatus: 'ok',
  }
}

export function normalizeClawHubDetail(
  payload: ClawHubDetailResponse,
  scanPayload: ClawHubScanResponse,
  options: { installed?: boolean } = {},
): SkillMarketDetail | null {
  const skill = payload.skill ?? {}
  const slug = skill.slug
  if (!slug) {
    return null
  }

  const trust = normalizeClawHubScan(scanPayload)
  const installed = options.installed ?? false
  const entryPreview = skill.description ?? undefined

  return {
    source: 'clawhub',
    sourceMode: 'primary',
    slug,
    displayName: skill.displayName || slug,
    summary: skill.summary || skill.description || '',
    owner: payload.owner?.handle || payload.owner?.displayName,
    canonicalUrl: clawHubCanonicalUrl(slug, payload.owner?.handle),
    license: payload.latestVersion?.license ?? null,
    version: payload.latestVersion?.version ?? skill.tags?.latest,
    downloads: skill.stats?.downloads,
    installs: skill.stats?.installs,
    stars: skill.stats?.stars,
    tags: skill.topics,
    requiresApiKey: false,
    trustState: trust.trustState,
    trustSummary: trust.trustSummary,
    installed,
    files: entryPreview ? [{ path: 'SKILL.md' }] : [],
    entryPreview,
    riskLabels: [],
    installEligibility: installed
      ? { status: 'installed', installedSkillName: slug }
      : installEligibilityFromTrustState(trust.trustState),
  }
}

export function normalizeClawHubVersionFiles(payload: ClawHubVersionResponse): SkillMarketFile[] {
  return (payload.version?.files ?? [])
    .filter((file) => typeof file.path === 'string' && file.path.trim())
    .map((file) => ({
      path: file.path!.trim(),
      size: typeof file.size === 'number' && Number.isFinite(file.size) ? file.size : undefined,
      sha256: typeof file.sha256 === 'string' ? file.sha256 : undefined,
      contentType: typeof file.contentType === 'string' ? file.contentType : file.contentType ?? undefined,
    }))
}

export function normalizeClawHubScan(payload: ClawHubScanResponse): {
  trustState: SkillMarketTrustState
  trustSummary?: string
  packageSha256?: string
} {
  const security = payload.security ?? payload
  const scannerEntries = Object.values(security.scanners ?? {})
  const blockedStatuses = ['malicious', 'blocked']
  const warningStatuses = ['suspicious', 'warning']
  const scannerStatus = (entry: { status?: string; normalizedStatus?: string }) => entry.normalizedStatus || entry.status
  const scannerSummary = scannerEntries.find((entry) => entry.summary)?.summary
  const scannerSummaryForStatuses = (statuses: string[]) =>
    scannerEntries.find((entry) => entry.summary && scannerStatus(entry) && statuses.includes(scannerStatus(entry)!))?.summary
  const hasScannerStatus = (statuses: string[]) =>
    scannerEntries.some((entry) => scannerStatus(entry) && statuses.includes(scannerStatus(entry)!))
  const packageSha256 = security.sha256 ?? security.sha256hash

  if (security.status === 'malicious' || security.status === 'blocked' || hasScannerStatus(blockedStatuses)) {
    return {
      trustState: 'blocked',
      trustSummary: scannerSummaryForStatuses(blockedStatuses),
      packageSha256,
    }
  }
  if (
    security.status === 'suspicious'
    || security.status === 'warning'
    || hasScannerStatus(warningStatuses)
  ) {
    return {
      trustState: 'warning',
      trustSummary: scannerSummaryForStatuses(warningStatuses),
      packageSha256,
    }
  }
  if (security.status === 'clean') {
    return { trustState: 'clean', trustSummary: scannerSummary, packageSha256 }
  }
  if (security.hasWarnings) {
    return {
      trustState: 'warning',
      trustSummary: scannerSummaryForStatuses(warningStatuses),
      packageSha256,
    }
  }
  return {
    trustState: 'unknown',
    trustSummary: undefined,
    packageSha256,
  }
}

function installEligibilityFromTrustState(trustState: SkillMarketTrustState): SkillMarketDetail['installEligibility'] {
  if (CLAWHUB_DETAIL_INSTALLABLE_TRUST_STATES.has(trustState)) {
    return { status: 'installable' }
  }
  if (trustState === 'blocked') {
    return { status: 'blocked', reason: 'ClawHub security scan blocked this skill.' }
  }
  if (trustState === 'warning') {
    return { status: 'blocked', reason: 'ClawHub security scan returned warnings.' }
  }
  return { status: 'blocked', reason: 'ClawHub security scan is missing or inconclusive.' }
}

function clawHubCanonicalUrl(slug: string, ownerHandle?: string): string {
  if (ownerHandle) {
    return `https://clawhub.ai/${encodeURIComponent(ownerHandle)}/${encodeURIComponent(slug)}`
  }
  return `https://clawhub.ai/${encodeURIComponent(slug)}`
}
