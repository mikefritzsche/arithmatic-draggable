interface Operator {
  showInList?: boolean
  symbol?: string
  valueType: string
  disabled: boolean
  label: string
  pemdasNumber: number,
  value: string | number
}
export const operators: Operator[] = [
  {
    disabled: false,
    valueType: 'operator',
    value: 'add',
    label: '+',
    pemdasNumber: 0,
  },
  {
    disabled: false,
    valueType: 'operator',
    value: 'subtract',
    label: '-',
    pemdasNumber: 0,
  },
  {
    disabled: false,
    valueType: 'operator',
    value: 'multiply',
    label: 'x',
    symbol: '*',
    pemdasNumber: 1
  },
  {
    disabled: false,
    valueType: 'operator',
    value: 'divide',
    label: '/',
    pemdasNumber: 1
  },
  {
    disabled: false,
    showInList: false,
    valueType: 'block',
    value: 'block_open',
    label: '(',
    pemdasNumber: 0.5
  },
  {
    disabled: false,
    showInList: false,
    valueType: 'block',
    value: 'block_close',
    label: ')',
    pemdasNumber: 0.5
  },
  {
    disabled: false,
    valueType: 'block',
    value: 'block_open_close',
    label: '( )',
    pemdasNumber: 1
  },
  {
    disabled: false,
    valueType: 'constant',
    value: 0,
    label: '#',
    pemdasNumber: 0
  }
]

export const operatorsHash = operators.reduce((acc: Record<string, Operator>, operator: any) => {
  if (operator.valueType !== 'constant' && !operator.valueType.includes('block')) {
    acc[operator.value] = operator
  }
  return acc
}, {})