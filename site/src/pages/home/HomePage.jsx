import { useEffect, useRef, useState } from 'react'
import Icon from '../../components/Icon'
import appIcon from '../../../../docs/images/app-icon.png'
import mainSession from '../../../../docs/images/desktop_ui/25_main_session.png'
import petSettings from '../../../../docs/images/desktop_ui/14_pet_settings_overview.png'
import computerUse from '../../../../docs/images/desktop_ui/06_settings_computer_use.png'
import scheduledTask from '../../../../docs/images/desktop_ui/20_scheduled_task.png'
import skillMarketplace from '../../../../docs/images/desktop_ui/21_skill_marketplace.png'
import diffReview from '../../../../docs/images/desktop_ui/23_workspace_diff_review.png'
import browserPreview from '../../../../docs/images/desktop_ui/24_browser_preview.png'
import dada from '../../../../desktop/src/assets/agent-mascots/agent-mascot-code.png'
import huhu from '../../../../desktop/src/assets/agent-mascots/agent-mascot-plan.png'
import bubu from '../../../../desktop/src/assets/agent-mascots/agent-mascot-fix.png'
import huihui from '../../../../desktop/src/assets/agent-mascots/agent-mascot-build.png'

const DOWNLOAD_URL = 'https://github.com/NanmiCoder/cc-haha/releases/latest'
const GITHUB_URL = 'https://github.com/NanmiCoder/cc-haha'

const content = {
  zh: {
    nav: ['产品旅程', '真实界面', '认识搭档', '文档'],
    download: '下载桌面端',
    eyebrow: 'CLAUDE CODE · 现在有了一间工作室',
    titleA: '把终端智能，',
    titleB: '带进一间会协作的工作室。',
    intro: 'Claude Code Haha 把主会话、代码改动、Agent、桌面宠物、远程入口与自动任务收进同一个本地优先的桌面应用。',
    primary: '下载 macOS / Windows / Linux',
    secondary: '从快速上手开始',
    local: '本地优先',
    providers: '多模型',
    remote: '跨设备',
    heroNote: '主会话在这里。右侧工作台只是需要时展开的工具。',
    orbit: ['会话', '代码', 'Agent', '设备'],
    journeyEyebrow: 'ONE SESSION, MANY HANDS',
    journeyTitle: '从一句话开始，工作自然展开。',
    journeyIntro: '不是把十几个工具摆成菜单，而是让它们围绕同一条会话轨迹工作。',
    steps: [
      ['01', '说清目标', '在 Main Session 里描述任务，选择项目、模型与权限模式。'],
      ['02', '组织协作', '用 Task、SubAgent 与 Agent Team 拆开复杂工作，活动面板持续汇总进度。'],
      ['03', '看见改变', '代码、Diff、Worktree 和预览都留在同一上下文里，审完再决定是否落地。'],
      ['04', '把手伸出去', 'Computer Use 操作真实桌面；H5 与 IM 让你离开电脑也能继续。'],
      ['05', '让它按时回来', '把稳定流程交给定时任务，运行记录仍可回到对应会话复盘。'],
    ],
    tourEyebrow: 'REAL PRODUCT, NOT A MOCKUP',
    tourTitle: '每一个入口，都有真实界面作证。',
    tourIntro: '切换下面的工作片段。截图来自真实 Claude Code Haha 桌面应用，不用概念图替代产品。',
    tours: [
      { id: 'session', label: 'Main Session', kicker: '工作发生的地方', title: '主会话是中心，不是右侧工作台。', body: '项目、对话、输入、模型与上下文在中间完成闭环；代码工作台只在你需要审查改动时出现。', image: mainSession },
      { id: 'pets', label: '桌面宠物', kicker: '协作也可以有性格', title: '搭搭、弧弧、补补、回回，会跟着任务状态行动。', body: '选择内置伙伴，或用一张角色图生成自己的宠物。它们不只是装饰，也把 Agent 的状态变得一眼可见。', image: petSettings },
      { id: 'computer', label: 'Computer Use', kicker: '从代码走向真实桌面', title: '让 Agent 看见屏幕、点击、输入与验证。', body: '在设置中完成安装、权限和预授权；敏感动作仍由你决定边界。', image: computerUse },
      { id: 'schedule', label: '定时任务', kicker: '让流程按时回来', title: '本地调度，运行记录可追溯。', body: '设置频率、模型、目录与通知；桌面应用保持运行时，任务会在独立会话里执行。', image: scheduledTask },
      { id: 'skills', label: 'Skills & Agents', kicker: '能力可以继续生长', title: '从技能市场发现工作流，也能管理自己的 Agent。', body: '查看来源、安全提示和安装状态；再为 Agent 单独配置模型、工具与系统提示词。', image: skillMarketplace },
      { id: 'diff', label: '代码审阅', kicker: '改变先被看见', title: 'Changed Files、Diff 与 Worktree 都有明确位置。', body: '逐文件理解改动，保留分支隔离，再由你决定下一步。', image: diffReview },
      { id: 'preview', label: '浏览器预览', kicker: '验证不必离开会话', title: '在工作台里打开安全的网页预览。', body: '预览本地或公开页面，把看见的结果继续带回当前任务；远程 H5 与 IM 则负责离开电脑后的连接。', image: browserPreview },
    ],
    petEyebrow: 'MEET THE CREW',
    petTitle: '四位搭档，四种工作节奏。',
    petIntro: '我们不想再用一枚冷冰冰的图标代表所有状态。于是，Claude Code Haha 有了自己的小队。',
    pets: [
      ['搭搭 Dada', '搭建', '把想法一块块变成可运行的东西。', dada, '#2eaa91'],
      ['弧弧 Huhu', '规划', '复杂任务也能画出一条清楚路线。', huhu, '#3577d4'],
      ['补补 Bubu', '修复', '找到裂缝，验证之后再补好它。', bubu, '#e56645'],
      ['回回 Huihui', '构建', '新回复一到，就抱着齿轮继续跑。', huihui, '#7657c8'],
    ],
    docsEyebrow: 'THE FIELD GUIDE',
    docsTitle: '不只告诉你“有什么”，还告诉你“怎么走”。',
    docsIntro: '文档被重新组织成真实任务路径。先完成一次可用体验，再深入架构、边界与维护。',
    docGroups: [
      ['第一次打开', '从安装、模型配置到完成第一段会话。', '/desktop/01-quick-start', '打开快速上手'],
      ['桌面工作台', '主会话、活动面板、代码审阅、宠物与自动任务。', '/desktop/03-features', '认识桌面功能'],
      ['伸向真实世界', 'Computer Use、H5 和 IM 接入的操作与安全边界。', '/features/computer-use', '配置 Computer Use'],
      ['理解它如何工作', '本地服务、Agent、记忆、Skills 与项目结构。', '/reference/project-structure', '进入开发者参考'],
    ],
    installEyebrow: 'READY WHEN YOU ARE',
    installTitle: '先把它带回桌面。',
    installBody: '下载安装包，打开应用，选择项目。你的第一条 Main Session 从这里开始。',
    copy: '复制',
    copied: '已复制',
    footer: '本地优先的 Claude Code 桌面工作室',
  },
  en: {
    nav: ['Journey', 'Real UI', 'Meet the crew', 'Docs'],
    download: 'Download desktop',
    eyebrow: 'CLAUDE CODE · NOW HAS A STUDIO',
    titleA: 'Bring terminal intelligence',
    titleB: 'into a studio that collaborates.',
    intro: 'Claude Code Haha brings the main session, code changes, agents, desktop pets, remote access, and scheduled work into one local-first desktop app.',
    primary: 'Download for macOS / Windows / Linux',
    secondary: 'Start with the guide',
    local: 'Local-first',
    providers: 'Multi-model',
    remote: 'Cross-device',
    heroNote: 'This is the Main Session. The right workbench opens only when you need it.',
    orbit: ['Session', 'Code', 'Agents', 'Devices'],
    journeyEyebrow: 'ONE SESSION, MANY HANDS',
    journeyTitle: 'Start with one sentence. Let the work unfold.',
    journeyIntro: 'Not a menu of disconnected tools—a single session thread where every capability has a role.',
    steps: [
      ['01', 'State the goal', 'Describe the task in Main Session, then choose your project, model, and permission mode.'],
      ['02', 'Organize the crew', 'Use tasks, subagents, and agent teams while the activity panel keeps progress together.'],
      ['03', 'See the change', 'Code, diffs, worktrees, and previews stay in context until you decide what lands.'],
      ['04', 'Reach outward', 'Computer Use works with your desktop; H5 and IM keep the session reachable away from it.'],
      ['05', 'Bring it back on time', 'Schedule stable routines and return to their session history when you need the evidence.'],
    ],
    tourEyebrow: 'REAL PRODUCT, NOT A MOCKUP',
    tourTitle: 'Every doorway is backed by a real screen.',
    tourIntro: 'Switch between actual workflows captured in Claude Code Haha—not conceptual placeholder art.',
    tours: [
      { id: 'session', label: 'Main Session', kicker: 'Where the work happens', title: 'The Main Session is the center—not the right workbench.', body: 'Project, conversation, composer, model, and context form the core loop. The code workbench appears only when review needs it.', image: mainSession },
      { id: 'pets', label: 'Desktop pets', kicker: 'Collaboration with a pulse', title: 'Dada, Huhu, Bubu, and Huihui move with the work.', body: 'Choose a built-in companion or create your own from a character image. They make agent state visible at a glance.', image: petSettings },
      { id: 'computer', label: 'Computer Use', kicker: 'Beyond the codebase', title: 'Let an agent see, click, type, and verify on the real desktop.', body: 'Install and authorize it in Settings, while keeping sensitive action boundaries in your hands.', image: computerUse },
      { id: 'schedule', label: 'Scheduled work', kicker: 'Work that comes back', title: 'Local scheduling with a traceable run history.', body: 'Choose a cadence, model, directory, and notification. Runs happen while the desktop app stays open.', image: scheduledTask },
      { id: 'skills', label: 'Skills & Agents', kicker: 'A studio that can grow', title: 'Discover workflows in the skill market and shape your own agents.', body: 'Review sources, safety notes, and install state, then give each agent its own model, tools, and system prompt.', image: skillMarketplace },
      { id: 'diff', label: 'Code review', kicker: 'See before you land', title: 'Changed files, diffs, and worktrees each have a clear place.', body: 'Understand changes file by file, keep branch isolation, and decide the next move yourself.', image: diffReview },
      { id: 'preview', label: 'Browser preview', kicker: 'Verify without leaving the session', title: 'Open a bounded web preview inside the workbench.', body: 'Preview a local or public page and carry what you see back into the task. H5 and IM keep it reachable away from the desktop.', image: browserPreview },
    ],
    petEyebrow: 'MEET THE CREW',
    petTitle: 'Four companions. Four working rhythms.',
    petIntro: 'One cold status icon should not represent every kind of work. Claude Code Haha has a crew instead.',
    pets: [
      ['Dada', 'Build', 'Turns an idea into something you can run.', dada, '#2eaa91'],
      ['Huhu', 'Plan', 'Finds a clear route through complicated work.', huhu, '#3577d4'],
      ['Bubu', 'Fix', 'Finds the crack, proves it, then patches it.', bubu, '#e56645'],
      ['Huihui', 'Ship', 'Grabs the gear and moves when a reply arrives.', huihui, '#7657c8'],
    ],
    docsEyebrow: 'THE FIELD GUIDE',
    docsTitle: 'Not only what exists—how to get somewhere.',
    docsIntro: 'The guide follows real user journeys: get to a useful result first, then go deeper into architecture and boundaries.',
    docGroups: [
      ['Your first launch', 'Install, choose a model, and finish your first session.', '/en/desktop/01-quick-start', 'Open quick start'],
      ['The desktop studio', 'Main Session, activity, review, pets, and scheduled work.', '/en/desktop/03-features', 'Explore desktop features'],
      ['Reach the real world', 'Computer Use, browser access, IM, and their safety boundaries.', '/en/features/computer-use', 'Set up Computer Use'],
      ['Understand the system', 'Local services, agents, memory, skills, and project structure.', '/en/reference/project-structure', 'Open developer reference'],
    ],
    installEyebrow: 'READY WHEN YOU ARE',
    installTitle: 'Bring it to your desktop.',
    installBody: 'Install the app, choose a project, and start your first Main Session.',
    copy: 'Copy',
    copied: 'Copied',
    footer: 'A local-first desktop studio for Claude Code',
  },
}

function useReveal() {
  const scope = useRef(null)

  useEffect(() => {
    const root = scope.current
    if (!root) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = 'true'
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })

    root.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return scope
}

function Header({ locale, c }) {
  const [open, setOpen] = useState(false)
  const prefix = locale === 'en' ? '/en' : ''
  const ids = ['journey', 'tour', 'crew', 'guide']
  const closeMenu = () => setOpen(false)

  return (
    <header className="site-header">
      <a className="brand" href={prefix || '/'} aria-label="Claude Code Haha">
        <span className="brand-mark"><img src={appIcon} alt="" /></span>
        <span>Claude Code <b>Haha</b></span>
      </a>
      <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon name="menu" />
      </button>
      <nav className={open ? 'header-nav is-open' : 'header-nav'} aria-label="Main navigation">
        {c.nav.map((item, index) => <a href={`${prefix || ''}/#${ids[index]}`} key={item} onClick={closeMenu}>{item}</a>)}
        <a href={locale === 'en' ? '/' : '/en/'} onClick={closeMenu}>{locale === 'en' ? '中文' : 'EN'}</a>
        <a className="nav-download" href={DOWNLOAD_URL}>
          <Icon name="download" size={16} />{c.download}
        </a>
      </nav>
    </header>
  )
}

function Hero({ locale, c }) {
  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy" data-reveal>
        <div className="eyebrow"><span className="status-dot" />{c.eyebrow}</div>
        <h1><span>{c.titleA}</span><em>{c.titleB}</em></h1>
        <p className="hero-intro">{c.intro}</p>
        <div className="hero-actions">
          <a className="button button-primary" href={DOWNLOAD_URL}>{c.primary}<Icon name="arrow" /></a>
          <a className="button button-paper" href={locale === 'en' ? '/en/desktop/01-quick-start' : '/desktop/01-quick-start'}>{c.secondary}</a>
        </div>
        <div className="hero-trust" aria-label="Product qualities">
          {[c.local, c.providers, c.remote].map((item) => <span key={item}><Icon name="check" size={15} />{item}</span>)}
        </div>
      </div>
      <div className="hero-stage" data-reveal>
        <div className="stage-thread" />
        <div className="stage-label stage-label-a">{c.orbit[0]}</div>
        <div className="stage-label stage-label-b">{c.orbit[1]}</div>
        <div className="stage-label stage-label-c">{c.orbit[2]}</div>
        <div className="stage-label stage-label-d">{c.orbit[3]}</div>
        <div className="window-card">
          <div className="window-bar">
            <span><i /><i /><i /></span>
            <b>MAIN SESSION</b>
            <small>LOCAL · CONNECTED</small>
          </div>
          <img src={mainSession} alt="Claude Code Haha Main Session" />
        </div>
        <div className="mascot-note">
          <img src={huhu} alt="" />
          <p>{c.heroNote}</p>
        </div>
      </div>
      <div className="hero-marquee" aria-hidden="true">
        <div>MAIN SESSION · CODE REVIEW · DESKTOP PETS · COMPUTER USE · REMOTE ACCESS · SCHEDULED WORK · MAIN SESSION · CODE REVIEW · DESKTOP PETS · COMPUTER USE · REMOTE ACCESS · SCHEDULED WORK ·</div>
      </div>
    </section>
  )
}

function Journey({ c }) {
  return (
    <section className="section journey" id="journey">
      <div className="section-heading" data-reveal>
        <div className="eyebrow">{c.journeyEyebrow}</div>
        <h2>{c.journeyTitle}</h2>
        <p>{c.journeyIntro}</p>
      </div>
      <ol className="journey-list">
        {c.steps.map(([number, title, body], index) => (
          <li data-reveal key={number}>
            <div className="step-number">{number}</div>
            <div className="step-copy"><h3>{title}</h3><p>{body}</p></div>
            <div className="step-mark" aria-hidden="true">
              {index === 0 ? <Icon name="spark" /> : <span>{['⌘', '∆', '↗', '↻'][index - 1]}</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProductTour({ c }) {
  const [activeId, setActiveId] = useState(c.tours[0].id)
  const active = c.tours.find((tour) => tour.id === activeId) || c.tours[0]

  useEffect(() => setActiveId(c.tours[0].id), [c])

  const selectAdjacentTab = (event, currentIndex) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return

    event.preventDefault()
    let nextIndex = currentIndex
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = c.tours.length - 1
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + c.tours.length) % c.tours.length
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % c.tours.length

    const nextTour = c.tours[nextIndex]
    setActiveId(nextTour.id)
    event.currentTarget.parentElement
      ?.querySelector(`#tour-tab-${nextTour.id}`)
      ?.focus()
  }

  return (
    <section className="section product-tour" id="tour">
      <div className="tour-heading" data-reveal>
        <div>
          <div className="eyebrow">{c.tourEyebrow}</div>
          <h2>{c.tourTitle}</h2>
        </div>
        <p>{c.tourIntro}</p>
      </div>
      <div className="tour-tabs" role="tablist" aria-label="Product tour">
        {c.tours.map((tour, index) => (
          <button
            aria-controls={`tour-panel-${tour.id}`}
            aria-selected={active.id === tour.id}
            className={active.id === tour.id ? 'is-active' : ''}
            id={`tour-tab-${tour.id}`}
            key={tour.id}
            onClick={() => setActiveId(tour.id)}
            onKeyDown={(event) => selectAdjacentTab(event, index)}
            role="tab"
            tabIndex={active.id === tour.id ? 0 : -1}
            type="button"
          >
            <span>0{c.tours.indexOf(tour) + 1}</span>{tour.label}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`tour-tab-${active.id}`}
        className="tour-board"
        data-reveal
        id={`tour-panel-${active.id}`}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="tour-copy">
          <div className="tour-kicker">{active.kicker}</div>
          <h3>{active.title}</h3>
          <p>{active.body}</p>
          <div className="tour-scribble" aria-hidden="true">LOOK HERE →</div>
        </div>
        <div className="tour-screen">
          <div className="screen-tape screen-tape-one" />
          <div className="screen-tape screen-tape-two" />
          <img key={active.id} src={active.image} alt={`${active.label} interface`} />
        </div>
      </div>
    </section>
  )
}

function Crew({ c }) {
  return (
    <section className="section crew" id="crew">
      <div className="crew-intro" data-reveal>
        <div className="eyebrow">{c.petEyebrow}</div>
        <h2>{c.petTitle}</h2>
        <p>{c.petIntro}</p>
      </div>
      <div className="crew-track">
        {c.pets.map(([name, role, body, image, color], index) => (
          <article className="crew-member" data-reveal key={name} style={{ '--pet-accent': color, '--pet-delay': `${index * 100}ms` }}>
            <span className="crew-index">0{index + 1}</span>
            <div className="pet-portrait"><div className="pet-halo" /><img src={image} alt="" /></div>
            <div className="crew-role">{role}</div>
            <h3>{name}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Guide({ c }) {
  return (
    <section className="section guide" id="guide">
      <div className="guide-title" data-reveal>
        <div className="eyebrow">{c.docsEyebrow}</div>
        <h2>{c.docsTitle}</h2>
        <p>{c.docsIntro}</p>
      </div>
      <div className="guide-stack">
        {c.docGroups.map(([title, body, href, action], index) => (
          <a className="guide-row" data-reveal href={href} key={title}>
            <span className="guide-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="guide-row-copy"><strong>{title}</strong><small>{body}</small></span>
            <span className="guide-action">{action}<Icon name="arrow" /></span>
          </a>
        ))}
      </div>
    </section>
  )
}

function Install({ locale, c }) {
  const [copied, setCopied] = useState(false)
  const command = [
    'git clone https://github.com/NanmiCoder/cc-haha.git',
    'cd cc-haha && bun install',
    './bin/claude-haha',
  ].join('\n')

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section className="section install" id="install">
      <div className="install-mascot" aria-hidden="true"><img src={dada} alt="" /><span>HA!</span></div>
      <div className="install-copy">
        <div className="eyebrow">{c.installEyebrow}</div>
        <h2>{c.installTitle}</h2>
        <p>{c.installBody}</p>
        <div className="install-actions">
          <a className="button button-ink" href={DOWNLOAD_URL}><Icon name="download" />{c.primary}</a>
          <a className="text-link" href={locale === 'en' ? '/en/desktop/04-installation' : '/desktop/04-installation'}>Installation guide <Icon name="arrow" size={17} /></a>
        </div>
      </div>
      <div className="command-sheet">
        <div className="command-label">CLI · SOURCE CHECKOUT</div>
        <code>
          <span>$</span> git clone https://github.com/NanmiCoder/cc-haha.git<br />
          <span>$</span> cd cc-haha &amp;&amp; bun install<br />
          <span>$</span> ./bin/claude-haha
        </code>
        <button type="button" onClick={copyCommand}><Icon name={copied ? 'check' : 'copy'} size={17} />{copied ? c.copied : c.copy}</button>
        <p>Desktop + CLI · same local runtime</p>
      </div>
    </section>
  )
}

function Footer({ locale, c }) {
  return (
    <footer className="footer">
      <div className="brand footer-brand"><span className="brand-mark"><img src={appIcon} alt="" /></span><span>Claude Code <b>Haha</b></span></div>
      <p>{c.footer}</p>
      <div className="footer-links">
        <a href={locale === 'en' ? '/en/desktop/01-quick-start' : '/desktop/01-quick-start'}>Docs</a>
        <a href={GITHUB_URL}><Icon name="github" size={18} />GitHub</a>
        <a href={locale === 'en' ? '/' : '/en/'}>{locale === 'en' ? '中文' : 'English'}</a>
      </div>
    </footer>
  )
}

export default function HomePage({ locale = 'zh' }) {
  const c = content[locale]
  const pageRef = useReveal()

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
    document.title = locale === 'en'
      ? 'Claude Code Haha — A studio for Claude Code'
      : 'Claude Code Haha — Claude Code 的桌面工作室'
  }, [locale])

  return (
    <div className="home" ref={pageRef}>
      <a className="skip-link" href="#journey">Skip to content</a>
      <Header locale={locale} c={c} />
      <main>
        <Hero locale={locale} c={c} />
        <Journey c={c} />
        <ProductTour c={c} />
        <Crew c={c} />
        <Guide c={c} />
        <Install locale={locale} c={c} />
      </main>
      <Footer locale={locale} c={c} />
    </div>
  )
}
