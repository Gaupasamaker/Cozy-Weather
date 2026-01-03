
// Este archivo ya no es necesario con la implementación simplificada directa.
// Se deja vacío o con un comentario para evitar errores de importación si algo lo referencia.
export default function handler(req, res) {
  res.status(404).json({ error: 'Endpoint deprecated. Use client-side SDK.' });
}
