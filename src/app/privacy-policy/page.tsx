
// src/app/privacy-policy/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="text-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-8">
          <Shield className="mx-auto h-16 w-16 text-primary" />
          <CardTitle className="mt-4 text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p>
              Telly Filmy ("us", "we", or "our") operates the
              Telly Filmy website (the "Service"). This page informs you of
              our policies regarding the collection, use, and disclosure of
              personal data when you use our Service and the choices you have
              associated with that data.
            </p>

            <h2>Information Collection and Use</h2>
            <p>
              We collect several different types of information for various
              purposes to provide and improve our Service to you.
            </p>

            <h3>Types of Data Collected</h3>
            <h4>Personal Data</h4>
            <p>
              While using our Service, we may ask you to provide us with certain
              personally identifiable information that can be used to contact or
              identify you ("Personal Data"). Personally identifiable information
              may include, but is not limited to:
            </p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Cookies and Usage Data</li>
            </ul>

            <h4>Usage Data</h4>
            <p>
              We may also collect information on how the Service is accessed and
              used ("Usage Data"). This Usage Data may include information such
              as your computer's Internet Protocol address (e.g. IP address),
              browser type, browser version, the pages of our Service that you
              visit, the time and date of your visit, the time spent on those
              pages, unique device identifiers and other diagnostic data.
            </p>

            <h2>Use of Data</h2>
            <p>
              Telly Filmy uses the collected data for various purposes:
            </p>
            <ul>
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>
                To allow you to participate in interactive features of our
                Service when you choose to do so
              </li>
              <li>To provide customer care and support</li>
              <li>
                To provide analysis or valuable information so that we can
                improve the Service
              </li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they are
              posted on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us by visiting the contact page on our website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
