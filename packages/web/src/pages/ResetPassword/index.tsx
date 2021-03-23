import { FormHandles } from '@unform/core'
import React, { useCallback, useRef } from 'react'
import * as Yup from 'yup'
import { useHistory, useLocation } from 'react-router-dom'
import { Form } from '@unform/web'
import { FiLock } from 'react-icons/fi'
import { useToast } from '../../hooks/toast'

import { AnimationContainer, Background, Container } from './styles'
import getValidationErrors from '../../utils/getValidationErrors'
import { Content } from '../SignIn/styles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logo from '../../assets/logo.svg'
import api from '../../services/api'

interface IResetPasswordFormData {
  password: string
  password_confirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()
  const location = useLocation()

  const handleSubmit = useCallback(
    async (data: IResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Senhas estão diferentes'
          )
        })
        await schema.validate(data, {
          abortEarly: false
        })
        const { password, password_confirmation } = data
        // eslint-disable-next-line no-restricted-globals
        const token = location.search.replace('?token=', '')
        if (!token) {
          throw new Error()
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token
        })

        history.push('/')
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente'
        })
      }
    },
    [addToast, history, location.search]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />
            <Button type="submit"> Resetar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ResetPassword
