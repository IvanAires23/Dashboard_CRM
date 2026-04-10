import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DetailSkeleton from '../../../components/ui/DetailSkeleton.jsx'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteAccount, getAccountById } from '../../../services/accounts.js'
import { extractEntity, getDisplayValue, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useConfirm } from '../../../lib/confirm/useConfirm.js'
import { useToast } from '../../../lib/toast/useToast.js'
import '../../../components/crud/crud.css'

function AccountDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const toast = useToast()
  const { accountId } = useParams()

  const accountQuery = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getAccountById(accountId),
    enabled: Boolean(accountId),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Account deleted successfully.')
      navigate('/accounts', { replace: true })
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete account right now. Please try again.')
    },
  })

  const account = extractEntity(accountQuery.data)
  const resolvedAccountId = resolveEntityId(account) || accountId

  const handleDelete = async () => {
    if (!resolvedAccountId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete account?',
      description: 'This action permanently removes the account and cannot be undone.',
      confirmLabel: 'Delete account',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(resolvedAccountId)
  }

  if (accountQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Accounts" title="Account details" meta="Loading record">
          <DetailSkeleton fields={4} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (accountQuery.isError || !account) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Accounts"
          title="Unable to load account"
          error={accountQuery.error}
          description="Account not found."
          onRetry={accountQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer
        eyebrow="Accounts"
        title={account?.name || 'Account details'}
        meta={`Account ID: ${resolvedAccountId || '—'}`}
      >
        <div className="crud-detail">
          <dl className="crud-detail__grid">
            <div className="crud-detail__item">
              <dt>Name</dt>
              <dd>{getDisplayValue(account?.name)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Industry</dt>
              <dd>{getDisplayValue(account?.industry ?? account?.segment)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Size</dt>
              <dd>{getDisplayValue(account?.size ?? account?.employeeCount ?? account?.employees)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Website</dt>
              <dd>{getDisplayValue(account?.website ?? account?.url)}</dd>
            </div>
          </dl>

          <div className="crud-detail__actions">
            <Link to="/accounts">Back</Link>
            <Link className="primary" to={`/accounts/${resolvedAccountId}/edit`}>
              Edit
            </Link>
            <button type="button" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </WidgetContainer>
    </PageContainer>
  )
}

export default AccountDetailPage
