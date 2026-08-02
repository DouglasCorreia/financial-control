import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/useAuthStore'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const signIn = useAuthStore((state) => state.signIn)
  const isLoading = useAuthStore((state) => state.isLoading)
  const authError = useAuthStore((state) => state.error)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    const success = await signIn(data.email, data.password)

    if (success) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 border-none outline-none outline-color-transparent focus:outline-none focus:outline-color-transparent">
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Entrar
          </CardTitle>
          
          <CardDescription className="text-center">
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>

              <Input
                id="email"
                type="email"
                placeholder="voce@email.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
                className="input"
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
                className="input"
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {authError && (
              <p className="text-sm text-center text-destructive space-y-2 bg-red-100 p-2 rounded-2xl">
                {authError}
              </p>
            )}

            <Button
              type="submit"
              className="btn-ok"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Não possui uma conta? <Link to="/cadastro" className="font-medium underline text-primary">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </form>
      </Card>

      <Card className="box-dashed w-full max-w-sm ring-0 mt-4">
        <CardContent>
          <CardDescription className="text-green-500">
            <CardTitle className="text-sm font-semibold text-center">
              Acesso conta teste
            </CardTitle>

            <p><b className="font-semibold">E-mail:</b> teste@teste.com</p>
            <p><b className="font-semibold">Senha:</b> 123456$!D</p>
          </CardDescription>
        </CardContent>
      </Card>
    </main>
  )
}