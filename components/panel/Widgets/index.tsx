import React, { ReactNode } from 'react';

interface IWidget {
  title: string;
  subTitle: string;
  value: number;
  icon: ReactNode;
}

interface Props {
  widgets?: IWidget[];
}

const Widgets = ({ widgets }: Props) => {
  return (
    <div className="w-full grid grid-cols-5 gap-6">
      {widgets?.map((widget, index) => (
        <div
          key={index}
          className="p-8 bg-primary/5 border border-primary/30 rounded-2xl overflow-hidden relative"
        >
          <div className="text-primary/20 absolute top-0 right-0">
            {widget.icon}
          </div>

          <h3 className="text-2xl font-semibold">{widget.title}</h3>
          <p className="text-sm text-slate-600">{widget.subTitle}</p>
          <p className="text-3xl font-bold mt-2 text-primary">{widget.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Widgets;
