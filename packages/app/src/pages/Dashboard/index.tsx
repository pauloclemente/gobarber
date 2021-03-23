import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import { useAuth } from '../../hooks/auth'
import { useNavigation } from '@react-navigation/native'
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProviderMeta,
  ProviderName,
  ProviderMetaText,
  ProviderInfo,
  ProviderAvatar,
  ProvidersListTitle
} from './styles'
import api from '../../services/api'
export interface IProvider {
  id: string
  name: string
  avatar_url: string
}
const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<IProvider[]>([])
  const { signOut, user } = useAuth()
  const { navigate } = useNavigation()
  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data)
    })
  }, [])
  const navigateToProfile = useCallback(() => {
    signOut()
  }, [signOut])
  const navigateToCreateAppointment = useCallback(
    (provider_id: string) => {
      navigate('CreateAppointment', { provider_id })
    },
    [navigate]
  )

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo,{'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>
        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>
      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabelereiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar source={{ uri: provider.avatar_url }} />
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText> Segunda a Sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText> 8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  )
}

export default Dashboard
