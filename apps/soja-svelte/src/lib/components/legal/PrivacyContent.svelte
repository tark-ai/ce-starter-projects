<script lang="ts">
import ContentSection from "../about/ContentSection.svelte";
import PageHeader from "../about/PageHeader.svelte";
</script>

<main>
      <PageHeader
        title="Privacy Policy"
        subtitle="Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services."
      />

      <ContentSection title="Information we collect">
        <p>We may collect and process the following types of personal information:</p>
        <p>
          <strong class="font-normal text-foreground">Information you provide to us</strong> —
          name, email address, shipping address, phone number and payment details; account login
          credentials if you create an account; and anything you send through forms, surveys or
          customer service enquiries.
        </p>
        <p>
          <strong class="font-normal text-foreground">
            Automatically collected information
          </strong> 
          — IP address, browser type and device information; interaction data such as pages visited,
          time spent and clicks; and cookies or similar tracking technologies.
        </p>
      </ContentSection>

      <ContentSection title="How we use your information">
        <p>
          To process and fulfil orders including shipping and payment; to provide customer support
          and respond to enquiries; to personalise your shopping experience; to send marketing
          communications, only with your consent; to analyse website usage and improve performance;
          and to comply with legal obligations.
        </p>
      </ContentSection>

      <ContentSection title="Sharing your information">
        <p>
          We do <strong class="font-normal text-foreground">not</strong> sell your personal
          information. We may share your data with trusted third-party service providers such as
          payment processors, shipping carriers and analytics; with legal authorities when required
          to comply with laws or protect rights; and with business partners in the event of a
          merger, acquisition or asset sale.
        </p>
      </ContentSection>

      <ContentSection title="Cookies">
        <p>
          We use cookies and similar technologies to enhance your experience. These may keep you
          signed in, store preferences and cart contents, provide analytics, and deliver
          personalised ads where applicable. You can modify your cookie preferences through your
          browser settings.
        </p>
      </ContentSection>

      <ContentSection title="Your rights">
        <p>
          Depending on your location you may have rights including access to the personal data we
          hold about you, correction of inaccurate or incomplete data, deletion of your data,
          objection to certain processing activities, and data portability.
        </p>
      </ContentSection>

      <ContentSection title="Data security">
        <p>
          We maintain appropriate technical and organisational safeguards to protect your data.
          However, no online transmission is 100% secure, and we cannot guarantee absolute security.
        </p>
      </ContentSection>

      <ContentSection title="Updates" class="pb-24">
        <p>
          We may update this Privacy Policy from time to time. The revised version will be posted
          with an updated effective date. We encourage you to review this policy periodically.
        </p>
      </ContentSection>
</main>
