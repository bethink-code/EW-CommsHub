import { redirect } from 'next/navigation';

// Activity view is now consolidated into the main Communications Hub
export default function CommsHubActivity() {
  redirect('/comms-hub');
}
