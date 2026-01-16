'use client';

import { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/types/user';
import { addVolunteerToEvent } from '@/lib/api/volunteers';
import { getCurrentUser } from '@/lib/api/client';

type RegistrationFlowProps = {
  eventTitle: string;
  eventId: string;
  userRole?: UserRole;
  onComplete: () => Promise<void>;
  onCancel: () => void;
};

type RegistrationData = {
  name: string;
  joinTime: string;
};

export default function RegistrationFlow({
  eventTitle,
  eventId,
  userRole,
  onComplete,
  onCancel,
}: RegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    joinTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Lock background scroll while the flashcard flow is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // For volunteers, skip flashcards and only get name
  const isVolunteer = userRole === 'volunteer';
  const steps = isVolunteer
    ? [
        {
          question: "What is your name?",
          type: 'text' as const,
          placeholder: 'Type your name here...',
        },
      ]
    : [
        {
          question: "What is your name?",
          type: 'text' as const,
          placeholder: 'Type your name here...',
        },
        {
          question: "What time will you join the event?",
          type: 'choice' as const,
          options: [
            'At the start (on time!)',
            'A little bit later',
            'I will arrive early',
          ],
        },
      ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // For volunteers, add their name to the volunteers list
      if (isVolunteer && formData.name.trim()) {
        await addVolunteerToEvent(eventId, formData.name.trim());
      }
      await onComplete();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const canProceed = currentStep === 0 
    ? formData.name.trim().length > 0
    : formData.joinTime.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Flashcard Modal */}
      <div className="fixed inset-4 z-[70] mx-auto flex max-h-[90vh] max-w-lg items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          {/* Card Container with Animation */}
          <div
            key={currentStep}
            className="flashcard"
            style={{
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            {/* Card Header */}
            <div className="rounded-t-3xl bg-gradient-to-br from-[#fef3c7] via-[#fce7f3] to-[#e0f2fe] p-6 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[var(--color-ink)]">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <button
                  onClick={onCancel}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[var(--color-ink)] shadow-md transition-transform hover:scale-110"
                  type="button"
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-ink)]">
                {currentStepData.question}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                Registering for: <span className="font-semibold">{eventTitle}</span>
              </p>
            </div>

            {/* Card Body */}
            <div className="rounded-b-3xl bg-white p-6">
              {currentStepData.type === 'text' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={currentStepData.placeholder}
                    className="w-full rounded-2xl border-3 border-[#3b82f6] bg-[var(--color-mist)] px-5 py-4 text-lg font-semibold text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)] focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/20"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
                    <svg className="h-5 w-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>This helps us know who's joining!</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentStepData.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData({ ...formData, joinTime: option })}
                      className={`w-full rounded-2xl border-3 p-4 text-left transition-all ${
                        formData.joinTime === option
                          ? 'border-[#3b82f6] bg-[#dbeafe] shadow-lg scale-105'
                          : 'border-[var(--color-border)] bg-white hover:border-[#3b82f6]/50 hover:bg-[var(--color-mist)]'
                      }`}
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          formData.joinTime === option
                            ? 'border-[#3b82f6] bg-[#3b82f6]'
                            : 'border-[var(--color-border)]'
                        }`}>
                          {formData.joinTime === option && (
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-semibold ${
                          formData.joinTime === option ? 'text-[#1e40af]' : 'text-[var(--color-ink)]'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 rounded-2xl border-2 border-[var(--color-border)] bg-white px-6 py-3 font-bold text-[var(--color-ink)] transition-transform hover:scale-105"
                    type="button"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceed || isSubmitting}
                  className={`flex-1 rounded-2xl px-6 py-3 font-bold text-white transition-transform ${
                    canProceed && !isSubmitting
                      ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:scale-105 shadow-lg'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  type="button"
                >
                  {isSubmitting
                    ? 'Registering...'
                    : currentStep === steps.length - 1
                      ? 'Complete Registration ✓'
                      : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
