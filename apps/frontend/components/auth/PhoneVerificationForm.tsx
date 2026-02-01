'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';

export default function PhoneVerificationForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.startsWith('/ar') ? 'ar' : 'en';
  const { user, loadUser } = useAuthStore();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState<string>(''); // For dev mode

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-send code on mount
  useEffect(() => {
    if (!user?.phoneVerified) {
      handleSendCode();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (countdown > 0) return;

    setIsSendingCode(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.sendVerificationCode();
      setSuccess(response.message);
      setCountdown(60);

      // In dev mode, show the code
      if (response.code) {
        setDevCode(response.code);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last digit
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newCode = pastedData.split('');
    setCode(newCode);
    inputRefs.current[5]?.focus();

    // Auto-submit
    handleVerify(pastedData);
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');

    if (codeToVerify.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.verifyPhone(codeToVerify);
      setSuccess(response.message);

      // Reload user to get updated verification status
      await loadUser();

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.phoneVerified) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 mb-4">✓ {t('phoneAlreadyVerified')}</div>
        <Button onClick={() => router.push(`/${locale}/dashboard`)}>
          {t('goToDashboard')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Dev Mode Code Display */}
      {devCode && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <div className="font-semibold">Development Mode</div>
          <div className="text-sm mt-1">
            Your verification code: <span className="font-mono font-bold">{devCode}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Code Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
          {t('enterVerificationCode')}
        </label>
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold"
              disabled={isLoading}
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Verify Button */}
      <Button
        onClick={() => handleVerify()}
        disabled={isLoading || code.some((d) => !d)}
        className="w-full"
      >
        {isLoading ? t('verifying') : t('verify')}
      </Button>

      {/* Resend Code */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={handleSendCode}
          disabled={isSendingCode || countdown > 0}
          className="text-sm"
        >
          {countdown > 0
            ? `${t('resendCodeIn')} ${countdown}s`
            : isSendingCode
            ? t('sending')
            : t('resendCode')}
        </Button>
      </div>

      {/* Phone Number Display */}
      {user?.phone && (
        <p className="text-sm text-gray-500 text-center">
          {t('codeSentTo')}: <span className="font-medium">{user.phone}</span>
        </p>
      )}
    </div>
  );
}
