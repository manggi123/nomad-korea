'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobCategory } from '@/types';

interface JobSelectorProps {
  value: JobCategory | '';
  onChange: (value: JobCategory) => void;
  disabled?: boolean;
  className?: string;
}

const JOB_OPTIONS: Record<JobCategory, string> = {
  developer: '개발자',
  designer: '디자이너',
  marketer: '마케터',
  writer: '작가',
  'video-producer': '영상 제작자',
  planner: '기획자',
};

export function JobSelector({
  value,
  onChange,
  disabled = false,
  className,
}: JobSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as JobCategory)}
      disabled={disabled}
    >
      <SelectTrigger className={className} aria-label="직업군 선택">
        <SelectValue placeholder="직업군을 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(JOB_OPTIONS).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
