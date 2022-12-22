export interface ArithmeticFormulaOperator {
    iconName?: string
    showInList?: boolean
    symbol?: string
    label: string
    pemdasNumber: number
    value: string
    valueType: string
}
export interface ArithmeticFormulaElement {
    backgroundColor?: string
    block?: string
    blockGroupId?: string
    children?: ArithmeticFormulaElement[]
    index?: number | string
    id: string
    parentId: string
    value: string | number
    valueType: 'block' | 'object_attribute' | 'constant' | 'operator' | 'calculated_field_formula'
}