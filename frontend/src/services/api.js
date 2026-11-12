const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const texto = await res.text()
    throw new Error(`Error ${res.status}: ${texto}`)
  }
  const texto = await res.text()
  return texto ? JSON.parse(texto) : null
}

export const api = {
  list: (recurso) => request(recurso),
  create: (recurso, body) =>
    request(recurso, { method: 'POST', body: JSON.stringify(body) }),
  update: (recurso, id, body) =>
    request(`${recurso}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (recurso, id) =>
    request(`${recurso}/${id}`, { method: 'DELETE' }),
}