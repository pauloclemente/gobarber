import React from 'react'
import { useTransition } from 'react-spring'
import { Container } from './styles'
import { IToastMessage } from '../../hooks/toast'
import Toast from './Toast'

interface IToastContainerProps {
  messages: IToastMessage[]
}
const ToastContainer: React.FC<IToastContainerProps> = ({ messages }) => {
  const messagesWithTransition = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 }
    }
  )
  return (
    <Container>
      {messagesWithTransition.map(({ item, key, props }) => (
        <Toast key={key} style={props} toast={item} />
      ))}
    </Container>
  )
}
export default ToastContainer
