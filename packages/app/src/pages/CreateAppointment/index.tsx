import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'

import { useAuth } from '../../hooks/auth'
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProviderListContainer,
  ProviderList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerBtn,
  OpenDatePickerBtnTxt,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourTxt,
  Content,
  CreateAppointmentBtn,
  CreateAppointmentBtnTxt
} from './styles'

import api from '../../services/api'
import { Alert, Platform } from 'react-native'

interface IRouteParams {
  provider_id: string
}
interface IAvailabilityProps {
  hour: number
  available: boolean
}
export interface IProvider {
  id: string
  name: string
  avatar_url: string
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()
  const route = useRoute()
  const { goBack, navigate } = useNavigation()
  const route_params = route.params as IRouteParams

  const [selectedHour, setSelectedHour] = useState(0)
  const [availability, setAvailability] = useState<IAvailabilityProps[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [providers, setProviders] = useState<IProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    route_params.provider_id
  )

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data)
    })
  }, [])
  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate()
        }
      })
      .then(response => {
        setAvailability(response.data)
      })
  }, [selectedDate, selectedProvider])
  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])
  const handleSelectProvider = useCallback((provider_id: string) => {
    setSelectedProvider(provider_id)
  }, [])
  const handleToogleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state)
  }, [])
  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false)
      }
      if (date) {
        setSelectedDate(date)
      }
    },
    []
  )
  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability])
  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability])
  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])
  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)
      date.setHours(selectedHour + 3)
      date.setMinutes(0)

      await api.post('appointments', {
        provider_id: selectedProvider,
        date
      })
      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente'
      )
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider])
  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProviderListContainer>
          <ProviderList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => {
                  handleSelectProvider(provider.id)
                }}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProviderListContainer>
        <Calendar>
          <Title>Escolha a data</Title>
          <OpenDatePickerBtn onPress={handleToogleDatePicker}>
            <OpenDatePickerBtnTxt>Selecionar outra data</OpenDatePickerBtnTxt>
          </OpenDatePickerBtn>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChanged}
              value={selectedDate}
            />
          )}
        </Calendar>
        <Schedule>
          <Title>Escolha o horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourTxt selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourTxt>
                </Hour>
              ))}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormatted}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourTxt selected={selectedHour === hour}>
                      {hourFormatted}
                    </HourTxt>
                  </Hour>
                )
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentBtn onPress={handleCreateAppointment}>
          <CreateAppointmentBtnTxt>Agendar</CreateAppointmentBtnTxt>
        </CreateAppointmentBtn>
      </Content>
    </Container>
  )
}

export default CreateAppointment
