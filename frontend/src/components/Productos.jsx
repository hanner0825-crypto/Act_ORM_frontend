import { useEffect, useState } from 'react'
import { api } from '../services/api'

const RECURSO = 'products'
const vacio = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock_min: '',
  categoria_id: '',
  disponible: true,
}

export default function Productos() {
  const [items, setItems] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(vacio)
  const [editId, setEditId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      setItems(await api.list(RECURSO))
      setCategorias(await api.list('categorias'))
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const guardar = async (e) => {
    e.preventDefault()
    const body = {
      ...form,
      precio: Number(form.precio),
      stock_min: Number(form.stock_min),
      categoria_id: Number(form.categoria_id),
    }
    try {
      if (editId) await api.update(RECURSO, editId, body)
      else await api.create(RECURSO, body)
      setForm(vacio)
      setEditId(null)
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const editar = (p) => {
    setEditId(p.id)
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      precio: p.precio,
      stock_min: p.stock_min,
      categoria_id: p.categoria_id,
      disponible: p.disponible,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelar = () => {
    setEditId(null)
    setForm(vacio)
  }

  const borrar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await api.remove(RECURSO, id)
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-2">
            <i className="bi bi-box-seam me-2"></i>Catálogo de Productos
          </h1>
          <p className="lead text-secondary">Gestión de inventario: Flask + React</p>
          <hr className="w-25 mx-auto border-primary border-2 opacity-50" />
        </div>

        {error && (
          <div className="alert alert-danger shadow-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={guardar} className="card border-0 shadow-sm rounded-4 p-4 mb-5">
          <h5 className="fw-bold mb-3">
            {editId ? `Editando producto #${editId}` : 'Nuevo producto'}
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input className="form-control" name="nombre" placeholder="Nombre"
                value={form.nombre} onChange={cambiar} required />
            </div>
            <div className="col-md-8">
              <input className="form-control" name="descripcion" placeholder="Descripción"
                value={form.descripcion} onChange={cambiar} />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="precio" type="number" placeholder="Precio"
                value={form.precio} onChange={cambiar} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="stock_min" type="number" placeholder="Stock mínimo"
                value={form.stock_min} onChange={cambiar} required />
            </div>
            <div className="col-md-3">
              <select className="form-select" name="categoria_id"
                value={form.categoria_id} onChange={cambiar} required>
                <option value="">Categoría...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <div className="form-check">
                <input className="form-check-input" id="disp" name="disponible" type="checkbox"
                  checked={form.disponible} onChange={cambiar} />
                <label className="form-check-label" htmlFor="disp">Disponible</label>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary me-2">
              {editId ? 'Actualizar' : 'Crear'}
            </button>
            {editId && (
              <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {cargando && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}

        {/* Tarjetas */}
        {!cargando && (
          <div className="row g-4">
            {items.length === 0 ? (
              <div className="col-12 text-center">
                <div className="alert alert-info shadow-sm">No se encontraron productos.</div>
              </div>
            ) : (
              items.map((p) => (
                <div className="col-md-4 col-sm-6" key={p.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body d-flex flex-column p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-dark rounded-pill px-3 py-2">ID: {p.id}</span>
                        <span className="badge bg-info-subtle text-info-emphasis rounded-pill px-3 py-2 border border-info-subtle">
                          {p.categoria_nombre || `Categoría ${p.categoria_id}`}
                        </span>
                      </div>
                      <h5 className="card-title fw-bold text-dark mb-2">{p.nombre}</h5>
                      <p className="card-text text-muted flex-grow-1 small">
                        {p.descripcion || 'Sin descripción disponible.'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <h4 className="fw-bold text-success mb-0">
                          ${Number(p.precio).toLocaleString('es-CO')}
                        </h4>
                        <span className="badge bg-light text-secondary border">
                          <i className="bi bi-stack me-1"></i>Min: {p.stock_min}
                        </span>
                      </div>
                      <div className="mt-3 d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => editar(p)}>
                          <i className="bi bi-pencil me-1"></i>Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => borrar(p.id)}>
                          <i className="bi bi-trash me-1"></i>Borrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}