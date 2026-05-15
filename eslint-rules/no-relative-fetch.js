const rule = {
  create (context) {
    return {
      CallExpression (node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'fetch') return
        const firstArg = node.arguments[0]
        if (!firstArg) return

        if (firstArg.type === 'Literal' && typeof firstArg.value === 'string' && /^\.?\//.test(firstArg.value)) {
          context.report({
            node: firstArg,
            message:
              'Use an absolute URL (https://synergism.cc/...) in fetch(). Relative URLs resolve against capacitor://localhost on mobile.'
          })
        }

        if (firstArg.type === 'TemplateLiteral' && /^\.?\//.test(firstArg.quasis[0]?.value.raw ?? '')) {
          context.report({
            node: firstArg,
            message:
              'Use an absolute URL (https://synergism.cc/...) in fetch(). Relative URLs resolve against capacitor://localhost on mobile.'
          })
        }
      }
    }
  }
}

export default {
  meta: { name: 'synergism-rules' },
  rules: { 'no-relative-fetch': rule }
}
