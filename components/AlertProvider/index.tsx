'use client';
import { useAlertStore } from '../../stores/alertStore';
import classNames from 'classnames/bind';
import type { IAlert } from '../../types/IAlert';
import { BsCheckCircle, BsInfoCircle } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { PiWarning } from 'react-icons/pi';
import { IoCloseOutline } from 'react-icons/io5';

const cn = classNames.bind({
  info: 'bg-bg-info-alert border-info-alert',
  success: 'bg-bg-success-alert border-success-alert',
  warning: 'bg-bg-warning-alert border-warning-alert',
  error: 'bg-bg-error-alert border-error-alert',
});

const ICONS = {
  success: <BsCheckCircle size={28} className="text-success-alert" />,
  info: <BsInfoCircle size={28} className="text-info-alert" />,
  warning: <PiWarning size={30} className="text-warning-alert" />,
  error: <BiErrorCircle size={32} className="text-error-alert" />,
};

const AlertProvider = () => {
  const { alerts, removeAlert } = useAlertStore();

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-4 max-w-[350px] min-w-[250px]">
      {alerts.map((alert: IAlert, index: number) => (
        <div
          key={index}
          className={cn(
            'w-full',
            'border-l-[10px] rounded-md',
            'p-4 py-6 box',
            'flex gap-3 items-center',
            'relative',
            alert.type
          )}
        >
          <IoCloseOutline
            size={24}
            className={cn(
              'absolute top-3 right-3',
              'cursor-pointer',
              'hover:scale-110',
              {
                'text-error-alert': alert.type === 'error',
                'text-warning-alert': alert.type === 'warning',
                'text-info-alert': alert.type === 'info',
                'text-success-alert': alert.type === 'success',
              }
            )}
            onClick={() => removeAlert(alert.id)}
          />
          <div className="min-w-[40p] w-[40px] h-[40px] flex items-center justify-center">
            {ICONS[alert.type]}
          </div>

          <div className="flex-1">
            <h4 className="font-semibold">{alert.title}</h4>
            <p className="text-lato text-sm">{alert.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertProvider;
