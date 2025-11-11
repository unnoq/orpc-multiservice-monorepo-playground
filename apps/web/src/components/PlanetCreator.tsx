import { useMutation, useQueryClient } from '@tanstack/react-query'
import { planetServiceOrpc } from '../lib/service-planet'
import { Card } from './ui/Card'
import { InfoMessage } from './ui/InfoMessage'

export function PlanetCreator() {
  const queryClient = useQueryClient()

  const createPlanetMutation = useMutation(
    planetServiceOrpc.planet.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: planetServiceOrpc.planet.key(),
        })
      },
      onError(error) {
        console.error('Failed to create planet:', error)
        // eslint-disable-next-line no-alert
        alert(`Failed to create planet: ${error.message}`)
      },
    }),
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const name = form.get('name') as string
    const description = (form.get('description') as string | null) ?? undefined
    const image = form.get('image') as File

    await createPlanetMutation.mutateAsync({
      name,
      description,
      image: image.size > 0 ? image : undefined,
    })

    e.currentTarget.reset()
  }

  return (
    <Card title="CREATE PLANET">
      <InfoMessage className="mb-20">
        oRPC + TanStack Query | Mutation Example
      </InfoMessage>

      <form onSubmit={handleSubmit}>
        <label>
          Planet Name
          <input
            type="text"
            name="name"
            required
            placeholder="Enter planet name..."
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            placeholder="Describe this planet (optional)..."
          />
        </label>

        <label>
          Planet Image
          <input type="file" name="image" accept="image/*" />
        </label>

        <button
          type="submit"
          className="btn-primary"
          disabled={createPlanetMutation.isPending}
        >
          {createPlanetMutation.isPending ? 'Creating...' : 'Create Planet'}
        </button>
      </form>
    </Card>
  )
}
