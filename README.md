# Sistema UI CRUD Reutilizable

Este proyecto implementa un sistema de componentes genéricos para operaciones CRUD, orientado a escalabilidad y reutilización en cualquier entidad del dominio.

## Objetivo de arquitectura

- Diseñar componentes independientes de entidad.
- Configurar UI mediante `props` y `schemas`.
- Centralizar estilos con tokens para mantener consistencia visual.
- Garantizar accesibilidad, responsividad y estados UX claros.

## Estructura principal

- `context.md`: definición formal del sistema de diseño (colores, tipografía, spacing, interacción y principios UX/UI).
- `src/components/ui/types.ts`: contratos tipados para formularios, tabla y buscador.
- `src/components/ui/GenericForm.tsx`: formulario dinámico con validación.
- `src/components/ui/DataTable.tsx`: tabla configurable con acciones por fila.
- `src/components/ui/SearchBar.tsx`: búsqueda con debounce y botón de limpieza.
- `src/components/ui/index.ts`: exportaciones centralizadas del kit UI.
- `src/index.css`: design tokens y estilos reutilizables.
- `src/App.tsx`: demostración de integración end-to-end del sistema.

## Decisiones de diseño y UX

- El sistema visual utiliza tokens CSS para colores, tipografías, radios, sombras y espaciado.
- La jerarquía visual prioriza claridad: encabezado contextual, formularios legibles y tabla con acciones directas.
- Los estados de interacción están estandarizados: `hover`, `focus`, `active`, `disabled`, `loading`, `empty`, `error`.
- En móvil, la tabla degrada a tarjetas para preservar legibilidad y acción rápida.
- Se mantiene semántica HTML y navegación por teclado en entradas y acciones.

## Uso rápido

### 1. Definir campos de formulario

```ts
const fields: FormFieldConfig[] = [
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { label: 'Activo', value: 'Active' },
      { label: 'Inactivo', value: 'Inactive' },
    ],
  },
];
```

### 2. Renderizar formulario genérico

```tsx
<GenericForm
  fields={fields}
  onSubmit={async (values) => {
    // Persistencia en API o estado global
  }}
/>
```

### 3. Definir columnas y acciones de tabla

```ts
const columns: TableColumn<MyEntity>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Nombre' },
  { key: 'createdAt', header: 'Creado', render: (row) => formatDate(row.createdAt) },
];
```

```tsx
<DataTable
  data={rows}
  columns={columns}
  getRowId={(row) => row.id}
  actions={[
    { label: 'Ver', onClick: handleView },
    { label: 'Editar', variant: 'secondary', onClick: handleEdit },
    { label: 'Eliminar', variant: 'danger', onClick: handleDelete },
  ]}
/>
```

### 4. Integrar búsqueda optimizada

```tsx
<SearchBar
  value={query}
  onSearch={setQuery}
  placeholder="Buscar registros"
  debounceMs={350}
/>
```

## Escalabilidad recomendada

- Conectar `GenericForm` a un motor de validación adicional por módulo cuando existan reglas complejas.
- Integrar `DataTable` con paginación server-side y carga incremental (`lazy loading`).
- Mantener nuevos componentes sobre los mismos tokens para evitar deriva visual.

## Scripts

- `npm run dev`: servidor local.
- `npm run build`: build de producción y validación de tipos.
- `npm run lint`: validación estática.
