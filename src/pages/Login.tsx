import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/useAuthStore'

import { Mail, Lock, EyeOff, Eye, LoaderCircle } from "lucide-react";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const signIn = useAuthStore((state) => state.signIn)
  const isLoading = useAuthStore((state) => state.isLoading)
  const authError = useAuthStore((state) => state.error)
  const navigate = useNavigate()

  const [lockPassword, setLockPassword] = useState(true)

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

  const toogleIcon = () => {
    setLockPassword((prev) => !prev);
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

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />

                <Input
                  id="email"
                  type="email"
                  placeholder="teste@email.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email')}
                  className="input pl-8.5"
                />
              </div>

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />

                <Input
                  id="password"
                  type={lockPassword ? "password" : "text"}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register('password')}
                  className="input pl-8.5"
                />

                <div className="absolute right-3 top-1/2 h-4 w- -translate-y-1/2 cursor-pointer" onClick={() => toogleIcon()}>
                  <Eye className={`${lockPassword ? "hidden" : "block"} absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300`} />

                  <EyeOff className={`${lockPassword ? "block" : "hidden"} absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300`} />
                </div>
              </div>

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
              {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
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
          <CardDescription className="text-chateau-green-500">
            <CardTitle className="text-sm font-semibold text-center">
              Acesso conta teste
            </CardTitle>

            <p><b className="font-semibold">E-mail:</b> teste@teste.com</p>
            <p><b className="font-semibold">Senha:</b> 123456$!Dd</p>
          </CardDescription>
        </CardContent>
      </Card>
    </main>
  )
}