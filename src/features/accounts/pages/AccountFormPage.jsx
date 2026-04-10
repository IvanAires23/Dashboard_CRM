import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { createAccount, getAccountById, updateAccount } from '../../../services/accounts.js'
import AccountForm from '../components/AccountForm.jsx'
import { buildAccountPayload, getAccountFormValues } from '../schemas/accountSchema.js'
import './AccountFormPage.css'

function extractAccountId(payload) {
  return payload?.id ?? payload?.account?.id ?? payload?.data?.id ?? null
}

function AccountFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { accountId } = useParams()
  const isEditMode = Boolean(accountId)

  const accountQuery = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getAccountById(accountId),
    enabled: isEditMode,
  })

  const createMutation = useMutation({
    mutationFn: createAccount,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAccount(id, payload),
  })

  const initialValues = useMemo(() => getAccountFormValues(accountQuery.data), [accountQuery.data])

  const handleSubmit = async (values) => {
    const payload = buildAccountPayload(values)

    if (isEditMode) {
      await updateMutation.mutateAsync({
        id: accountId,
        payload,
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['account', accountId] }),
      ])
      return
    }

    const createdAccount = await createMutation.mutateAsync(payload)
    const nextAccountId = extractAccountId(createdAccount)

    await queryClient.invalidateQueries({ queryKey: ['accounts'] })
    if (nextAccountId) {
      await queryClient.invalidateQueries({ queryKey: ['account', nextAccountId] })
    }

    if (nextAccountId) {
      navigate(`/accounts/${nextAccountId}/edit`, { replace: true })
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isEditMode && accountQuery.isPending) {
    return (
      <PageContainer className="account-form-page">
        <LoadingState
          title="Loading account"
          description="Fetching account details so you can edit this record."
          eyebrow="Accounts"
        />
      </PageContainer>
    )
  }

  if (isEditMode && accountQuery.isError) {
    return (
      <PageContainer className="account-form-page">
        <ErrorState
          eyebrow="Accounts"
          title="Unable to load account"
          error={accountQuery.error}
          description="Please try again in a few seconds."
          onRetry={accountQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="account-form-page">
      <WidgetContainer
        className="account-form-panel"
        eyebrow="Accounts"
        title={isEditMode ? 'Edit account' : 'Create account'}
        meta={isEditMode ? `Account ID: ${accountId}` : 'Capture company profile details'}
      >
        <p className="account-form-page__description">
          {isEditMode
            ? 'Update company details used to organize account portfolio context.'
            : 'Create an account with validated organization and website details.'}
        </p>

        <AccountForm
          key={isEditMode ? `account-edit-${accountId}` : 'account-create'}
          mode={isEditMode ? 'edit' : 'create'}
          initialValues={initialValues}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default AccountFormPage
