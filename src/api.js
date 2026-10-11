import { seedMembers, seedProjects, getMatches } from './data.js'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}

export async function loadProjects() {
  try { return { data: await request('/projects'), offline: false } }
  catch { return { data: seedProjects, offline: true } }
}

export async function loadMembers() {
  try { return { data: await request('/members'), offline: false } }
  catch { return { data: seedMembers, offline: true } }
}

export async function loadMatches(project, members) {
  try { return await request(`/projects/${project.id}/matches`) }
  catch { return getMatches(members || seedMembers, project) }
}

export async function createProject(project) {
  try { return await request('/projects', { method: 'POST', body: JSON.stringify(project) }) }
  catch {
    return { ...project, id: `PX-${Math.floor(200 + Math.random() * 700)}`, status: 'Staffing', filled: 0, accent: 'mint' }
  }
}