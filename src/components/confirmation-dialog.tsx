'use client';

import type * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type RechargeOption = {
  type: string;
  value: string | number;
  description: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  option: RechargeOption;
};

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, option }: Props) {
  // Ensure description is always a string
  const description = option?.description ?? 'الخيار المحدد';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent dir="rtl"> {/* Ensure dialog is RTL */}
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد العملية</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد أنك تريد المتابعة وشراء "{description}"؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>تأكيد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
