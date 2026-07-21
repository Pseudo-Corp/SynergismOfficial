const MESSAGE = 'Use new Decimal() to construct zero.'

function isLiteral (node, value) {
  return node.type === 'Literal' && node.value === value
}

function report (context, node, argument) {
  context.report({
    node,
    message: MESSAGE,
    fix (fixer) {
      if (node.type === 'NewExpression') {
        return fixer.replaceText(argument, '')
      }

      return [
        fixer.replaceText(node.callee, 'new Decimal'),
        fixer.replaceText(argument, '')
      ]
    }
  })
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow passing an explicit zero when constructing a Decimal'
    },
    fixable: 'code',
    schema: []
  },
  create (context) {
    return {
      NewExpression (node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'Decimal' || node.arguments.length !== 1) return

        const argument = node.arguments[0]
        if (isLiteral(argument, 0) || isLiteral(argument, '0')) {
          report(context, node, argument)
        }
      },
      CallExpression (node) {
        if (
          node.callee.type !== 'MemberExpression'
          || node.callee.computed
          || node.callee.object.type !== 'Identifier'
          || node.callee.object.name !== 'Decimal'
          || node.callee.property.type !== 'Identifier'
          || node.arguments.length !== 1
        ) return

        const argument = node.arguments[0]
        const isExplicitZero = node.callee.property.name === 'fromString'
          ? isLiteral(argument, '0')
          : node.callee.property.name === 'fromNumber' && isLiteral(argument, 0)

        if (isExplicitZero) {
          report(context, node, argument)
        }
      }
    }
  }
}
