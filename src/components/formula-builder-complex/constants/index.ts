interface Operator {
  showInList?: boolean
  valueType: string
  value: string
  label: string
  symbol?: string
  pemdasNumber: number
}
export const operators: Operator[] = [
  {
    valueType: 'operator',
    value: 'add',
    label: '+',
    pemdasNumber: 0,
  },
  {
    valueType: 'operator',
    value: 'subtract',
    label: '-',
    pemdasNumber: 0,
  },
  {
    valueType: 'operator',
    value: 'multiply',
    label: 'x',
    symbol: '*',
    pemdasNumber: 1
  },
  {
    valueType: 'operator',
    value: 'divide',
    label: '/',
    pemdasNumber: 1
  },
  {
    showInList: false,
    valueType: 'operator',
    value: 'block_open',
    label: '(',
    pemdasNumber: 0.5
  },
  {
    showInList: false,
    valueType: 'operator',
    value: 'block_close',
    label: ')',
    pemdasNumber: 0.5
  },
  {
    valueType: 'operator',
    value: 'block_open_close',
    label: '( )',
    pemdasNumber: 1
  },
  {
    valueType: 'operator',
    value: 'constant',
    label: '#',
    pemdasNumber: 0
  }
]