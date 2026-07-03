export type SkillMarketSource = 'clawhub' | 'skillhub'
export type SkillMarketListSource = 'auto' | SkillMarketSource
export type SkillMarketSourceMode = 'primary' | 'fallback' | 'enhanced'
export type SkillMarketTrustState =
  | 'clean'
  | 'benign'
  | 'signed'
  | 'official'
  | 'warning'
  | 'unknown'
  | 'blocked'

export type SkillMarketRiskLabel =
  | 'allowed-tools'
  | 'hooks'
  | 'scripts'
  | 'executables'
  | 'external-network'
  | 'requires-api-key'

export type SkillMarketSort = 'downloads' | 'installs' | 'stars' | 'updated' | 'trending'

export type SkillMarketItem = {
  source: SkillMarketSource
  sourceMode: SkillMarketSourceMode
  slug: string
  displayName: string
  summary: string
  summaryZh?: string
  owner?: string
  canonicalUrl: string
  upstreamUrl?: string
  license?: string | null
  version?: string
  downloads?: number
  installs?: number
  stars?: number
  category?: string
  tags?: string[]
  requiresApiKey?: boolean
  trustState: SkillMarketTrustState
  trustSummary?: string
  installed: boolean
}

export type SkillMarketFile = {
  path: string
  size?: number
  sha256?: string
  contentType?: string | null
}

export type SkillMarketFilePreview = {
  path: string
  content: string
  language?: string
  size?: number
  truncated?: boolean
}

export type SkillMarketInstallEligibility =
  | { status: 'installable' }
  | { status: 'installed'; installedSkillName: string }
  | { status: 'conflict'; targetPath: string }
  | { status: 'blocked'; reason: string }

export type SkillMarketDetail = SkillMarketItem & {
  files: SkillMarketFile[]
  filePreviews?: SkillMarketFilePreview[]
  entryPreview?: string
  previewUnavailableReason?: string
  riskLabels: SkillMarketRiskLabel[]
  installEligibility: SkillMarketInstallEligibility
}

export type SkillMarketListResponse = {
  items: SkillMarketItem[]
  nextCursor: string | null
  source: SkillMarketSource
  sourceStatus: 'ok' | 'fallback' | 'cached'
  message?: string
}

export type SkillMarketInstallResult = {
  installed: true
  skillName: string
  targetPath: string
}

export type SkillMarketListParams = {
  source?: SkillMarketListSource
  sort?: SkillMarketSort
  q?: string
  query?: string
  cursor?: string
  limit?: number
}
