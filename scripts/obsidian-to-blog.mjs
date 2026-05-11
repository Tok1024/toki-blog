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
  --tags <t1,t2>       comma-separated tags (merged with Obsidian frontmatter tags)
  --summary <text>     custom summary (auto-extracted if omitted)
  --draft              create as draft
  --overwrite          overwrite existing output file
  --dry-run            preview output without writing
  --help               show help

Transforms applied:
  - Obsidian image embeds ![[img]] → standard markdown images
  - Local markdown images → copied to public/static/images/<slug>/
  - Wiki-links [[page]] and [[page|alias]] → plain text or links
  - Obsidian callouts > [!TYPE] → remark-github-blockquote-alert format
  - Obsidian highlights ==text== → <mark>text</mark>
  - Obsidian comments %%...%% → removed
  - Bare #tags in content → removed (use frontmatter tags instead)
  - Preserves existing Obsidian frontmatter (tags, summary, etc.)
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
    .filter((line) => !line.startsWith('> [!'))
    .filter((line) => !line.startsWith('```'))
    .filter((line) => !line.startsWith('%%'))
    .filter((line) => !line.startsWith('---'))
  const summary = lines.find((line) => line.length > 12) || '从 Obsidian 导入的笔记。'
  return summary.replace(/[*_~`=]/g, '').slice(0, 120)
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

// --- Obsidian-specific transforms ---

function convertWikiLinks(content) {
  // [[page|alias]] → alias
  // [[page]] → page (just the display name)
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, inner) => {
    const parts = inner.split('|')
    const display = parts.length > 1 ? parts[1].trim() : parts[0].trim()
    // Strip any path prefix, keep just the note name
    const cleaned = display.replace(/^.*\//, '')
    return cleaned
  })
}

function convertHighlights(content) {
  // ==highlighted text== → <mark>highlighted text</mark>
  return content.replace(/==([^=]+)==/g, '<mark>$1</mark>')
}

function removeObsidianComments(content) {
  // %%block comments%% (can span multiple lines)
  let result = content.replace(/%%[\s\S]*?%%/g, '')
  return result
}

function removeBareHashtags(content) {
  // Remove #tag patterns that aren't headings (line doesn't start with #)
  // Be careful not to remove # in code blocks or headings
  const lines = content.split('\n')
  let inCodeBlock = false
  const processed = lines.map((line) => {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return line
    }
    if (inCodeBlock) return line
    // Don't touch heading lines
    if (/^\s*#{1,6}\s/.test(line)) return line
    // Remove standalone #tags (word boundary before #, letters/digits/- after)
    return line.replace(/(?<=\s|^)#([a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_/-]*)/g, '$1')
  })
  return processed.join('\n')
}

function normalizeCallouts(content) {
  // Obsidian callouts use > [!TYPE] which is already the remark-github-blockquote-alert format
  // But Obsidian also supports > [!TYPE]- (foldable) and > [!TYPE]+ (default open)
  // Normalize these to just > [!TYPE]
  return content.replace(/^(>\s*\[![A-Z]+\])[+-]\s*/gm, '$1 ')
}

function normalizeBlankLines(content) {
  // Collapse 3+ consecutive blank lines into 2
  return content.replace(/\n{4,}/g, '\n\n\n')
}

async function transformContent(content, noteDir, vaultRoot, slug) {
  let output = content

  // 1. Remove Obsidian comments first (before other transforms see them)
  output = removeObsidianComments(output)

  // 2. Handle Obsidian image embeds: ![[image.png]] or ![[image.png|400]]
  const obsidianEmbeds = [...output.matchAll(/!\[\[([^\]]+)\]\]/g)]
  for (const match of obsidianEmbeds) {
    const raw = match[1]
    const target = raw.split('|')[0].trim()
    // Check if it's an image (common extensions)
    if (/\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i.test(target)) {
      const source = await resolveAttachment(noteDir, vaultRoot, target)
      if (source) {
        const publicPath = await copyAttachment(source, slug)
        output = output.replace(match[0], `![](${publicPath})`)
      } else {
        console.warn(`  Warning: Could not find image: ${target}`)
      }
    } else {
      // Non-image embed (e.g. ![[other-note]]) → convert to text reference
      const display = raw.split('|').pop().trim().replace(/^.*\//, '')
      output = output.replace(match[0], `*See: ${display}*`)
    }
  }

  // 3. Handle local markdown images (non-URL, non-already-processed)
  const markdownImages = [...output.matchAll(/!\[([^\]]*)\]\((?!https?:\/\/|\/static\/)([^)]+)\)/g)]
  for (const match of markdownImages) {
    const imgPath = decodeURIComponent(match[2])
    const source = await resolveAttachment(noteDir, vaultRoot, imgPath)
    if (source) {
      const publicPath = await copyAttachment(source, slug)
      output = output.replace(match[0], `![${match[1]}](${publicPath})`)
    } else {
      console.warn(`  Warning: Could not find image: ${imgPath}`)
    }
  }

  // 4. Convert remaining wiki-links to plain text
  output = convertWikiLinks(output)

  // 5. Convert Obsidian highlights
  output = convertHighlights(output)

  // 6. Normalize callout foldable syntax
  output = normalizeCallouts(output)

  // 7. Remove bare #tags from content
  output = removeBareHashtags(output)

  // 8. Normalize excessive blank lines
  output = normalizeBlankLines(output)

  return output
}

function mergeTags(obsidianTags, cliTags) {
  const all = new Set()
  // Obsidian frontmatter tags
  if (Array.isArray(obsidianTags)) {
    obsidianTags.forEach((t) => all.add(String(t).toLowerCase().trim()))
  } else if (typeof obsidianTags === 'string') {
    obsidianTags.split(',').forEach((t) => {
      const cleaned = t.trim().replace(/^#/, '').toLowerCase()
      if (cleaned) all.add(cleaned)
    })
  }
  // CLI --tags
  if (cliTags) {
    cliTags.split(',').forEach((t) => {
      const cleaned = t.trim().toLowerCase()
      if (cleaned) all.add(cleaned)
    })
  }
  // Always include 'note' if empty
  if (all.size === 0) all.add('note')
  return [...all]
}

function parseArgs(argv) {
  const args = { query: '', section: 'study', draft: false, overwrite: false, dryRun: false }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--vault' || token === '-v') args.vault = argv[++i]
    else if (token === '--section' || token === '-s') args.section = argv[++i]
    else if (token === '--slug') args.slug = argv[++i]
    else if (token === '--title') args.title = argv[++i]
    else if (token === '--tags' || token === '-t') args.tags = argv[++i]
    else if (token === '--summary') args.summary = argv[++i]
    else if (token === '--draft') args.draft = true
    else if (token === '--overwrite') args.overwrite = true
    else if (token === '--dry-run') args.dryRun = true
    else if (token === '--help' || token === '-h') args.help = true
    else if (!args.query && !token.startsWith('-')) {
      args.query = token
    } else throw new Error(`Unknown argument: ${token}`)
  }
  return args
}

function escapeYamlString(str) {
  if (/[:'"\n]/.test(str)) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  }
  return `'${str}'`
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

  if (!args.overwrite && !args.dryRun && (await exists(outputFile))) {
    throw new Error(`Output already exists: ${outputFile}. Use --overwrite to replace it.`)
  }

  console.log(`Source: ${path.relative(vaultRoot, sourceFile)}`)
  console.log(`Slug:   ${slug}`)

  const transformed = await transformContent(
    parsed.content,
    path.dirname(sourceFile),
    vaultRoot,
    slug
  )

  // Merge tags from Obsidian frontmatter and CLI
  const tags = mergeTags(parsed.data.tags, args.tags)
  const summary =
    args.summary || parsed.data.summary || parsed.data.description || extractSummary(transformed)
  const date = parsed.data.date ? new Date(parsed.data.date).toISOString().slice(0, 10) : today()

  const frontmatter = `---
title: ${escapeYamlString(sourceTitle)}
date: ${date}
lastmod: ${today()}
section: ${args.section}
tags: [${tags.join(', ')}]
summary: ${escapeYamlString(summary)}
images: []
draft: ${args.draft ? 'true' : 'false'}
authors: ['default']
layout: PostLayout
canonicalUrl: ''
---

`

  const finalContent = frontmatter + transformed.trimStart() + '\n'

  if (args.dryRun) {
    console.log('\n--- DRY RUN (preview) ---\n')
    // Show first 60 lines
    const previewLines = finalContent.split('\n').slice(0, 60)
    console.log(previewLines.join('\n'))
    if (finalContent.split('\n').length > 60) {
      console.log(`\n... (${finalContent.split('\n').length - 60} more lines)`)
    }
    console.log('\n--- END DRY RUN ---')
    return
  }

  await fs.mkdir(BLOG_DATA_DIR, { recursive: true })
  await fs.writeFile(outputFile, finalContent, 'utf8')

  console.log(`Output: ${path.relative(BLOG_ROOT, outputFile)}`)
  console.log(`Section: ${args.section}`)
  console.log(`Tags: ${tags.join(', ')}`)
  console.log(`Summary: ${summary.slice(0, 60)}...`)
}

main().catch((error) => {
  console.error(`oblog failed: ${error.message}`)
  process.exit(1)
})
