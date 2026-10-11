export const seedProjects = [
  {
    id: 'PX-204', name: 'Customer intelligence', client: 'Northstar Health',
    status: 'Staffing', deadline: 'Oct 28, 2026', teamSize: 5, filled: 3,
    priority: 'High', accent: 'mint',
    skills: [
      { name: 'React', level: 'Advanced', count: 1 },
      { name: 'Python', level: 'Advanced', count: 1 },
      { name: 'Data engineering', level: 'Intermediate', count: 1 },
      { name: 'Product design', level: 'Intermediate', count: 1 },
    ],
  },
  {
    id: 'PX-198', name: 'Atlas mobile banking', client: 'Meridian Credit',
    status: 'In progress', deadline: 'Nov 14, 2026', teamSize: 7, filled: 5,
    priority: 'Medium', accent: 'peach',
    skills: [
      { name: 'React Native', level: 'Advanced', count: 1 },
      { name: 'Java', level: 'Advanced', count: 1 },
      { name: 'AWS', level: 'Intermediate', count: 1 },
    ],
  },
  {
    id: 'PX-187', name: 'Sustainable supply chain', client: 'Common Ground',
    status: 'Staffing', deadline: 'Dec 02, 2026', teamSize: 4, filled: 2,
    priority: 'Medium', accent: 'blue',
    skills: [
      { name: 'Machine learning', level: 'Advanced', count: 1 },
      { name: 'Python', level: 'Intermediate', count: 1 },
      { name: 'UX research', level: 'Intermediate', count: 1 },
    ],
  },
  {
    id: 'PX-176', name: 'Operations redesign', client: 'Fieldwork Co.',
    status: 'In progress', deadline: 'Jan 09, 2027', teamSize: 6, filled: 4,
    priority: 'Low', accent: 'lavender',
    skills: [
      { name: 'Service design', level: 'Advanced', count: 1 },
      { name: 'Figma', level: 'Intermediate', count: 1 },
    ],
  },
]

export const seedMembers = [
  { id: 'TM-041', name: 'Amara Okafor', role: 'Frontend engineer', level: 'Senior', location: 'Brooklyn, NY', availability: 80, skills: ['React', 'TypeScript', 'Design systems', 'Accessibility'], initials: 'AO', color: 'coral' },
  { id: 'TM-018', name: 'Leo Martínez', role: 'Data engineer', level: 'Senior', location: 'Austin, TX', availability: 100, skills: ['Python', 'Data engineering', 'dbt', 'AWS'], initials: 'LM', color: 'blue' },
  { id: 'TM-052', name: 'Priya Nair', role: 'Product designer', level: 'Mid-level', location: 'Toronto, CA', availability: 60, skills: ['Product design', 'Figma', 'UX research', 'Prototyping'], initials: 'PN', color: 'yellow' },
  { id: 'TM-033', name: 'Noah Kim', role: 'Machine learning engineer', level: 'Senior', location: 'Seattle, WA', availability: 100, skills: ['Machine learning', 'Python', 'MLOps', 'AWS'], initials: 'NK', color: 'mint' },
  { id: 'TM-027', name: 'Sofia Chen', role: 'Full-stack engineer', level: 'Mid-level', location: 'San Francisco, CA', availability: 40, skills: ['React', 'Java', 'Node.js', 'PostgreSQL'], initials: 'SC', color: 'lavender' },
  { id: 'TM-061', name: 'Ethan Brooks', role: 'UX researcher', level: 'Senior', location: 'Chicago, IL', availability: 80, skills: ['UX research', 'Service design', 'Figma', 'Facilitation'], initials: 'EB', color: 'peach' },
  { id: 'TM-039', name: 'Mila Petrova', role: 'Backend engineer', level: 'Mid-level', location: 'Denver, CO', availability: 100, skills: ['Java', 'Spring Boot', 'AWS', 'PostgreSQL'], initials: 'MP', color: 'blue' },
  { id: 'TM-044', name: 'Jules Rivera', role: 'Product designer', level: 'Senior', location: 'Portland, OR', availability: 80, skills: ['Product design', 'Figma', 'Design systems', 'UX research'], initials: 'JR', color: 'coral' },
]

export function scoreMember(member, project) {
  const required = project.skills ?? []
  if (!required.length) return 0
  const matched = required.filter((skill) => member.skills.some((candidate) => candidate.toLowerCase() === skill.name.toLowerCase()))
  const skillScore = (matched.length / required.length) * 70
  const availabilityScore = (member.availability / 100) * 20
  const seniorityScore = required.some((skill) => skill.level === 'Advanced') && member.level === 'Senior' ? 10 : 6
  return Math.min(99, Math.round(skillScore + availabilityScore + seniorityScore))
}

export function getMatches(members, project) {
  return members
    .map((member) => ({ ...member, matchScore: scoreMember(member, project) }))
    .filter((member) => member.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}