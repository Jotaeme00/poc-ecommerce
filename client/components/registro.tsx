'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Registro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const validarFormulario = () => {
    if (!email || !senha || !confirmarSenha) {
      setErro('Todos os campos são obrigatórios.')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro('Por favor, insira um email válido.')
      return false
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return false
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso(false)

    if (validarFormulario()) {
      try {
        const resposta = await fetch('http://localhost:3001/registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha }),
        })

        if (resposta.ok) {
          setSucesso(true)
          setEmail('')
          setSenha('')
          setConfirmarSenha('')
        } else {
          const dados = await resposta.json()
          setErro(dados.mensagem || 'Ocorreu um erro ao registrar. Tente novamente.')
        }
      } catch (error) {
        setErro('Erro de conexão. Verifique sua internet e tente novamente.')
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Registre-se para acessar nossa plataforma.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
            <Input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>
          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
          {sucesso && (
            <Alert>
              <AlertDescription>Registro realizado com sucesso!</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">Registrar</Button>
        </form>
      </CardContent>
    </Card>
  )
}