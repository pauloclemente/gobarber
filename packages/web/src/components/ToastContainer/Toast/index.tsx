import React, { useEffect } from 'react'
import { FiAlertCircle, FiXCircle, FiInfo, FiCheckCircle } from 'react-icons/fi'
import { Container } from './styles'
import { IToastMessage, useToast } from '../../../hooks/toast'

interface IToastProps {
  toast: IToastMessage
  // eslint-disable-next-line @typescript-eslint/ban-types
  style: object
}
const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />
}

const Toast: React.FC<IToastProps> = ({ toast, style }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [removeToast, toast.id])

  return (
    <Container
      type={toast.type}
      hasDescription={Number(!!toast.description)}
      style={style}
    >
      {icons[toast.type || 'info']}
      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>
      <button onClick={() => removeToast(toast.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}
export default Toast
