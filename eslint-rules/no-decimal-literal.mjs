const MESSAGE =
  'Compare against a module-scope Decimal constant instead of a literal. A string/number argument goes through fromString()/fromNumber() on every call, which is slower than comparing against an already-constructed Decimal.'

const COMPARISON_METHODS = new Set([
  'cmp',
  'compare',
  'eq',
  'equals',
  'neq',
  'notEquals',
  'lt',
  'lessThan',
  'lte',
  'lessThanOrEqualTo',
  'gt',
  'greaterThan',
  'gte',
  'greaterThanOrEqualTo'
])

function isDecimalSourceLiteral (node) {
  if (
    node.type === 'Literal' && node.value !== 0 && (
      typeof node.value === 'string' || typeof node.value === 'number'
    )
  ) return true

  return node.type === 'TemplateLiteral' && node.expressions.length === 0
}

function rootIdentifierName (node) {
  let current = node
  while (current) {
    if (current.type === 'MemberExpression') current = current.object
    else if (current.type === 'CallExpression') current = current.callee
    else break
  }

  return current?.type === 'Identifier' ? current.name : null
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow literals as arguments to Decimal comparison methods. oxlint JS plugins receive no type information (context.parserServices is empty), so receivers are matched by method name; use ignoreReceiverRoots to exempt non-Decimal APIs that share these method names.'
    },
    schema: [{
      type: 'object',
      properties: {
        ignoreReceiverRoots: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      additionalProperties: false
    }]
  },
  create (context) {
    const ignoreReceiverRoots = new Set(context.options?.[0]?.ignoreReceiverRoots ?? ['z'])

    return {
      CallExpression (node) {
        const callee = node.callee
        if (callee.type !== 'MemberExpression' || callee.computed || callee.property.type !== 'Identifier') return
        if (!COMPARISON_METHODS.has(callee.property.name)) return
        if (ignoreReceiverRoots.has(rootIdentifierName(callee.object))) return

        const isStatic = callee.object.type === 'Identifier' && callee.object.name === 'Decimal'
        const args = isStatic ? node.arguments : node.arguments.slice(0, 1)

        for (const argument of args) {
          if (isDecimalSourceLiteral(argument)) {
            context.report({ node: argument, message: MESSAGE })
          }
        }
      }
    }
  }
}
