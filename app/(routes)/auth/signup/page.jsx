import { Suspense } from 'react';
import SignupForm from './SignupForm';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <SignupForm />
    </Suspense>
  );
}
