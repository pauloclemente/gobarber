import React, { useRef, useCallback } from 'react'
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoImg from '../../assets/logo.png'
import { Container, Title, BackToSignIn, BackToSignInText } from './styles'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'
interface ISignUpDTO {
  password: string
  name: string
  email: string
}

const SignUp: React.FC = () => {
  const navigation = useNavigation()
  const formRef = useRef<FormHandles>(null)
  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const handleSignUp = useCallback(
    async (data: ISignUpDTO) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mai válido'),
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'No mínimo 6 dígitos')
        })
        await schema.validate(data, { abortEarly: false })
        console.log(data)
        await api.post('/users', data)
        Alert.alert('Usuário cadastrado!', 'Você já fazer login na aplicação.')
        navigation.goBack()
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)
          formRef.current?.setErrors(errors)
          return
        }
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao realizar o cadastro, tente novamente.'
        )
      }
    },
    [navigation]
  )
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                icon="lock"
                name="password"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Criar conta
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn
        onPress={() => {
          navigation.goBack()
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para o logon</BackToSignInText>
      </BackToSignIn>
    </>
  )
}
export default SignUp
