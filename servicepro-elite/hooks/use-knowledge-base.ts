import { useState, useCallback } from 'react'

interface Article {
  id: number
  title: string
  content: string
}

export function useKnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([])

  const addArticle = useCallback((newArticle: Omit<Article, 'id'>) => {
    setArticles(prevArticles => [
      ...prevArticles,
      { ...newArticle, id: Date.now() }
    ])
  }, [])

  const updateArticle = useCallback((updatedArticle: Article) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      )
    )
  }, [])

  const deleteArticle = useCallback((id: number) => {
    setArticles(prevArticles => prevArticles.filter(article => article.id !== id))
  }, [])

  return {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
  }
}

