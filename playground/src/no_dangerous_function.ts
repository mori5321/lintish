import { Rule } from 'eslint'


const lintCode = (context: Rule.RuleContext, node: Rule.Node): void => {
    // const filepath = context.getFilename()
    // const cwd = context.getCwd()
    // const relativeFilePath = filepath.replace(cwd, '')

    // if (relativeFilePath.startsWith('/dangerous')) {
    //     return
    // }

    context.report({
        node,
        message: 'function name cannot be dangeraous'
    })
}

// const ruleModule: Rule.RuleModule = {
module.exports = {
    meta: {
        type: 'problem',
        fixable: 'code',
        docs: {
            description: 'Disallow the use of the dangerous function outside of /dangerous.',
            category: 'Possible Errors',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => {
                if (node.callee.type === 'FunctionExpression') {
                    if (node.callee.id?.name === 'dangerous') {
                        lintCode(context, node)
                    }
                }
            },
            FunctionDeclaration: (node) => {
                if (node.id?.name === 'dangerous') {
                    lintCode(context, node)
                }
            },
            ArrowFunctionExpression: (node) => {
                if (node.parent.type === 'FunctionDeclaration' && node.parent.id?.name === 'dangerous') {
                    lintCode(context, node)
                }
            }
        
        }
    }
} as Rule.RuleModule

// module.exports = ruleModule
