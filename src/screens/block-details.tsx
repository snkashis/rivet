import { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { type Transaction, formatEther, formatGwei } from 'viem'
import { Container, LabelledContent } from '~/components'
import {
  Box,
  Column,
  Columns,
  Inline,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useBlock } from '~/hooks/useBlock'
import { truncate } from '~/utils'

const numberIntl = new Intl.NumberFormat()
const numberIntl4SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 4,
})
const numberIntl6SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 6,
})

export default function BlockDetails() {
  const { blockNumber } = useParams()
  const { data: block } = useBlock({
    blockNumber: BigInt(blockNumber!),
    includeTransactions: true,
  })
  if (!block) return null
  return (
    <>
      <Container dismissable fit header={`Block ${blockNumber}`}>
        <Stack gap="20px">
          <Columns gap="12px">
            <Column width="1/4">
              <LabelledContent label="Block">
                <Text size="12px">{block.number!.toString()}</Text>
              </LabelledContent>
            </Column>
            <LabelledContent label="Timestamp">
              {status === 'pending' ? (
                <Text color="text/tertiary" size="12px">
                  Pending
                </Text>
              ) : (
                <Text size="12px">
                  {new Date(Number(block.timestamp! * 1000n)).toLocaleString()}
                </Text>
              )}
            </LabelledContent>
            <Column width="1/4">
              <LabelledContent label="Transactions">
                <Text size="12px">{block.transactions.length}</Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="12px">
            {block.hash && (
              <Column width="1/4">
                <LabelledContent label="Hash">
                  <Text size="12px">{truncate(block.hash, { start: 4 })}</Text>
                </LabelledContent>
              </Column>
            )}
            <Column width="1/4">
              <LabelledContent label="Base Fee">
                <Text size="12px">
                  {numberIntl6SigFigs.format(
                    Number(formatGwei(block.baseFeePerGas!)),
                  )}{' '}
                  gwei
                </Text>
              </LabelledContent>
            </Column>
            <Column>
              <LabelledContent label="Gas Used/Limit">
                <Text size="12px" wrap={false}>
                  {numberIntl.format(Number(block.gasUsed?.toString()))} /{' '}
                  {numberIntl.format(Number(block.gasLimit?.toString()))} (
                  {Math.round(
                    (Number(block.gasUsed) / Number(block.gasLimit)) * 100,
                  )}
                  %)
                </Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="12px">
            <Column width="1/4">
              <LabelledContent label="Fee Recipient">
                <Text size="12px">{truncate(block.miner, { start: 4 })}</Text>
              </LabelledContent>
            </Column>
            <Column>
              <LabelledContent label="Total Difficulty">
                <Text size="12px">
                  {numberIntl.format(Number(block.totalDifficulty?.toString()))}
                </Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="12px">
            <Column width="1/4">
              <LabelledContent label="Size">
                <Text size="12px">
                  {numberIntl.format(Number(block.size.toString()))} bytes
                </Text>
              </LabelledContent>
            </Column>
            <LabelledContent label="Logs Bloom">
              <Text size="12px">{truncate(block.logsBloom!)}</Text>
            </LabelledContent>
          </Columns>
          {block.transactions.length > 0 && (
            <>
              <Separator />
              <Stack gap="12px">
                <Text color="text/tertiary">Transactions</Text>
                <Box marginHorizontal="-12px">
                  {(block.transactions as Transaction[]).map(
                    (transaction, i) => (
                      <Fragment key={transaction.hash}>
                        {i !== 0 && <Separator />}
                        <Box paddingHorizontal="12px" paddingVertical="8px">
                          <Columns alignVertical="center">
                            <LabelledContent label="Hash">
                              <Inline
                                alignVertical="center"
                                gap="4px"
                                wrap={false}
                              >
                                <Text size="12px">
                                  {truncate(transaction.hash, { start: 4 })}
                                </Text>
                              </Inline>
                            </LabelledContent>
                            <LabelledContent label="From">
                              <Text wrap={false} size="12px">
                                {truncate(transaction.from, {
                                  start: 6,
                                  end: 4,
                                })}
                              </Text>
                            </LabelledContent>
                            <LabelledContent label="To">
                              <Text wrap={false} size="12px">
                                {transaction.to &&
                                  truncate(transaction.to, {
                                    start: 6,
                                    end: 4,
                                  })}
                              </Text>
                            </LabelledContent>
                            <LabelledContent label="Value">
                              <Text wrap={false} size="12px">
                                {numberIntl4SigFigs.format(
                                  Number(formatEther(transaction.value!)),
                                )}{' '}
                                ETH
                              </Text>
                            </LabelledContent>
                          </Columns>
                        </Box>
                      </Fragment>
                    ),
                  )}
                </Box>
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </>
  )
}
