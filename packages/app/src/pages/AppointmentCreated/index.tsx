/* eslint-disable import/no-duplicates */
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import ptBR from 'date-fns/locale/pt-BR'
import { format } from 'date-fns'

import { Container, Title, Description, OkBtn, OkBtnTxt } from './styles'
interface IRouteParams {
  date: number
}
const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation()
  const { params } = useRoute()

  const routeParams = params as IRouteParams
  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard'
        }
      ],
      index: 0
    })
  }, [reset])
  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      { locale: ptBR }
    )
  }, [routeParams.date])
  return (
    <Container>
      <Icon name="check" size={80} color="#04e361" />
      <Title>Agendamento concluído</Title>
      <Description>{formattedDate}</Description>
      <OkBtn onPress={handleOkPressed}>
        <OkBtnTxt>Ok</OkBtnTxt>
      </OkBtn>
    </Container>
  )
}

export default AppointmentCreated
