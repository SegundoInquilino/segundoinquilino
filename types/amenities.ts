export const AMENITIES = [
  { id: 'silencioso', label: 'Silencioso', icon: '🤫' },
  { id: 'metro_proximo', label: 'Metrô próximo', icon: '🚇' },
  { id: 'mercado_proximo', label: 'Mercado próximo', icon: '🛒' },
  { id: 'estacionamento', label: 'Estacionamento', icon: '🅿️' },
  { id: 'pet_friendly', label: 'Pet friendly', icon: '🐾' },
  { id: 'portaria_24h', label: 'Portaria 24h', icon: '💂' },
  { id: 'academia', label: 'Academia', icon: '💪' },
  { id: 'piscina', label: 'Piscina', icon: '🏊' },
  { id: 'churrasqueira', label: 'Churrasqueira', icon: '🍖' },
  { id: 'playground', label: 'Playground', icon: '🎡' },
  { id: 'salao_festas', label: 'Salão de Festas', icon: '🎉' },
  { id: 'seguranca', label: 'Segurança 24h', icon: '🔒' },
  { id: 'cameras', label: 'Câmeras', icon: '📹' },
  { id: 'delivery_room', label: 'Sala de Delivery', icon: '📦' },
  { id: 'bicicletario', label: 'Bicicletário', icon: '🚲' },
  { id: 'lavanderia', label: 'Lavanderia', icon: '🧺' },
  { id: 'quadra', label: 'Quadra', icon: '🏀' },
  { id: 'coworking', label: 'Coworking', icon: '💻' }
]

export type Amenity = typeof AMENITIES[number] 