import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/useAuthStore'

import { Check, Eye, EyeOff, LoaderCircle, Lock, Mail, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'

const registerSchema = z
  .object({
    nome: z.string().min(3, 'Informe seu nome'),
    email: z.string().email('Digite um e-mail válido'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/\d/, 'A senha deve conter pelo menos um número')
      .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;']/,
        'A senha deve conter pelo menos um caractere especial'
    ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;']/

export default function Register() {
  const signUp = useAuthStore((state) => state.signUp)
  const isLoading = useAuthStore((state) => state.isLoading)
  const authError = useAuthStore((state) => state.error)
  const navigate = useNavigate()

  const [lockPassword, setLockPassword] = useState(true)
  const [password, setPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const passwordField = register('password', {
    onChange: (event) => setPassword(event.target.value),
  })

  const passwordRules = [
    {
      label: 'Pelo menos 8 caracteres',
      valid: password.length >= 8,
    },
    {
      label: 'Uma letra maiúscula',
      valid: /[A-Z]/.test(password),
    },
    {
      label: 'Uma letra minúscula',
      valid: /[a-z]/.test(password),
    },
    {
      label: 'Um número',
      valid: /\d/.test(password),
    },
    {
      label: 'Um caractere especial',
      valid: specialCharacterRegex.test(password),
    },
  ]

  const onSubmit = async (data: RegisterFormData) => {
    const success = await signUp(
      data.nome,
      data.email,
      data.password,
    )

    if (success) {
      navigate('/dashboard', { replace: true })
    }
  }

  const toogleIcon = () => {
    setLockPassword((prev) => !prev);
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
                className="input"
              />

              {errors.nome && (
                <p className="text-sm text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />

                <Input
                  id="email"
                  type="email"
                  placeholder="voce@email.com"
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
                  {...passwordField}
                  className="input pl-8.5"
                />

                <div className="absolute right-3 top-1/2 h-4 w- -translate-y-1/2 cursor-pointer" onClick={() => toogleIcon()}>
                  <Eye className={`${lockPassword ? "hidden" : "block"} absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300`} />

                  <EyeOff className={`${lockPassword ? "block" : "hidden"} absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300`} />
                </div>
              </div>

              <ul className="space-y-1">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className="text-foreground"
                  >
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      {rule.valid ? (
                        <Check className="size-4 text-chateau-green-600" aria-hidden="true" />
                      ) : (
                        <X className="size-4 text-red-500" aria-hidden="true" />
                      )}
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>

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
                className="input"
              />

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
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
              {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : 'Cadastrar'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Já possui uma conta? <Link to="/login" className="font-medium underline text-primary">Entre aqui</Link>
            </p>
          </CardContent>
        </form>
      </Card>
    </main>
  )
}
