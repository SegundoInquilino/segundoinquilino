export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-4">
            <a
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Termos e Condições
            </a>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Segundo Inquilino. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 