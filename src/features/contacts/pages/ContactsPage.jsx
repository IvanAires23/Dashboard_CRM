import ModulePage from '../../../components/ui/ModulePage.jsx'
import { Link } from 'react-router-dom'

function ContactsPage() {
  return (
    <>
      <ModulePage
        eyebrow="Contacts"
        title="Contacts"
        description="The contacts module will manage people, roles, communication history, and relationship context."
        summaryCards={[
          { label: 'Stakeholders', value: '186', note: 'Mapped across strategic accounts' },
          { label: 'Decision makers', value: '58', note: 'Primary contacts for active revenue' },
          { label: 'Missing owners', value: '9', note: 'Need assignment before outreach' },
        ]}
        nextSteps={[
          'Group contacts by account and relationship type',
          'Track communication history and contact ownership',
          'Support persona, seniority and buying-role filters',
        ]}
      />

      <section className="page-container">
        <Link className="state-action" to="/contacts/new">
          Create contact
        </Link>
      </section>
    </>
  )
}

export default ContactsPage
