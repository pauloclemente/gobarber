/* eslint-disable import/no-duplicates */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isToday, format, parseISO, isAfter } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'

import DayPicker, { DayModifiers } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { FiClock, FiPower } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/auth'
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment
} from './styles'
import logo from '../../assets/logo.svg'
import api from '../../services/api'

interface IMonthAvailabilityItem {
  day: number
  available: boolean
}
interface IAppointmentData {
  user: { name: string; avatar_url: string }
  hourFormatted: string
  id: string
  date: string
}
const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth()
  const [appointments, setAppointments] = useState<IAppointmentData[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabilityItem[]
  >([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day)
    }
  }, [])
  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])
  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        return new Date(year, month, Number(monthDay.day))
      })
    return dates
  }, [currentMonth, monthAvailability])
  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBr })
  }, [selectedDate])
  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBr })
  }, [selectedDate])
  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12
    })
  }, [appointments])
  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12
    })
  }, [appointments])
  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appointments])
  // month availability
  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1
        }
      })
      .then(response => {
        setMonthAvailability(response.data)
      })
  }, [currentMonth, user.id])
  // appointments
  useEffect(() => {
    api
      .get<IAppointmentData[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate()
        }
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm')
          }
        })
        setAppointments(appointmentsFormatted)
      })
  }, [selectedDate])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logo} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button onClick={signOut} type="button">
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Hor??rios agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manh??</strong>
            {morningAppointments.length === 0 && (
              <p> Nenhum agendamento nesse per??odo</p>
            )}
            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p> Nenhum agendamento nesse per??odo</p>
            )}
            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Mar??o',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro'
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  )
}

export default Dashboard
