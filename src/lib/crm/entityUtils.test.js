import { describe, expect, it } from 'vitest'
import { extractCollection, resolveEntityId } from './entityUtils.js'

describe('entityUtils', () => {
  it('extracts arrays from known collection keys', () => {
    const payload = {
      data: [
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Beta' },
      ],
    }

    expect(extractCollection(payload)).toHaveLength(2)
  })

  it('returns empty collection for unknown payload shape', () => {
    expect(extractCollection({ foo: 'bar' })).toEqual([])
  })

  it('resolves entity id from known id fields', () => {
    expect(resolveEntityId({ dealId: 42 })).toBe('42')
    expect(resolveEntityId({ id: 'abc-123' })).toBe('abc-123')
  })
})
