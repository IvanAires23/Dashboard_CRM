import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveDealStage } from '../../../services/deals.js'

const DEALS_QUERY_KEY = ['deals']

function asText(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

function patchDealStageRecord(record, dealId, stageId) {
  if (!record || typeof record !== 'object') {
    return record
  }

  const recordId = asText(
    record.id ?? record._id ?? record.uuid ?? record.dealId,
  )

  if (!recordId || recordId !== asText(dealId)) {
    return record
  }

  return {
    ...record,
    stage: stageId,
    stageId,
    pipelineStage: stageId,
  }
}

function patchCollection(collection, dealId, stageId) {
  if (!Array.isArray(collection)) {
    return collection
  }

  return collection.map((item) => patchDealStageRecord(item, dealId, stageId))
}

function patchDealPayload(payload, dealId, stageId) {
  if (Array.isArray(payload)) {
    return patchCollection(payload, dealId, stageId)
  }

  if (!payload || typeof payload !== 'object') {
    return payload
  }

  const collectionKeys = ['deals', 'data', 'items', 'results', 'rows', 'records']
  let nextPayload = payload

  collectionKeys.forEach((key) => {
    if (Array.isArray(payload[key])) {
      nextPayload = {
        ...nextPayload,
        [key]: patchCollection(payload[key], dealId, stageId),
      }
    }
  })

  if (payload.deal && typeof payload.deal === 'object') {
    nextPayload = {
      ...nextPayload,
      deal: patchDealStageRecord(payload.deal, dealId, stageId),
    }
  }

  if (payload.data && !Array.isArray(payload.data) && typeof payload.data === 'object') {
    nextPayload = {
      ...nextPayload,
      data: patchDealStageRecord(payload.data, dealId, stageId),
    }
  }

  return patchDealStageRecord(nextPayload, dealId, stageId)
}

export function useMoveDealStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dealId, stageId }) => moveDealStage(dealId, stageId),
    onMutate: async ({ dealId, stageId }) => {
      const normalizedDealId = asText(dealId)
      await queryClient.cancelQueries({ queryKey: DEALS_QUERY_KEY })
      await queryClient.cancelQueries({ queryKey: ['deal', normalizedDealId] })

      const previousDeals = queryClient.getQueryData(DEALS_QUERY_KEY)
      const previousDeal = queryClient.getQueryData(['deal', normalizedDealId])

      queryClient.setQueryData(DEALS_QUERY_KEY, (currentPayload) =>
        patchDealPayload(currentPayload, normalizedDealId, stageId),
      )
      queryClient.setQueryData(['deal', normalizedDealId], (currentPayload) =>
        patchDealPayload(currentPayload, normalizedDealId, stageId),
      )

      return {
        previousDeals,
        previousDeal,
        dealId: normalizedDealId,
      }
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return
      }

      queryClient.setQueryData(DEALS_QUERY_KEY, context.previousDeals)
      queryClient.setQueryData(['deal', context.dealId], context.previousDeal)
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['deal', asText(variables?.dealId)] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'crm-overview'] })
    },
  })
}

export default useMoveDealStage
