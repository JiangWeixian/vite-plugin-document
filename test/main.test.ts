import { welcome } from '../src'
import { describe, test, expect, vi } from 'vitest'

describe('index', () => {
  test('demo part', () => {
    console.log = vi.fn()
    welcome()
    expect(console.log).toHaveBeenCalledWith('hello world')
  })
})
