import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/useAuthStore'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'

const registerSchema = z
  .object({
    nome: z.string().min(2, 'Informe seu nome'),
    email: z.string().email('Digite um e-mail válido'),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const signUp = useAuthStore((state) => state.signUp)
  const isLoading = useAuthStore((state) => state.isLoading)
  const authError = useAuthStore((state) => state.error)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    await signUp(data.nome, data.email, data.password)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 border-none outline-none outline-color-transparent focus:outline-none focus:outline-color-transparent">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Cadastrar
          </CardTitle>

          <CardDescription className="text-center">
            Crie sua conta para continuar
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>

              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                aria-invalid={Boolean(errors.nome)}
                {...register('nome')}
              />

              {errors.nome && (
                <p className="text-sm text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>

              <Input
                id="email"
                type="email"
                placeholder="voce@email.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>

              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register('confirmPassword')}
              />

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {authError && (
              <p className="text-sm text-destructive">
                {authError}
              </p>
            )}

            <p>Já possui uma conta? <Link to="/login" className="font-medium underline text-primary">Entre aqui</Link></p>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </main>
  )
}