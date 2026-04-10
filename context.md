# Sistema de Diseño UI Genérico para CRUD

## 1. Sistema de Color

### Paleta principal
- `Primary`: `#1660ff` (acciones principales y foco visual)
- `Secondary`: `#0f766e` (acciones secundarias y apoyo visual)
- `Neutral`: escala de grises para superficies, bordes y texto de baja jerarquía
- `Success`: `#0a9f6f` (confirmaciones y estados correctos)
- `Warning`: `#d97706` (advertencias y validaciones preventivas)
- `Danger`: `#dc2626` (errores y acciones destructivas)

### Fondos y superficies
- Fondo base (`background`): gradiente suave para dar profundidad sin perder legibilidad.
- Superficie (`surface`): blanco con variación (`surface-soft`) para contenedores internos.
- Borde (`border`): gris claro consistente para inputs, tablas y tarjetas.

### Jerarquía de texto
- Texto primario (`text-primary`): para títulos y contenido principal.
- Texto secundario (`text-secondary`): para soporte y metadatos.
- Texto deshabilitado (`text-disabled`): para estados inactivos.

### Estados interactivos
- `hover`: incremento sutil de contraste de fondo o borde.
- `active`: oscurecimiento controlado de la acción.
- `focus`: halo visible (`focus-ring`) con alto contraste para accesibilidad.

## 2. Tipografía

- Familia principal: `Manrope` (UI), con fallback `Segoe UI`, `Helvetica Neue`, `sans-serif`.
- Escala tipográfica:
  - `xs`: 12px
  - `sm`: 14px
  - `md`: 16px
  - `lg`: 18px
  - `xl`: 22px
  - `2xl`: 28px
- Pesos:
  - `500`: texto de apoyo fuerte
  - `600`: etiquetas y subtítulos
  - `700`: encabezados
- Alturas de línea:
  - 1.4 para contenido compacto
  - 1.6 para lectura de párrafos

## 3. Sistema de Espaciado

Escala base en múltiplos de 4:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px.

Reglas:
- Separación vertical entre campos de formulario: mínimo 16px.
- Padding interno de contenedores: 20px en móvil, 24px en desktop.
- Evitar valores arbitrarios fuera de la escala para mantener consistencia.

## 4. Guías de Componentes

- Radio de borde:
  - `md`: 10px (inputs y controles)
  - `lg`: 14px (tarjetas)
  - `xl`: 18px (contenedores principales)
- Elevación:
  - `shadow-sm`: tarjetas internas
  - `shadow-md`: paneles principales
- Inputs:
  - Etiqueta siempre visible
  - Mensaje de error debajo del campo
  - Estado de foco con `focus-ring`
- Botones:
  - `primary`: acción principal
  - `secondary`: acción de soporte
  - `ghost`: acción contextual discreta
  - `danger`: acción destructiva

## 5. Patrones de Interacción

- `hover/focus/active/disabled` definidos para todos los controles interactivos.
- Carga:
  - Botones con spinner interno
  - Tablas con skeleton rows
- Vacío:
  - Mensaje claro + contexto de siguiente acción
- Error:
  - Texto explícito y específico en español
  - Indicador visual de campo inválido

## 6. Principios UX/UI

- Claridad sobre complejidad:
  - Formularios y tablas con estructura legible, sin ruido visual.
- Jerarquía visual fuerte:
  - Título, contexto y acción principal claramente diferenciados.
- Consistencia:
  - Misma semántica visual para estados en todos los componentes.
- Feedback inmediato:
  - Estados de carga, validación y vacío visibles sin ambigüedad.
- Accesibilidad:
  - Navegación por teclado funcional.
  - Contraste suficiente en texto y acciones.
  - Labels asociados correctamente a cada control.

## Decisiones de arquitectura

- Los componentes son `entity-agnostic`: no conocen dominios concretos.
- Todo se maneja por configuración (`schema`/`props`) para escalar a cualquier módulo CRUD.
- Estilos centralizados con tokens (`CSS custom properties`) para evitar duplicación.
- Separación lógica/UI:
  - Validación y estado del formulario encapsulados en `GenericForm`.
  - Búsqueda con debounce encapsulada en `SearchBar`.
  - Render de columnas y acciones encapsulado en `DataTable`.