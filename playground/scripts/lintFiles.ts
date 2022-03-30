import path from 'path'
import glob from 'glob'
import { ESLint} from 'eslint'
// import eslintConfig from '../.eslintrc'

// https://betterprogramming.pub/creating-custom-eslint-rules-cdc579694608

const errorLog = (data: string) => {
    console.log('\x1b[31m', data)
}

const warningLog = (data: string) => {
    console.log('\x1b[33m', data)
}

const successLog = (data: string) => {
    console.log('\x1b[32m', data)
}

const infoLog = (data: string) => {
    console.log('\x1b[34m', data)
}

(async function lintFiles() {
    infoLog('Linting files..')

    const cwd = process.cwd()
    const files = glob.sync('**/*', {
        cwd,
        ignore: ['node_modules/**', 'dist/**', 'src/**', 'scripts/**'],
        nodir: true
    })

    const errors: string[] = []
    const warnings: string[] = []

    const filesToLint = files.filter(file => {
        const extension = path.extname(file)
        return ['.js', '.ts'].includes(extension)
    })

    console.log('Files to Lint', filesToLint)
    console.log('RulePath', path.join(cwd, 'dist', 'src'))

    const eslint = new ESLint({
        cwd,
        // errorOnUnmatchedPattern: true,
        // extensions: ['.ts', '.tsx', '.js'],
        // allowInlineConfig: true,
        // eslint-disable-next-line
    // @ts-ignore
        // baseConfig: eslintConfig,
        rulePaths: [path.join(cwd, 'src')],
        // useEslintrc: true,
        fix: true
    })

    console.log('Before Loop')
    for (const file of filesToLint) {
        infoLog(`Checking ${file}`)
        const filePath = path.join(cwd, file)
        // const filePath = file
        console.log('File Path', filePath)

        try {
            // const lintResult = await eslint.lintFiles([filePath])
            const lintResult = await eslint.lintFiles(filePath)
            // await ESLint.outputFixes(lintResult)
            console.log('LintResult', lintResult)
            if (lintResult.length) {
                lintResult.forEach((r: ESLint.LintResult) => {
                    r.messages.forEach((m) => {
                        if (m.severity === 1) {
                            warnings.push(
                                `⚠️ ${`eslint(${m.ruleId || ''})`}-${m.message} at ${r.filePath}:${m.line}:${m.column}`
                            )
                        }

                        if (m.severity === 2) {
                            errors.push(
                                `❌ ${`eslint(${m.ruleId || ''})`}-${m.message} at ${r.filePath}:${m.line}:${m.column}`
                            )
                        }
                    })
                })
            }
        } catch (e) {
            errors.push((e as Error).message)
        }
    }

    console.log('Errors/Warnings', errors, warnings)

    if (warnings.length) {
        console.log('\x1b[33m', '\x1b[4m', 'Warnings..')
        console.log('%s\x1b[0m', '\t')
        for (const warning of warnings) {
            warningLog(warning)
            console.log(warning)
        }

    }
    if (errors.length) {
        const error = 'Linting Failed:'
        console.log('\x1b[31m', '\x1b[4m', error)
        console.log('%s\x1b[0m', '\t')
        for (const err of errors) {
            errorLog(err)
            console.log(err)
        }
    } else {
        successLog('No linting issue found ✅.')
    }
}()).catch(e => {
    errorLog(e.message)
    process.exit(1)
})
