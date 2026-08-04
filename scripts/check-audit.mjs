import { readFileSync } from 'node:fs'

const ignoredAdvisories = new Set([
  // This project uses BrowserRouter and does not use React Router RSC APIs.
  'GHSA-qwww-vcr4-c8h2',
])

let report

try {
  const file = readFileSync('npm-audit-report.json')
  const isUtf16Le = file[0] === 0xff && file[1] === 0xfe
  const content = isUtf16Le
    ? file.subarray(2).toString('utf16le')
    : file.toString('utf8').replace(/^\uFEFF/, '')

  report = JSON.parse(content)
} catch {
  console.error('Não foi possível ler o relatório do npm audit.')
  process.exit(1)
}

const vulnerabilities = report.vulnerabilities ?? {}

const hasIgnoredAdvisory = (item) => {
  if (!item || typeof item !== 'object') return false

  const advisoryId = item.url?.split('/').pop()
  return ignoredAdvisories.has(advisoryId)
}

const ignoredPackages = new Set(
  Object.entries(vulnerabilities)
    .filter(([, vulnerability]) =>
      vulnerability.via?.some(hasIgnoredAdvisory),
    )
    .map(([packageName]) => packageName),
)

const onlyIgnoredAdvisories = (vulnerability) => {
  const directAdvisories = (vulnerability.via ?? []).filter(
    (item) => typeof item === 'object',
  )

  if (directAdvisories.length > 0) {
    return directAdvisories.every(hasIgnoredAdvisory)
  }

  return (
    vulnerability.via?.length > 0 &&
    vulnerability.via.every(
      (dependency) =>
        typeof dependency === 'string' && ignoredPackages.has(dependency),
    )
  )
}

const actionable = Object.entries(vulnerabilities).filter(
  ([, vulnerability]) =>
    ['high', 'critical'].includes(vulnerability.severity) &&
    !onlyIgnoredAdvisories(vulnerability),
)

if (actionable.length > 0) {
  console.error('Foram encontradas vulnerabilidades altas ou críticas:')

  for (const [packageName, vulnerability] of actionable) {
    console.error(`- ${packageName}: ${vulnerability.severity}`)
  }

  process.exit(1)
}

console.log('Auditoria aprovada: nenhum alerta alto ou crítico acionável.')
