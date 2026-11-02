import React from 'react';
import { LuCalendarCheck, LuCheck, LuCircleDot, LuUser } from 'react-icons/lu';

export type StepKey = 'info' | 'wheel' | 'meet';

const STEP_META: Record<StepKey, { label: string; Icon: React.ElementType }> = {
  info: { label: 'Bilgilerin', Icon: LuUser },
  wheel: { label: 'Çark', Icon: LuCircleDot },
  meet: { label: 'Randevu', Icon: LuCalendarCheck },
};

interface StepperProps {
  /** Adımların sırası firmanın çark moduna göre değişir */
  steps: StepKey[];
  /** Aktif adımın sırası; steps.length ise hepsi tamamlandı */
  current: number;
}

const Stepper = ({ steps, current }: StepperProps) => {
  return (
    <ol className="list-none m-0 p-0 flex items-start justify-center max-w-[520px] w-full mx-auto">
      {steps.map((key, i) => {
        const { label, Icon } = STEP_META[key];
        const done = i < current;
        const active = i === current;

        return (
          <React.Fragment key={key}>
            <li
              className="flex flex-col items-center gap-2 w-[84px]"
              aria-current={active ? 'step' : undefined}
            >
              <span
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  done
                    ? 'bg-ck-brand text-white'
                    : active
                    ? 'bg-ck-night text-white ring-4 ring-ck-brand/20 scale-110'
                    : 'bg-ck-surface text-ck-muted border border-ck-line'
                }`}
              >
                {done ? (
                  <LuCheck size={20} strokeWidth={3} aria-hidden="true" />
                ) : (
                  <Icon size={20} aria-hidden="true" />
                )}
              </span>
              <span
                className={`text-[13px] font-bold ${
                  active || done ? 'text-ck-ink' : 'text-ck-muted'
                }`}
              >
                {label}
              </span>
            </li>
            {i < steps.length - 1 && (
              <li
                aria-hidden="true"
                className="flex-1 h-0.5 mt-[21px] rounded-full bg-ck-line overflow-hidden"
              >
                <span
                  className={`block h-full bg-ck-brand transition-all duration-500 ${
                    done ? 'w-full' : 'w-0'
                  }`}
                />
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
};

export default Stepper;
