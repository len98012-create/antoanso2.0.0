import React from 'react';
import { ShieldAlert, Lock, Smartphone, EyeOff, HelpCircle } from 'lucide-react';
import { QuickPrompt } from '../types';

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const PROMPTS: QuickPrompt[] = [
  {
    id: '1',
    label: 'Mật khẩu mạnh',
    prompt: 'Làm thế nào để tạo một mật khẩu mạnh và dễ nhớ?',
    icon: <Lock size={14} />,
  },
  {
    id: '2',
    label: 'Lừa đảo Phishing',
    prompt: 'Dấu hiệu nhận biết các trang web và email lừa đảo là gì?',
    icon: <ShieldAlert size={14} />,
  },
  {
    id: '3',
    label: 'Bảo mật FB',
    prompt: 'Hướng dẫn tớ cách bảo mật tài khoản mạng xã hội 2 lớp.',
    icon: <Smartphone size={14} />,
  },
  {
    id: '4',
    label: 'Lộ thông tin',
    prompt: 'Làm sao để kiểm tra xem thông tin cá nhân của tớ có bị lộ không?',
    icon: <EyeOff size={14} />,
  },
  {
    id: '5',
    label: 'Quyền riêng tư',
    prompt: 'Cài đặt quyền riêng tư trên điện thoại như thế nào là an toàn?',
    icon: <HelpCircle size={14} />,
  }
];

const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="px-4 py-3 overflow-x-auto no-scrollbar mask-gradient-sides">
      <div className="flex gap-2 min-w-max mx-auto md:justify-center">
        {PROMPTS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.prompt)}
            disabled={disabled}
            className="flex items-center gap-2 whitespace-nowrap px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <span className="text-emerald-500">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPrompts;
