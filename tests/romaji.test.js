import test from 'node:test'
import assert from 'node:assert/strict'
import { kanaToRomaji } from '../src/core/romaji.js'

test('romanizes common ON readings written in katakana', () => {
  assert.equal(kanaToRomaji('ショク'), 'shoku')
  assert.equal(kanaToRomaji('ガク'), 'gaku')
})

test('preserves KANJIDIC okurigana separators', () => {
  assert.equal(kanaToRomaji('た.べる'), 'ta.beru')
  assert.equal(kanaToRomaji('の.む'), 'no.mu')
})

test('handles contracted sounds and small tsu', () => {
  assert.equal(kanaToRomaji('キョウ'), 'kyou')
  assert.equal(kanaToRomaji('ガッコウ'), 'gakkou')
})
