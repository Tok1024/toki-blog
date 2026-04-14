#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BLOG_ROOT = path.resolve(__dirname, '..')
const BLOG_DATA_DIR = path.join(BLOG_ROOT, 'data', 'blog')
const BLOG_IMAGE_DIR = path.join(BLOG_ROOT, 'public', 'static', 'images')
const DEFAULT_VAULT_CANDIDATES = [process.env.OBSIDIAN_VAULT, '/Users/toki/Downloads/Baidu'].filter(
  Boolean
)

function printHelp() {
  console.log(`oblog <query> [options]

Options:
  --vault <path>       Obsidian vault path
  --section <name>     study | life (default: study)
  --slug <slug>        output blog slug
  --title <title>      output blog title
  --draft              create as draft
  --overwrite          overwrite existing output file
  --help               show help
`)
}

async function promptSelect(options, vaultRoot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log('Multiple notes matched:')
  options.slice(0, 20).forEach((file, index) => {
    console.log(`${index + 1}. ${path.relative(vaultRoot, file)}`)
  })

  const answer = await new Promise((resolve) => {
    rl.question('Choose a note number: ', resolve)
  })
  rl.close()

  const selectedIndex = parseInt(String(answer).trim(), 10) - 1
  if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= options.length) {
    throw new Error('Invalid selection.')
  }

  return options[selectedIndex]
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
    .replace(/^-+|-+$/g, '')
}

function sanitizeFileName(fileName) {
  const ext = path.extname(fileName)
  const base = path.basename(fileName, ext)
  const safeBase = base
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${safeBase || 'image'}${ext.toLowerCase()}`
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function walkMarkdownFiles(dir, result = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkMarkdownFiles(fullPath, result)
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      result.push(fullPath)
    }
  }
  return result
}

async function resolveVault(explicitVault) {
  const candidates = explicitVault ? [explicitVault] : DEFAULT_VAULT_CANDIDATES
  for (const candidate of candidates) {
    if (candidate && (await exists(path.join(candidate, '.obsidian')))) {
      return candidate
    }
  }
  throw new Error(
    'No Obsidian vault found. Pass --vault <path> or set OBSIDIAN_VAULT to your vault root.'
  )
}

function extractSummary(content) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'))
    .filter((line) => !line.startsWith('![') && !line.startsWith('![['))
  const summary = lines.find((line) => line.length > 12) || '从 Obsidian 导入的笔记。'
  return summary.slice(0, 120)
}

async function resolveAttachment(noteDir, vaultRoot, rawTarget) {
  const cleanTarget = rawTarget.split('|')[0].trim()
  const candidates = [path.resolve(noteDir, cleanTarget), path.resolve(vaultRoot, cleanTarget)]
  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate
  }

  const baseName = path.basename(cleanTarget)
  const stack = [vaultRoot]
  while (stack.length > 0) {
    const current = stack.pop()
    const entries = await fs.readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
      } else if (entry.name === baseName) {
        return fullPath
      }
    }
  }

  return null
}

async function copyAttachment(sourcePath, slug) {
  const targetDir = path.join(BLOG_IMAGE_DIR, slug)
  await fs.mkdir(targetDir, { recursive: true })
  const fileName = sanitizeFileName(path.basename(sourcePath))
  const targetPath = path.join(targetDir, fileName)
  await fs.copyFile(sourcePath, targetPath)
  return `/static/images/${encodeURIComponent(slug)}/${encodeURIComponent(fileName)}`
}

async function transformContent(content, noteDir, vaultRoot, slug) {
  let output = content

  const obsidianEmbeds = [...content.matchAll(/!\[\[([^\]]+)\]\]/g)]
  for (const match of obsidianEmbeds) {
    const source = await resolveAttachment(noteDir, vaultRoot, match[1])
    if (!source) continue
    const publicPath = await copyAttachment(source, slug)
    output = output.replace(match[0], `![](${publicPath})`)
  }

  const markdownImages = [...output.matchAll(/!\[([^\]]*)\]\((?!https?:\/\/|\/static\/)([^)]+)\)/g)]
  for (const match of markdownImages) {
    const source = await resolveAttachment(noteDir, vaultRoot, match[2])
    if (!source) continue
    const publicPath = await copyAttachment(source, slug)
    output = output.replace(match[0], `![${match[1]}](${publicPath})`)
  }

  return output
}

function parseArgs(argv) {
  const args = { query: '', section: 'study', draft: false, overwrite: false }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--vault') args.vault = argv[++i]
    else if (token === '-v') args.vault = argv[++i]
    else if (token === '--section') args.section = argv[++i]
    else if (token === '-s') args.section = argv[++i]
    else if (token === '--slug') args.slug = argv[++i]
    else if (token === '--title') args.title = argv[++i]
    else if (token === '--draft') args.draft = true
    else if (token === '--overwrite') args.overwrite = true
    else if (token === '--help' || token === '-h') args.help = true
    else if (!args.query && !token.startsWith('-')) {
      args.query = token
    } else throw new Error(`Unknown argument: ${token}`)
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help || !args.query) {
    printHelp()
    process.exit(args.help ? 0 : 1)
  }

  const vaultRoot = await resolveVault(args.vault)
  const markdownFiles = await walkMarkdownFiles(vaultRoot)
  const queryLower = args.query.toLowerCase()
  const matches = markdownFiles.filter((file) =>
    path.basename(file, path.extname(file)).toLowerCase().includes(queryLower)
  )

  if (matches.length === 0) {
    throw new Error(`No note found for query "${args.query}" in ${vaultRoot}`)
  }

  let sourceFile = matches.find(
    (file) => path.basename(file, path.extname(file)).toLowerCase() === queryLower
  )
  if (!sourceFile) {
    if (matches.length > 1) {
      sourceFile = await promptSelect(matches, vaultRoot)
    } else {
      ;[sourceFile] = matches
    }
  }

  const raw = await fs.readFile(sourceFile, 'utf8')
  const parsed = matter(raw)
  const sourceTitle =
    args.title || parsed.data.title || path.basename(sourceFile, path.extname(sourceFile))
  const slug = args.slug || slugify(path.basename(sourceFile, path.extname(sourceFile)))
  const outputFile = path.join(BLOG_DATA_DIR, `${slug}.mdx`)

  if (!args.overwrite && (await exists(outputFile))) {
    throw new Error(`Output already exists: ${outputFile}. Use --overwrite to replace it.`)
  }

  const transformed = await transformContent(
    parsed.content,
    path.dirname(sourceFile),
    vaultRoot,
    slug
  )
  const summary = extractSummary(transformed)
  const date = today()
  const frontmatter = `---
title: '${sourceTitle.replace(/'/g, "\\'")}'
date: ${date}
lastmod: ${date}
section: ${args.section}
tags: [note]
summary: '${summary.replace(/'/g, "\\'")}'
images: []
draft: ${args.draft ? 'true' : 'false'}
authors: ['default']
layout: PostLayout
canonicalUrl: ''
---

`

  await fs.mkdir(BLOG_DATA_DIR, { recursive: true })
  await fs.writeFile(outputFile, frontmatter + transformed.trimStart() + '\n', 'utf8')

  console.log(`Imported: ${path.relative(vaultRoot, sourceFile)}`)
  console.log(`Output: ${path.relative(BLOG_ROOT, outputFile)}`)
  console.log(`Section: ${args.section}`)
}

main().catch((error) => {
  console.error(`oblog failed: ${error.message}`)
  process.exit(1)
})
