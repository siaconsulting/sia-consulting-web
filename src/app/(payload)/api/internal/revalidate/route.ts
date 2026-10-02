import { timingSafeEqual } from 'node:crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getEditorialRevalidationTargets, type EditorialCollection } from '@/utilities/editorialRevalidation'
import { getGlobalRevalidationTargets, PUBLIC_GLOBALS, type PublicGlobal } from '@/utilities/globalRevalidation'

export const runtime = 'nodejs'

const collections = new Set<EditorialCollection>([
  'services', 'sectors', 'trainings', 'publications', 'case-studies', 'team-members', 'references', 'resources',
])

const matchesSecret = (provided: string | null, expected: string) => {
  if (!provided) return false
  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(`Bearer ${expected}`)

  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer)
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATION_SECRET
  if (!secret) return new Response(null, { status: 503 })
  if (!matchesSecret(request.headers.get('authorization'), secret)) {
    return new Response(null, { status: 401 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 8_192) return new Response(null, { status: 413 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(null, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return new Response(null, { status: 400 })
  }

  if ('global' in body) {
    const { global } = body as { global: unknown }
    if (typeof global !== 'string' || !PUBLIC_GLOBALS.includes(global as PublicGlobal)) {
      return new Response(null, { status: 400 })
    }
    const targets = getGlobalRevalidationTargets(global as PublicGlobal)
    for (const { path, type } of targets.paths) revalidatePath(path, type)
    for (const tag of targets.tags) revalidateTag(tag, 'max')
    return new Response(null, { status: 204 })
  }

  if (!('collection' in body) || !('slugs' in body)) return new Response(null, { status: 400 })

  const { collection, slugs } = body as { collection: unknown; slugs: unknown }
  if (
    typeof collection !== 'string' ||
    !collections.has(collection as EditorialCollection) ||
    !Array.isArray(slugs) ||
    slugs.length > 2 ||
    !slugs.every(
      (slug) =>
        slug === null ||
        (typeof slug === 'string' && slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)),
    )
  ) {
    return new Response(null, { status: 400 })
  }

  const targets = getEditorialRevalidationTargets(collection as EditorialCollection, slugs)
  for (const { path, type } of targets.paths) revalidatePath(path, type)
  for (const tag of targets.tags) revalidateTag(tag, 'max')

  return new Response(null, { status: 204 })
}
