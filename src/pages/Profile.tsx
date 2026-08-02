import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const nameSchema = z.object({
  nome: z.string().min(3, 'Informe um nome válido'),
})

const passwordSchema = z
  .object({
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

type NameFormData = z.infer<typeof nameSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function Profile() {
    const user = useAuthStore((state) => state.user)
    const profile = useAuthStore((state) => state.profile)
    const setProfile = useAuthStore((state) => state.setProfile)
    const isLoading = useAuthStore((state) => state.isLoading)

    const [nameMessage, setNameMessage] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    const nameForm = useForm<NameFormData>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            nome: profile?.nome ?? '',
        },
    })

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    })

     useEffect(() => {
        nameForm.reset({
            nome: profile?.nome ?? '',
        })
    }, [profile, nameForm])

    const updateName = async (data: NameFormData) => {
        if (!user) return

        const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({ nome: data.nome })
        .eq('id', user.id)
        .select('id, nome, created_at')
        .single()

        if (error) {
            setNameMessage(error.message)

            return
        }

        setProfile(updatedProfile)
        setNameMessage('Nome atualizado com sucesso.')

        setTimeout(() => {
            setNameMessage('')
        }, 3000)
    }

    const updatePassword = async (data: PasswordFormData) => {
        const { error } = await supabase.auth.updateUser({
        password: data.password,
        })

        if (error) {
            setPasswordMessage(error.message)
            
            return
        }

        passwordForm.reset()
        setPasswordMessage('Senha atualizada com sucesso.')

        setTimeout(() => {
            setPasswordMessage('')
        }, 3000)
    }

    return (
        <div className="w-full max-w-2xl">
            <Card className="card-full">
                <CardHeader>
                    <CardTitle>Meu perfil</CardTitle>

                    <CardDescription>
                        Atualize seus dados pessoais.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    <form
                        onSubmit={nameForm.handleSubmit(updateName)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome</Label>

                            <Input
                                className="input"
                                id="nome"
                                {...nameForm.register('nome')}
                            />

                            {nameForm.formState.errors.nome && (
                                <p className="text-sm text-destructive">
                                {nameForm.formState.errors.nome.message}
                                </p>
                            )}
                        </div>

                        {nameMessage && (
                            <p className="text-sm text-center text-green-500 space-y-2 bg-green-100 p-2 rounded-2xl">
                                {nameMessage}
                            </p>
                        )}

                        <Button className="btn-ok-w-max" type="submit" disabled={isLoading}>
                             {isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="card-full mt-8">
                <CardHeader>
                    <CardTitle>Minha senha</CardTitle>

                    <CardDescription>
                        Atualize sua senha.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    <form
                        onSubmit={passwordForm.handleSubmit(updatePassword)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova senha</Label>

                            <Input
                                className="input"
                                id="password"
                                type="password"
                                {...passwordForm.register('password')}
                            />

                            {passwordForm.formState.errors.password && (
                                <p className="text-sm text-destructive">
                                {passwordForm.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirmar nova senha
                            </Label>

                            <Input
                                className="input"
                                id="confirmPassword"
                                type="password"
                                {...passwordForm.register('confirmPassword')}
                            />

                            {passwordForm.formState.errors.confirmPassword && (
                                <p className="text-sm text-destructive">
                                    {passwordForm.formState.errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {passwordMessage && (
                            <p className="text-sm text-center text-green-500 space-y-2 bg-green-100 p-2 rounded-2xl">
                                {passwordMessage}
                            </p>
                        )}

                        <Button className="btn-ok-w-max" type="submit" disabled={isLoading}>
                             {isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}