import React, { useCallback, useRef } from 'react'
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoImg from '../../assets/logo.png'
import {
  Container,
  Title,
  ForgotPassword,
  CreateAccountBtn,
  ForgotPasswordText,
  CreateAccountBtnTxt
} from './styles'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/auth'
interface ISignInDTO {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()
  const { signIn } = useAuth()
  const handleSignIn = useCallback(
    async (data: ISignInDTO) => {
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
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)
          formRef.current?.setErrors(errors)
        }
        Alert.alert(
          'Error na autenticação',
          'Ocorreu um erro ao realizar o login, verifique as credenciais'
        )
      }
    },
    [signIn]
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
              <Title>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
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
                returnKeyType="send"
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Entrar
              </Button>
            </Form>
            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountBtn onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountBtnTxt>Criar uma conta</CreateAccountBtnTxt>
      </CreateAccountBtn>
    </>
  )
}
export default SignIn
