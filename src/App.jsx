import { useEffect, useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, Bell, BriefcaseBusiness, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleHelp, Clock3, Filter, LayoutDashboard,
  Menu, Plus, Search, SlidersHorizontal, Sparkles, Users, X,
} from 'lucide-react'
import { createProject, loadMatches, loadMembers, loadProjects } from './api.js'
import { seedMembers } from './data.js'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Projects', icon: BriefcaseBusiness },
  { label: 'People', icon: Users },
]

function Avatar({ member, size = '' }) {
  return <span className={`avatar avatar-${member.color || 'mint'} ${size}`}>{member.initials || member.name?.split(' ').map((part) => part[0]).join('')}</span>
}

function displayDeadline(deadline) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? new Date(`${deadline}T12:00:00`) : new Date(deadline)
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
}

function App() {
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState(seedMembers)
  const [matches, setMatches] = useState([])
  const [activeProjectId, setActiveProjectId] = useState('PX-204')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All projects')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [view, setView] = useState('Projects')
  const activeProject = projects.find((project) => project.id === activeProjectId) || projects[0]

  useEffect(() => {
    Promise.all([loadProjects(), loadMembers()]).then(([projectResult, memberResult]) => {
      setProjects(projectResult.data)
      setMembers(memberResult.data)
      setOffline(projectResult.offline || memberResult.offline)
      if (!projectResult.data.some((project) => project.id === activeProjectId)) {
        setActiveProjectId(projectResult.data[0]?.id)
      }
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!activeProject) { setMatches([]); return undefined }
    let current = true
    loadMatches(activeProject, members).then((result) => { if (current) setMatches(result) })
    return () => { current = false }
  }, [activeProject, members])

  useEffect(() => {
    function handleToast(event) { notify(event.detail) }
    window.addEventListener('forma:toast', handleToast)
    return () => window.removeEventListener('forma:toast', handleToast)
  }, [])

  const visibleProjects = projects.filter((project) => {
    const matchesQuery = `${project.name} ${project.client} ${project.id}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (filter === 'All projects' || project.status === filter)
  })

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  async function submitProject(formData) {
    const skills = formData.skills.split(',').map((name) => name.trim()).filter(Boolean).map((name) => ({ name, level: 'Intermediate', count: 1 }))
    if (!formData.name.trim() || !formData.client.trim() || skills.length === 0) return
    const newProject = await createProject({
      name: formData.name.trim(), client: formData.client.trim(), deadline: formData.deadline,
      teamSize: Number(formData.teamSize), skills, priority: 'Medium',
    })
    setProjects((current) => [newProject, ...current])
    setActiveProjectId(newProject.id)
    setIsModalOpen(false)
    notify('Project created. Matching talent is ready to review.')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#overview" onClick={() => setView('Overview')} aria-label="Forma home">
          <span className="brand-mark"><span /><span /><span /></span><span>forma</span>
        </a>
        <div className="workspace-switcher"><span className="workspace-symbol">N</span><span className="workspace-copy"><strong>Northstar Studio</strong><small>Workspace</small></span><ChevronDown size={15} /></div>
        <p className="nav-label">WORKSPACE</p>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${view === label ? 'nav-active' : ''}`} onClick={() => { setView(label); setMobileNavOpen(false) }}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Projects' && <small>{String(projects.length).padStart(2, '0')}</small>}
            </button>
          ))}
        </nav>
        <p className="nav-label project-label">RECENT PROJECTS <button aria-label="Add project" onClick={() => setIsModalOpen(true)}><Plus size={14} /></button></p>
        <div className="side-projects">
          {projects.slice(0, 4).map((project) => <button key={project.id} className={`side-project ${activeProjectId === project.id ? 'side-project-active' : ''}`} onClick={() => { setActiveProjectId(project.id); setView('Projects'); setMobileNavOpen(false) }}><span className={`project-dot dot-${project.accent}`} />{project.name}</button>)}
        </div>
        <div className="sidebar-bottom"><button className="nav-link"><CircleHelp size={17} /><span>Help center</span></button><div className="profile-row"><Avatar member={{ initials: 'MC', color: 'mint' }} /><span><strong>Mae Chen</strong><small>People lead</small></span><ChevronDown size={15} /></div></div>
      </aside>

      {mobileNavOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={19} /></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{view}</strong></div>
          <div className="topbar-actions"><span className="today-label"><CalendarDays size={15} /> Sunday, October 11</span><button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You are all caught up.')}><Bell size={17} /><i /></button><span className="topbar-divider" /><Avatar member={{ initials: 'MC', color: 'mint' }} /></div>
        </header>

        <div className="content-wrap">
          <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> TEAM INTELLIGENCE <span className="eyebrow-year">2026 / Q4</span></div><h1>Build the right team.</h1><p>Good work starts with the right people in the room.</p></div><button className="button button-dark" onClick={() => setIsModalOpen(true)}><Plus size={17} /> New project</button></section>

          {offline && <div className="connection-note"><span className="connection-dot" /> Demo data · Spring Boot API is offline</div>}

          <section className="stats-row" aria-label="Team staffing overview">
            <article className="stat-card"><span className="stat-caption">ACTIVE PROJECTS <BriefcaseBusiness size={15} /></span><div className="stat-main"><strong>{String(projects.length).padStart(2, '0')}</strong><span className="stat-change positive"><ArrowUpRight size={13} /> 2 <small>this month</small></span></div><div className="stat-track"><span style={{ width: '68%' }} /></div></article>
            <article className="stat-card"><span className="stat-caption">PEOPLE AVAILABLE <Users size={15} /></span><div className="stat-main"><strong>{members.filter((member) => member.availability >= 60).length}<small className="stat-total"> / {members.length}</small></strong><span className="stat-change">{Math.round(members.reduce((total, member) => total + member.availability, 0) / (members.length || 1))}% <small>avg. capacity</small></span></div><div className="avatar-stack">{members.slice(0, 4).map((member) => <Avatar key={member.id} member={member} />)}<span className="stack-more">+4</span></div></article>
            <article className="stat-card"><span className="stat-caption">OPEN ROLES <span className="stat-caption-square">↗</span></span><div className="stat-main"><strong>{projects.reduce((sum, project) => sum + Math.max(0, project.teamSize - project.filled), 0)}</strong><span className="stat-change attention"><ArrowDownRight size={13} /> 3 <small>vs last week</small></span></div><div className="open-roles-note"><span className="role-indicator" /> Across {projects.length} projects</div></article>
          </section>

          <section className="workspace-grid">
            {view === 'People' ? <PeopleDirectory members={matches} query={query} onQueryChange={setQuery} projectName={activeProject?.name} /> : <>
            <div className="projects-panel">
              <div className="section-heading"><div><span className="section-kicker">THE WORK</span><h2>Projects <span>{String(projects.length).padStart(2, '0')}</span></h2></div><button className="text-button" onClick={() => { setFilter('All projects'); setQuery('') }}>View all <ChevronRight size={15} /></button></div>
              <div className="project-toolbar"><label className="search-field"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a project" aria-label="Find a project" />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={14} /></button>}</label><label className="filter-select"><Filter size={14} /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter projects"><option>All projects</option><option>Staffing</option><option>In progress</option></select><ChevronDown size={13} /></label></div>
              <div className="project-list">
                {loading ? <div className="empty-state">Loading projects…</div> : visibleProjects.length ? visibleProjects.map((project) => <ProjectRow key={project.id} project={project} active={activeProjectId === project.id} onClick={() => setActiveProjectId(project.id)} />) : <div className="empty-state">No projects match that search.</div>}
              </div>
              <button className="add-project-row" onClick={() => setIsModalOpen(true)}><Plus size={15} /> Add a project <span>Start with the skills you need</span></button>
            </div>

            <section className="matching-panel" aria-label="Recommended team members">
              <div className="matching-heading"><div><span className="section-kicker">TALENT MATCH</span><h2>People for this project</h2></div><button className="icon-button slim-button" aria-label="Matching settings" onClick={() => notify('Matching balances skills, availability and seniority.')}><SlidersHorizontal size={16} /></button></div>
              {activeProject ? <>
                <div className="selected-project"><span className={`project-monogram dot-${activeProject.accent}`}>{activeProject.name.slice(0, 1)}</span><div><strong>{activeProject.name}</strong><small>{activeProject.client} <span>·</span> {Math.max(0, activeProject.teamSize - activeProject.filled)} roles open</small></div><button className="icon-button project-menu" aria-label="Project details" onClick={() => notify(`${activeProject.id} · due ${activeProject.deadline}`)}><ChevronDown size={16} /></button></div>
                <div className="requirement-head"><span>SKILL COVERAGE</span><button onClick={() => notify('Skill requirements are managed in project settings.')}>Edit needs <ChevronRight size={13} /></button></div>
                <div className="skill-list">{(activeProject.skills || []).map((skill) => { const covered = members.some((member) => member.skills.some((memberSkill) => memberSkill.toLowerCase() === skill.name.toLowerCase())); return <span key={skill.name} className={`skill-chip ${covered ? 'skill-covered' : 'skill-gap'}`}><span>{covered ? <Check size={11} /> : <Plus size={11} />}</span>{skill.name}<small>{skill.level}</small></span> })}</div>
                <div className="recommendation-head"><div><strong>Best fit</strong><span>{matches.length} people ranked by fit</span></div><button aria-label="Filter people" className="icon-button slim-button" onClick={() => notify('Showing people with matching project skills.')}><Filter size={15} /></button></div>
                <div className="candidate-list">{matches.slice(0, 4).map((member, index) => <CandidateRow key={member.id} member={member} index={index} />)}{!matches.length && <div className="empty-state">Add skills to see people matches.</div>}</div>
                <button className="all-matches-button" onClick={() => setView('People')}>Explore all matches <ArrowUpRight size={14} /></button>
              </> : <div className="empty-state">Choose a project to see its matches.</div>}
            </section>
            </>}
          </section>

          <section className="bottom-strip"><div className="bottom-strip-icon"><Sparkles size={17} /></div><div><strong>Make room for good work.</strong><span>People with overlapping skills can be the difference between a team and a great one.</span></div><button className="text-button" onClick={() => notify('Your team profile is up to date.')}>Team directory <ArrowUpRight size={14} /></button></section>
          <footer className="page-footer"><span>FORMA <i /> TEAM INTELLIGENCE</span><span>BUILT FOR BETTER WORK, TOGETHER</span></footer>
        </div>
      </main>

      {isModalOpen && <ProjectModal onClose={() => setIsModalOpen(false)} onSubmit={submitProject} />}
      {toast && <div className="toast" role="status"><span><Check size={14} /></span>{toast}</div>}
    </div>
  )
}

function PeopleDirectory({ members, query, onQueryChange, projectName }) {
  const visibleMembers = members.filter((member) => `${member.name} ${member.role} ${member.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="directory-panel" aria-label="People directory">
    <div className="section-heading"><div><span className="section-kicker">THE PEOPLE</span><h2>Matching talent <span>{String(visibleMembers.length).padStart(2, '0')}</span></h2></div><span className="directory-context">Ranked for {projectName || 'your project'}</span></div>
    <label className="search-field directory-search"><Search size={15} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search people or skills" aria-label="Search people or skills" />{query && <button aria-label="Clear search" onClick={() => onQueryChange('')}><X size={14} /></button>}</label>
    <div className="directory-list">{visibleMembers.length ? visibleMembers.map((member) => <article className="directory-row" key={member.id}><Avatar member={member} /><div className="directory-person"><strong>{member.name}</strong><span>{member.role} <i /> {member.level}</span><small>{member.location}</small></div><div className="directory-skills">{member.skills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div><div className="directory-availability"><span>{member.availability}% available</span><i><b style={{ width: `${member.availability}%` }} /></i></div><div className="directory-fit"><strong>{member.matchScore}%</strong><small>FIT</small></div><button className="candidate-add" aria-label={`Add ${member.name} to project`} onClick={() => window.dispatchEvent(new CustomEvent('forma:toast', { detail: `${member.name} added to shortlist.` }))}><Plus size={15} /></button></article>) : <div className="empty-state">No matching people found.</div>}</div>
  </section>
}

function ProjectRow({ project, active, onClick }) {
  const progress = Math.min(100, Math.round((project.filled / project.teamSize) * 100))
  return <button className={`project-row ${active ? 'project-row-active' : ''}`} onClick={onClick}>
    <span className={`project-monogram dot-${project.accent}`}>{project.name.slice(0, 1)}</span>
    <span className="project-row-copy"><span className="project-name-line"><strong>{project.name}</strong><small className={project.status === 'Staffing' ? 'status-staffing' : 'status-progress'}>{project.status}</small></span><span className="project-client-line">{project.id} <i /> {project.client}</span></span>
    <span className="project-progress"><span><i style={{ width: `${progress}%` }} /></span><small>{project.filled}/{project.teamSize}</small></span>
    <span className="project-deadline"><Clock3 size={13} />{displayDeadline(project.deadline)}</span><ChevronRight className="row-chevron" size={15} />
  </button>
}

function CandidateRow({ member, index }) {
  const matchedSkills = member.skills.slice(0, 2)
  return <article className="candidate-row"><Avatar member={member} /><div className="candidate-info"><div className="candidate-name"><strong>{member.name}</strong>{index === 0 && <span className="top-match">TOP MATCH</span>}</div><span className="candidate-role">{member.role} <i /> {member.level}</span><div className="candidate-skill-tags">{matchedSkills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="candidate-fit"><strong>{member.matchScore}%</strong><span>FIT</span></div><button className="candidate-add" aria-label={`Add ${member.name} to project`} title={`Add ${member.name}`} onClick={() => window.dispatchEvent(new CustomEvent('forma:toast', { detail: `${member.name} added to shortlist.` }))}><Plus size={15} /></button></article>
}

function ProjectModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({ name: '', client: '', deadline: '2026-11-30', teamSize: '4', skills: '' })
  const [error, setError] = useState('')
  function update(field, value) { setFormData((current) => ({ ...current, [field]: value })) }
  function submit(event) {
    event.preventDefault()
    if (!formData.name.trim() || !formData.client.trim() || !formData.skills.trim()) { setError('Add a project name, client and at least one skill.'); return }
    onSubmit(formData)
  }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><span className="section-kicker">NEW OPPORTUNITY</span><h2 id="modal-title">Start with the work.</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div><p className="modal-intro">Tell us what you’re building. We’ll surface the people who can help.</p><form onSubmit={submit}><label>Project name<input autoFocus value={formData.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Customer platform refresh" /></label><label>Client or team<input value={formData.client} onChange={(event) => update('client', event.target.value)} placeholder="e.g. Northstar Health" /></label><div className="form-row"><label>Target date<input type="date" value={formData.deadline} onChange={(event) => update('deadline', event.target.value)} /></label><label>Team size<input type="number" min="1" max="30" value={formData.teamSize} onChange={(event) => update('teamSize', event.target.value)} /></label></div><label>Skills needed <small>Separate skills with commas</small><input value={formData.skills} onChange={(event) => update('skills', event.target.value)} placeholder="e.g. React, Product design, Python" /></label>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button type="submit" className="button button-dark"><Sparkles size={15} /> Find my team</button></div></form></section></div>
}

export default App