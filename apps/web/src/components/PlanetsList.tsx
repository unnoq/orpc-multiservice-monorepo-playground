import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { planetServiceOrpc } from '../lib/service-planet'
import { ErrorMessage } from './ui/ErrorMessage'
import { InfoMessage } from './ui/InfoMessage'
import { InterfaceWindow } from './ui/InterfaceWindow'

interface Planet {
  id: number
  name: string
  description?: string
  imageUrl?: string
}

export function PlanetsList() {
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
  } = useSuspenseInfiniteQuery(
    planetServiceOrpc.planet.list.infiniteOptions({
      input: cursor => ({ cursor, limit: 10 }),
      getNextPageParam: lastPage =>
        lastPage.length === 10 ? lastPage.at(-1)?.id : null,
      initialPageParam: 0,
    }),
  )

  if (status === 'error') {
    return (
      <div className="card">
        <div className="card-body">
          <ErrorMessage message="Something went wrong loading planets." />
        </div>
      </div>
    )
  }

  const totalPlanets = data.pages.reduce((acc, page) => acc + page.length, 0)

  return (
    <InterfaceWindow
      tabs={[
        { label: 'PLANETS DATABASE', isActive: true },
        { label: 'QUERY' },
        { label: 'RESULTS' },
      ]}
      contentPadding={0}
    >
      <InfoMessage style={{ margin: '20px', borderRadius: 0 }}>
        oRPC + TanStack Query | Infinite Query Example
      </InfoMessage>

      <PlanetsTable planets={data.pages.flatMap(page => page)} />

      <PlanetsTableFooter
        onLoadMore={() => fetchNextPage()}
        onRefresh={() => refetch()}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        totalPlanets={totalPlanets}
      />
    </InterfaceWindow>
  )
}

interface PlanetsTableProps {
  planets: Planet[]
}

function PlanetsTable({ planets }: PlanetsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Image URL</th>
        </tr>
      </thead>
      <tbody>
        {planets.map((planet, index) => (
          <PlanetRow key={`${planet.id}-${index}`} planet={planet} />
        ))}
      </tbody>
    </table>
  )
}

interface PlanetRowProps {
  planet: Planet
}

function PlanetRow({ planet }: PlanetRowProps) {
  return (
    <tr>
      <td>
        <code
          style={{
            fontFamily: '\'Courier New\', Courier, monospace',
            fontSize: '13px',
            background: '#f9f9f9',
            padding: '2px 6px',
            border: '1px solid #e0e0e0',
          }}
        >
          {planet.id}
        </code>
      </td>
      <td style={{ fontWeight: 600 }}>{planet.name}</td>
      <td>
        {planet.description || (
          <span style={{ opacity: 0.5 }}>—</span>
        )}
      </td>
      <td>
        {planet.imageUrl
          ? (
              <a
                href={planet.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#5db3e5',
                  textDecoration: 'none',
                  borderBottom: '2px solid #5db3e5',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                VIEW IMAGE →
              </a>
            )
          : (
              <span style={{ opacity: 0.5 }}>No image</span>
            )}
      </td>
    </tr>
  )
}

interface PlanetsTableFooterProps {
  onLoadMore: () => void
  onRefresh: () => void
  hasNextPage: boolean
  isFetching: boolean
  totalPlanets: number
}

function PlanetsTableFooter({
  onLoadMore,
  onRefresh,
  hasNextPage,
  isFetching,
  totalPlanets,
}: PlanetsTableFooterProps) {
  return (
    <tfoot>
      <tr>
        <td colSpan={4}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onLoadMore}
              disabled={!hasNextPage || isFetching}
              className="btn-secondary"
            >
              {isFetching
                ? 'Loading...'
                : hasNextPage
                  ? 'Load More'
                  : 'No More Planets'}
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="btn-link"
              disabled={isFetching}
            >
              Refresh
            </button>

            <span
              style={{
                marginLeft: 'auto',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: '\'Courier New\', Courier, monospace',
              }}
            >
              •
              {' '}
              {totalPlanets}
              {' '}
              planet
              {totalPlanets !== 1 ? 's' : ''}
              {' '}
              loaded
            </span>
          </div>
        </td>
      </tr>
    </tfoot>
  )
}
