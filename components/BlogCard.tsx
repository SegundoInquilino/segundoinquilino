interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
  category?: string
}

export default function BlogCard({ title, excerpt, date, slug, category }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {category && (
        <span className="text-sm text-purple-600 font-medium mb-3 block">
          {category}
        </span>
      )}
      
      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
        {title}
      </h2>
      
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {excerpt}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {date}
        </span>
        <a 
          href={`/blog/${slug}`} 
          className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center"
        >
          Ler mais 
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </a>
      </div>
    </article>
  )
} 