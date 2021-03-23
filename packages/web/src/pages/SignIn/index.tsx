import React, { useRef, useCallback } from 'react'
import { FiLogIn, FiLock, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import { Container, Content, AnimationContainer, Background } from './styles'
import logo from '../../assets/logo.svg'
import Input from '../../components/Input'
import Button from '../../components/Button'
import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'

interface ISignInFormData {
  email: string
  password: string
}
const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { signIn } = useAuth()
  const { addToast } = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: ISignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mai válido'),
          password: Yup.string().required('Senha obrigatória')
        })
        await schema.validate(data, { abortEarly: false })
        await signIn({ email: data.email, password: data.password })
        history.push('/dashboard')
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)
          formRef.current?.setErrors(errors)
        }
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao realizar o login, verifique as credenciais'
        })
      }
    },
    [signIn, addToast, history]
  )
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1> Faça seu logon</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Entrar</Button>
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn
