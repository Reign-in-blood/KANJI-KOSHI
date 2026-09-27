function shuffle(items, random) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

function normalizeAnswer(answer, item) {
  if (typeof answer === 'string') {
    return {
      key: item?.id ?? answer,
      label: answer,
    }
  }

  if (!answer || typeof answer !== 'object') {
    throw new Error('getAnswer must return a string or an object')
  }

  const key = answer.key ?? item?.id
  const label = answer.label

  if (typeof key !== 'string' || !key) {
    throw new Error('Every multiple-choice answer needs a non-empty key')
  }

  if (typeof label !== 'string' || !label.trim()) {
    throw new Error('Every multiple-choice answer needs a non-empty label')
  }

  return {
    key,
    label: label.trim(),
  }
}

export function createMultipleChoiceQuestion(subject, pool, options = {}) {
  if (!subject) throw new Error('A subject is required')
  if (!Array.isArray(pool)) throw new Error('The choice pool must be an array')

  const getAnswer = options.getAnswer
  const optionCount = options.optionCount ?? 4
  const random = options.random ?? Math.random
  const isDistractorAllowed = options.isDistractorAllowed ?? (() => true)

  if (typeof getAnswer !== 'function') throw new Error('getAnswer must be a function')
  if (!Number.isInteger(optionCount) || optionCount < 2) {
    throw new Error('optionCount must be an integer greater than 1')
  }
  if (typeof random !== 'function') throw new Error('random must be a function')

  const correct = normalizeAnswer(getAnswer(subject), subject)
  const usedKeys = new Set([correct.key])
  const usedLabels = new Set([correct.label])
  const distractors = []

  const candidates = shuffle(
    pool.filter(item => item !== subject && isDistractorAllowed(item, subject)),
    random,
  )

  for (const candidate of candidates) {
    const answer = normalizeAnswer(getAnswer(candidate), candidate)

    if (usedKeys.has(answer.key) || usedLabels.has(answer.label)) continue

    usedKeys.add(answer.key)
    usedLabels.add(answer.label)
    distractors.push(answer)

    if (distractors.length === optionCount - 1) break
  }

  if (distractors.length !== optionCount - 1) {
    throw new Error(
      `Not enough unique distractors: needed ${optionCount - 1}, found ${distractors.length}`,
    )
  }

  const choices = shuffle(
    [
      { ...correct, isCorrect: true },
      ...distractors.map(answer => ({ ...answer, isCorrect: false })),
    ],
    random,
  )

  return {
    subject,
    correctKey: correct.key,
    choices,
  }
}

export function evaluateMultipleChoice(question, selectedKey) {
  if (!question || !Array.isArray(question.choices)) {
    throw new Error('Invalid multiple-choice question')
  }

  const selected = question.choices.find(choice => choice.key === selectedKey)

  if (!selected) {
    throw new Error(`Unknown choice: ${selectedKey}`)
  }

  return {
    selectedKey,
    correctKey: question.correctKey,
    isCorrect: selectedKey === question.correctKey,
  }
}
