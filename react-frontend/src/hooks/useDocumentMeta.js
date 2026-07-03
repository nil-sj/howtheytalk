import { useEffect } from 'react'

const SITE_NAME = 'HowTheyTalk'
const DEFAULT_DESCRIPTION = 'A personal diary of American English words, idioms, phrases, and usage differences — written for non-native speakers learning practical, everyday English in the United States.'

function setMetaTag(selector, attr, value) {
  let tag = document.querySelector(selector)
  if (!tag) return
  tag.setAttribute(attr, value)
}

export default function useDocumentMeta(title, description) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — American English Idioms, Phrases & Usage Diary`
    document.title = fullTitle

    const desc = description || DEFAULT_DESCRIPTION
    setMetaTag('meta[name="description"]', 'content', desc)
    setMetaTag('meta[property="og:title"]', 'content', fullTitle)
    setMetaTag('meta[property="og:description"]', 'content', desc)
    setMetaTag('meta[name="twitter:title"]', 'content', fullTitle)
    setMetaTag('meta[name="twitter:description"]', 'content', desc)

    return () => {
      document.title = `${SITE_NAME} — American English Idioms, Phrases & Usage Diary`
    }
  }, [title, description])
}
