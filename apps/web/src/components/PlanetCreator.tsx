import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { planetServiceOrpc } from '../lib/service-planet'
import { Card } from './ui/Card'
import { InfoMessage } from './ui/InfoMessage'

interface PlanetFormData {
  name: string
  description?: string
  image?: File
}

export function PlanetCreator() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<PlanetFormData>({
    name: '',
    description: '',
  })

  const createPlanetMutation = useMutation(
    planetServiceOrpc.planet.create.mutationOptions({
      onSuccess() {
        // Invalidate and refetch planets list
        queryClient.invalidateQueries({
          queryKey: planetServiceOrpc.planet.key(),
        })

        // Reset form
        setFormData({ name: '', description: '' })

        // Clear file input manually
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]')
        if (fileInput) {
          fileInput.value = ''
        }
      },
      onError(error) {
        console.error('Failed to create planet:', error)
        // eslint-disable-next-line no-alert
        alert(`Failed to create planet: ${error.message}`)
      },
    }),
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const name = form.get('name') as string
    const description = (form.get('description') as string | null) ?? undefined
    const image = form.get('image') as File

    createPlanetMutation.mutate({
      name,
      description,
      image: image.size > 0 ? image : undefined,
    })
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
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            placeholder="Describe this planet (optional)..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
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
