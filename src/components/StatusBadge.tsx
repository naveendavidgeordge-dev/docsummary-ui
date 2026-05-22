import { DocumentStatus } from '@/types';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  status: DocumentStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: Props) => {
  interface StatusConfig {
    label: string;
    icon: any;
    color: string;
    spin?: boolean;
  }

  const configs: Record<DocumentStatus, StatusConfig> = {
    PENDING: {
      label: 'Pending',
      icon: Clock,
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    PROCESSING: {
      label: 'Processing',
      icon: Loader2,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      spin: true,
    },
    COMPLETED: {
      label: 'Completed',
      icon: CheckCircle2,
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    FAILED: {
      label: 'Failed',
      icon: XCircle,
      color: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
        config.color,
        className
      )}
    >
      <Icon className={clsx('w-3.5 h-3.5', config.spin && 'animate-spin')} />
      {config.label}
    </span>
  );
};
