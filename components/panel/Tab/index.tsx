import { useState, type ReactNode } from 'react';
import cn from 'classnames';

interface TabProps {
  initialTab?: string;
  tabs: { value: string; label: ReactNode }[];
  children?: (activeTab: string) => ReactNode;
  onChange?: (activeTab: string) => void;
  className?: string;
}

const Tab = ({ tabs, initialTab, children, onChange, className }: TabProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    initialTab ? initialTab : tabs[0]?.value
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onChange) {
      onChange(tab);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="h-[50px] flex w-full relative">
        <div className="absolute top-full left-0 w-full h-[4px] bg-orange/20 rounded-md"></div>

        {tabs.map((tab, index) => (
          <button
            key={index}
            className={cn(
              'flex-1 px-8 py-2 h-[50px] cursor-pointer relative group'
            )}
            onClick={() => handleTabChange(tab.value)}
          >
            <span
              className={cn({
                'text-orange font-semibold': activeTab === tab.value,
                'text-slate-500': activeTab !== tab.value,
              })}
            >
              {tab.label}
            </span>
            <div
              className={cn(
                'absolute top-full left-0 w-full h-[4px] rounded-md transition-all duration-300 group-hover:!bg-orange/30',
                {
                  'bg-orange': activeTab === tab.value,
                }
              )}
            ></div>
          </button>
        ))}
      </div>

      <div className="w-full mt-4">{children ? children(activeTab) : null}</div>
    </div>
  );
};

export default Tab;
