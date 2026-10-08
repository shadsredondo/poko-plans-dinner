import LegalPage, { LegalSection, CONTACT_EMAIL } from "@/components/LegalPage";

const Privacy = () => (
  <LegalPage title="Privacy Policy" updated="October 8, 2026">
    <p className="text-[15px] leading-relaxed text-muted-foreground">
      Poko is a small, independent app that plans dinner menus. This page explains what we collect, why, and
      what you can do about it. We don't sell your data and we don't show ads.
    </p>

    <LegalSection heading="What we collect">
      <p>
        <strong className="text-foreground">Your planning answers.</strong> Guest count, the ingredients you
        have, how much effort you want, your cooking skill and cuisine. You can plan without an account.
      </p>
      <p>
        <strong className="text-foreground">Your account, if you create one.</strong> Your email address and, if
        you sign in with Google, your name and profile picture from Google. We only use these to sign you in.
      </p>
      <p>
        <strong className="text-foreground">Menus you save.</strong> The menu and the answers that produced it,
        so you can find them again.
      </p>
      <p>
        <strong className="text-foreground">Small browser storage.</strong> Your browser keeps your sign-in
        session and a few preferences in local storage. We don't use advertising or analytics cookies.
      </p>
    </LegalSection>

    <LegalSection heading="Who processes it">
      <p>We rely on a few services to run Poko:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong className="text-foreground">Supabase</strong> stores accounts and saved menus.</li>
        <li>
          <strong className="text-foreground">Lovable AI gateway and Google Gemini</strong> receive your planning
          answers to generate the menu. Don't include personal details in the ingredients field.
        </li>
        <li>
          <strong className="text-foreground">YouTube</strong> finds and plays recipe videos. When you play one,
          YouTube's own privacy policy applies.
        </li>
        <li><strong className="text-foreground">Vercel</strong> hosts the website.</li>
        <li><strong className="text-foreground">Google</strong> handles "Continue with Google" sign-in.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="How long we keep it">
      <p>
        Saved menus and your account stay until you delete them or ask us to. Planning answers you don't save
        aren't stored in our database.
      </p>
    </LegalSection>

    <LegalSection heading="Your choices">
      <p>
        You can delete saved menus at any time from Your menus. To delete your account or get a copy of your
        data, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>{" "}
        and we'll handle it within 30 days.
      </p>
    </LegalSection>

    <LegalSection heading="Children">
      <p>Poko isn't intended for children under 13, and we don't knowingly collect their data.</p>
    </LegalSection>

    <LegalSection heading="Changes">
      <p>If this policy changes, we'll update the date at the top of this page.</p>
    </LegalSection>
  </LegalPage>
);

export default Privacy;
