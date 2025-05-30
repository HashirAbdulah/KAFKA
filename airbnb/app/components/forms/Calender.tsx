// 'use client';
// import { DateRange, Range, RangeKeyDict } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';

// interface DatePickerProps {
//     value: Range,
//     onChange: (value: RangeKeyDict) => void;
//     bookedDates?: Date[];
// }

// const DatePicker: React.FC<DatePickerProps> = ({
//     value,
//     onChange,
//     bookedDates
// }) => {
//     return (
//         <DateRange
//             className='w-full border border-gray-400 rounded-xl mb-4'
//             rangeColors={['#262626']}
//             ranges={[value]}
//             date={new Date()}
//             onChange={onChange}
//             direction='vertical'
//             showDateDisplay={false}
//             minDate={new Date()}
//             disabledDates={bookedDates}
//         />
//     )
// }

// export default DatePicker;
'use client';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DatePickerProps {
  value: Range;
  onChange: (value: RangeKeyDict) => void;
  bookedDates?: Date[];
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  bookedDates,
}) => {
  return (
    <div className="w-full max-w-full overflow-x-auto animate-fade-in">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .rdrCalendarWrapper {
          font-size: 12px;
          width: 100%;
          max-width: 100%;
        }
        .rdrMonth {
          width: 100%;
          max-width: 280px;
          padding: 8px;
        }
        .rdrDay {
          font-size: 10px;
        }
        .rdrDayNumber span {
          font-size: 10px;
        }
        @media (max-width: 640px) {
          .rdrCalendarWrapper {
            font-size: 10px;
          }
          .rdrMonth {
            max-width: 260px;
            padding: 6px;
          }
          .rdrDay {
            width: 32px;
            height: 32px;
          }
          .rdrDayNumber span {
            font-size: 9px;
          }
        }
      `}</style>
      <DateRange
        className="w-full max-w-[300px] sm:max-w-full border border-gray-300 rounded-xl mb-4 shadow-sm"
        rangeColors={['#6b7280']}
        ranges={[value]}
        date={new Date()}
        onChange={onChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={bookedDates}
      />
    </div>
  );
};

export default DatePicker;
