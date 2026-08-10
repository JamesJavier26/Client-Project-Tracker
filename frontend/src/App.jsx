import { Fragment, useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = '/api/projects'
const STATUS_OPTIONS = ['Planning', 'In Progress', 'On Hold', 'Completed']
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High']
const PAGE_SIZE = 6

const initialForm = {
  client_name: '',
  project_name: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  start_date: '',
  due_date: '',
}

function App() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || project.status === statusFilter
      const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [projects, searchTerm, statusFilter, priorityFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE))
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredProjects.slice(start, start + PAGE_SIZE)
  }, [filteredProjects, currentPage])

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, priorityFilter])

  async function loadProjects() {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Unable to load projects')
      }

      const payload = await response.json()
      setProjects(payload.data || [])
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm(initialForm)
    setEditingId(null)
    setErrors({})
    setSubmitError('')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    setErrors({})

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `${API_URL}/${editingId}` : API_URL

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const apiErrors = payload.errors || {}
        setErrors(apiErrors)
        setSubmitError(payload.message || 'Please check the form and try again.')
        return
      }

      const project = payload.data
      setProjects((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? project : item))
        }

        return [project, ...current]
      })

      resetForm()
    } catch (error) {
      setSubmitError('Something went wrong while saving the project.')
    }
  }

  async function handleDelete(projectId) {
    if (!window.confirm('Delete this project?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Could not delete project.')
      }

      setProjects((current) => current.filter((project) => project.id !== projectId))

      if (editingId === projectId) {
        resetForm()
      }

      if (expandedId === projectId) {
        setExpandedId(null)
      }
    } catch (error) {
      setSubmitError(error.message)
    }
  }

  function handleEdit(project) {
    setEditingId(project.id)
    setForm({
      client_name: project.client_name,
      project_name: project.project_name,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
      start_date: project.start_date,
      due_date: project.due_date,
    })
    setErrors({})
    setSubmitError('')
  }

  function toggleProject(projectId) {
    setExpandedId((current) => (current === projectId ? null : projectId))
  }

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Agency Workspace</p>
          <h1>Client Project Tracker</h1>
        </div>
      </header>

      <main className="layout">
        <section className="panel form-panel">
          <div className="panel-header">
            <h2>{editingId ? 'Edit project' : 'Create project'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="project-form">
            <div className="field-grid">
              <label>
                <span>Client Name</span>
                <input
                  type="text"
                  name="client_name"
                  value={form.client_name}
                  onChange={handleChange}
                  className={errors.client_name ? 'invalid' : ''}
                />
                {errors.client_name && <small>{errors.client_name[0]}</small>}
              </label>

              <label>
                <span>Project Name</span>
                <input
                  type="text"
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  className={errors.project_name ? 'invalid' : ''}
                />
                {errors.project_name && <small>{errors.project_name[0]}</small>}
              </label>

              <label className="full-width">
                <span>Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                />
              </label>

              <label>
                <span>Status</span>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && <small>{errors.status[0]}</small>}
              </label>

              <label>
                <span>Priority</span>
                <select name="priority" value={form.priority} onChange={handleChange}>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                {errors.priority && <small>{errors.priority[0]}</small>}
              </label>

              <label>
                <span>Start Date</span>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className={errors.start_date ? 'invalid' : ''}
                />
                {errors.start_date && <small>{errors.start_date[0]}</small>}
              </label>

              <label>
                <span>Due Date</span>
                <input
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  className={errors.due_date ? 'invalid' : ''}
                />
                {errors.due_date && <small>{errors.due_date[0]}</small>}
              </label>
            </div>

            {submitError && <p className="form-error">{submitError}</p>}

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? 'Update project' : 'Save project'}
              </button>
              {editingId && (
                <button type="button" className="secondary-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="panel-header">
            <h2>Projects</h2>
            <span>{filteredProjects.length} total</span>
          </div>

          <div className="filters">
            <label className="filter-field search-field">
              <span>Search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by project or client"
              />
            </label>

            <label className="filter-field">
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">All</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span>Priority</span>
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                <option value="All">All</option>
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <p className="empty-state">Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="empty-state">No projects match your current filters.</p>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="project-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Client</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.map((project) => {
                      const isExpanded = expandedId === project.id

                      return (
                        <Fragment key={project.id}>
                          <tr
                            className={`project-row ${isExpanded ? 'is-expanded' : ''}`}
                            onClick={() => toggleProject(project.id)}
                          >
                            <td>{project.project_name}</td>
                            <td>{project.client_name}</td>
                            <td>
                              <span className={`badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {project.status}
                              </span>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="details-row">
                              <td colSpan="3">
                                <div className="project-details">
                                  <div className="details-grid">
                                    <div>
                                      <span className="detail-label">Priority</span>
                                      <span className={`badge priority-${project.priority.toLowerCase()}`}>
                                        {project.priority}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="detail-label">Start Date</span>
                                      <p>{new Date(project.start_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <span className="detail-label">Due Date</span>
                                      <p>{new Date(project.due_date).toLocaleDateString()}</p>
                                    </div>
                                  </div>

                                  <div className="detail-description">
                                    <span className="detail-label">Description</span>
                                    <p>{project.description || 'No description provided.'}</p>
                                  </div>

                                  <div className="detail-actions">
                                    <button type="button" className="secondary-btn" onClick={() => handleEdit(project)}>
                                      Edit
                                    </button>
                                    <button type="button" className="danger-btn" onClick={() => handleDelete(project.id)}>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
