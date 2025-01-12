'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Faça login para continuar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-gray-600">
            Para ver os detalhes completos da review, você precisa estar logado.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/auth" className="w-full">
              <Button className="w-full" variant="default">
                Fazer login
              </Button>
            </Link>
            <Link href="/auth?mode=signup" className="w-full">
              <Button className="w-full" variant="outline">
                Criar uma conta
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 